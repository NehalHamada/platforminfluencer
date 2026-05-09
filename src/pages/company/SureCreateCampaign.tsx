import { useTranslation } from "react-i18next";
import { useLocation, useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";

import hero from "/assets/Hero.png";

import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { useCampaignDetailsQuery } from "@/queries/campaigns/useCampaignsDetailsQuery";
import type { Campaign } from "@/types/campaign.types";

interface CampaignData {
  totalPrice: string;
  postsCount: string;
  adPlan: string;
  executionDate: string;
  campaignName: string;
  contentLink: string;
  paymentMethod: string;
}

type CampaignPaymentApiData = {
  source?: string;
  total_price?: string;
  posts_count?: string;
  ad_plan?: string;
  execution_date?: string;
  content_link?: string;
  payment_method?: string;
};

type SureCreateCampaignState = {
  campaignId?: string | number;
  createdCampaign?: Campaign;
};

const emptyCampaignData: CampaignData = {
  totalPrice: "",
  postsCount: "",
  adPlan: "",
  executionDate: "",
  campaignName: "",
  contentLink: "",
  paymentMethod: "",
};

const parsePaymentDataFromCampaign = (
  campaign?: Campaign,
): Partial<CampaignData> => {
  if (!campaign) return {};

  try {
    const parsed = JSON.parse(campaign.idea || "{}") as CampaignPaymentApiData;

    if (parsed.source !== "campaign_payment") return {};

    return {
      totalPrice: parsed.total_price || "",
      postsCount: parsed.posts_count || "",
      adPlan: parsed.ad_plan || "",
      executionDate: parsed.execution_date || "",
      campaignName: campaign.name || "",
      contentLink: parsed.content_link || "",
      paymentMethod: parsed.payment_method || "",
    };
  } catch {
    return {
      campaignName: campaign.name || "",
      adPlan: campaign.idea || "",
    };
  }
};

const getNumericAmount = (value: string) => {
  const normalized = value
    .replace(/[٠-٩]/g, (digit) => String("٠١٢٣٤٥٦٧٨٩".indexOf(digit)))
    .replace(/[۰-۹]/g, (digit) => String("۰۱۲۳۴۵۶۷۸۹".indexOf(digit)))
    .replace(/[^\d.]/g, "");
  const amount = Number(normalized);
  return Number.isFinite(amount) ? amount : 0;
};

const formatAmount = (value: number) =>
  new Intl.NumberFormat("ar-EG", {
    maximumFractionDigits: 0,
  }).format(value);

function SureCreateCampaign() {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.dir() === "rtl";
  const location = useLocation();
  const navigate = useNavigate();
  const routeState = (location.state || {}) as SureCreateCampaignState;
  const campaignId = routeState.campaignId ? String(routeState.campaignId) : "";
  const { data: campaignDetails } = useCampaignDetailsQuery(campaignId);
  const apiCampaign = campaignDetails?.data || routeState.createdCampaign;

  const campaignData: CampaignData = {
    ...emptyCampaignData,
    ...parsePaymentDataFromCampaign(apiCampaign),
  };

  const paymentLabels: Record<string, string> = {
    mada: "مدى Mada",
    visa: "VISA",
    mastercard: "Mastercard",
  };
  const totalAmount = getNumericAmount(campaignData.totalPrice);
  const commissionPercentage = 10;
  const commissionAmount = totalAmount * (commissionPercentage / 100);
  const influencerAmount = totalAmount - commissionAmount;

  const readOnlyField = cn(
    "h-11 rounded-full border-[#d9d7cf] bg-[#fafaf8] px-4 text-sm text-[#2f2f2b] read-only:cursor-default read-only:opacity-80 focus-visible:ring-0 focus-visible:border-[#d9d7cf]",
    isRTL ? "text-right" : "text-left",
  );

  const labelClass = cn(
    "text-sm font-medium text-[#2f2f2b]",
    isRTL ? "text-right" : "text-left",
  );

  const handleLaunch = () => {
    navigate("/dashboard/company/campaign-details", {
      state: {
        campaignId,
        campaignData,
        createdCampaign: apiCampaign,
      },
    });
  };

  return (
    <section
      dir={isRTL ? "rtl" : "ltr"}
      className="relative -mt-24 overflow-hidden bg-white">
      <div className="relative h-80 overflow-hidden sm:h-64 lg:h-90">
        <img
          src={hero}
          alt={t("sureCampaign.heroAlt", "Campaign confirmation hero")}
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-black/55" />
        <div
          className={cn(
            "absolute inset-x-0 bottom-8 z-10 px-6 sm:bottom-10 sm:px-10 lg:px-16",
            isRTL ? "text-right" : "text-left",
          )}>
          <h1 className="inline-block border-b-2 border-white pb-2 text-[26px] font-semibold text-white sm:text-[32px] lg:text-[38px]">
            {t("sureCampaign.title", "انشاء حملة")}
          </h1>
        </div>
      </div>

      <div className="relative z-10 -mt-4 rounded-t-[28px] bg-white px-4 pb-12 pt-7 sm:-mt-6 sm:px-6 sm:pt-9 lg:-mt-8 lg:rounded-t-[40px] lg:px-10 lg:pb-16">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto max-w-225">
            <Card className="rounded-[24px] border-0! ring-0! bg-white shadow-[0_14px_35px_rgba(34,34,31,0.06)] sm:rounded-[28px]">
              <CardContent className="p-5 sm:p-7 lg:p-8">
                <div className="space-y-5 sm:space-y-6">
                  <div className="grid grid-cols-1 gap-x-7 gap-y-4 sm:gap-y-5 md:grid-cols-2">
                    <div className="flex flex-col gap-2">
                      <Label htmlFor="sure-total-price" className={labelClass}>
                        {t("sureCampaign.totalPrice", "السعر الإجمالي")}
                      </Label>
                      <Input
                        id="sure-total-price"
                        value={campaignData.totalPrice}
                        readOnly
                        className={readOnlyField}
                      />
                    </div>

                    <div className="flex flex-col gap-2">
                      <Label htmlFor="sure-posts-count" className={labelClass}>
                        {t("sureCampaign.postsCount", "عدد المنشورات")}
                      </Label>
                      <Input
                        id="sure-posts-count"
                        value={campaignData.postsCount}
                        readOnly
                        className={readOnlyField}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-x-7 gap-y-4 sm:gap-y-5 md:grid-cols-2">
                    <div className="flex flex-col gap-2">
                      <Label
                        htmlFor="sure-execution-date"
                        className={labelClass}>
                        {t("sureCampaign.executionDate", "موعد التنفيذ")}
                      </Label>
                      <Input
                        id="sure-execution-date"
                        value={campaignData.executionDate}
                        readOnly
                        className={readOnlyField}
                      />
                    </div>

                    <div className="flex flex-col gap-2">
                      <Label htmlFor="sure-ad-plan" className={labelClass}>
                        {t("sureCampaign.conditions", "الشروط الاضافية")}
                      </Label>
                      <Input
                        id="sure-ad-plan"
                        value={campaignData.adPlan}
                        readOnly
                        className={readOnlyField}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-x-7 gap-y-4 sm:gap-y-5 md:grid-cols-2">
                    <div className="flex flex-col gap-2">
                      <Label
                        htmlFor="sure-campaign-name"
                        className={labelClass}>
                        {t("sureCampaign.campaignName", "اسم الحملة")}
                      </Label>
                      <Input
                        id="sure-campaign-name"
                        value={campaignData.campaignName}
                        readOnly
                        className={readOnlyField}
                      />
                    </div>

                    <div className="flex flex-col gap-2">
                      <Label htmlFor="sure-content-link" className={labelClass}>
                        {t(
                          "sureCampaign.filesForInfluencer",
                          "اضافة ملفات للمؤثر",
                        )}
                      </Label>
                      <Input
                        id="sure-content-link"
                        value={campaignData.contentLink}
                        readOnly
                        className={readOnlyField}
                      />
                    </div>
                  </div>

                  <Separator className="bg-[#e8e6df]" />

                  <div className="space-y-1.5">
                    <p
                      className={cn(
                        "text-sm font-medium text-[#2f2f2b]",
                        isRTL ? "text-right" : "text-left",
                      )}>
                      {t("sureCampaign.paymentSection", "قسم الدفع")}
                    </p>
                    <p
                      className={cn(
                        "text-sm text-[#5a5a52]",
                        isRTL ? "text-right" : "text-left",
                      )}>
                      {t("sureCampaign.paymentOption", "خيار الدفع")}
                      {" : "}
                      <Badge
                        variant="outline"
                        className="border-0 bg-transparent text-[#2f2f2b] font-medium text-sm px-0 py-0 underline">
                        {paymentLabels[campaignData.paymentMethod] ||
                          campaignData.paymentMethod}
                      </Badge>
                    </p>
                  </div>

                  <Card className="rounded-[20px] border-[#d9d7cf] bg-white shadow-none">
                    <CardHeader className="pb-0 pt-4 px-5 sm:px-6">
                      <CardTitle className="text-center text-sm font-medium text-[#2f2f2b]">
                        {t("sureCampaign.campaignNotes", "ملاحظات الحملة")}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="px-5 pb-5 pt-3 sm:px-6 sm:pb-6">
                      <Separator className="bg-[#e8e6df] mb-4" />
                      <ul
                        className={cn(
                          "space-y-3",
                          isRTL ? "text-right" : "text-left",
                        )}>
                        <li className="flex items-start gap-2 text-sm text-[#2f2f2b]">
                          <span className="mt-0.5 shrink-0 text-[#2f2f2b]">
                            •
                          </span>
                          <span>
                            {t(
                              "sureCampaign.notes.totalPriceLabel",
                              "السعر الإجمالي",
                            )}
                            {": "}
                            {formatAmount(totalAmount)}
                            {" "}
                            {t("sureCampaign.notes.currency", "ريال")}
                          </span>
                        </li>
                        <li className="flex items-start gap-2 text-sm text-[#2f2f2b]">
                          <span className="mt-0.5 shrink-0 text-[#2f2f2b]">
                            •
                          </span>
                          <span>
                            {t(
                              "sureCampaign.notes.commissionLabel",
                              "العمولة",
                            )}
                            {": "}
                            {commissionPercentage}% ={" "}
                            {formatAmount(commissionAmount)}
                            {" "}
                            {t("sureCampaign.notes.currency", "ريال")}
                          </span>
                        </li>
                        <li className="flex items-start gap-2 text-sm text-[#2f2f2b]">
                          <span className="mt-0.5 shrink-0 text-[#2f2f2b]">
                            •
                          </span>
                          <span>
                            {t(
                              "sureCampaign.notes.influencerAmountLabel",
                              "المبلغ الذي سيُحجز للمؤثر",
                            )}
                            {": "}
                            {formatAmount(influencerAmount)}
                            {" "}
                            {t("sureCampaign.notes.currency", "ريال")}
                          </span>
                        </li>
                      </ul>
                    </CardContent>
                  </Card>

                  <div className="flex justify-center pt-1">
                    <Button
                      type="button"
                      onClick={handleLaunch}
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
                        {t("sureCampaign.launch", "إطلاق الحملة")}
                      </span>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}

export default SureCreateCampaign;
