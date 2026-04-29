import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslation } from "react-i18next";
import { Outlet, useLocation, useNavigate } from "react-router-dom";

import LanguageToggle from "@/components/common/LanguageToggle";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/Button";
import { registerSchema, type RegisterSchemaType } from "@/schema/auth.schema";
import { cn } from "@/lib/utils";
import logphoto from "/assets/login-register.png";
import {
  Eye,
  EyeOff,
  KeyRound,
  Mail,
  User,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import type { SharedRegisterData, UserRole } from "@/types/auth.types";

function Register() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();

  const isArabic = i18n.language === "ar";
  const isBaseRegisterPage = location.pathname === "/register";

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showRolePopup, setShowRolePopup] = useState(false);
  const [pendingData, setPendingData] = useState<RegisterSchemaType | null>(
    null,
  );

  const form = useForm<RegisterSchemaType>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = form;

  const onContinue = (data: RegisterSchemaType) => {
    console.log("form data", data);
    setPendingData(data);
    setShowRolePopup(true);
    console.log("Open Popup");
  };

  const onError = (errors: unknown) => {
    console.log("Form Errors: ", errors);
  };

  const handleChooseRole = (role: UserRole) => {
    if (!pendingData) return;

    const payload: SharedRegisterData = {
      name: pendingData.name,
      email: pendingData.email,
      password: pendingData.password,
      password_confirmation: pendingData.confirmPassword,
      type: role,
    };
    console.log("Payload Register", payload);

    sessionStorage.setItem("registerData", JSON.stringify(payload));
    setShowRolePopup(false);

    if (role === "company") {
      navigate("/register/company");
      return;
    }

    if (role === "influencer") {
      navigate("/register/influencer");
      return;
    }
  };

  return (
    <>
      {isBaseRegisterPage ? (
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
                <h1 className="mb-6 text-center text-2xl font-bold text-white lg:mb-8 lg:text-[#202020]">
                  {t("register.title")}
                </h1>

                <Form {...form}>
                  <form
                    onSubmit={handleSubmit(onContinue, onError)}
                    className="space-y-5">
                    <div className="space-y-2">
                      <Label
                        htmlFor="register-name"
                        className={cn(
                          "block text-sm text-white lg:text-inherit",
                          isArabic ? "text-right" : "text-left",
                        )}>
                        {t("register.name")}
                      </Label>
                      <div className="relative">
                        <User
                          className={cn(
                            "absolute top-1/2 -translate-y-1/2 text-white/75 lg:text-gray-400",
                            isArabic ? "right-3" : "left-3",
                          )}
                        />
                        <Input
                          id="register-name"
                          type="text"
                          {...register("name")}
                          aria-invalid={!!errors.name}
                          placeholder="Almostaqbal"
                          className={cn(
                            "h-11 rounded-full border bg-transparent text-white shadow-none placeholder:text-white/70 focus-visible:border-[#a7b78e] focus-visible:ring-[#a7b78e]/25 lg:bg-white/95 lg:text-[#202020] lg:placeholder:text-muted-foreground",
                            errors.name
                              ? "border-destructive focus-visible:ring-destructive/20 lg:border-destructive"
                              : "border-white/55 focus-visible:border-[#a7b78e] focus-visible:ring-[#a7b78e]/20 lg:border-[#d9d9d9]",
                            isArabic ? "pr-10 text-right" : "pl-10 text-left",
                          )}
                        />
                      </div>
                      {errors.name?.message ? (
                        <p
                          className={cn(
                            "text-sm text-red-500",
                            isArabic ? "text-right" : "text-left",
                          )}>
                          {t(String(errors.name.message))}
                        </p>
                      ) : null}
                    </div>

                    <div className="space-y-2">
                      <Label
                        htmlFor="register-email"
                        className={cn(
                          "block text-sm text-white lg:text-inherit",
                          isArabic ? "text-right" : "text-left",
                        )}>
                        {t("register.email")}
                      </Label>
                      <div className="relative">
                        <Mail
                          className={cn(
                            "absolute top-1/2 -translate-y-1/2 text-white/75 lg:text-gray-400",
                            isArabic ? "right-3" : "left-3",
                          )}
                        />
                        <Input
                          id="register-email"
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
                      {errors.email?.message ? (
                        <p
                          className={cn(
                            "text-sm text-red-500",
                            isArabic ? "text-right" : "text-left",
                          )}>
                          {t(String(errors.email.message))}
                        </p>
                      ) : null}
                    </div>

                    <div className="space-y-2">
                      <Label
                        htmlFor="register-password"
                        className={cn(
                          "block text-sm text-white lg:text-inherit",
                          isArabic ? "text-right" : "text-left",
                        )}>
                        {t("register.password")}
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
                          {showPassword ? (
                            <EyeOff size={18} />
                          ) : (
                            <Eye size={18} />
                          )}
                        </button>
                        <Input
                          id="register-password"
                          type={showPassword ? "text" : "password"}
                          {...register("password")}
                          aria-invalid={!!errors.password}
                          placeholder="********"
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
                        htmlFor="register-confirm-password"
                        className={cn(
                          "block text-sm text-white lg:text-inherit",
                          isArabic ? "text-right" : "text-left",
                        )}>
                        {t("register.confirmPassword")}
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
                          onClick={() =>
                            setShowConfirmPassword((prev) => !prev)
                          }
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
                          id="register-confirm-password"
                          type={showConfirmPassword ? "text" : "password"}
                          {...register("confirmPassword")}
                          aria-invalid={!!errors.confirmPassword}
                          placeholder="********"
                          className={cn(
                            "h-11 rounded-full border bg-transparent text-white shadow-none placeholder:text-white/70 focus-visible:border-[#a7b78e] focus-visible:ring-[#a7b78e]/25 lg:bg-white/95 lg:text-[#202020] lg:placeholder:text-muted-foreground",
                            errors.confirmPassword
                              ? "border-destructive focus-visible:ring-destructive/20 lg:border-destructive"
                              : "border-white/55 focus-visible:border-[#a7b78e] focus-visible:ring-[#a7b78e]/20 lg:border-[#d9d9d9]",
                            isArabic
                              ? "pr-10 pl-10 text-right"
                              : "pl-10 pr-10 text-left",
                          )}
                        />
                      </div>
                      {errors.confirmPassword?.message ? (
                        <p
                          className={cn(
                            "text-sm text-red-500",
                            isArabic ? "text-right" : "text-left",
                          )}>
                          {t(String(errors.confirmPassword.message))}
                        </p>
                      ) : null}
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

                      {t("register.continue")}
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </div>

          <div className="hidden w-full lg:block lg:w-1/2">
            <img
              src={logphoto}
              alt="register"
              className="h-50 w-full rounded-[20px] object-cover lg:h-[calc(100vh-32px)]"
            />
          </div>
        </section>
      ) : (
        <Outlet />
      )}

      <Dialog open={showRolePopup} onOpenChange={setShowRolePopup}>
        <DialogContent
          dir={isArabic ? "rtl" : "ltr"}
          className="z-999 w-full max-w-md rounded-2xl border-0 bg-white p-6 shadow-xl">
          <DialogHeader>
            <DialogTitle className="text-center text-2xl font-bold">
              {t("register.popup.title")}
            </DialogTitle>
            <DialogDescription className="sr-only">
              {t("register.popup.title")}
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4">
            <Button
              type="button"
              onClick={() => handleChooseRole("company")}
              className="w-full">
              {t("register.popup.company")}
            </Button>

            <Button
              type="button"
              variant="outline"
              onClick={() => handleChooseRole("influencer")}
              className="w-full">
              {t("register.popup.influencer")}
            </Button>

            <Button
              type="button"
              variant="ghost"
              onClick={() => setShowRolePopup(false)}
              className="w-full">
              {t("register.popup.cancel")}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default Register;
