import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useResendOtpMutation } from "@/queries/auth/useResendOtpMutation";
import { useVerifyOtpMutation } from "@/queries/auth/useVerifyOtpMutation";
import { authService } from "@/services/auth.service";
import { useAuthStore } from "@/store/auth.store";
import type { AuthResponse } from "@/types/auth.types";
import { getOtpFromResponse, logOtpFromResponse } from "@/utils/logOtp";
import { clearPendingAuth, getPendingAuth } from "@/utils/pendingAuth";

import logphoto from "/assets/login-register.png";

const OTP_EXPIRES_IN_SECONDS = 3 * 60;

const formatTimerPart = (value: number) =>
  value < 10 ? `0${value}` : String(value);

const isAuthResponse = (response: unknown): response is AuthResponse => {
  if (!response || typeof response !== "object") return false;

  const value = response as Partial<AuthResponse>;

  return Boolean(value.data?.token && value.data.user);
};

function VerifyOtp() {
  const verifyOtpMutation = useVerifyOtpMutation();
  const resendOtpMutation = useResendOtpMutation();
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);
  const { t, i18n } = useTranslation();

  const isArabic = i18n.language === "ar";
  const otpPurpose = sessionStorage.getItem("otpPurpose");
  const getOtpEmail = () =>
    sessionStorage.getItem("otpEmail") || localStorage.getItem("otpEmail");

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [secondsLeft, setSecondsLeft] = useState(OTP_EXPIRES_IN_SECONDS);
  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);

  const isSubmitting = verifyOtpMutation.isPending;
  const isResending = resendOtpMutation.isPending;
  const isOtpExpired = secondsLeft === 0;
  const minutes = formatTimerPart(Math.floor(secondsLeft / 60));
  const seconds = formatTimerPart(secondsLeft % 60);
  const timerText = `${minutes}:${seconds}`;

  useEffect(() => {
    if (secondsLeft === 0) return;

    const timer = window.setInterval(() => {
      setSecondsLeft((value) => Math.max(value - 1, 0));
    }, 1000);

    return () => window.clearInterval(timer);
  }, [secondsLeft]);

  const resolveVerifiedUser = (response: unknown) => {
    if (isAuthResponse(response)) {
      const { user, token } = response.data;
      setAuth({ user, token });
      clearPendingAuth();
      return user;
    }

    const pendingAuth = getPendingAuth();

    if (pendingAuth) {
      setAuth(pendingAuth);
      clearPendingAuth();
      return pendingAuth.user;
    }

    return null;
  };

  const handleChange = (value: string, index: number) => {
    const cleanedValue = value.replace(/\D/g, "").slice(0, 1);
    const newOtp = [...otp];

    newOtp[index] = cleanedValue;
    setOtp(newOtp);

    if (cleanedValue && index < otp.length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number,
  ) => {
    if (e.key !== "Backspace") return;

    e.preventDefault();

    const newOtp = [...otp];

    if (newOtp[index]) {
      newOtp[index] = "";
      setOtp(newOtp);
      return;
    }

    if (index > 0) {
      newOtp[index - 1] = "";
      setOtp(newOtp);
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();

    const pastedValue = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, 6);

    if (!pastedValue) return;

    const newOtp = ["", "", "", "", "", ""];

    pastedValue.split("").forEach((char, index) => {
      newOtp[index] = char;
    });

    setOtp(newOtp);

    const nextIndex = Math.min(pastedValue.length, 5);
    inputRefs.current[nextIndex]?.focus();
  };

  const handleResendOtp = async () => {
    const email = getOtpEmail();

    if (!email) {
      toast.error(t("auth_errors.otp_failed"));
      return;
    }

    try {
      const response =
        otpPurpose === "forget-password"
          ? await authService.forgotPassword({ email })
          : await resendOtpMutation.mutateAsync({ email });
      logOtpFromResponse("new resend otp:", response);
      console.log("resend otp full response:", response);

      const newOtp = getOtpFromResponse(response);
      console.log("new resend extracted otp:", newOtp ?? "not returned");

      const newOtpDigits =
        typeof newOtp === "string" || typeof newOtp === "number"
          ? String(newOtp).replace(/\D/g, "").slice(0, 6)
          : "";

      setOtp(["", "", "", "", "", ""]);

      if (newOtpDigits.length === 6) {
        setOtp(newOtpDigits.split(""));
      }

      setSecondsLeft(OTP_EXPIRES_IN_SECONDS);
      inputRefs.current[0]?.focus();
      toast.success(t("verifyOtp.resendSuccess"));
    } catch (error) {
      console.log(error);
      toast.error(t("auth_errors.otp_failed"));
    }
  };

  const onSubmit = async (
    e: React.SyntheticEvent<HTMLFormElement, SubmitEvent>,
  ) => {
    e.preventDefault();

    const otpCode = otp.join("");
    console.log("submitted otp:", otpCode);

    if (otpCode.length !== 6) {
      toast.error(t("auth_errors.otp_failed"));
      return;
    }

    const email = getOtpEmail();

    if (!email) {
      toast.error(t("auth_errors.otp_failed"));
      return;
    }

    if (otpPurpose === "forget-password") {
      sessionStorage.setItem("resetOtp", otpCode);
      console.log("forget password verified otp:", otpCode);
      console.log("reset password session data:", { email, otp: otpCode });
      toast.success(t("verifyOtp.success_reset"));
      navigate("/reset-password");
      return;
    }

    try {
      const response = await verifyOtpMutation.mutateAsync({
        email,
        otp: otpCode,
      });
      logOtpFromResponse("verify otp response:", response);

      const successKey =
        otpPurpose === "login-verification" ||
        otpPurpose === "influencer-register" ||
        otpPurpose === "company-register"
          ? "verifyOtp.success_login"
          : "verifyOtp.success_reset";

      toast.success(t(successKey));

      if (otpPurpose === "influencer-register") {
        const verifiedUser = resolveVerifiedUser(response);

        sessionStorage.removeItem("registerData");
        sessionStorage.removeItem("influencerStepOneData");
        sessionStorage.removeItem("influencerStepTwoData");
        sessionStorage.removeItem("otpPurpose");
        sessionStorage.removeItem("otpEmail");
        localStorage.removeItem("otpEmail");

        navigate(
          verifiedUser?.type === "company"
            ? "/dashboard/company"
            : "/dashboard/influencer",
        );
        return;
      }

      if (otpPurpose === "company-register") {
        const verifiedUser = resolveVerifiedUser(response);

        sessionStorage.removeItem("registerData");
        sessionStorage.removeItem("companyRegisterStep1");
        sessionStorage.removeItem("otpPurpose");
        sessionStorage.removeItem("otpEmail");
        localStorage.removeItem("otpEmail");

        navigate(
          verifiedUser?.type === "influencer"
            ? "/dashboard/influencer"
            : "/dashboard/company",
        );
        return;
      }

      if (otpPurpose === "login-verification") {
        sessionStorage.removeItem("otpPurpose");
        sessionStorage.removeItem("otpEmail");
        localStorage.removeItem("otpEmail");

        const verifiedUser = resolveVerifiedUser(response);

        if (verifiedUser) {
          navigate(
            verifiedUser.type === "company"
              ? "/dashboard/company"
              : "/dashboard/influencer",
          );
          return;
        }

        navigate("/login");
        return;
      }

      sessionStorage.setItem("resetOtp", otpCode);
      console.log("verified otp:", otpCode);
      navigate("/reset-password");
    } catch (error) {
      console.log(error);
      toast.error(t("auth_errors.otp_failed"));
    }
  };

  return (
    <section
      dir={isArabic ? "rtl" : "ltr"}
      className={cn(
        "fixed inset-0 z-60 flex min-h-screen flex-col items-center justify-center overflow-y-auto px-4 py-8 text-white lg:relative lg:inset-auto lg:z-auto lg:flex-col-reverse lg:justify-between lg:gap-10 lg:p-4 lg:text-inherit",
        "lg:flex-row",
        isArabic ? "lg:flex-row-reverse" : "lg:flex-row",
      )}>
      <img
        src={logphoto}
        alt=""
        aria-hidden="true"
        className="absolute inset-0 h-full w-full object-cover lg:hidden"
      />
      <div className="absolute inset-0 bg-black/70 lg:hidden" />

      <div className="relative z-10 flex w-full justify-center lg:w-1/2">
        <Card className="w-full max-w-md border-0 bg-transparent py-0 shadow-none ring-0">
          <CardContent className="p-0">
            <h1 className="mb-2 text-center text-2xl font-bold text-white lg:text-[#202020]">
              {t("verifyOtp.title")}
            </h1>

            <p className="mb-10 text-center text-sm leading-6 text-white/80 lg:text-[#7a7a73]">
              {t("verifyOtp.description")}
            </p>

            <form onSubmit={onSubmit} className="space-y-6">
              <div className="flex items-center justify-center gap-3" dir="ltr">
                {otp.map((digit, index) => (
                  <Input
                    key={index}
                    ref={(element) => {
                      inputRefs.current[index] = element;
                    }}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleChange(e.target.value, index)}
                    onKeyDown={(e) => handleKeyDown(e, index)}
                    onPaste={handlePaste}
                    aria-label={`${t("verifyOtp.title")} ${index + 1}`}
                    className="h-12 w-12 rounded-xl border border-white/55 bg-transparent text-center text-lg text-white shadow-none transition focus-visible:border-[#a7b78e] focus-visible:ring-2 focus-visible:ring-[#a7b78e]/25 lg:border-[#d9d9d9] lg:bg-white lg:text-[#202020] lg:focus-visible:ring-[#a7b78e]/20"
                  />
                ))}
              </div>

              <Button
                type="submit"
                disabled={isSubmitting || isOtpExpired}
                variant="brand"
                className="relative h-10 w-full rounded-full text-sm lg:h-14 lg:text-base">
                <span
                  className={cn(
                    "pointer-events-none absolute top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/80 text-[#93a079]",
                    isArabic ? "left-2" : "right-2",
                  )}>
                  {isArabic ? (
                    <ChevronLeft size={18} />
                  ) : (
                    <ChevronRight size={18} />
                  )}
                </span>

                {isSubmitting ? t("verifyOtp.loading") : t("verifyOtp.send")}
              </Button>

              <div className="space-y-3 text-center">
                <p className="text-xs text-white/80 lg:text-[#7a7a73]">
                  {isOtpExpired
                    ? t("verifyOtp.expired")
                    : t("verifyOtp.expiresIn", { time: timerText })}
                </p>

                <Button
                  type="button"
                  variant="ghost"
                  disabled={isResending || !isOtpExpired}
                  onClick={handleResendOtp}
                  className="h-auto rounded-full px-4 py-2 text-sm text-white underline-offset-4 hover:bg-white/10 hover:underline disabled:opacity-60 lg:text-[#93a079] lg:hover:bg-[#93a079]/10">
                  {isResending
                    ? t("verifyOtp.resending")
                    : t("verifyOtp.resend")}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>

      <div className="hidden w-full lg:block lg:w-1/2">
        <img
          src={logphoto}
          alt={t("verifyOtp.title")}
          className="h-50 w-full rounded-[20px] object-cover lg:h-[calc(100vh-32px)]"
        />
      </div>
    </section>
  );
}

export default VerifyOtp;
