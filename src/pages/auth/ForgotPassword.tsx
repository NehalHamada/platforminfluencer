import { Button } from "@/components/ui/Button";
import LanguageToggle from "@/components/common/LanguageToggle";
import { Card, CardContent } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import useAuth from "@/hooks/useAuth";
import {
  forgetPasswordSchema,
  type ForgotPasswordSchemaType,
} from "@/schema/auth.schema";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { Mail } from "lucide-react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import logphoto from "/assets/login-register.png";
import { getOtpFromResponse, logOtpFromResponse } from "@/utils/logOtp";

function ForgotPassword() {
  const { forgotPassword } = useAuth();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();

  const isArabic = i18n.language === "ar";

  const form = useForm<ForgotPasswordSchemaType>({
    resolver: zodResolver(forgetPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = form;

  const onSubmit = async (data: ForgotPasswordSchemaType) => {
    try {
      sessionStorage.removeItem("resetOtp");
      const response = await forgotPassword({
        email: data.email,
      });
      logOtpFromResponse("forgot password otp:", response);
      console.log("forgot password full response:", response);

      const otp = getOtpFromResponse(response);

      if (otp !== undefined && otp !== null && otp !== "") {
        sessionStorage.setItem("resetOtp", String(otp));
      }

      console.log("forgot password extracted otp:", otp ?? "not returned");
      sessionStorage.setItem("otpEmail", data.email);
      sessionStorage.setItem("otpPurpose", "forget-password");
      toast.success(t("forgetPassword.success"));
      navigate("/verify-otp");
    } catch {
      toast.error(t("forgetPassword.error"));
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
              {t("forgetPassword.title")}
            </h1>
            <p className="mb-10 mt-2 text-center text-sm text-white/80 lg:text-[#7a7a73]">
              {t("forgetPassword.description")}
            </p>

            <Form {...form}>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                <div className="space-y-2">
                  <Label
                    htmlFor="forgot-password-email"
                    className={cn(
                      "block text-sm text-white lg:text-inherit",
                      isArabic ? "text-right" : "text-left",
                    )}>
                    {t("forgetPassword.email")}
                  </Label>

                  <div className="relative">
                    <Mail
                      className={cn(
                        "absolute top-1/2 -translate-y-1/2 text-white/75 lg:text-gray-400",
                        isArabic ? "right-3" : "left-3",
                      )}
                    />
                    <Input
                      id="forgot-password-email"
                      type="email"
                      {...register("email")}
                      aria-invalid={!!errors.email}
                      placeholder="Almostaqbal@support.com"
                      className={cn(
                        "h-11 rounded-full border bg-transparent text-white shadow-none placeholder:text-white/70 focus-visible:border-[#a7b78e] focus-visible:ring-[#a7b78e]/25 lg:bg-white/95 lg:text-[#202020] lg:placeholder:text-muted-foreground",
                        errors.email
                          ? "border-destructive focus-visible:ring-destructive/20 lg:border-destructive"
                          : "border-white/55 focus-visible:border-[#a7b78e] focus-visible:ring-[#a7b78e]/20 lg:border-[#d9d9d9]",
                        isArabic ? "pr-10 text-right" : "pl-10 text-left",
                      )}
                    />
                  </div>

                  {errors.email ? (
                    <p
                      className={cn(
                        "text-sm text-red-500",
                        isArabic ? "text-right" : "text-left",
                      )}>
                      {t(String(errors.email.message))}
                    </p>
                  ) : null}
                </div>

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  variant="brand"
                  className="h-10 w-full rounded-full text-sm lg:h-14 lg:text-base">
                  {isSubmitting
                    ? t("forgetPassword.loading")
                    : t("forgetPassword.send")}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>

      <div className="hidden w-full justify-center lg:flex lg:w-1/2">
        <img
          src={logphoto}
          alt={t("forgetPassword.title")}
          className="h-50 w-full rounded-[20px] object-cover lg:h-[calc(100vh-32px)]"
        />
      </div>
    </section>
  );
}

export default ForgotPassword;
