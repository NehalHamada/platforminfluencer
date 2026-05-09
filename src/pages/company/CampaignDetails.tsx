import { CalendarDays, Check, Circle } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate } from "react-router-dom";

import hero from "/assets/Hero.png";

import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useCampaignDetailsQuery } from "@/queries/campaigns/useCampaignsDetailsQuery";
import type { Campaign, CampaignRequest } from "@/types/campaign.types";

type ApiRecord = Record<string, unknown>;

type CampaignPaymentApiData = {
  source?: string;
  total_price?: string;
  posts_count?: string;
  ad_plan?: string;
  execution_date?: string;
  content_link?: string;
  influencer_amount?: string;
  settlement_amount?: string;
  final_amount?: string;
  content_details?: string;
  content_type?: string;
};

type CampaignDetailsState = {
  campaignId?: string | number;
  createdCampaign?: Campaign;
  conversationId?: string | number;
  peerName?: string;
  campaignName?: string;
  applicationStatus?: string;
  agreementStatus?: string;
  application?: Partial<CampaignRequest> & ApiRecord;
  campaignData?: Partial<CampaignPaymentApiData> & ApiRecord;
};

type DetailsData = {
  campaignName: string;
  influencerName: string;
  budget: string;
  postsCount: string;
  deliveryDate: string;
  notes: string;
  contentDetails: string;
  influencerAmount: string;
};

type CampaignProgressStatus =
  | "accepted"
  | "content_approved"
  | "modification_requested"
  | "unknown";

const emptyDetailsData: DetailsData = {
  campaignName: "",
  influencerName: "",
  budget: "",
  postsCount: "",
  deliveryDate: "",
  notes: "",
  contentDetails: "",
  influencerAmount: "",
};

const toRecord = (value: unknown): ApiRecord =>
  value && typeof value === "object" ? (value as ApiRecord) : {};

const getText = (...values: unknown[]): string => {
  for (const value of values) {
    if (typeof value === "string" && value.trim()) return value.trim();
    if (typeof value === "number" && Number.isFinite(value)) return String(value);
  }

  return "";
};

const normalizeStatus = (status?: unknown): string =>
  typeof status === "string" ? status.trim().toLowerCase().split("-").join("_") : "";

const parseCampaignIdea = (idea?: string): Partial<CampaignPaymentApiData> => {
  if (!idea) return {};

  try {
    const parsed = JSON.parse(idea) as CampaignPaymentApiData;
    return parsed.source === "campaign_payment" ? parsed : {};
  } catch {
    return {
      ad_plan: idea,
    };
  }
};

const getApplicationRecord = (
  campaign?: Campaign,
  routeState?: CampaignDetailsState,
): ApiRecord => {
  const campaignRecord = toRecord(campaign);
  return {
    ...toRecord(campaignRecord.application),
    ...toRecord(campaignRecord.request),
    ...toRecord(routeState?.application),
  };
};

const getCampaignProgressStatus = (
  campaign?: Campaign,
  routeState?: CampaignDetailsState,
): CampaignProgressStatus => {
  const campaignRecord = toRecord(campaign);
  const applicationRecord = getApplicationRecord(campaign, routeState);
  const rawStatus = getText(
    routeState?.applicationStatus,
    routeState?.agreementStatus,
    applicationRecord.status,
    campaignRecord.application_status,
    campaignRecord.applicationStatus,
    campaignRecord.request_status,
    campaignRecord.status,
  );
  const status = normalizeStatus(rawStatus);

  if (
    ["content_approved", "approved_content", "contentapproved", "approved"].indexOf(
      status,
    ) !== -1
  ) {
    return "content_approved";
  }

  if (status === "modification_requested") return "modification_requested";
  if (status === "accepted") return "accepted";

  return "unknown";
};

