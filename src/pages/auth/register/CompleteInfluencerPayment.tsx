import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { ChevronLeft, ChevronRight, CircleAlert, Info } from "lucide-react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import RegistrationSuccessPopup from "@/components/common/RegistrationSuccessPopup";
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
import {
  completeInfluencerPaymentSchema,
  type CompleteInfluencerPaymentSchemaType,
} from "@/schema/auth.schema";
import { cn } from "@/lib/utils";
import hero from "/assets/Hero.optimized.jpg";
import successImage from "/assets/popImg.optimized.png";
import { useCompleteInfluencerProfileMutation } from "@/queries/auth/useCompleteInfluencerProfileMutation";
import { logOtpFromResponse } from "@/utils/logOtp";
import type {
  InfluencerStepPayload,
  SharedRegisterData,
} from "@/types/auth.types";

type SavedInfluencerProfileData = {
  phone: string;
  cooperation_type: string;
  content_field: string;
  platform_ids: number[];
  platform_links: string[];
  accepted_terms: boolean;
};

const isNumberArray = (value: unknown): value is number[] =>
  Array.isArray(value) && value.every((item) => typeof item === "number");




const isRegisterData = (data: unknown): data is SharedRegisterData => {
  if (!data || typeof data !== "object") return false;

  const value = data as Partial<SharedRegisterData>;

  return Boolean(
    value.name &&
    value.email &&
    value.password &&
    value.password_confirmation &&
    value.type === "influencer",
  );
};

const isInfluencerStepData = (data: unknown): data is InfluencerStepPayload => {
  if (!data || typeof data !== "object") return false;

  const value = data as Partial<InfluencerStepPayload>;

  return (
    isNumberArray(value.platform_ids) &&
    isNumberArray(value.follower_range_ids) &&
    isNumberArray(value.content_type_ids)
  );
};

const isInfluencerProfileData = (
  data: unknown,
): data is SavedInfluencerProfileData => {
  if (!data || typeof data !== "object") return false;

  const value = data as Partial<SavedInfluencerProfileData>;

  return Boolean(
    value.phone &&
    value.cooperation_type &&
    value.content_field &&
    isNumberArray(value.platform_ids) &&
    Array.isArray(value.platform_links) &&
    value.platform_links.length > 0 &&
    value.accepted_terms,
  );
};

