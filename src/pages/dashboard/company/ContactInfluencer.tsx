import { zodResolver } from "@hookform/resolvers/zod";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate } from "react-router-dom";

import hero from "/assets/Hero.png";

import SelectField from "@/components/common/company/SelectField";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { useContentTypesQuery } from "@/queries/masterData/useContentTypesQuery";
import { useCampaignTypesQuery } from "@/queries/masterData/useCampaignTypesQuery";
import { useExecutionTimesQuery } from "@/queries/masterData/useExecutionTimesQuery";
import { useBudgetRangesQuery } from "@/queries/masterData/useBudgetRangesQuery";
import { useSendCollaborationRequestMutation } from "@/queries/campaigns/useSendCollaborationRequestMutation";
import {
  influencerChatSchema,
  type InfluencerChatSchema,
} from "@/schema/dashboard.schema";
function ContactInfluencer() {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.dir() === "rtl";
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as
    | { influencerId?: string | number; influencerName?: string }
    | null;
  const influencerId = state?.influencerId;

  const contentTypesQuery = useContentTypesQuery();
  const campaignTypesQuery = useCampaignTypesQuery();
  const executionTimesQuery = useExecutionTimesQuery();
  const budgetRangesQuery = useBudgetRangesQuery();
  const sendCollaborationMutation = useSendCollaborationRequestMutation();

  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<InfluencerChatSchema>({
    resolver: zodResolver(influencerChatSchema),
    defaultValues: {
      campaignName: "",
      contentType: "",
      goal: "",
      budget: "",
      executionDate: "",
      message: "",
    },
  });

  const onSubmit = (data: InfluencerChatSchema) => {
    if (influencerId) {
      sendCollaborationMutation.mutate(
        {
          influencerId,
          payload: {
            name: data.campaignName,
            content_type_id: Number(data.contentType),
            goal: data.goal,
            budget_range_id: Number(data.budget),
            execution_time_id: Number(data.executionDate),
            message: data.message,
          },
        },
        {
          onSuccess: () => {
            navigate("/dashboard/company/campaigns");
          },
        },
      );
      return;
    }

    navigate("/dashboard/company/messages", {
      state: { contactMessage: data.message },
    });
  };

  return (
    <section
      dir={isRTL ? "rtl" : "ltr"}
      className="relative -mt-24 overflow-hidden bg-white">
      <div className="relative h-44 overflow-hidden sm:h-52 lg:h-72">
        <img
          src={hero}
          alt={t("infChat.heroAlt")}
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-black/55" />
      </div>

      <div className="relative z-10 -mt-4 rounded-t-[28px] bg-white px-4 pb-12 pt-7 sm:-mt-6 sm:px-6 sm:pt-9 lg:-mt-8 lg:rounded-t-[40px] lg:px-10 lg:pb-16">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto max-w-225">
            <div className="mb-7 text-center sm:mb-8">
              <h1 className="text-[32px] font-semibold leading-tight text-[#22221f] sm:text-[42px]">
                {t("infChat.title")}{" "}
                <span className="font-bold text-[#2f2f2a]">
                  {t("infChat.influencerName")}
                </span>
              </h1>
              <p className="mt-2 text-[13px] leading-6 text-[#696961] sm:mt-3 sm:text-base">
                {t("infChat.description")}
              </p>
            </div>

            <Card className="rounded-[24px] border-0! ring-0! bg-white shadow-[0_14px_35px_rgba(34,34,31,0.06)] sm:rounded-[28px]">
              <CardContent className="p-4 sm:p-6 lg:p-7">
                <form
                  onSubmit={handleSubmit(onSubmit)}
                  className="space-y-6 sm:space-y-7">
                  <div className="grid grid-cols-1 gap-x-7 gap-y-4 sm:gap-y-5 md:grid-cols-2">
                    {/* اسم التعاون */}
                    <div className="flex flex-col gap-2">
                      <Label
                        htmlFor="campaignName"
                        className={cn(
                          "text-md font-medium text-[#2f2f2b]",
                          isRTL ? "text-right" : "text-left",
                        )}>
                        {t("infChat.campaignName")}
                      </Label>
                      <Input
                        id="campaignName"
                        {...register("campaignName")}
                        placeholder={t("infChat.placeholders.campaignName")}
                        aria-invalid={errors.campaignName ? "true" : undefined}
                        className={cn(
                          "h-11 rounded-full border-[#d9d7cf] bg-white px-4 text-sm text-[#2f2f2b] placeholder:text-[#8b8b84] focus-visible:border-[#9aa883] focus-visible:ring-1 focus-visible:ring-[#9aa883]/30",
                          isRTL ? "text-right" : "text-left",
                        )}
                      />
                      {errors.campaignName ? (
                        <p
                          className={cn(
                            "text-xs font-medium text-destructive",
                            isRTL ? "text-right" : "text-left",
                          )}>
                          {t(errors.campaignName.message ?? "")}
                        </p>
                      ) : null}
                    </div>

                    {/* نوع المحتوى - from API */}
                    <SelectField
                      name="contentType"
                      label={t("infChat.contentType")}
                      placeholder={
                        contentTypesQuery.isLoading
                          ? t("influencer.loadingContentTypes")
                          : t("infChat.placeholders.contentType")
                      }
                      options={
                        contentTypesQuery.data?.map((item) => ({
                          label: t(
                            `masterData.contentTypes.${item.id}`,
                            item.label,
                          ),
                          value: item.id.toString(),
                        })) ?? []
                      }
                      control={control}
                      error={errors.contentType}
                      isRTL={isRTL}
                    />

                    {/* هدف التعاون - from API */}
                    <SelectField
                      name="goal"
                      label={t("infChat.goal")}
                      placeholder={
                        campaignTypesQuery.isLoading
                          ? t(
                              "createCampaign.loadingCampaignTypes",
                              "Loading...",
                            )
                          : t("infChat.placeholders.goal")
                      }
                      options={
                        campaignTypesQuery.data?.map((item) => ({
                          label: t(
                            `masterData.campaignTypes.${item.id}`,
                            item.label,
                          ),
                          value: item.id.toString(),
                        })) ?? []
                      }
                      control={control}
                      error={errors.goal}
                      isRTL={isRTL}
                    />

                    {/* الميزانية المتوفرة */}
                    <SelectField
                      name="budget"
                      label={t("infChat.budget")}
                      placeholder={
                        budgetRangesQuery.isLoading
                          ? t("createCampaign.loadingBudgetRanges", "Loading...")
                          : t("infChat.placeholders.budget")
                      }
                      options={
                        budgetRangesQuery.data?.map((item) => ({
                          label: t(
                            `masterData.budgetRanges.${item.id}`,
                            item.label,
                          ),
                          value: item.id.toString(),
                        })) ?? []
                      }
                      control={control}
                      error={errors.budget}
                      isRTL={isRTL}
                    />

                    {/* موعد التنفيذ - from API */}
                    <SelectField
                      name="executionDate"
                      label={t("infChat.executionDate")}
                      placeholder={
                        executionTimesQuery.isLoading
                          ? t("createCampaign.loadingExecutionTimes")
                          : t("infChat.placeholders.executionDate")
                      }
                      options={
                        executionTimesQuery.data?.map((item) => ({
                          label: t(
                            `masterData.executionTimes.${item.id}`,
                            item.label,
                          ),
                          value: item.id.toString(),
                        })) ?? []
                      }
                      control={control}
                      error={errors.executionDate}
                      isRTL={isRTL}
                    />

                    {/* رسالتك إلى المؤثر - input عادي */}
                    <div className="flex flex-col gap-2">
                      <Label
                        htmlFor="message"
                        className={cn(
                          "text-md font-medium text-[#2f2f2b]",
                          isRTL ? "text-right" : "text-left",
                        )}>
                        {t("infChat.message")}
                      </Label>
                      <Input
                        id="message"
                        {...register("message")}
                        placeholder={t("infChat.placeholders.message")}
                        aria-invalid={errors.message ? "true" : undefined}
                        className={cn(
                          "h-11 rounded-full border-[#d9d7cf] bg-white px-4 text-sm text-[#2f2f2b] placeholder:text-[#8b8b84] focus-visible:border-[#9aa883] focus-visible:ring-1 focus-visible:ring-[#9aa883]/30",
                          isRTL ? "text-right" : "text-left",
                        )}
                      />
                      {errors.message ? (
                        <p
                          className={cn(
                            "text-xs font-medium text-destructive",
                            isRTL ? "text-right" : "text-left",
                          )}>
                          {t(errors.message.message ?? "")}
                        </p>
                      ) : null}
                    </div>
                  </div>

                  <div
                    className={cn(
                      "flex pt-1",
                      isRTL ? "justify-start" : "justify-end",
                    )}>
                    <Button
                      type="submit"
                      disabled={isSubmitting || sendCollaborationMutation.isPending}
                      className="group relative inline-flex h-11 min-w-42 items-center justify-center rounded-full bg-[#9aa883] px-6 text-sm font-medium text-white shadow-[0_8px_18px_rgba(154,168,131,0.35)] transition hover:scale-[1.02] hover:bg-[#8f9d78] disabled:cursor-not-allowed disabled:opacity-70 sm:h-12 sm:min-w-45.5">
                      <span
                        className={cn(
                          "absolute top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full bg-[#f3f7eb] text-[#8c9878] sm:h-8 sm:w-8",
                          isRTL ? "left-2" : "right-2",
                        )}>
                        {isRTL ? (
                          <ChevronLeft size={18} />
                        ) : (
                          <ChevronRight size={18} />
                        )}
                      </span>
                      <span className={isRTL ? "pr-6" : "pl-6"}>
                        {isSubmitting || sendCollaborationMutation.isPending
                          ? t("createCampaign.submitting", "Sending...")
                          : t("infChat.submit")}
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

export default ContactInfluencer;