const getCampaignDetailsData = (
  campaign?: Campaign,
  routeState?: CampaignDetailsState,
): DetailsData => {
  if (!campaign && !routeState) return emptyDetailsData;

  const campaignRecord = toRecord(campaign);
  const applicationRecord = getApplicationRecord(campaign, routeState);
  const routeCampaignData = toRecord(routeState?.campaignData);
  const ideaData = parseCampaignIdea(campaign?.idea);
  const influencerRecord = toRecord(applicationRecord.user);

  return {
    campaignName: getText(routeState?.campaignName, campaign?.name),
    influencerName: getText(
      routeState?.peerName,
      influencerRecord.name,
      campaign?.user?.name,
      campaignRecord.influencer_name,
      campaignRecord.influencerName,
    ),
    budget: getText(
      applicationRecord.price,
      routeCampaignData.total_price,
      ideaData.total_price,
      campaign?.budget_range?.name,
      campaign?.budgetRange?.name,
      campaign?.budget_range_name,
    ),
    postsCount: getText(
      routeCampaignData.posts_count,
      ideaData.posts_count,
      applicationRecord.posts_count,
      campaignRecord.posts_count,
    ),
    deliveryDate: getText(
      routeCampaignData.execution_date,
      ideaData.execution_date,
      applicationRecord.execution_date,
      campaignRecord.execution_date,
    ),
    notes: getText(
      applicationRecord.note,
      routeCampaignData.ad_plan,
      ideaData.ad_plan,
      campaign?.idea,
    ),
    contentDetails: getText(
      routeCampaignData.content_details,
      routeCampaignData.content_type,
      ideaData.content_details,
      ideaData.content_type,
      applicationRecord.content_details,
      applicationRecord.content_type,
      ideaData.ad_plan,
    ),
    influencerAmount: getText(
      routeCampaignData.influencer_amount,
      routeCampaignData.settlement_amount,
      routeCampaignData.final_amount,
      ideaData.influencer_amount,
      ideaData.settlement_amount,
      ideaData.final_amount,
      applicationRecord.influencer_amount,
      applicationRecord.settlement_amount,
      applicationRecord.final_amount,
    ),
  };
};