function CompleteInfluencerPayment() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const influencerMutation = useCompleteInfluencerProfileMutation();
  const isArabic = i18n.language === "ar";

  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [isNegotiableState, setIsNegotiableState] = useState<"yes" | "no">(
    "yes",
  );
  const [selectedMethod, setSelectedMethod] = useState<"bank" | "wallet">(
    "bank",
  );

  const form = useForm<CompleteInfluencerPaymentSchemaType>({
    resolver: zodResolver(completeInfluencerPaymentSchema),
    defaultValues: {
      postPrice: "",
      storyPrice: "",
      reelPrice: "",
      isNegotiable: true,
      payoutMethod: "bank",
      accountHolder: "",
      bankName: "",
      iban: "",
      country: "",
      currency: "",
    },
  });

  const {
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = form;

  const onSubmit = async (data: CompleteInfluencerPaymentSchemaType) => {
    const savedRegisterData = sessionStorage.getItem("registerData");
    const savedStepOneData = sessionStorage.getItem("influencerStepOneData");
    const savedStepTwoData = sessionStorage.getItem("influencerStepTwoData");

    if (!savedRegisterData || !savedStepOneData || !savedStepTwoData) {
      toast.error(t("auth_errors.register_failed"));
      return;
    }

    if (data.payoutMethod === "wallet") {
      toast.error(t("auth_errors.validation_error"));
      return;
    }

    let registerData: unknown;
    let stepOneData: unknown;
    let stepTwoData: unknown;

    try {
      registerData = JSON.parse(savedRegisterData);
      stepOneData = JSON.parse(savedStepOneData);
      stepTwoData = JSON.parse(savedStepTwoData);
    } catch {
      toast.error(t("auth_errors.register_failed"));
      return;
    }

    if (
      !isRegisterData(registerData) ||
      !isInfluencerStepData(stepOneData) ||
      !isInfluencerProfileData(stepTwoData)
    ) {
      toast.error(t("auth_errors.register_failed"));
      return;
    }

    influencerMutation.mutate(
      {
        registerData,
        influencerStepData: stepOneData,

        completeProfileData: {
          phone: stepTwoData.phone,
          cooperation_type: stepTwoData.cooperation_type,
          content_field: stepTwoData.content_field,

          price_post: Number(data.postPrice),
          price_story: Number(data.storyPrice),
          price_reel: Number(data.reelPrice),
          is_negotiable: data.isNegotiable,

          platform_ids: stepTwoData.platform_ids,
          platform_links: stepTwoData.platform_links,

          follower_range_ids: stepOneData.follower_range_ids,
          content_type_ids: stepOneData.content_type_ids,

          account_holder_name: data.accountHolder || "",
          bank_name: data.bankName || "",
          iban: data.iban || "",
          country: data.country || "",
          currency: data.currency || "",

          accepted_terms: stepTwoData.accepted_terms,
        },
      },
      {
        onSuccess: (response) => {
          logOtpFromResponse("influencer register otp:", response);
          sessionStorage.setItem("otpPurpose", "influencer-register");
          localStorage.setItem("otpEmail", registerData.email);

          toast.success(t("verifyOtp.success"));
          navigate("/verify-otp");
        },
        onError: (error) => {
          if (axios.isAxiosError(error)) {
            const status = error.response?.status;
            if (status === 422) {
              toast.error(t("auth_errors.validation_error"));
            } else {
              toast.error(t("auth_errors.register_failed"));
            }
            return;
          }

          toast.error(t("auth_errors.register_failed"));
        },
      },
    );
  };

  const fieldClass =
    "h-7.5 rounded-full border border-[#d2d2cc] bg-transparent px-3 text-[10px] shadow-none focus-visible:ring-0";

  return (
    <>
      <section
        dir={isArabic ? "rtl" : "ltr"}
        className="min-h-screen bg-[#ececea]">
        <div className="mx-auto min-h-screen bg-[#ececea]">
          <div className="relative h-34 overflow-hidden">
            <img
              src={hero}
              alt="campaign hero"
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-black/35" />
          </div>

          <div className="relative -mt-4 rounded-t-[18px] bg-[#f6f6f3] px-8 pb-8 pt-9 shadow-[0_8px_24px_rgba(0,0,0,0.08)]">
            <div className="text-center">
              <h1 className="text-[14px] font-semibold leading-7 text-[#1f1f1f]">
                {t("completeInfluencerPayment.title")}
              </h1>
              <p className="mx-auto mt-1 max-w-72 text-[9px] leading-5 text-[#666666]">
                {t("completeInfluencerPayment.description")}
              </p>
            </div>

            <Form {...form}>
              <form onSubmit={handleSubmit(onSubmit)} className="mt-5">
                <Card className="border-0 bg-transparent py-0 shadow-none ring-0">
                  <CardContent className="space-y-4 p-0">
                    <div className="grid grid-cols-2 gap-x-2.5 gap-y-3">
                      <FormField
                        control={form.control}
                        name="postPrice"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="mb-1 block text-[9px] font-medium text-[#3f3f3f]">
                              {t("completeInfluencerPayment.postPrice")}
                            </FormLabel>
                            <FormControl>
                              <Input {...field} className={fieldClass} />
                            </FormControl>
                            <FormMessage className="text-[9px]">
                              {errors.postPrice?.message
                                ? t(String(errors.postPrice.message))
                                : null}
                            </FormMessage>
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="storyPrice"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="mb-1 block text-[9px] font-medium text-[#3f3f3f]">
                              {t("completeInfluencerPayment.storyPrice")}
                            </FormLabel>
                            <FormControl>
                              <Input {...field} className={fieldClass} />
                            </FormControl>
                            <FormMessage className="text-[9px]">
                              {errors.storyPrice?.message
                                ? t(String(errors.storyPrice.message))
                                : null}
                            </FormMessage>
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="reelPrice"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="mb-1 block text-[9px] font-medium text-[#3f3f3f]">
                              {t("completeInfluencerPayment.reelPrice")}
                            </FormLabel>
                            <FormControl>
                              <Input {...field} className={fieldClass} />
                            </FormControl>
                            <FormMessage className="text-[9px]">
                              {errors.reelPrice?.message
                                ? t(String(errors.reelPrice.message))
                                : null}
                            </FormMessage>
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="isNegotiable"
                        render={() => (
                          <FormItem>
                            <FormLabel className="mb-1 block text-[9px] font-medium text-[#3f3f3f]">
                              {t("completeInfluencerPayment.isNegotiable")}
                            </FormLabel>
                            <div className="flex h-7.5 items-center justify-between rounded-full border border-[#d2d2cc] px-2">
                              <Button
                                type="button"
                                variant="ghost"
                                onClick={() => {
                                  setIsNegotiableState("yes");
                                  setValue("isNegotiable", true);
                                }}
                                className={cn(
                                  "flex min-w-9 rounded-full px-2 py-1 text-[9px] hover:bg-transparent",
                                  isNegotiableState === "yes"
                                    ? "bg-[#ece7ff] text-[#5e4ea1] hover:bg-[#ece7ff]"
                                    : "text-[#7d7d7d]",
                                )}>
                                {t("completeInfluencerPayment.yes")}
                              </Button>
                              <Button
                                type="button"
                                variant="ghost"
                                onClick={() => {
                                  setIsNegotiableState("no");
                                  setValue("isNegotiable", false);
                                }}
                                className={cn(
                                  "flex min-w-9 rounded-full px-2 py-1 text-[9px] hover:bg-transparent",
                                  isNegotiableState === "no"
                                    ? "bg-[#ece7ff] text-[#5e4ea1] hover:bg-[#ece7ff]"
                                    : "text-[#7d7d7d]",
                                )}>
                                {t("completeInfluencerPayment.no")}
                              </Button>
                            </div>
                            <FormMessage className="text-[9px]">
                              {errors.isNegotiable?.message
                                ? t(String(errors.isNegotiable.message))
                                : null}
                            </FormMessage>
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="pt-2 text-center">
                      <h2 className="text-[12px] font-semibold text-[#262626]">
                        {t("completeInfluencerPayment.payoutTitle")}
                      </h2>
                      <p className="mx-auto mt-1 max-w-64 text-[8px] leading-4 text-[#707070]">
                        {t("completeInfluencerPayment.payoutDescription")}
                      </p>
                    </div>

                    <FormField
                      control={form.control}
                      name="payoutMethod"
                      render={({ field }) => (
                        <FormItem>
                          <p className="mb-2 text-center text-[9px] font-medium text-[#3f3f3f]">
                            {t("completeInfluencerPayment.chooseMethod")}
                          </p>
                          <div className="flex items-center justify-center gap-2">
                            <Button
                              type="button"
                              variant="outline"
                              onClick={() => {
                                setSelectedMethod("wallet");
                                field.onChange("wallet");
                              }}
                              className={cn(
                                "h-7 min-w-24 rounded-full text-[8px]",
                                selectedMethod === "wallet"
                                  ? "border-[#3a9c4a] bg-white text-[#3a9c4a] hover:bg-white"
                                  : "border-[#cfcfc9] bg-white text-[#6d6d6d] hover:bg-white",
                              )}>
                              <span className="font-semibold">
                                {t("completeInfluencerPayment.stcPay")}
                              </span>
                            </Button>
                            <Button
                              type="button"
                              variant="outline"
                              onClick={() => {
                                setSelectedMethod("bank");
                                field.onChange("bank");
                              }}
                              className={cn(
                                "h-7 min-w-24 rounded-full text-[8px]",
                                selectedMethod === "bank"
                                  ? "border-[#3a5cff] bg-white text-[#3a5cff] hover:bg-white"
                                  : "border-[#cfcfc9] bg-white text-[#6d6d6d] hover:bg-white",
                              )}>
                              <span className="font-semibold">
                                {t("completeInfluencerPayment.visa")}
                              </span>
                            </Button>
                          </div>
                          <FormMessage className="mt-1 text-center text-[9px]">
                            {errors.payoutMethod?.message
                              ? t(String(errors.payoutMethod.message))
                              : null}
                          </FormMessage>
                          <div className="mt-2 flex items-center justify-center gap-1 text-[8px] text-[#707070]">
                            <CircleAlert size={10} />
                            <span>
                              {t("completeInfluencerPayment.methodNote")}
                            </span>
                          </div>
                        </FormItem>
                      )}
                    />

                    {selectedMethod === "bank" ? (
                      <div className="grid grid-cols-2 gap-x-2.5 gap-y-3">
                        <FormField
                          control={form.control}
                          name="accountHolder"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="mb-1 block text-[9px] font-medium text-[#3f3f3f]">
                                {t("completeInfluencerPayment.accountHolder")}
                              </FormLabel>
                              <FormControl>
                                <Input {...field} className={fieldClass} />
                              </FormControl>
                              <FormMessage className="text-[9px]">
                                {errors.accountHolder?.message
                                  ? t(String(errors.accountHolder.message))
                                  : null}
                              </FormMessage>
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="bankName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="mb-1 block text-[9px] font-medium text-[#3f3f3f]">
                                {t("completeInfluencerPayment.bankName")}
                              </FormLabel>
                              <FormControl>
                                <Input {...field} className={fieldClass} />
                              </FormControl>
                              <FormMessage className="text-[9px]">
                                {errors.bankName?.message
                                  ? t(String(errors.bankName.message))
                                  : null}
                              </FormMessage>
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="iban"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="mb-1 block text-[9px] font-medium text-[#3f3f3f]">
                                {t("completeInfluencerPayment.iban")}
                              </FormLabel>
                              <FormControl>
                                <Input {...field} className={fieldClass} />
                              </FormControl>
                              <FormMessage className="text-[9px]">
                                {errors.iban?.message
                                  ? t(String(errors.iban.message))
                                  : null}
                              </FormMessage>
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="country"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="mb-1 block text-[9px] font-medium text-[#3f3f3f]">
                                {t("completeInfluencerPayment.country")}
                              </FormLabel>
                              <FormControl>
                                <Input {...field} className={fieldClass} />
                              </FormControl>
                              <FormMessage className="text-[9px]">
                                {errors.country?.message
                                  ? t(String(errors.country.message))
                                  : null}
                              </FormMessage>
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="currency"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="mb-1 block text-[9px] font-medium text-[#3f3f3f]">
                                {t("completeInfluencerPayment.currency")}
                              </FormLabel>
                              <FormControl>
                                <Select
                                  value={field.value}
                                  onValueChange={field.onChange}>
                                  <SelectTrigger
                                    dir={isArabic ? "rtl" : "ltr"}
                                    className="h-7.5 rounded-full border border-[#d2d2cc] bg-transparent px-3 text-[10px] shadow-none focus-visible:ring-0">
                                    <SelectValue
                                      placeholder={t(
                                        "completeInfluencerPayment.currency",
                                      )}
                                    />
                                  </SelectTrigger>
                                  <SelectContent
                                    dir={isArabic ? "rtl" : "ltr"}
                                    position="popper"
                                    sideOffset={6}
                                    className="z-9999">
                                    <SelectItem value="EGP">EGP</SelectItem>
                                    <SelectItem value="SAR">SAR</SelectItem>
                                    <SelectItem value="USD">USD</SelectItem>
                                  </SelectContent>
                                </Select>
                              </FormControl>
                              <FormMessage className="text-[9px]">
                                {errors.currency?.message
                                  ? t(String(errors.currency.message))
                                  : null}
                              </FormMessage>
                            </FormItem>
                          )}
                        />
                      </div>
                    ) : null}

                    <div className="flex items-start justify-center gap-1 text-[8px] text-[#707070]">
                      <Info size={10} className="mt-px" />
                      <span>{t("completeInfluencerPayment.bankInfoNote")}</span>
                    </div>

                    <div
                      className={cn(
                        "pt-2 flex",
                        isArabic ? "justify-start" : "justify-start",
                      )}>
                      <Button
                        type="submit"
                        disabled={isSubmitting || influencerMutation.isPending}
                        className="h-7.5 min-w-28 rounded-full bg-[#9ba785] px-2 text-[10px] font-medium text-white hover:bg-[#8f9b79] disabled:opacity-70">
                        <span className="flex w-full items-center justify-between gap-2">
                          <span className={isArabic ? "order-1" : "order-1"}>
                            {influencerMutation.isPending
                              ? t("completeInfluencerPayment.loading")
                              : t("completeInfluencerPayment.save")}
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

      <RegistrationSuccessPopup
        open={showSuccessPopup}
        onClose={() => setShowSuccessPopup(false)}
        title={t("registrationSuccess.title")}
        description={t("registrationSuccess.description")}
        image={successImage}
        userType="influencer"
      />
    </>
  );
}

export default CompleteInfluencerPayment;
