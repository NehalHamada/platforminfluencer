import { zodResolver } from "@hookform/resolvers/zod";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

import hero from "/assets/Hero.png";

import SelectField from "@/components/common/company/SelectField";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { useBudgetRangesQuery } from "@/queries/masterData/useBudgetRangesQuery";
import { useCampaignTypesQuery } from "@/queries/masterData/useCampaignTypesQuery";
import { useExecutionTimesQuery } from "@/queries/masterData/useExecutionTimesQuery";
import { useInfluencerCountRangesQuery } from "@/queries/masterData/useInfluencerCountRangesQuery";
import { usePlatformsQuery } from "@/queries/masterData/usePlatformsQuery";
import { useTargetAudiencesQuery } from "@/queries/masterData/useTargetAudiencesQuery";
import { useTargetLocationsQuery } from "@/queries/masterData/useTargetLocationsQuery";
import { useCreateCampaignMutation } from "@/queries/campaigns/useCreateCampaignsMutation";
import { campaignSchema, type CampaignSchema } from "@/schema/campaign.schema";
import type {
  CampaignInputFieldProps,
  CampaignPayload,
} from "@/types/campaign.types";

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
          "text-sm font-medium text-[#2f2f2b]",
          isRTL ? "text-right" : "text-left",
        )}>
        {label}
      </Label>

      <Input
        id={name}
        {...register(name)}
        placeholder={placeholder}
        aria-invalid={error ? "true" : undefined}
        className={cn(
          "h-11 rounded-full border-[#d9d7cf] bg-white px-4 text-sm text-[#2f2f2b] placeholder:text-[#8b8b84] focus-visible:border-[rgba(111,66,193,0.5)] focus-visible:ring-1 focus-visible:ring-[rgba(111,66,193,0.2)]",
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
  const navigate = useNavigate();
  const platformsQuery = usePlatformsQuery();
  const targetAudiencesQuery = useTargetAudiencesQuery();
  const targetLocationsQuery = useTargetLocationsQuery();
  const executionTimesQuery = useExecutionTimesQuery();
  const campaignTypesQuery = useCampaignTypesQuery();
  const budgetRangesQuery = useBudgetRangesQuery();
  const influencerCountRangesQuery = useInfluencerCountRangesQuery();
  const createCampaignMutation = useCreateCampaignMutation();

  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CampaignSchema>({
    resolver: zodResolver(campaignSchema),
    defaultValues: {
      name: "",
      idea: "",
      platform_id: "",
      target_audience_id: "",
      target_location_id: "",
      execution_time_id: "",
      campaign_type_id: "",
      budget_range_id: "",
      influencer_count_range_id: "",
    },
  });

  const onSubmit = async (data: CampaignSchema) => {
    const payload: CampaignPayload = {
      name: data.name,
      idea: data.idea,
      platform_id: Number(data.platform_id),
      target_audience_id: Number(data.target_audience_id),
      target_location_id: Number(data.target_location_id),
      execution_time_id: Number(data.execution_time_id),
      campaign_type_id: Number(data.campaign_type_id),
      budget_range_id: Number(data.budget_range_id),
      influencer_count_range_id: Number(data.influencer_count_range_id),
    };



    createCampaignMutation.mutate(payload, {
      onSuccess: () => {
        navigate("/dashboard/company");
      },
      onError: (error) => {
        console.error(error);
      },
    });
  };

  return (
    <section
      dir={isRTL ? "rtl" : "ltr"}
      className="relative -mt-24 overflow-hidden bg-white">
      <div className="relative h-44 overflow-hidden sm:h-52 lg:h-72">
        <img
          src={hero}
          alt="campaign hero"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-black/55" />
      </div>

      <div className="relative z-10 -mt-4 rounded-t-[28px] bg-white px-4 pb-12 pt-7 sm:-mt-6 sm:px-6 sm:pt-9 lg:-mt-8 lg:rounded-t-[40px] lg:px-10 lg:pb-16">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto max-w-[900px]">
            <div className="mb-7 text-center sm:mb-8">
              <h1 className="text-[32px] font-semibold leading-tight text-[#22221f] sm:text-[42px]">
                {t("createCampaign.title")}
              </h1>
              <p className="mt-2 text-[13px] leading-6 text-[#696961] sm:mt-3 sm:text-base">
                {t("createCampaign.description")}
              </p>
            </div>

            <Card className="rounded-[24px] border-0! ring-0! bg-white shadow-[0_14px_35px_rgba(34,34,31,0.06)] sm:rounded-[28px]">
              <CardContent className="p-4 sm:p-6 lg:p-7">
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 sm:space-y-7">
                  <div className="grid grid-cols-1 gap-x-7 gap-y-4 sm:gap-y-5 md:grid-cols-2">
                    <CampaignInputField
                      name="name"
                      label={t("createCampaign.campaignName")}
                      placeholder={t("createCampaign.campaignNamePlaceholder")}
                      register={register}
                      error={errors.name}
                      isRTL={isRTL}
                    />

                    <CampaignInputField
                      name="idea"
                      label={t("createCampaign.campaignIdea")}
                      placeholder={t("createCampaign.campaignIdeaPlaceholder")}
                      register={register}
                      error={errors.idea}
                      isRTL={isRTL}
                    />

                    <SelectField
                      name="platform_id"
                      label={t("createCampaign.platform")}
                      placeholder={t("createCampaign.loadingPlatforms")}
                      options={
                        platformsQuery.data?.map((platform) => ({
                          label: t(
                            `masterData.platforms.${platform.id}`,
                            platform.label,
                          ),
                          value: platform.id.toString(),
                        })) ?? []
                      }
                      control={control}
                      error={errors.platform_id}
                      isRTL={isRTL}
                    />
                    {platformsQuery.isError ? (
                      <p
                        className={cn(
                          "-mt-3 text-xs font-medium text-destructive md:col-span-2",
                          isRTL ? "text-right" : "text-left",
                        )}>
                        {t("createCampaign.platformsError")}
                      </p>
                    ) : null}

                    <SelectField
                      name="target_audience_id"
                      label={t("createCampaign.targetAge")}
                      placeholder={t("createCampaign.loadingTargetAudiences")}
                      options={
                        targetAudiencesQuery.data?.map((audience) => ({
                          label: t(
                            `masterData.targetAudiences.${audience.id}`,
                            audience.label,
                          ),
                          value: audience.id.toString(),
                        })) ?? []
                      }
                      control={control}
                      error={errors.target_audience_id}
                      isRTL={isRTL}
                    />
                    {targetAudiencesQuery.isError ? (
                      <p
                        className={cn(
                          "-mt-3 text-xs font-medium text-destructive md:col-span-2",
                          isRTL ? "text-right" : "text-left",
                        )}>
                        {t("createCampaign.targetAudiencesError")}
                      </p>
                    ) : null}

                    <SelectField
                      name="target_location_id"
                      label={t("createCampaign.targetCountry")}
                      placeholder={t("createCampaign.loadingTargetLocations")}
                      options={
                        targetLocationsQuery.data?.map((location) => ({
                          label: t(
                            `masterData.targetLocations.${location.id}`,
                            location.label,
                          ),
                          value: location.id.toString(),
                        })) ?? []
                      }
                      control={control}
                      error={errors.target_location_id}
                      isRTL={isRTL}
                    />
                    {targetLocationsQuery.isError ? (
                      <p
                        className={cn(
                          "-mt-3 text-xs font-medium text-destructive md:col-span-2",
                          isRTL ? "text-right" : "text-left",
                        )}>
                        {t("createCampaign.targetLocationsError")}
                      </p>
                    ) : null}

                    <SelectField
                      name="execution_time_id"
                      label={t("createCampaign.campaignDuration")}
                      placeholder={
                        executionTimesQuery.isLoading
                          ? t("createCampaign.loadingExecutionTimes")
                          : t("createCampaign.campaignDurationPlaceholder")
                      }
                      options={
                        executionTimesQuery.data?.map((time) => ({
                          label: t(
                            `masterData.executionTimes.${time.id}`,
                            time.label,
                          ),
                          value: time.id.toString(),
                        })) ?? []
                      }
                      control={control}
                      error={errors.execution_time_id}
                      isRTL={isRTL}
                    />
                    {executionTimesQuery.isError ? (
                      <p
                        className={cn(
                          "-mt-3 text-xs font-medium text-destructive md:col-span-2",
                          isRTL ? "text-right" : "text-left",
                        )}>
                        {t("createCampaign.executionTimesError")}
                      </p>
                    ) : null}

                    <SelectField
                      name="campaign_type_id"
                      label={t("createCampaign.campaignType")}
                      placeholder={
                        campaignTypesQuery.isLoading
                          ? t(
                              "createCampaign.loadingCampaignTypes",
                              "Loading campaign types...",
                            )
                          : t("createCampaign.campaignTypePlaceholder")
                      }
                      options={
                        campaignTypesQuery.data?.map((type) => ({
                          label: t(
                            `masterData.campaignTypes.${type.id}`,
                            type.label,
                          ),
                          value: type.id.toString(),
                        })) ?? []
                      }
                      control={control}
                      error={errors.campaign_type_id}
                      isRTL={isRTL}
                    />
                    {campaignTypesQuery.isError ? (
                      <p
                        className={cn(
                          "-mt-3 text-xs font-medium text-destructive md:col-span-2",
                          isRTL ? "text-right" : "text-left",
                        )}>
                        {t(
                          "createCampaign.campaignTypesError",
                          "Could not load campaign types",
                        )}
                      </p>
                    ) : null}

                    <SelectField
                      name="budget_range_id"
                      label={t("createCampaign.estimatedBudget")}
                      placeholder={
                        budgetRangesQuery.isLoading
                          ? t(
                              "createCampaign.loadingBudgetRanges",
                              "Loading budget ranges...",
                            )
                          : t("createCampaign.estimatedBudgetPlaceholder")
                      }
                      options={
                        budgetRangesQuery.data?.map((range) => ({
                          label: t(
                            `masterData.budgetRanges.${range.id}`,
                            range.label,
                          ),
                          value: range.id.toString(),
                        })) ?? []
                      }
                      control={control}
                      error={errors.budget_range_id}
                      isRTL={isRTL}
                    />
                    {budgetRangesQuery.isError ? (
                      <p
                        className={cn(
                          "-mt-3 text-xs font-medium text-destructive md:col-span-2",
                          isRTL ? "text-right" : "text-left",
                        )}>
                        {t(
                          "createCampaign.budgetRangesError",
                          "Could not load budget ranges",
                        )}
                      </p>
                    ) : null}

                    <div className="md:col-span-1">
                      <SelectField
                        name="influencer_count_range_id"
                        label={t("createCampaign.influencersCount")}
                        placeholder={
                          influencerCountRangesQuery.isLoading
                            ? t(
                                "createCampaign.loadingInfluencerCountRanges",
                                "Loading influencer count ranges...",
                              )
                            : t("createCampaign.influencersCountPlaceholder")
                        }
                        options={
                          influencerCountRangesQuery.data?.map((range) => ({
                            label: t(
                              `masterData.influencerCountRanges.${range.id}`,
                              range.label,
                            ),
                            value: range.id.toString(),
                          })) ?? []
                        }
                        control={control}
                        error={errors.influencer_count_range_id}
                        isRTL={isRTL}
                      />
                    </div>
                    {influencerCountRangesQuery.isError ? (
                      <p
                        className={cn(
                          "-mt-3 text-xs font-medium text-destructive md:col-span-2",
                          isRTL ? "text-right" : "text-left",
                        )}>
                        {t(
                          "createCampaign.influencerCountRangesError",
                          "Could not load influencer count ranges",
                        )}
                      </p>
                    ) : null}
                  </div>

                  <div className={cn("flex pt-1", isRTL ? "justify-start" : "justify-end")}>
                    <Button
                      type="submit"
                      disabled={isSubmitting || createCampaignMutation.isPending}
                      className="group relative inline-flex h-11 min-w-[168px] items-center justify-center rounded-full bg-[linear-gradient(135deg,rgba(111,66,193,1),rgba(201,162,39,1))] px-6 text-sm font-medium text-white shadow-[0_0_20px_rgba(111,66,193,0.25)] transition hover:scale-[1.02] hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-70 sm:h-12 sm:min-w-[182px]">
                      <span
                        className={cn(
                          "absolute top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full bg-white/20 text-white sm:h-8 sm:w-8",
                          isRTL ? "left-2" : "right-2",
                        )}>
                        {isRTL ? (
                          <ChevronLeft size={18} />
                        ) : (
                          <ChevronRight size={18} />
                        )}
                      </span>

                      <span className={isRTL ? "pr-6" : "pl-6"}>
                        {isSubmitting || createCampaignMutation.isPending
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