function CampaignDetails() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const isRTL = i18n.dir() === "rtl";
  const { state } = useLocation();
  const routeState = (state || {}) as CampaignDetailsState;
  const campaignId = routeState.campaignId ? String(routeState.campaignId) : "";
  const { data: campaignDetails } = useCampaignDetailsQuery(campaignId);
  const campaign = campaignDetails?.data || routeState.createdCampaign;
  const detailsData = getCampaignDetailsData(campaign, routeState);
  const progressStatus = getCampaignProgressStatus(campaign, routeState);
  const isContentApproved = progressStatus === "content_approved";

  const campaignInfo = [
    {
      label: t("campaignDetails.campaignName", "اسم الحملة"),
      value: detailsData.campaignName,
    },
    {
      label: t("campaignDetails.influencerName", "اسم المؤثر"),
      value: detailsData.influencerName,
      contentApprovedOnly: true,
    },
    {
      label: isContentApproved
        ? t("campaignDetails.price", "السعر")
        : t("campaignDetails.budget", "الميزانية"),
      value: detailsData.budget,
    },
    {
      label: isContentApproved
        ? t("campaignDetails.content", "المحتوى")
        : t("campaignDetails.postsCount", "عدد المنشورات"),
      value: detailsData.postsCount || detailsData.contentDetails,
    },
    {
      label: t("campaignDetails.deliveryDate", "موعد التسليم"),
      value: detailsData.deliveryDate,
      acceptedOnly: true,
    },
    {
      label: t("campaignDetails.influencerAmount", "مبلغ المؤثر"),
      value: detailsData.influencerAmount,
      contentApprovedOnly: true,
    },
    {
      label: t("campaignDetails.notes", "ملاحظات"),
      value: detailsData.notes,
      acceptedOnly: true,
    },
  ].filter((item) => {
    if (!item.value) return false;
    if (item.contentApprovedOnly && !isContentApproved) return false;
    if (item.acceptedOnly && isContentApproved) return false;
    return true;
  });

  const acceptedTimeline = [
    {
      label: t("campaignDetails.sent", "تم الإرسال"),
      done: true,
    },
    {
      label: t("campaignDetails.waitingDelivery", "بانتظار تسليم المحتوى"),
      done: false,
    },
    {
      label: t("campaignDetails.reviewed", "تمت المراجعة"),
      done: false,
    },
  ];

  const contentApprovedTimeline = [
    {
      label: t("campaignDetails.launched", "تم إطلاق الحملة"),
      done: true,
    },
    {
      label: t("campaignDetails.contentApproved", "تمت الموافقة على المحتوى"),
      done: true,
    },
    {
      label: t("campaignDetails.waitingSettlement", "بانتظار التسوية"),
      done: false,
    },
  ];

  const timeline = isContentApproved ? contentApprovedTimeline : acceptedTimeline;
  const statusLabel = isContentApproved
    ? t("campaignDetails.waitingCommission", "بانتظار دفع العمولة")
    : t("campaignDetails.accepted", "تم قبول الاتفاق");
  const footerLabel = isContentApproved
    ? t("campaignDetails.waitingCommission", "بانتظار دفع العمولة")
    : t("campaignDetails.waitingContent", "بانتظار تسليم المحتوى");

  return (
    <section
      dir={isRTL ? "rtl" : "ltr"}
      className="relative -mt-24 overflow-hidden bg-white">
      <div className="relative h-80 overflow-hidden sm:h-64 lg:h-90">
        <img
          src={hero}
          alt={t("campaignDetails.heroAlt", "Campaign details hero")}
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-black/55" />
        <div
          className={cn(
            "absolute inset-x-0 bottom-8 z-10 px-6 sm:bottom-10 sm:px-10 lg:px-16",
            isRTL ? "text-right" : "text-left",
          )}>
          <h1 className="inline-block border-b-2 border-white pb-2 text-[26px] font-semibold text-white sm:text-[32px] lg:text-[38px]">
            {t("campaignDetails.title", "تفاصيل الحملة")}
          </h1>
        </div>
      </div>

      <div className="relative z-10 -mt-4 rounded-t-[22px] bg-white px-4 pb-7 pt-3 sm:-mt-6 sm:px-6 sm:pt-5 lg:-mt-8 lg:min-h-130 lg:rounded-t-[32px] lg:px-10 lg:pb-10 lg:pt-10">
        <div className="mx-auto max-w-7xl">
          <Card className="rounded-[12px] border-0! bg-white py-0 shadow-[0_8px_24px_rgba(34,34,31,0.045)] ring-0! lg:rounded-[18px] lg:shadow-[0_18px_45px_rgba(34,34,31,0.06)]">
            <CardContent className="px-3 py-3.5 sm:px-3.5 sm:py-4 lg:px-8 lg:py-8">
              <div className="relative mx-auto min-h-47.5 rounded-[7px] bg-[#fbfbfb] px-3.5 pb-4 pt-7 lg:min-h-82.5 lg:rounded-[10px] lg:px-8 lg:pb-10 lg:pt-14">
                <div className="absolute left-4 top-4 lg:left-8 lg:top-8">
                  <span className="inline-flex items-center gap-1 rounded-lg bg-[#8faa74] px-2 py-1 text-[9px] font-medium leading-none text-white lg:px-4 lg:py-2 lg:text-sm">
                    {statusLabel}
                    {isContentApproved ? <Check className="h-3 w-3" /> : null}
                  </span>
                </div>

                <div className="absolute right-4 top-4 lg:right-8 lg:top-8">
                  {detailsData.deliveryDate ? (
                    <span className="inline-flex items-center gap-1 text-[9px] text-[#8f9188] lg:text-sm">
                      <CalendarDays className="h-2.5 w-2.5 lg:h-4 lg:w-4" />
                      {detailsData.deliveryDate}
                    </span>
                  ) : null}
                </div>

                <div
                  dir="ltr"
                  className={cn(
                    "mt-6 grid grid-cols-1 gap-8 sm:items-start lg:mt-10 lg:gap-16",
                    isRTL
                      ? "lg:grid-cols-[260px_minmax(0,1fr)]"
                      : "lg:grid-cols-[minmax(0,1fr)_260px]",
                  )}>
                  <div dir="ltr" className={cn(isRTL ? "lg:order-1" : "lg:order-2")}>
                    <div className="relative flex min-h-27 flex-row justify-between gap-2 sm:flex-col sm:justify-start sm:gap-4 lg:min-h-52.5 lg:gap-9">
                      <div
                        className={cn(
                          "absolute left-3 right-3 top-3 h-px bg-[#d7d9d2] sm:bottom-3 sm:top-3 sm:h-auto sm:w-px lg:top-4",
                          isRTL
                            ? "sm:left-3 sm:right-auto lg:left-4"
                            : "sm:left-auto sm:right-3 lg:right-4",
                        )}
                      />
                      {timeline.map((step) => (
                        <div
                          key={step.label}
                          className={cn(
                            "relative z-10 flex flex-col items-center gap-1 sm:flex-row",
                            isRTL ? "sm:justify-start" : "sm:justify-end",
                          )}>
                          <span
                            className={cn(
                              "order-1 flex h-6 w-6 items-center justify-center rounded-full border bg-white lg:h-8 lg:w-8",
                              isRTL ? "sm:order-1" : "sm:order-2",
                              step.done
                                ? "border-[#8faa74] text-[#8faa74]"
                                : "border-[#cfd6c6] text-[#9a9d92]",
                            )}>
                            {step.done ? (
                              <Check className="h-3 w-3 lg:h-4 lg:w-4" />
                            ) : (
                              <Circle className="h-2.5 w-2.5 lg:h-3 lg:w-3" />
                            )}
                          </span>
                          <span
                            dir={isRTL ? "rtl" : "ltr"}
                            className={cn(
                              "order-2 w-15 text-center text-[8px] leading-3 text-[#8b8d84] lg:w-30 lg:text-xs lg:leading-5",
                              isRTL
                                ? "sm:order-2 sm:text-right"
                                : "sm:order-1 sm:text-right",
                            )}>
                            {step.label}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div
                    dir={isRTL ? "rtl" : "ltr"}
                    className={cn(
                      isRTL
                        ? "lg:order-2 lg:justify-self-end"
                        : "lg:order-1 lg:justify-self-start",
                    )}>
                    <div className="max-w-71.25 rounded-[7px] px-3 py-2.5 lg:max-w-160 lg:rounded-[12px] lg:px-8 lg:py-7">
                      <div className={cn("mb-3 lg:mb-5", isRTL ? "text-right" : "text-left")}>
                        <h2 className="text-[13px] font-semibold text-[#1f201d] lg:text-xl">
                          {t("campaignDetails.agreementDetails", "تفاصيل الاتفاق")}
                        </h2>
                        <p className="text-[10px] text-[#8b8d84] lg:text-sm">
                          {isContentApproved
                            ? t("campaignDetails.waitingSettlement", "بانتظار التسوية")
                            : t(
                                "campaignDetails.waitingDelivery",
                                "بانتظار تسليم المحتوى",
                              )}
                        </p>
                      </div>

                      <dl className="space-y-0.5 lg:space-y-3">
                        {campaignInfo.map((item) => (
                          <div
                            key={item.label}
                            className={cn(
                              "grid gap-1.5 text-[10px] leading-4 text-[#2f2f2b] lg:gap-8 lg:text-lg lg:leading-7",
                              "grid-cols-[minmax(100px,auto)_minmax(120px,1fr)] lg:grid-cols-[minmax(170px,auto)_minmax(220px,1fr)]",
                              isRTL ? "text-right" : "text-left",
                            )}>
                            <dt className="font-semibold">{item.label}:</dt>
                            <dd className="text-[#3f403a]">{item.value}</dd>
                          </div>
                        ))}
                      </dl>
                    </div>
                  </div>
                </div>

                <div className="mt-5 flex items-center justify-center lg:mt-10">
                  <div className="relative flex w-full max-w-43.75 items-center justify-center lg:max-w-[320px]">
                    <div className="absolute left-0 right-0 h-px bg-[#cfd6c6]" />

                    <Button
                      type="button"
                      onClick={() =>
                        navigate("/dashboard/company/messages", {
                          state: {
                            conversationId: routeState.conversationId,
                            peerName: routeState.peerName,
                            campaignName:
                              detailsData.campaignName || routeState.campaignName,
                          },
                        })
                      }
                      className="relative z-10 -mx-1 h-6 min-w-28 rounded-full bg-[#9aa883] px-4 text-[9px] font-semibold text-white shadow-none hover:bg-[#8f9d78] lg:h-11 lg:min-w-48 lg:px-8 lg:text-base">
                      {footerLabel}
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}

export default CampaignDetails;
