import { Card, CardContent } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { loginSchema, type LoginSchemaType } from "@/schema/auth.schema";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import logphoto from "/assets/login-register.png";
import { Eye, EyeOff, KeyRound, Mail } from "lucide-react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useLoginMutation } from "@/queries/auth/useLoginMutation";
import { Button } from "@/components/ui/Button";
import axios from "axios";
import { logOtpFromResponse } from "@/utils/logOtp";
import { setPendingAuth } from "@/utils/pendingAuth";
import type { AuthResponse, AuthUser, UserRole } from "@/types/auth.types";
import { toast } from "react-toastify";

type LoginVerificationError = {
  message?: string;
  requires_verification?: boolean;
  data?: Partial<AuthResponse["data"]>;
};

const getAuthUser = (value: unknown): AuthUser | null => {
  if (!value || typeof value !== "object") return null;

  const user = value as { id?: unknown; name?: unknown; type?: unknown };
  const id =
    typeof user.id === "number"
      ? user.id
      : typeof user.id === "string"
        ? Number(user.id)
        : NaN;

  if (
    Number.isFinite(id) &&
    typeof user.name === "string" &&
    (user.type === "company" || user.type === "influencer")
  ) {
    return {
      id,
      name: user.name,
      type: user.type,
    };
  }

  return null;
};

const storePendingAuthFromResponse = (response: {
  data?: Partial<AuthResponse["data"]>;
}) => {
  const user = response.data?.user;
  const token = response.data?.token;
  const authUser = getAuthUser(user);

  if (authUser && typeof token === "string" && token) {
    setPendingAuth({ user: authUser, token });
  }
};

