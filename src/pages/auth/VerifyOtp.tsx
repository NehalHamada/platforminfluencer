import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import LanguageToggle from "@/components/common/LanguageToggle";
import { cn } from "@/lib/utils";
import { useVerifyOtpMutation } from "@/queries/auth/useVerifyOtpMutation";
import { useAuthStore } from "@/store/auth.store";

import logphoto from "/assets/login-register.png";

function VerifyOtp() {
  const verifyOtpMutation = useVerifyOtpMutation();
  console.log("ver", verifyOtpMutation);
  const navigate = useNavigate();
  const clearAuth = useAuthStore((state) => state.clearAuth);
  const { t, i18n } = useTranslation();

  const isArabic = i18n.language === "ar";
  const otpPurpose = sessionStorage.getItem("otpPurpose");

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  console.log(otp);
  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);

  const isSubmitting = verifyOtpMutation.isPending;

  const handleChange = (value: string, index: number) => {
    const cleanedValue = value.replace(/\D/g, "").slice(0, 1);
    const newOtp = [...otp];
    console.log(newOtp);

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

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const otpCode = otp.join("");
    console.log("otp", otpCode);

    if (otpCode.length !== 6) {
      toast.error(t("verifyOtp.errors.otp_required"));
      return;
    }

    const email =
      otpPurpose === "influencer-register" || otpPurpose === "company-register"
        ? localStorage.getItem("otpEmail")
        : localStorage.getItem("resetEmail");

    if (!email) {
      toast.error(t("verifyOtp.error"));
      return;
    }

    try {
      await verifyOtpMutation.mutateAsync({
        email,
        otp: otpCode,
      });

      toast.success(t("verifyOtp.success"));

      if (otpPurpose === "influencer-register") {
        sessionStorage.removeItem("registerData");
        sessionStorage.removeItem("influencerStepOneData");
        sessionStorage.removeItem("influencerStepTwoData");
        sessionStorage.removeItem("otpPurpose");
        localStorage.removeItem("otpEmail");

        navigate("/dashboard/influencer");
        return;
      }

      if (otpPurpose === "company-register") {
        sessionStorage.removeItem("otpPurpose");
        localStorage.removeItem("otpEmail");

        clearAuth();
        navigate("/login");
        return;
      }

      localStorage.setItem("resetOtp", otpCode);
      navigate("/reset-password");
    } catch (error) {
      console.log(error);
      toast.error(t("verifyOtp.error"));
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

      <div className="absolute top-4 inset-s-4 z-10 lg:hidden">
        <LanguageToggle />
      </div>

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
                disabled={isSubmitting}
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
