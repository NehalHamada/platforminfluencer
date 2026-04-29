import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { ChevronLeft, ChevronRight, CircleAlert, Info } from "lucide-react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
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
import hero from "/assets/Hero.png";
import successImage from "/assets/popImg.png";
import { useCompleteInfluencerProfileMutation } from "@/queries/auth/useCompleteInfluencerProfileMutation";

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
      toast.error(t("influencer.error"));
      return;
    }

    if (data.payoutMethod === "wallet") {
      toast.error("Wallet not available yet");
      return;
    }

    const registerData = JSON.parse(savedRegisterData);
    const stepOneData = JSON.parse(savedStepOneData);
    const stepTwoData = JSON.parse(savedStepTwoData);

    console.log("registerData", registerData);
    console.log("stepOneData", stepOneData);
    console.log("stepTwoData", stepTwoData);

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

          platform: stepTwoData.platform,
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
        onSuccess: () => {
          sessionStorage.setItem("otpPurpose", "influencer-register");
          localStorage.setItem("otpEmail", registerData.email);

          toast.success(t("verifyOtp.success"));
          navigate("/verify-otp");
        },
        onError: (error) => {
          console.log(error);
          toast.error(t("influencer.error"));
        },
      },
    );
  };

  const fieldClass =
    "h-8 rounded-full border border-[#d2d2cc] bg-transparent px-4 text-[11px] shadow-none focus-visible:ring-0";

  return (
    <>
      <section dir={isArabic ? "rtl" : "ltr"} className="min-h-screen">
        <div>
          <div className="relative h-60 overflow-hidden">
            <img
              src={hero}
              alt="campaign hero"
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-black/35" />
          </div>

          <div className="relative -mt-4 rounded-t-[26px] bg-[#f6f6f3] px-8 pb-10 pt-9 shadow-[0_8px_24px_rgba(0,0,0,0.08)]">
            <div className="mt-8 text-center">
              <h1 className="text-[17px] font-semibold leading-8 text-[#1f1f1f]">
                {t("completeInfluencerPayment.title")}
              </h1>
              <p className="mt-2 text-[11px] leading-6 text-[#666666]">
                {t("completeInfluencerPayment.description")}
              </p>
            </div>

            <Form {...form}>
              <form onSubmit={handleSubmit(onSubmit)} className="mt-8">
                <Card className="border-0 bg-transparent py-0 shadow-none ring-0">
                  <CardContent className="space-y-6 p-0">
                    <div className="grid grid-cols-1 gap-x-3 gap-y-4 sm:grid-cols-2">
                      <FormField
                        control={form.control}
                        name="postPrice"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="mb-1.5 block text-[11px] font-medium text-[#3f3f3f]">
                              {t("completeInfluencerPayment.postPrice")}
                            </FormLabel>
                            <FormControl>
                              <Input {...field} className={fieldClass} />
                            </FormControl>
                            <FormMessage className="text-[10px]">
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
                            <FormLabel className="mb-1.5 block text-[11px] font-medium text-[#3f3f3f]">
                              {t("completeInfluencerPayment.storyPrice")}
                            </FormLabel>
                            <FormControl>
                              <Input {...field} className={fieldClass} />
                            </FormControl>
                            <FormMessage className="text-[10px]">
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
                            <FormLabel className="mb-1.5 block text-[11px] font-medium text-[#3f3f3f]">
                              {t("completeInfluencerPayment.reelPrice")}
                            </FormLabel>
                            <FormControl>
                              <Input {...field} className={fieldClass} />
                            </FormControl>
                            <FormMessage className="text-[10px]">
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
                            <FormLabel className="mb-1.5 block text-[11px] font-medium text-[#3f3f3f]">
                              {t("completeInfluencerPayment.isNegotiable")}
                            </FormLabel>
                            <div className="flex h-8 items-center justify-between rounded-full border border-[#d2d2cc] px-3">
                              <Button
                                type="button"
                                variant="ghost"
                                onClick={() => {
                                  setIsNegotiableState("yes");
                                  setValue("isNegotiable", true);
                                }}
                                className={cn(
                                  "flex min-w-12 rounded-full px-2 py-1 text-[10px] hover:bg-transparent",
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
                                  "flex min-w-12 rounded-full px-2 py-1 text-[10px] hover:bg-transparent",
                                  isNegotiableState === "no"
                                    ? "bg-[#ece7ff] text-[#5e4ea1] hover:bg-[#ece7ff]"
                                    : "text-[#7d7d7d]",
                                )}>
                                {t("completeInfluencerPayment.no")}
                              </Button>
                            </div>
                            <FormMessage className="text-[10px]">
                              {errors.isNegotiable?.message
                                ? t(String(errors.isNegotiable.message))
                                : null}
                            </FormMessage>
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="mt-7 text-center">
                      <h2 className="text-[14px] font-semibold text-[#262626]">
                        {t("completeInfluencerPayment.payoutTitle")}
                      </h2>
                      <p className="mt-2 text-[10px] leading-5 text-[#707070]">
                        {t("completeInfluencerPayment.payoutDescription")}
                      </p>
                    </div>

                    <FormField
                      control={form.control}
                      name="payoutMethod"
                      render={({ field }) => (
                        <FormItem className="mt-5">
                          <p className="mb-2 text-center text-[11px] font-medium text-[#3f3f3f]">
                            {t("completeInfluencerPayment.chooseMethod")}
                          </p>
                          <div className="flex items-center justify-center gap-3">
                            <Button
                              type="button"
                              variant="outline"
                              onClick={() => {
                                setSelectedMethod("wallet");
                                field.onChange("wallet");
                              }}
                              className={cn(
                                "h-8.5 min-w-28 rounded-full text-[10px]",
                                selectedMethod === "wallet"
                                  ? "border-[#3a9c4a] bg-white text-[#3a9c4a] hover:bg-white"
                                  : "border-[#cfcfc9] bg-white text-[#6d6d6d] hover:bg-white",
                              )}>
                              <span className="font-semibold">
                                {t("completeInfluencerPayment.wallet")}
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
                                "h-8.5 min-w-28 rounded-full text-[10px]",
                                selectedMethod === "bank"
                                  ? "border-[#3a5cff] bg-white text-[#3a5cff] hover:bg-white"
                                  : "border-[#cfcfc9] bg-white text-[#6d6d6d] hover:bg-white",
                              )}>
                              <span className="font-semibold">
                                {t("completeInfluencerPayment.visa")}
                              </span>
                            </Button>
                          </div>
                          <FormMessage className="mt-1 text-center text-[10px]">
                            {errors.payoutMethod?.message
                              ? t(String(errors.payoutMethod.message))
                              : null}
                          </FormMessage>
                          <div className="mt-2 flex items-center justify-center gap-1 text-[9px] text-[#707070]">
                            <CircleAlert size={11} />
                            <span>
                              {t("completeInfluencerPayment.methodNote")}
                            </span>
                          </div>
                        </FormItem>
                      )}
                    />

                    {selectedMethod === "bank" ? (
                      <div className="mt-6 grid grid-cols-1 gap-x-3 gap-y-4 sm:grid-cols-2">
                        <FormField
                          control={form.control}
                          name="accountHolder"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="mb-1.5 block text-[11px] font-medium text-[#3f3f3f]">
                                {t("completeInfluencerPayment.accountHolder")}
                              </FormLabel>
                              <FormControl>
                                <Input {...field} className={fieldClass} />
                              </FormControl>
                              <FormMessage className="text-[10px]">
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
                              <FormLabel className="mb-1.5 block text-[11px] font-medium text-[#3f3f3f]">
                                {t("completeInfluencerPayment.bankName")}
                              </FormLabel>
                              <FormControl>
                                <Input {...field} className={fieldClass} />
                              </FormControl>
                              <FormMessage className="text-[10px]">
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
                              <FormLabel className="mb-1.5 block text-[11px] font-medium text-[#3f3f3f]">
                                {t("completeInfluencerPayment.iban")}
                              </FormLabel>
                              <FormControl>
                                <Input {...field} className={fieldClass} />
                              </FormControl>
                              <FormMessage className="text-[10px]">
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
                              <FormLabel className="mb-1.5 block text-[11px] font-medium text-[#3f3f3f]">
                                {t("completeInfluencerPayment.country")}
                              </FormLabel>
                              <FormControl>
                                <Input {...field} className={fieldClass} />
                              </FormControl>
                              <FormMessage className="text-[10px]">
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
                            <FormItem className="sm:col-span-2">
                              <FormLabel className="mb-1.5 block text-[11px] font-medium text-[#3f3f3f]">
                                {t("completeInfluencerPayment.currency")}
                              </FormLabel>
                              <FormControl>
                                <Select
                                  value={field.value}
                                  onValueChange={field.onChange}>
                                  <SelectTrigger
                                    dir={isArabic ? "rtl" : "ltr"}
                                    className="h-8 rounded-full border border-[#d2d2cc] bg-transparent px-4 text-[11px] shadow-none focus-visible:ring-0">
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
                              <FormMessage className="text-[10px]">
                                {errors.currency?.message
                                  ? t(String(errors.currency.message))
                                  : null}
                              </FormMessage>
                            </FormItem>
                          )}
                        />
                      </div>
                    ) : null}

                    <div className="mt-3 flex items-start gap-1 text-[9px] text-[#707070]">
                      <Info size={11} className="mt-px" />
                      <span>{t("completeInfluencerPayment.bankInfoNote")}</span>
                    </div>

                    <div
                      className={cn(
                        "mt-7 flex",
                        isArabic ? "justify-end" : "justify-start",
                      )}>
                      <Button
                        type="submit"
                        disabled={isSubmitting || influencerMutation.isPending}
                        className="h-8.75 min-w-32 rounded-full bg-[#9ba785] px-3 text-[11px] font-medium text-white hover:bg-[#8f9b79] disabled:opacity-70">
                        <span className="flex w-full items-center justify-between gap-2">
                          <span className={isArabic ? "order-2" : "order-1"}>
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