function Login() {
  const loginMutation = useLoginMutation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { t, i18n } = useTranslation();
  const [showPassword, setShowPassword] = useState(false);
  const form = useForm<LoginSchemaType>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = form;

  const onSubmit = async (data: LoginSchemaType) => {
    try {
      loginMutation.mutate(data, {
        onSuccess: (response) => {
          logOtpFromResponse("login otp:", response);
          storePendingAuthFromResponse(response);
          localStorage.setItem("otpEmail", data.email);
          sessionStorage.setItem("otpPurpose", "login-verification");
          navigate("/verify-otp");
        },
        onError: (error) => {
          if (axios.isAxiosError<LoginVerificationError>(error)) {
            const responseData = error.response?.data;
            const status = error.response?.status;

            if (status === 403 && responseData?.requires_verification) {
              logOtpFromResponse("login otp:", responseData);
              storePendingAuthFromResponse(responseData ?? {});
              localStorage.setItem("otpEmail", data.email);
              sessionStorage.setItem("otpPurpose", "login-verification");
              navigate("/verify-otp");
              return;
            }

            if (status === 401) {
              toast.error(t("auth_errors.invalid_credentials"));
              return;
            }

            if (status === 404) {
              toast.error(t("auth_errors.user_not_found"));
              return;
            }

            if (status === 422) {
              toast.error(t("auth_errors.validation_error"));
              return;
            }

            toast.error(t("auth_errors.login_failed"));
            return;
          }

          toast.error(t("auth_errors.login_failed"));
        },
      });
    } catch {
      toast.error(t("auth_errors.server_error"));
    }
  };

  const isArabic = i18n.language === "ar";
  const selectedRole = searchParams.get("role");
  const selectedUserRole: UserRole | null =
    selectedRole === "company" || selectedRole === "influencer"
      ? selectedRole
      : null;
  const registerPath = selectedUserRole
    ? `/register?role=${selectedUserRole}`
    : "/register";

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

      <div className="relative z-10 flex w-full justify-center lg:w-1/2">
        <Card className="w-full max-w-md border-0 bg-transparent py-0 shadow-none ring-0">
          <CardContent className="p-0">
            <h1 className="mb-8 text-center text-2xl font-bold text-white lg:mb-10 lg:text-[#202020]">
              {t("login.title")}
            </h1>

            <Form {...form}>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                <div className="space-y-2">
                  <Label
                    htmlFor="login-email"
                    className={cn(
                      "block text-sm text-white lg:text-inherit",
                      isArabic ? "text-right" : "text-left",
                    )}>
                    {t("login.email")}
                  </Label>

                  <div className="relative">
                    <Mail
                      className={cn(
                        "absolute top-1/2 -translate-y-1/2 text-gray-400",
                        "lg:text-gray-400",
                        isArabic ? "right-3" : "left-3",
                      )}
                    />
                    <Input
                      id="login-email"
                      type="email"
                      autoComplete="email"
                      {...register("email")}
                      aria-invalid={!!errors.email}
                      placeholder="Almostaqbal@support.com"
                      className={cn(
                        "h-11 rounded-full border border-white/55 bg-transparent text-white shadow-none placeholder:text-white/70 focus-visible:border-[#a7b78e] focus-visible:ring-[#a7b78e]/25 lg:bg-white/95 lg:text-[#202020] lg:placeholder:text-muted-foreground",
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

                <div className="space-y-2">
                  <Label
                    htmlFor="login-password"
                    className={cn(
                      "block text-sm text-white lg:text-inherit",
                      isArabic ? "text-right" : "text-left",
                    )}>
                    {t("login.password")}
                  </Label>

                  <div className="relative">
                    <button
                      type="button"
                      tabIndex={-1}
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

                    <KeyRound
                      className={cn(
                        "absolute top-1/2 -translate-y-1/2 text-white/75 lg:text-gray-400",
                        isArabic ? "right-3" : "left-3",
                      )}
                    />

                    <Input
                      id="login-password"
                      type={showPassword ? "text" : "password"}
                      autoComplete="current-password"
                      {...register("password")}
                      aria-invalid={!!errors.password}
                      placeholder="******"
                      className={cn(
                        "h-11 rounded-full border border-white/55 bg-transparent text-white shadow-none placeholder:text-white/70 focus-visible:border-[#a7b78e] focus-visible:ring-[#a7b78e]/25 lg:bg-white/95 lg:text-[#202020] lg:placeholder:text-muted-foreground",
                        errors.password
                          ? "border-destructive focus-visible:ring-destructive/20 lg:border-destructive"
                          : "border-white/55 focus-visible:border-[#a7b78e] focus-visible:ring-[#a7b78e]/20 lg:border-[#d9d9d9]",
                        isArabic
                          ? "pr-10 pl-10 text-right"
                          : "pl-10 pr-10 text-left",
                      )}
                    />
                  </div>

                  {errors.password ? (
                    <p
                      className={cn(
                        "text-sm text-red-500",
                        isArabic ? "text-right" : "text-left",
                      )}>
                      {t(String(errors.password.message))}
                    </p>
                  ) : null}

                  <Link
                    to="/forget-password"
                    className={cn(
                      "mt-2 flex text-sm text-white/80 transition hover:text-white lg:text-gray-400 lg:hover:text-gray-500",
                      isArabic ? "justify-start" : "justify-start",
                    )}>
                    {t("login.forgetPassword")}
                  </Link>
                </div>



                <Button
                  type="submit"
                  disabled={isSubmitting}
                  variant="brand"
                  className="h-10 w-full rounded-full text-sm lg:h-14 lg:text-base">
                  {isSubmitting ? t("login.loading") : t("login.login")}
                </Button>
              </form>
            </Form>

            <div className="mt-10 text-center">
              <Button
                type="button"
                variant="ghost"
                onClick={() => navigate(registerPath)}
                className="h-auto bg-transparent px-0 text-sm text-white underline underline-offset-4 hover:bg-transparent hover:text-white/80 lg:text-gray-400 lg:hover:text-gray-500">
                {t("login.createAccount")}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="hidden w-full justify-center lg:flex lg:w-1/2">
        <img
          src={logphoto}
          alt={t("login.title")}
          className="h-50 w-full rounded-[20px] object-cover lg:h-[calc(100vh-32px)]"
        />
      </div>
    </section>
  );
}

export default Login;
