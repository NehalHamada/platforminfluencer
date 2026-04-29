import { zodResolver } from "@hookform/resolvers/zod";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";

import hero from "/assets/Hero.png";

import SelectField from "@/components/common/company/SelectField";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { campaignSchema, type CampaignSchema } from "@/schema/campaign.schema";
import { campaignService } from "@/services/campaign.service";
import type { CampaignInputFieldProps } from "@/types/campaign.types";

function CampaignInputField({
  name,
  label,
  placeholder,
  register,
  error,
  isRTL,
}: CampaignInputFieldProps) {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col gap-2">
      <Label
        htmlFor={name}
        className={cn(
          "text-sm font-medium text-[#2f2f2b] sm:text-base",
          isRTL ? "text-right" : "text-left",
        )}>
        {label}
      </Label>

      <Input
        id={name}
        {...register(name)}
        placeholder={placeholder}
        aria-invalid={error ? "true" : "false"}
        className={cn(
          "h-11 rounded-full border-[#d9d7cf] bg-white px-4 text-sm text-[#2f2f2b] placeholder:text-[#8b8b84] focus-visible:ring-1 focus-visible:ring-[#9aa883]",
          isRTL ? "text-right" : "text-left",
        )}
      />

      {error ? (
        <p
          className={cn(
            "text-xs font-medium text-destructive",
            isRTL ? "text-right" : "text-left",
          )}>
          {t(error.message ?? "")}
        </p>
      ) : null}
    </div>
  );
}

function CreateCampaign() {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.dir() === "rtl";

  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CampaignSchema>({
    resolver: zodResolver(campaignSchema),
    defaultValues: {
      campaignName: "",
      campaignIdea: "",
      platform: "",
      targetAge: "",
      targetCountry: "",
      campaignDuration: "",
      campaignType: "",
      estimatedBudget: "",
      influencersCount: "",
    },
  });

  const onSubmit = async (data: CampaignSchema) => {
    try {
      const response = await campaignService.createCampaign(data);
      console.log(response);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <section
      dir={isRTL ? "rtl" : "ltr"}
      className="relative -mt-24 overflow-hidden bg-[#f3f3f1]">
      <div className="relative h-48 overflow-hidden sm:h-56 lg:h-85">
        <img
          src={hero}
          alt="campaign hero"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-black/60" />
      </div>

      <div className="relative z-10 -mt-10 rounded-t-[34px] bg-[#f3f3f1] px-4 pb-14 pt-8 sm:-mt-12 sm:px-6 lg:-mt-14 lg:rounded-t-[40px] lg:px-10 lg:pt-10">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto max-w-3xl">
            <div className="mb-8 text-center">
              <h1 className="text-2xl font-semibold text-[#22221f] sm:text-[30px]">
                {t("createCampaign.title")}
              </h1>
              <p className="mt-3 text-sm leading-7 text-[#696961] sm:text-base">
                {t("createCampaign.description")}
              </p>
            </div>

            <Card className="rounded-[28px] border-white/70 bg-[linear-gradient(180deg,rgba(255,255,255,0.9)_0%,rgba(243,243,241,0.98)_100%)] shadow-[0_18px_50px_rgba(34,34,31,0.06)]">
              <CardContent className="p-4 sm:p-6 lg:p-8">
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                  <div className="grid grid-cols-1 gap-x-8 gap-y-5 md:grid-cols-2">
                    <CampaignInputField
                      name="campaignName"
                      label={t("createCampaign.campaignName")}
                      placeholder={t("createCampaign.campaignNamePlaceholder")}
                      register={register}
                      error={errors.campaignName}
                      isRTL={isRTL}
                    />

                    <CampaignInputField
                      name="campaignIdea"
                      label={t("createCampaign.campaignIdea")}
                      placeholder={t("createCampaign.campaignIdeaPlaceholder")}
                      register={register}
                      error={errors.campaignIdea}
                      isRTL={isRTL}
                    />

                    <SelectField
                      name="platform"
                      label={t("createCampaign.platform")}
                      placeholder={t("createCampaign.platformPlaceholder")}
                      options={[
                        { label: "Tiktok", value: "Tiktok" },
                        { label: "Instagram", value: "Instagram" },
                      ]}
                      control={control}
                      error={errors.platform}
                      isRTL={isRTL}
                    />

                    <SelectField
                      name="targetAge"
                      label={t("createCampaign.targetAge")}
                      placeholder={t("createCampaign.targetAgePlaceholder")}
                      options={[
                        {
                          label: "Young Adults (25 - 34)",
                          value: "young-adults-25-34",
                        },
                      ]}
                      control={control}
                      error={errors.targetAge}
                      isRTL={isRTL}
                    />

                    <SelectField
                      name="targetCountry"
                      label={t("createCampaign.targetCountry")}
                      placeholder={t("createCampaign.targetCountryPlaceholder")}
                      options={[
                        { label: "All Saudi regions", value: "all-saudi" },
                      ]}
                      control={control}
                      error={errors.targetCountry}
                      isRTL={isRTL}
                    />

                    <SelectField
                      name="campaignDuration"
                      label={t("createCampaign.campaignDuration")}
                      placeholder={t(
                        "createCampaign.campaignDurationPlaceholder",
                      )}
                      options={[
                        { label: "Within one month", value: "within-month" },
                      ]}
                      control={control}
                      error={errors.campaignDuration}
                      isRTL={isRTL}
                    />

                    <SelectField
                      name="campaignType"
                      label={t("createCampaign.campaignType")}
                      placeholder={t("createCampaign.campaignTypePlaceholder")}
                      options={[{ label: "Lifestyle", value: "lifestyle" }]}
                      control={control}
                      error={errors.campaignType}
                      isRTL={isRTL}
                    />

                    <SelectField
                      name="estimatedBudget"
                      label={t("createCampaign.estimatedBudget")}
                      placeholder={t(
                        "createCampaign.estimatedBudgetPlaceholder",
                      )}
                      options={[
                        {
                          label: "Less than 5000 SAR",
                          value: "less-than-5000",
                        },
                      ]}
                      control={control}
                      error={errors.estimatedBudget}
                      isRTL={isRTL}
                    />

                    <div className="md:col-span-2 md:max-w-[48.5%]">
                      <SelectField
                        name="influencersCount"
                        label={t("createCampaign.influencersCount")}
                        placeholder={t(
                          "createCampaign.influencersCountPlaceholder",
                        )}
                        options={[{ label: "2", value: "2" }]}
                        control={control}
                        error={errors.influencersCount}
                        isRTL={isRTL}
                      />
                    </div>
                  </div>

                  <div
                    className={cn(
                      "flex",
                      isRTL ? "justify-start" : "justify-end",
                    )}>
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="group relative inline-flex h-12 min-w-42.5 items-center justify-center rounded-full bg-[#9aa883] px-6 text-sm font-medium text-white shadow-[0_8px_18px_rgba(154,168,131,0.35)] transition hover:scale-[1.02] hover:bg-[#8f9d78] disabled:cursor-not-allowed disabled:opacity-70">
                      <span
                        className={cn(
                          "absolute top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-[#eef2e7] text-[#8c9878]",
                          isRTL ? "left-2" : "right-2",
                        )}>
                        {isRTL ? (
                          <ChevronLeft size={18} />
                        ) : (
                          <ChevronRight size={18} />
                        )}
                      </span>

                      <span className={isRTL ? "pr-6" : "pl-6"}>
                        {isSubmitting
                          ? t("createCampaign.submitting")
                          : t("createCampaign.publishCampaign")}
                      </span>
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}

export default CreateCampaign;
