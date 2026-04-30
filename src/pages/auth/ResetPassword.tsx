import {
  resetPasswordSchema,
  type ResetPasswordSchemaType,
} from "@/schema/auth.schema";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import logphoto from "/assets/login-register.png";
import LanguageToggle from "@/components/common/LanguageToggle";
import { Card, CardContent } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, KeyRound } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/Button";
import { useResetPasswordMutation } from "@/queries/auth/useResetPasswordMutation";

function ResetPassword() {
  const resetPasswordMutation = useResetPasswordMutation();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();

  const isArabic = i18n.language === "ar";

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    const resetEmail = sessionStorage.getItem("otpEmail");
    const resetOtp = sessionStorage.getItem("resetOtp");
    const otpPurpose = sessionStorage.getItem("otpPurpose");

    console.log("reset password stored otp:", resetOtp ?? "not found");

    if (!resetEmail || !resetOtp || otpPurpose !== "forget-password") {
      navigate("/forget-password");
    }
  }, [navigate]);

  const form = useForm<ResetPasswordSchemaType>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: "",
      password_confirmation: "",
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = form;

  const onSubmit = async (data: ResetPasswordSchemaType) => {
    const resetEmail = sessionStorage.getItem("otpEmail");
    const resetOtp = sessionStorage.getItem("resetOtp");
    const otpPurpose = sessionStorage.getItem("otpPurpose");

    if (!resetEmail || !resetOtp || otpPurpose !== "forget-password") {
      toast.error(t("resetPassword.invalidSession"));
      navigate("/forget-password");
      return;
    }

    const cleanResetEmail = resetEmail.trim().toLowerCase();
    const cleanResetOtp = resetOtp.trim();

    console.log("reset password otp:", cleanResetOtp);
    console.log("reset password payload:", {
      email: cleanResetEmail,
      otp: cleanResetOtp,
    });

    try {
      await resetPasswordMutation.mutateAsync({
        email: cleanResetEmail,
        otp: cleanResetOtp,
        password: data.password,
        password_confirmation: data.password_confirmation,
      });

      toast.success(t("resetPassword.success"));

      sessionStorage.removeItem("otpEmail");
      sessionStorage.removeItem("resetOtp");
      sessionStorage.removeItem("otpPurpose");

      navigate("/login");
    } catch (error) {
      console.log(error);
      toast.error(t("resetPassword.error"));
    }
  };

  return (
    <section
      dir={isArabic ? "rtl" : "ltr"}
      className={cn(
        "fixed inset-0 z-60 flex min-h-screen flex-col items-center justify-center overflow-y-auto px-4 py-8 text-white lg:relative lg:inset-auto lg:z-auto lg:flex-col-reverse lg:justify-between lg:gap-10 lg:p-4 lg:text-inherit",
        "lg:flex-row",
        isArabic ? "lg:flex-row-reverse" : "lg:flex-row-reverse",
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
            <h1 className="text-center text-2xl font-bold text-white lg:text-[#202020]">
              {t("resetPassword.title")}
            </h1>
            <p className="mb-10 mt-2 text-center text-sm leading-6 text-white/80 lg:text-[#7a7a73]">
              {t("resetPassword.description")}
            </p>

            <Form {...form}>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                <div className="space-y-2">
                  <Label
                    htmlFor="reset-password"
                    className={cn(
                      "block text-sm text-white lg:text-inherit",
                      isArabic ? "text-right" : "text-left",
                    )}>
                    {t("resetPassword.password")}
                  </Label>
                  <div className="relative">
                    <KeyRound
                      className={cn(
                        "absolute top-1/2 -translate-y-1/2 text-white/75 lg:text-gray-400",
                        isArabic ? "right-3" : "left-3",
                      )}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((prev) => !prev)}
                      aria-label={
                        showPassword
                          ? t("login.hidePassword", "Hide password")
                          : t("login.showPassword", "Show password")
                      }
                      className={cn(
                        "absolute top-1/2 -translate-y-1/2 cursor-pointer text-white/75 transition hover:text-white lg:text-gray-400 lg:hover:text-gray-500",
                        isArabic ? "left-3" : "right-3",
                      )}>
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                    <Input
                      id="reset-password"
                      type={showPassword ? "text" : "password"}
                      autoComplete="new-password"
                      {...register("password")}
                      aria-invalid={!!errors.password}
                      placeholder="******"
                      className={cn(
                        "h-11 rounded-full border bg-transparent text-white shadow-none placeholder:text-white/70 focus-visible:border-[#a7b78e] focus-visible:ring-[#a7b78e]/25 lg:bg-white/95 lg:text-[#202020] lg:placeholder:text-muted-foreground",
                        errors.password
                          ? "border-destructive focus-visible:ring-destructive/20 lg:border-destructive"
                          : "border-white/55 focus-visible:border-[#a7b78e] focus-visible:ring-[#a7b78e]/20 lg:border-[#d9d9d9]",
                        isArabic
                          ? "pr-10 pl-10 text-right"
                          : "pl-10 pr-10 text-left",
                      )}
                    />
                  </div>
                  {errors.password?.message ? (
                    <p
                      className={cn(
                        "text-sm text-red-500",
                        isArabic ? "text-right" : "text-left",
                      )}>
                      {t(String(errors.password.message))}
                    </p>
                  ) : null}
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="reset-confirm-password"
                    className={cn(
                      "block text-sm text-white lg:text-inherit",
                      isArabic ? "text-right" : "text-left",
                    )}>
                    {t("resetPassword.confirmPassword")}
                  </Label>
                  <div className="relative">
                    <KeyRound
                      className={cn(
                        "absolute top-1/2 -translate-y-1/2 text-white/75 lg:text-gray-400",
                        isArabic ? "right-3" : "left-3",
                      )}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword((prev) => !prev)}
                      aria-label={
                        showConfirmPassword
                          ? t("login.hidePassword", "Hide password")
                          : t("login.showPassword", "Show password")
                      }
                      className={cn(
                        "absolute top-1/2 -translate-y-1/2 cursor-pointer text-white/75 transition hover:text-white lg:text-gray-400 lg:hover:text-gray-500",
                        isArabic ? "left-3" : "right-3",
                      )}>
                      {showConfirmPassword ? (
                        <EyeOff size={18} />
                      ) : (
                        <Eye size={18} />
                      )}
                    </button>
                    <Input
                      id="reset-confirm-password"
                      type={showConfirmPassword ? "text" : "password"}
                      autoComplete="new-password"
                      {...register("password_confirmation")}
                      aria-invalid={!!errors.password_confirmation}
                      placeholder="******"
                      className={cn(
                        "h-11 rounded-full border bg-transparent text-white shadow-none placeholder:text-white/70 focus-visible:border-[#a7b78e] focus-visible:ring-[#a7b78e]/25 lg:bg-white/95 lg:text-[#202020] lg:placeholder:text-muted-foreground",
                        errors.password_confirmation
                          ? "border-destructive focus-visible:ring-destructive/20 lg:border-destructive"
                          : "border-white/55 focus-visible:border-[#a7b78e] focus-visible:ring-[#a7b78e]/20 lg:border-[#d9d9d9]",
                        isArabic
                          ? "pr-10 pl-10 text-right"
                          : "pl-10 pr-10 text-left",
                      )}
                    />
                  </div>
                  {errors.password_confirmation?.message ? (
                    <p
                      className={cn(
                        "text-sm text-red-500",
                        isArabic ? "text-right" : "text-left",
                      )}>
                      {t(String(errors.password_confirmation.message))}
                    </p>
                  ) : null}
                </div>

                <Button
                  type="submit"
                  disabled={resetPasswordMutation.isPending}
                  variant="brand"
                  className="h-10 w-full rounded-full text-sm lg:h-14 lg:text-base">
                  {resetPasswordMutation.isPending
                    ? t("resetPassword.loading")
                    : t("resetPassword.submit")}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
      <div className="hidden w-full lg:block lg:w-1/2">
        <img
          src={logphoto}
          alt={t("resetPassword.title")}
          className="h-50 w-full rounded-[20px] object-cover lg:h-[calc(100vh-32px)]"
        />
      </div>
    </section>
  );
}

export default ResetPassword;
