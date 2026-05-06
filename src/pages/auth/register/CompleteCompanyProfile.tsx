import { useEffect, useMemo, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import axios from "axios";

import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
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
import {
  completeCompanySchema,
  type CompleteCompanySchemaType,
} from "@/schema/auth.schema";

import { cn } from "@/lib/utils";
import hero from "/assets/Hero.png";
import { authService } from "@/services/auth.service";
import { logOtpFromResponse } from "@/utils/logOtp";
import { setPendingAuth } from "@/utils/pendingAuth";
import { useContentTypesQuery } from "@/queries/masterData/useContentTypesQuery";
import { usePlatformsQuery } from "@/queries/masterData/usePlatformsQuery";
import type {
  CompanyStepPayload,
  SharedRegisterData,
} from "@/types/auth.types";

const getApiErrorMessage = (data: unknown) => {
  if (!data || typeof data !== "object") return "Failed";

  const apiData = data as {
    message?: string;
    errors?: Record<string, string[] | string>;
  };

  if (apiData.errors) {
    const firstError = Object.keys(apiData.errors)
      .map((key) => apiData.errors?.[key])
      .reduce<string[]>((messages, errorValue) => {
        if (!errorValue) return messages;
        return messages.concat(errorValue);
      }, [])[0];

    if (firstError) return String(firstError);
  }

  return apiData.message || "Failed";
};

const isValidCompanyStepPayload = (
  data: CompanyStepPayload | null,
): data is CompanyStepPayload =>
  Boolean(
    data?.company_name && data.manager_name && data.field && data.country,
  );

const isValidRegisterData = (
  data: SharedRegisterData | null,
): data is SharedRegisterData =>
  Boolean(
    data?.name &&
    data.email &&
    data.password &&
    data.password_confirmation &&
    data.type === "company",
  );

function CompleteCompanyProfile() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const isArabic = i18n.language === "ar";
  const platformsQuery = usePlatformsQuery();
  const contentTypesQuery = useContentTypesQuery();
  const [selectedFileName, setSelectedFileName] = useState("");
  const savedRegisterData = sessionStorage.getItem("registerData");
  const savedStepOneData = sessionStorage.getItem("companyRegisterStep1");

  const parsedRegisterData = useMemo<SharedRegisterData | null>(() => {
    if (!savedRegisterData) return null;

    try {
      return JSON.parse(savedRegisterData) as SharedRegisterData;
    } catch {
      return null;
    }
  }, [savedRegisterData]);

  const parsedStepOneData = useMemo<CompanyStepPayload | null>(() => {
    if (!savedStepOneData) return null;

    try {
      return JSON.parse(savedStepOneData) as CompanyStepPayload;
    } catch {
      return null;
    }
  }, [savedStepOneData]);

  useEffect(() => {
    if (!savedRegisterData || !savedStepOneData) {
      navigate("/register/company");
    }
  }, [navigate, savedRegisterData, savedStepOneData]);

  const form = useForm<CompleteCompanySchemaType>({
    resolver: zodResolver(completeCompanySchema),
    defaultValues: {
      field: "",
      phone: "",
      platformIds: [],
      contentTypeIds: [],
      acceptedTerms: false,
    },
  });

  const {
    handleSubmit,
    formState: { isSubmitting, errors },
    setValue,
  } = form;

  const onSubmit = async (data: CompleteCompanySchemaType) => {
    if (!savedRegisterData || !savedStepOneData) {
      toast.error("Step 1 data not found");
      navigate("/register/company");
      return;
    }

    try {
      const registerData = JSON.parse(savedRegisterData) as SharedRegisterData;
      const stepOneData = JSON.parse(savedStepOneData) as CompanyStepPayload;

      if (!isValidRegisterData(registerData)) {
        toast.error(t("company.error"));
        navigate("/register");
        return;
      }

      if (!isValidCompanyStepPayload(stepOneData)) {
        toast.error(t("company.error"));
        navigate("/register/company");
        return;
      }

      const registerResponse = await authService.registerCompanyStep({
        ...registerData,
        ...stepOneData,
      });
      logOtpFromResponse("company register otp:", registerResponse);

      setPendingAuth({
        user: registerResponse.data.user,
        token: registerResponse.data.token,
      });

      const formData = new FormData();

      formData.append("field", data.field);
      formData.append("phone", data.phone);
      formData.append("commercial_register", data.commercialRegister);

      data.platformIds.forEach((id) => {
        formData.append("platform_ids[]", String(id));
      });

      data.contentTypeIds.forEach((id) => {
        formData.append("content_type_ids[]", String(id));
      });

      formData.append("accepted_terms", data.acceptedTerms ? "1" : "0");

      const completeProfileResponse =
        await authService.completeCompanyProfile(formData);
      logOtpFromResponse(
        "company complete profile otp:",
        completeProfileResponse,
      );

      sessionStorage.setItem("otpPurpose", "company-register");
      localStorage.setItem("otpEmail", registerData.email);

      toast.success(t("verifyOtp.success"));
      navigate("/verify-otp");
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {

        toast.error(getApiErrorMessage(error.response?.data));
      } else {
        toast.error("Failed");
      }
    }
  };

  const fieldClass =
    "h-10 rounded-full border border-[#d2d2cc] bg-transparent px-4 text-sm shadow-none focus-visible:ring-0";

  return (
    <>
      <section
        dir={isArabic ? "rtl" : "ltr"}
        className="min-h-screen bg-[#ececea]">
        <div className="bg-[#ececea]">
          <div className="relative h-50 overflow-hidden">
            <img
              src={hero}
              alt="campaign hero"
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-black/35" />
          </div>

          <div className="relative -mt-4 rounded-t-[26px] bg-[#f6f6f3] px-8 pb-10 pt-10 shadow-[0_8px_24px_rgba(0,0,0,0.08)]">
            <div className="mx-auto text-center">
              <h1 className="text-[17px] font-semibold leading-8 text-[#1f1f1f]">
                {t("completeCompanyProfile.title")}
              </h1>
              <p className="mt-2 text-[11px] leading-6 text-[#666666]">
                {t("completeCompanyProfile.description")}
              </p>
            </div>

            <Form {...form}>
              <form onSubmit={handleSubmit(onSubmit)} className="mt-8">
                <Card className="border-0 bg-transparent py-0 shadow-none ring-0">
                  <CardContent className="space-y-5 p-0">
                    <div className="grid grid-cols-1 gap-x-3 gap-y-4 sm:grid-cols-2">
                      <div>
                        <FormLabel className="mb-1.5 block text-[11px] font-medium text-[#3f3f3f]">
                          {t("completeInfluencerProfile.fullName")}
                        </FormLabel>
                        <Input
                          value={parsedStepOneData?.company_name ?? ""}
                          readOnly
                          className={fieldClass}
                        />
                      </div>

                      <div>
                        <FormLabel className="mb-1.5 block text-[11px] font-medium text-[#3f3f3f]">
                          {t("completeInfluencerProfile.email")}
                        </FormLabel>
                        <Input
                          value={parsedRegisterData?.email ?? ""}
                          readOnly
                          className={fieldClass}
                        />
                      </div>

                      <div>
                        <FormLabel className="mb-1.5 block text-[11px] font-medium text-[#3f3f3f]">
                          {t("completeInfluencerProfile.password")}
                        </FormLabel>
                        <Input
                          type="password"
                          value={parsedRegisterData?.password ?? ""}
                          readOnly
                          className={fieldClass}
                        />
                      </div>

                      <FormField
                        control={form.control}
                        name="field"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="mb-1.5 block text-[11px] font-medium text-[#3f3f3f]">
                              {t("completeCompanyProfile.field")}
                            </FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                className={fieldClass}
                                aria-invalid={errors.field ? "true" : undefined}
                              />
                            </FormControl>
                            <FormMessage className="text-[10px]">
                              {errors.field?.message
                                ? t(String(errors.field.message))
                                : null}
                            </FormMessage>
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="phone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="mb-1.5 block text-[11px] font-medium text-[#3f3f3f]">
                              {t("completeCompanyProfile.phone")}
                            </FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                className={fieldClass}
                                aria-invalid={errors.phone ? "true" : undefined}
                              />
                            </FormControl>
                            <FormMessage className="text-[10px]">
                              {errors.phone?.message
                                ? t(String(errors.phone.message))
                                : null}
                            </FormMessage>
                          </FormItem>
                        )}
                      />

                      <FormItem>
                        <FormLabel className="mb-1.5 block text-[11px] font-medium text-[#3f3f3f]">
                          {t("completeCompanyProfile.commercialRegister")}
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="file"
                            className={fieldClass}
                            onChange={(event) => {
                              const file = event.target.files?.[0];

                              if (file) {
                                setValue("commercialRegister", file, {
                                  shouldValidate: true,
                                  shouldDirty: true,
                                  shouldTouch: true,
                                });
                                setSelectedFileName(file.name);
                              } else {
                                setSelectedFileName("");
                              }
                            }}
                          />
                        </FormControl>
                        <FormMessage className="text-[10px]">
                          {errors.commercialRegister?.message
                            ? t(String(errors.commercialRegister.message))
                            : null}
                        </FormMessage>
                        {selectedFileName ? (
                          <p className="text-xs text-[#666666]">
                            {selectedFileName}
                          </p>
                        ) : null}
                      </FormItem>

                      <FormField
                        control={form.control}
                        name="platformIds"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="mb-1.5 block text-[11px] font-medium text-[#3f3f3f]">
                              {t("completeCompanyProfile.platform")}
                            </FormLabel>
                            <FormControl>
                              <Select
                                value={field.value[0]?.toString() ?? ""}
                                onValueChange={(value) =>
                                  field.onChange([Number(value)])
                                }>
                                <SelectTrigger
                                  className={fieldClass}
                                  aria-invalid={
                                    errors.platformIds ? "true" : undefined
                                  }>
                                  <SelectValue
                                    placeholder={
                                      platformsQuery.isLoading
                                        ? t(
                                            "completeCompanyProfile.loadingPlatforms",
                                            "Loading platforms...",
                                          )
                                        : t(
                                            "completeCompanyProfile.selectPlatform",
                                          )
                                    }
                                  />
                                </SelectTrigger>
                                <SelectContent dir={isArabic ? "rtl" : "ltr"}>
                                  {platformsQuery.data?.map((option) => (
                                    <SelectItem
                                      key={option.id}
                                      value={option.id.toString()}>
                                      {t(
                                        `masterData.platforms.${option.id}`,
                                        option.label,
                                      )}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </FormControl>
                            <FormMessage className="text-[10px]">
                              {errors.platformIds?.message
                                ? t(String(errors.platformIds.message))
                                : null}
                            </FormMessage>
                            {platformsQuery.isError ? (
                              <p className="text-[10px] text-destructive">
                                {t(
                                  "completeCompanyProfile.platformsError",
                                  "Could not load platforms",
                                )}
                              </p>
                            ) : null}
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="contentTypeIds"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="mb-1.5 block text-[11px] font-medium text-[#3f3f3f]">
                              {t("completeCompanyProfile.contentType")}
                            </FormLabel>
                            <FormControl>
                              <Select
                                value={field.value[0]?.toString() ?? ""}
                                onValueChange={(value) =>
                                  field.onChange([Number(value)])
                                }>
                                <SelectTrigger
                                  className={fieldClass}
                                  aria-invalid={
                                    errors.contentTypeIds ? "true" : undefined
                                  }>
                                  <SelectValue
                                    placeholder={
                                      contentTypesQuery.isLoading
                                        ? t(
                                            "completeCompanyProfile.loadingContentTypes",
                                            "Loading content types...",
                                          )
                                        : t(
                                            "completeCompanyProfile.selectContentType",
                                          )
                                    }
                                  />
                                </SelectTrigger>
                                <SelectContent dir={isArabic ? "rtl" : "ltr"}>
                                  {contentTypesQuery.data?.map((option) => (
                                    <SelectItem
                                      key={option.id}
                                      value={option.id.toString()}>
                                      {t(
                                        `masterData.contentTypes.${option.id}`,
                                        option.label,
                                      )}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </FormControl>
                            <FormMessage className="text-[10px]">
                              {errors.contentTypeIds?.message
                                ? t(String(errors.contentTypeIds.message))
                                : null}
                            </FormMessage>
                            {contentTypesQuery.isError ? (
                              <p className="text-[10px] text-destructive">
                                {t(
                                  "completeCompanyProfile.contentTypesError",
                                  "Could not load content types",
                                )}
                              </p>
                            ) : null}
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="acceptedTerms"
                      render={({ field }) => (
                        <FormItem className="mt-5 space-y-3">
                          <div className="flex items-start gap-2">
                            <FormControl>
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={(checked) =>
                                  field.onChange(Boolean(checked))
                                }
                                className="mt-0.5 border-[#cfcfc9] data-[state=checked]:border-[#8ea179] data-[state=checked]:bg-[#8ea179]"
                              />
                            </FormControl>
                            <FormLabel className="cursor-pointer text-[11px] font-normal text-[#8b8b8b]">
                              {t("completeCompanyProfile.acceptTerms")}
                            </FormLabel>
                          </div>
                          <FormMessage className="text-[10px]">
                            {errors.acceptedTerms?.message
                              ? t(String(errors.acceptedTerms.message))
                              : null}
                          </FormMessage>
                        </FormItem>
                      )}
                    />

                    <div className="mt-7 flex justify-start">
                      <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="h-8.75 min-w-32 rounded-full bg-[#9ba785] px-3 text-[11px] font-medium text-white hover:bg-[#8f9b79] disabled:opacity-70">
                        <span className="flex w-full items-center justify-between gap-2">
                          <span>
                            {isSubmitting
                              ? t("completeCompanyProfile.loading")
                              : t("completeCompanyProfile.continue")}
                          </span>
                          <span
                            className={cn(
                              "flex h-5 w-5 items-center justify-center rounded-full bg-white text-[#5a6947]",
                              isArabic ? "order-1" : "order-2",
                            )}>
                            {isArabic ? (
                              <ChevronLeft size={12} />
                            ) : (
                              <ChevronRight size={12} />
                            )}
                          </span>
                        </span>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </form>
            </Form>
          </div>
        </div>
      </section>
    </>
  );
}

export default CompleteCompanyProfile;
