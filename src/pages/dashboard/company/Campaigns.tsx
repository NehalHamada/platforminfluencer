import { ArrowLeft, ArrowRight, CalendarDays, Check, Circle, MessageCircleMore } from "lucide-react";
import { useTranslation } from "react-i18next";

import hero from "/assets/Hero.png";

import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/badge";
import { CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useCampaignsQuery } from "@/queries/campaigns/useCampaignsQuery";
import type { CampaignStep } from "@/types/campaign.types";

function Campaigns() {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.dir() === "rtl";
  const campaignsQuery = useCampaignsQuery();
  const campaign = campaignsQuery.data?.data?.[0];
  const status = campaign?.status ?? "draft";
  const completedSteps =
    status === "completed" ? 3 : status === "active" ? 2 : 1;

  const steps: CampaignStep[] = [
    {
      id: 1,
      label: isRTL ? "تم الاتفاق" : "Agreement completed",
      completed: completedSteps >= 1,
    },
    {
      id: 2,
      label: isRTL ? "الموافقة على المحتوى" : "Content approved",
      completed: completedSteps >= 2,
    },
    {
      id: 3,
      label: isRTL ? "تم نشر المحتوى" : "Content published",
      completed: completedSteps >= 3,
    },
  ];

  return (
    <section
      dir={isRTL ? "rtl" : "ltr"}
      className="relative -mt-24 overflow-x-hidden bg-[rgba(255,255,255,1)]">
      <div className="relative h-52 w-full overflow-hidden sm:h-80">
        <img
          src={hero}
          alt={t("campaigns.heroAlt")}
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-black/55" />
        <h1
          className={cn(
            "absolute bottom-5 block text-[11px] font-semibold text-white sm:hidden",
            isRTL ? "right-4" : "left-4",
          )}>
          {t("campaigns.pageTitle")}
        </h1>
      </div>

      <div className="relative z-10 -mt-1 bg-[rgba(255,255,255,1)] px-3 pb-24 pt-0 sm:-mt-10 sm:rounded-t-[34px] sm:px-6 sm:pb-10 sm:pt-6 lg:rounded-t-[42px] lg:px-10 lg:pt-8">
        <div className="mx-auto max-w-md sm:max-w-7xl">
          <div className="border0 bg-white py-0 shadow-none sm:rounded-[28px] sm:shadow-[0_16px_48px_rgba(28,30,24,0.06)]">
            <CardContent className="p-0 sm:p-6 lg:p-8">
              {campaignsQuery.isLoading ? (
                <div className="rounded-[22px] bg-white p-8 text-center text-sm text-[#6a6a63]">
                  {t("campaigns.loading")}
                </div>
              ) : null}

              {campaignsQuery.isError ? (
                <div className="rounded-[22px] bg-white p-8 text-center text-sm text-destructive">
                  {t("campaigns.error")}
                </div>
              ) : null}

              {!campaignsQuery.isLoading && !campaignsQuery.isError && !campaign ? (
                <div className="rounded-[22px] bg-white p-8 text-center text-sm text-[#6a6a63]">
                  {t("campaigns.empty")}
                </div>
              ) : null}

              {campaign ? (
                <div className="rounded-none bg-[rgba(255,255,255,1)] p-0 sm:rounded-[22px] sm:p-5 lg:p-6">
                  <div
                    className={cn(
                      "mb-4 flex flex-row-reverse items-center justify-between gap-2 border-b border-[#f0eee8] px-1 py-3 sm:mb-5 sm:flex-row sm:gap-3 sm:border-[rgba(255,255,255,1)] sm:px-0 sm:pb-4 sm:pt-0 sm:items-center sm:justify-between",
                      isRTL ? "sm:flex-row-reverse" : "sm:flex-row",
                    )}>
                    <div
                      className={cn(
                        "flex items-center gap-1.5 sm:gap-2",
                        isRTL ? "flex-row-reverse" : "flex-row",
                      )}>
                      <Badge className="rounded-sm bg-[#b9c69f] px-3 py-1.5 text-[11px] font-medium text-white hover:bg-[#b9c69f] sm:rounded-md sm:px-3 sm:py-1.5 sm:text-xs">
                        {t("campaigns.openChat")}
                      </Badge>
                      <MessageCircleMore className="hidden h-3 w-3 text-[#9baa87] sm:block sm:h-4 sm:w-4" />
                    </div>

                    <div
                      className={cn(
                        "flex items-center gap-1.5 text-[11px] text-[#98a085] sm:gap-2 sm:text-sm",
                        isRTL ? "flex-row" : "flex-row",
                      )}>
                      <CalendarDays className="h-4 w-4 sm:h-4 sm:w-4" />
                      <span>{campaign.createdAt ?? "-"}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-5 px-1 sm:gap-8 sm:px-0 lg:grid-cols-[0.95fr_1.05fr]">
                    <div className={cn(isRTL ? "lg:order-1" : "lg:order-1")}>
                      <div
                        className={cn(
                          "space-y-3 text-sm leading-7 text-[#4f5049] sm:space-y-4 sm:text-[15px] sm:leading-7",
                          isRTL ? "text-right" : "text-left",
                        )}>
                        <div>
                          <p className="font-semibold text-[#2b2b26]">
                            {t("campaigns.campaignName")} :
                          </p>
                          <div
                            className={cn(
                              "mt-1 flex flex-col items-start gap-1 sm:mt-2 sm:flex-row sm:flex-wrap sm:gap-2",
                              isRTL ? "sm:justify-start" : "sm:justify-start",
                            )}>
                            <span>{campaign.name ?? campaign.campaignName ?? "-"}</span>
                            <Badge className="self-center rounded-sm bg-[#39b54a] px-4 py-1.5 text-[12px] font-medium text-white hover:bg-[#39b54a] sm:self-auto sm:rounded-md sm:px-4 sm:py-1.5 sm:text-sm">
                              {status === "completed"
                                ? t("campaigns.success")
                                : t("campaigns.inProgress")}
                            </Badge>
                          </div>
                        </div>

                        <p>
                          <span className="font-semibold text-[#2b2b26]">
                            {t("campaigns.influencerName")} :
                          </span>{" "}
                          {campaign.influencerName ?? "-"}
                        </p>

                        <div>
                          <p className="font-semibold text-[#2b2b26]">
                            {t("campaigns.paymentDetails")} :
                          </p>
                          <ul className="mt-1 space-y-0.5 sm:mt-2 sm:space-y-1">
                            <li>
                              <span className="font-semibold text-[#4a4a45]">
                                {t("campaigns.totalAmount")} :
                              </span>{" "}
                              {campaign.totalAmount ?? campaign.estimatedBudget ?? "-"}
                            </li>
                            <li>
                              <span className="font-semibold text-[#4a4a45]">
                                {t("campaigns.commission")} :
                              </span>{" "}
                              {campaign.commission ?? "-"}
                            </li>
                            <li>
                              <span className="font-semibold text-[#4a4a45]">
                                {t("campaigns.netAmount")} :
                              </span>{" "}
                              {campaign.netAmount ?? "-"}
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>

                    <div
                      className={cn(
                        "order-first sm:order-0",
                        isRTL ? "lg:order-2" : "lg:order-2",
                      )}>
                      <div className="relative lg:pt-2">
                        <div
                          className={cn(
                            "hidden sm:absolute sm:bottom-3 sm:top-3 sm:block sm:w-px sm:bg-[#d9d5ea]",
                            isRTL ? "left-2" : "right-2",
                          )}
                          aria-hidden="true"
                        />

                        <div className="relative flex items-start justify-between gap-2 pb-2 sm:block sm:space-y-8">
                          <div
                            className="absolute left-5 right-5 top-1 h-px bg-[#d8dccb] sm:hidden"
                            aria-hidden="true"
                          />
                          {steps.map((step) => (
                            <div
                              key={step.id}
                              className={cn(
                                "relative flex flex-1 flex-col items-center gap-1 sm:flex-row sm:gap-4",
                                isRTL ? "sm:flex-row-reverse" : "sm:flex-row-reverse",
                              )}>
                              <div className="relative z-10 flex h-2 w-2 shrink-0 items-center justify-center rounded-full bg-[#9baa87] text-white sm:h-5 sm:w-5 sm:bg-[#8f8cb0]">
                                {step.completed ? (
                                  <Check className="hidden h-3 w-3 sm:block" strokeWidth={3} />
                                ) : (
                                  <Circle className="hidden h-3 w-3 sm:block" />
                                )}
                              </div>

                              <p
                                className={cn(
                                  "text-center text-[11px] font-medium text-[#62665d] sm:text-[15px]",
                                  isRTL ? "sm:text-right" : "sm:text-left",
                                )}>
                                {step.label}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 flex justify-center sm:mt-8">
                    <Button
                      type="button"
                      variant="outline"
                      className="h-9 w-full max-w-md rounded-sm border border-dashed border-[#d5d2c8] bg-white text-xs font-medium text-[#6a6a63] hover:bg-[#f8f7f3] sm:h-12 sm:rounded-md sm:text-sm">
                      {t("campaigns.viewContent")}
                    </Button>
                  </div>
                </div>
              ) : null}

              <div className="flex justify-center pt-3 sm:pt-8">
                <Button
                  type="button"
                  className="group h-9 rounded-full bg-[#aab48f] px-4 text-xs font-medium text-white shadow-none hover:bg-[#9eaa83] sm:h-14 sm:px-6 sm:text-sm sm:shadow-[0_10px_30px_rgba(170,180,143,0.3)]">
                  <span className={isRTL ? "text-right" : "text-left"}>
                    {t("campaigns.relaunch")}
                  </span>
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#eef2e6] text-[#8b9677] sm:h-8 sm:w-8">
                    {isRTL ? (
                      <ArrowLeft className="h-3 w-3 sm:h-4.5 sm:w-4.5" />
                    ) : (
                      <ArrowRight className="h-3 w-3 sm:h-4.5 sm:w-4.5" />
                    )}
                  </span>
                </Button>
              </div>
            </CardContent>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Campaigns;
