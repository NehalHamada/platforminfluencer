import { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useForm } from "react-hook-form";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { companySchema, type CompanySchemaType } from "@/schema/auth.schema";
import { cn } from "@/lib/utils";
import { useTargetLocationsQuery } from "@/queries/masterData/useTargetLocationsQuery";
import logphoto from "/assets/login-register.png";
import { toast } from "react-toastify";
import type { SharedRegisterData } from "@/types/auth.types";

const isRegisterData = (data: unknown): data is SharedRegisterData => {
  if (!data || typeof data !== "object") return false;

  const value = data as Partial<SharedRegisterData>;

  return Boolean(
    value.name &&
      value.email &&
      value.password &&
      value.password_confirmation &&
      value.type === "company",
  );
};

function CompanyForm() {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const isArabic = i18n.language === "ar";
  const targetLocationsQuery = useTargetLocationsQuery();

  const savedRegisterData = sessionStorage.getItem("registerData");

  useEffect(() => {
    if (!savedRegisterData) {
      navigate("/register");
    }
  }, [savedRegisterData, navigate]);

  const parsedRegisterData: SharedRegisterData | null = (() => {
    if (!savedRegisterData) return null;

    try {
      const data = JSON.parse(savedRegisterData);
      return isRegisterData(data) ? data : null;
    } catch {
      return null;
    }
  })();

  const form = useForm<CompanySchemaType>({
    resolver: zodResolver(companySchema),
    defaultValues: {
      companyName: "",
      managerName: "",
      field: "",
      country: "",
    },
  });

  const {
    handleSubmit,
    formState: { isSubmitting, errors },
  } = form;

  const onSubmit = async (data: CompanySchemaType) => {
    if (!parsedRegisterData) {
      toast.error(t("auth_errors.register_failed"));
      navigate("/register");
      return;
    }

    try {
      const stepOnePayload = {
        company_name: data.companyName,
        manager_name: data.managerName,
        field: data.field,
        country: data.country,
      };

      sessionStorage.setItem(
        "companyRegisterStep1",
        JSON.stringify(stepOnePayload),
      );

      navigate("/register/company/complete");
    } catch {
      toast.error(t("auth_errors.register_failed"));
    }
  };

  const inputClass = (hasError?: boolean) =>
    cn(
      "h-11 rounded-full border bg-transparent text-white shadow-none focus-visible:border-[#a7b78e] focus-visible:ring-[#a7b78e]/25 lg:bg-white/95 lg:text-[#202020]",
      hasError
        ? "border-destructive focus-visible:ring-destructive/20 lg:border-destructive"
        : "border-white/55 focus-visible:border-[#a7b78e] focus-visible:ring-[#a7b78e]/20 lg:border-[#d9d9d9]",
    );

  if (location.pathname !== "/register/company") {
    return <Outlet />;
  }

  return (
    <section
      dir={isArabic ? "rtl" : "ltr"}
      className={cn(
        "fixed inset-0 z-60 flex min-h-screen flex-col items-center justify-center overflow-y-auto px-4 py-8 text-white lg:relative lg:inset-auto lg:z-auto lg:flex-row-reverse lg:justify-between lg:gap-10 lg:p-4 lg:text-inherit",
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
              {t("company.title")}
            </h1>

            <Form {...form}>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                <FormField
                  control={form.control}
                  name="companyName"
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <FormLabel
                        className={cn(
                          "block text-sm text-white lg:text-inherit",
                          isArabic ? "text-right" : "text-left",
                        )}>
                        {t("company.companyName")}
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="text"
                          className={cn(
                            inputClass(!!errors.companyName),
                            isArabic ? "pr-4 text-right" : "pl-4 text-left",
                          )}
                          aria-invalid={errors.companyName ? "true" : undefined}
                          placeholder={t("company.companyNamePlaceholder")}
                        />
                      </FormControl>
                      <FormMessage
                        className={cn(isArabic ? "text-right" : "text-left")}>
                        {errors.companyName?.message
                          ? t(errors.companyName.message)
                          : null}
                      </FormMessage>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="managerName"
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <FormLabel
                        className={cn(
                          "block text-sm text-white lg:text-inherit",
                          isArabic ? "text-right" : "text-left",
                        )}>
                        {t("company.managerName")}
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="text"
                          className={cn(
                            inputClass(!!errors.managerName),
                            isArabic ? "pr-4 text-right" : "pl-4 text-left",
                          )}
                          aria-invalid={errors.managerName ? "true" : undefined}
                          placeholder={t("company.managerNamePlaceholder")}
                        />
                      </FormControl>
                      <FormMessage
                        className={cn(isArabic ? "text-right" : "text-left")}>
                        {errors.managerName?.message
                          ? t(errors.managerName.message)
                          : null}
                      </FormMessage>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="field"
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <FormLabel
                        className={cn(
                          "block text-sm text-white lg:text-inherit",
                          isArabic ? "text-right" : "text-left",
                        )}>
                        {t("company.field")}
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="text"
                          className={cn(
                            inputClass(!!errors.field),
                            isArabic ? "pr-4 text-right" : "pl-4 text-left",
                          )}
                          aria-invalid={errors.field ? "true" : undefined}
                          placeholder={t("company.field")}
                        />
                      </FormControl>
                      <FormMessage
                        className={cn(isArabic ? "text-right" : "text-left")}>
                        {errors.field?.message ? t(errors.field.message) : null}
                      </FormMessage>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="country"
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <FormLabel
                        className={cn(
                          "block text-sm text-white lg:text-inherit",
                          isArabic ? "text-right" : "text-left",
                        )}>
                        {t("company.country")}
                      </FormLabel>
                      <FormControl>
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                          disabled={targetLocationsQuery.isLoading}>
                          <SelectTrigger
                            className={cn(
                              inputClass(!!errors.country),
                              "px-4 text-sm [&>svg]:text-white/75 lg:[&>svg]:text-gray-400",
                              isArabic ? "text-right" : "text-left",
                            )}
                            aria-invalid={errors.country ? "true" : undefined}>
                            <SelectValue
                              placeholder={
                                targetLocationsQuery.isLoading
                                  ? t("company.loadingCountries")
                                  : t("company.selectCountry")
                              }
                            />
                          </SelectTrigger>
                          <SelectContent
                            dir={isArabic ? "rtl" : "ltr"}
                            position="popper"
                            sideOffset={6}
                            className="z-9999">
                            {targetLocationsQuery.data?.map((option) => (
                              <SelectItem
                                key={option.id}
                                value={option.id.toString()}>
                                {t(
                                  `masterData.targetLocations.${option.id}`,
                                  option.label,
                                )}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormControl>
                      {targetLocationsQuery.isError ? (
                        <p
                          className={cn(
                            "text-sm font-medium text-destructive",
                            isArabic ? "text-right" : "text-left",
                          )}>
                          {t("company.countriesError")}
                        </p>
                      ) : null}
                      <FormMessage
                        className={cn(isArabic ? "text-right" : "text-left")}>
                        {errors.country?.message
                          ? t(String(errors.country.message))
                          : null}
                      </FormMessage>
                    </FormItem>
                  )}
                />

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
                  {isSubmitting ? t("company.loading") : t("company.submit")}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>

      <div className="hidden w-full lg:block lg:w-1/2">
        <img
          src={logphoto}
          alt="company"
          className="h-50 w-full rounded-[20px] object-cover lg:h-[calc(100vh-32px)]"
        />
      </div>
    </section>
  );
}

export default CompanyForm;
