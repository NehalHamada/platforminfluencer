import { useState } from "react";
import { ShieldCheck } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Link, Outlet, useLocation } from "react-router-dom";

import hero from "/assets/Hero.optimized.jpg";

import { Button } from "@/components/ui/Button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useInfluencerDashboardQuery } from "@/queries/dashboard/useInfluencerDashboardQuery";
import { useCollaborationRequestsQuery } from "@/queries/campaigns/useCollaborationRequestsQuery";
import { useRespondToCollaborationRequestMutation } from "@/queries/campaigns/useRespondToCollaborationRequestMutation";
import { useCampaignStore } from "@/store/campaign.store";
import { isClosedCampaignStatus } from "@/utils/campaignProgress";
import { useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/constants/queryKeys";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

import { useAuthStore } from "@/store/auth.store";
import type { AuthUser } from "@/types/auth.types";
import type {
  CollaborationRequest,
  Campaign,
  ApiNamedEntity,
  ApiUser,
} from "@/types/campaign.types";
import type {
  ActivityItem,
  InfluencerDashboardResponse,
  UpcomingCampaignItem,
} from "@/types/dashboard.types";

type DashboardCampaignCard = {
  id: string | number;
  requestId?: string | number;
  campaignId: string | number;
  brand: string;
  campaignName?: string;
  companyName?: string;
  type: string;
  typeId?: number;
  date: string;
  dateId?: number;
  budget: string;
  budgetId?: number;
  platform?: string;
  platformId?: number;
  audience?: string;
  targetAudienceId?: number;
  image?: string;
  description?: string;
};

const avatarColors = [
  "bg-[#8FA36A]",
  "bg-[#C07A59]",
  "bg-[#6F8FAF]",
  "bg-[#A66A8A]",
  "bg-[#7C8C5A]",
  "bg-[#B08A4A]",
];

const getAvatarColor = (seed: string) => {
  const total = seed
    .split("")
    .reduce((sum, char) => sum + char.charCodeAt(0), 0);

  return avatarColors[total % avatarColors.length];
};

const getRecord = (value: unknown) =>
  value && typeof value === "object" ? (value as Record<string, unknown>) : {};

const getText = (...values: unknown[]) =>
  values
    .map((value) =>
      typeof value === "string" || typeof value === "number"
        ? String(value).trim()
        : "",
    )
    .find(Boolean);

const getNumber = (...values: unknown[]) => {
  for (const value of values) {
    const numericValue =
      typeof value === "number"
        ? value
        : typeof value === "string"
          ? Number(value)
          : NaN;

    if (Number.isFinite(numericValue)) return numericValue;
  }

  return undefined;
};

const getNamedEntityText = (value?: ApiNamedEntity | null) =>
  getText(value?.name);

const getCompanyName = (campaign?: Campaign | null, user?: ApiUser | null) =>
  getText(
    user?.company_name,
    user?.name,
    campaign?.user?.company_name,
    campaign?.user?.name,
    campaign?.company_name,
  );

const getCampaignImage = (value: unknown) => {
  const raw = getRecord(value);
  const campaign = getRecord(raw.campaign);
  const media = getRecord(raw.media);
  const image = getRecord(raw.image);

  return getText(
    raw.image_url,
    raw.image,
    raw.thumbnail_url,
    raw.thumbnail,
    raw.media_url,
    media.url,
    image.url,
    campaign.image_url,
    campaign.image,
    campaign.thumbnail_url,
    campaign.media_url,
  );
};

const getCampaignDescription = (campaign?: Campaign | null, raw?: unknown) => {
  const rawRecord = getRecord(raw);
  const rawCampaign = getRecord(rawRecord.campaign);

  return getText(
    campaign?.idea,
    rawRecord.description,
    rawRecord.idea,
    rawCampaign.description,
    rawCampaign.idea,
  );
};

const mapUpcomingCampaignToCard = (
  campaign: UpcomingCampaignItem,
): DashboardCampaignCard => {
  const raw = getRecord(campaign.raw);

  return {
    id: campaign.id,
    campaignId: campaign.campaignId ?? campaign.id,
    brand: campaign.brand,
    campaignName: campaign.campaignName,
    companyName: getText(campaign.brand, raw.company_name, raw.companyName),
    type: campaign.type,
    typeId: campaign.typeId,
    date: campaign.date,
    dateId: campaign.dateId,
    budget: campaign.budget,
    budgetId: campaign.budgetId,
    platform: getText(raw.platform_name),
    platformId: campaign.platformId,
    audience: getText(raw.target_audience_name),
    targetAudienceId: campaign.targetAudienceId,
    image: getCampaignImage(campaign.raw),
    description: getCampaignDescription(undefined, campaign.raw),
  };
};

const mapCollaborationRequestToCard = (
  request: CollaborationRequest,
): DashboardCampaignCard | null => {
  const campaign = request.campaign;
  if (!campaign) return null;

  const rawCampaign = getRecord(campaign);
  const companyName = getCompanyName(campaign, request.company ?? request.user);
  const campaignType =
    getNamedEntityText(campaign.campaign_type) ||
    getNamedEntityText(campaign.campaignType);
  const executionTime =
    getNamedEntityText(campaign.execution_time) ||
    getNamedEntityText(campaign.executionTime);
  const budgetRange =
    getNamedEntityText(campaign.budget_range) ||
    getNamedEntityText(campaign.budgetRange);

  return {
    id: request.id,
    requestId: request.id,
    campaignId: request.campaign_id ?? campaign.id,
    brand: companyName ?? "-",
    campaignName: getText(campaign.name, rawCampaign.title, campaignType),
    companyName,
    type: getText(campaignType, campaign.campaign_type_name, rawCampaign.type) ?? "",
    typeId: getNumber(rawCampaign.campaign_type_id),
    date:
      getText(executionTime, rawCampaign.execution_date, campaign.created_at) ??
      "",
    dateId: getNumber(rawCampaign.execution_time_id),
    budget: getText(budgetRange, campaign.budget_range_name, request.price) ?? "",
    budgetId: getNumber(rawCampaign.budget_range_id),
    platform: getNamedEntityText(campaign.platform),
    platformId: getNumber(rawCampaign.platform_id),
    audience: getNamedEntityText(campaign.target_audience),
    targetAudienceId: getNumber(rawCampaign.target_audience_id),
    image: getCampaignImage(campaign),
    description: getCampaignDescription(campaign),
  };
};

const mapActivityToCollageItem = (item: ActivityItem, index: number) => ({
  id: item.id,
  src: item.src || item.image,
  alt: item.alt || item.title || "Recent activity",
  className:
    index === 2
      ? "h-20 w-16 sm:h-44 sm:w-36"
      : index % 2 === 0
        ? "h-9 w-12 sm:h-20 sm:w-28 sm:-mb-4"
        : "h-14 w-14 sm:h-28 sm:w-28 sm:-mb-2",
  featured: index === 2,
});

const getStoredUser = (): AuthUser | null => {
  if (typeof window === "undefined") return null;

  const parseUser = (value: string | null): AuthUser | null => {
    if (!value) return null;

    try {
      const parsed = JSON.parse(value) as unknown;
      const user =
        parsed && typeof parsed === "object" && "state" in parsed
          ? (parsed as { state?: { user?: unknown } }).state?.user
          : parsed;

      if (!user || typeof user !== "object") return null;

      const candidate = user as {
        id?: unknown;
        name?: unknown;
        type?: unknown;
      };
      const id =
        typeof candidate.id === "number"
          ? candidate.id
          : typeof candidate.id === "string"
            ? Number(candidate.id)
            : NaN;

      if (
        Number.isFinite(id) &&
        typeof candidate.name === "string" &&
        (candidate.type === "company" || candidate.type === "influencer")
      ) {
        return {
          id,
          name: candidate.name,
          type: candidate.type,
        };
      }
    } catch {
      return null;
    }

    return null;
  };

  return (
    parseUser(sessionStorage.getItem("user")) ||
    parseUser(sessionStorage.getItem("auth-storage"))
  );
};

function SectionTitle({
  title,
  subtitle,
}: {
  title: string;
  subtitle?: string;
}) {
  return (
    <div className="mb-3 text-center">
      <h2 className="text-[12px] font-bold text-[#232323] sm:text-base">
        {title}
      </h2>
      {subtitle ? (
        <p className="mx-auto mt-1 max-w-38 text-[8px] leading-4 text-[#8b8b8b] sm:max-w-80 sm:text-xs sm:leading-5">
          {subtitle}
        </p>
      ) : null}
    </div>
  );
}

function InfluencerDashboard() {
  const respondMutation = useRespondToCollaborationRequestMutation();

  const queryClient = useQueryClient();
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const { rejectedCampaignIds, addRejectedCampaignId } = useCampaignStore();
  const [showAllUpcomingMobile, setShowAllUpcomingMobile] = useState(false);
  const [selectedCampaign, setSelectedCampaign] =
    useState<DashboardCampaignCard | null>(null);
  const authUser = useAuthStore((state) => state.user);
  const { data: dashboardData } = useInfluencerDashboardQuery();
  const collabRequestsQuery = useCollaborationRequestsQuery();

  const isRTL = i18n.dir() === "rtl";
  const storedUser = getStoredUser();
  const storedProfileName = storedUser?.name || authUser?.name || "";
  const fallbackProfileName = isRTL ? "مؤثر" : "Influencer";

  const emptyDashboardData: InfluencerDashboardResponse = {
    profile: {
      name: storedProfileName || fallbackProfileName,
      avatar: null,
    },
    currentInfo: [],
    upcomingCampaigns: [],
    activities: [],
  };

  const data: InfluencerDashboardResponse = {
    ...emptyDashboardData,
    ...dashboardData,
    profile: {
      ...emptyDashboardData.profile,
      ...dashboardData?.profile,
      name:
        storedProfileName ||
        dashboardData?.profile.name ||
        emptyDashboardData.profile.name,
    },
    currentInfo: dashboardData
      ? dashboardData.currentInfo
      : emptyDashboardData.currentInfo,
    upcomingCampaigns: dashboardData
      ? dashboardData.upcomingCampaigns
      : emptyDashboardData.upcomingCampaigns,
    activities: dashboardData
      ? dashboardData.activities
      : emptyDashboardData.activities,
  };
  const profileInitial =
    data.profile.name.trim().charAt(0).toUpperCase() || "U";
  const avatarColor = getAvatarColor(
    `${storedUser?.id ?? authUser?.id ?? ""}${data.profile.name}`,
  );
  const getMasterDataTranslation = (
    group: string,
    id: number | undefined,
    fallback: string,
  ) =>
    id
      ? t(`masterData.${group}.${id}`, {
          defaultValue: fallback,
        })
      : fallback;
  const recommendedCampaignCards = data.upcomingCampaigns
    .filter((c) => !isClosedCampaignStatus(c.status))
    .map(mapUpcomingCampaignToCard);

  const cooperationRequestCards = (collabRequestsQuery.data?.data ?? [])
    .filter((request) => !isClosedCampaignStatus(request.status))
    .filter(
      (request) =>
        !rejectedCampaignIds.includes(
          String(request.campaign_id ?? request.campaign?.id ?? request.id),
        ),
    )
    .map(mapCollaborationRequestToCard)
    .filter((item): item is DashboardCampaignCard => Boolean(item));
  const handleReject = (
    requestId: number | string,
    campaignId: number | string,
  ) => {
    respondMutation.mutate(
      {
        requestId,
        status: "rejected",
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({
            queryKey: ["campaigns", "collaboration-requests"],
          });
          queryClient.invalidateQueries({
            queryKey: queryKeys.dashboard.influencer(),
          });
        },
      },
    );

    addRejectedCampaignId(campaignId);
  };
  const postsCollage = data.activities
    .filter((item) => Boolean(item.src || item.image))
    .map(mapActivityToCollageItem);

  if (location.pathname !== "/dashboard/influencer") {
    return <Outlet />;
  }

  return (
    <div
      dir={isRTL ? "rtl" : "ltr"}
      className="min-h-screen w-full bg-[#efefef]">
      <section className="relative h-35 w-full overflow-hidden sm:h-40 lg:h-44">
        <img
          src={hero}
          alt="Influencer dashboard hero"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-black/35" />
      </section>

      <main className="relative -mt-4 bg-[rgba(251,251,251,1)] px-0 pb-0 sm:-mt-5 sm:rounded-t-3xl">
        <div className="rounded-t-[12px] bg-[#f7f7f7] px-2.5 pb-16 pt-4 shadow-[0_-1px_0_rgba(0,0,0,0.03)] sm:rounded-t-[16px] sm:px-8 sm:pt-5 lg:px-9">
          {/* Mobile Header Layout */}
          <div
            className={cn(
              "mb-8 flex items-center justify-between sm:hidden",
              isRTL ? "flex-row-reverse" : "flex-row",
            )}>
            <div
              className={cn(
                "flex flex-col gap-1",
                isRTL ? "items-start" : "items-end",
              )}>
              <p className="text-[17px] font-bold text-[#232323]">
                {data.profile.name}
              </p>
              <div className="flex items-center gap-1.5 rounded-full border border-[#ecece7] bg-white px-3 py-1 text-[11px] font-medium shadow-sm">
                <span className="font-bold text-[rgba(111,66,193,1)]">
                  {t("influencerDashboard.verified")}
                </span>
                <div className="flex h-4 w-4 items-center justify-center rounded-full bg-[rgba(111,66,193,1)] text-white">
                  <ShieldCheck className="h-2.5 w-2.5" />
                </div>
              </div>
            </div>

            <Avatar className="h-16 w-16 border-4 border-white shadow-[0_4px_12px_rgba(0,0,0,0.08)]">
              <AvatarImage
                src={data.profile.avatar || undefined}
                alt={data.profile.name}
              />
              <AvatarFallback
                className={cn("text-lg font-semibold text-white", avatarColor)}>
                {profileInitial}
              </AvatarFallback>
            </Avatar>
          </div>

          {/* Desktop Header Layout */}
          <div
            className={cn(
              "mb-8 hidden items-center justify-between sm:mb-12 sm:flex",
              isRTL ? "flex-row" : "flex-row-reverse",
            )}>
            <div className="flex items-center gap-1.5 rounded-md border border-[#ecece7] bg-white px-3 py-1.5 text-[11px] font-medium text-[#232323] shadow-sm sm:px-4 sm:py-2 sm:text-sm">
              <span className="opacity-80">
                {t("influencerDashboard.verified")}
              </span>
              <ShieldCheck className="h-4 w-4 text-[#a37bb0] sm:h-5 sm:w-5" />
            </div>

            <div className="flex items-center gap-3 sm:gap-4">
              <p className="text-sm font-bold text-[#232323] sm:text-lg">
                {data.profile.name}
              </p>
              <Avatar className="h-10 w-10 border border-white shadow-sm sm:h-14 sm:w-14">
                <AvatarImage
                  src={data.profile.avatar || undefined}
                  alt={data.profile.name}
                />
                <AvatarFallback
                  className={cn(
                    "text-sm font-semibold text-white sm:text-lg",
                    avatarColor,
                  )}>
                  {profileInitial}
                </AvatarFallback>
              </Avatar>
            </div>
          </div>

          <section className="mb-10 sm:mb-16">
            <div className="mb-10 text-center">
              <h2 className="relative inline-block pb-3 text-base font-bold text-[#1a1a1a] sm:text-2xl">
                {t("influencerDashboard.currentTasks")}
                <span className="absolute bottom-0 left-1/2 h-0.5 w-full -translate-x-1/2 bg-[#1a1a1a]" />
              </h2>
            </div>

            <div className="sm:mx-auto sm:max-w-212.5">
              {data.currentInfo.length === 0 ? (
                <Card className="flex flex-col items-center justify-center rounded-[20px] border-2 border-dashed border-[#eef1e6] bg-transparent px-6 py-10 text-center">
                  <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-[rgba(111,66,193,0.04)]">
                    <ShieldCheck className="h-6 w-6 text-[rgba(111,66,193,1)]" />
                  </div>
                  <p className="mb-2 text-sm font-bold text-[rgba(111,66,193,0.7)]">
                    {t("influencerDashboard.noActiveTasks")}
                  </p>
                  <p className="max-w-xs text-xs leading-5 text-[#b0b0a0]">
                    {t("influencerDashboard.noActiveTasksSubtitle")}
                  </p>
                </Card>
              ) : (
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-8">
                  {data.currentInfo.map((item) => (
                    <Card
                      key={item.id}
                      className="group relative overflow-hidden rounded-[15px] border-0 bg-[#f4f4f4] shadow-none sm:rounded-[20px]">
                      <div className="bg-[rgba(111,66,193,0.08)] px-4 py-2.5 text-center text-[11px] font-medium text-[rgba(111,66,193,0.7)] sm:px-6 sm:py-3 sm:text-[14px]">
                        {t("influencerDashboard.deadline")} : {item.date}
                      </div>

                      <CardContent
                        className={cn(
                          "px-6 py-6 pb-14 text-[11px] leading-relaxed text-[#232323] sm:px-8 sm:py-8 sm:pb-16 sm:text-[15px]",
                          isRTL ? "text-right" : "text-left",
                        )}>
                        <div className="space-y-2 sm:space-y-3">
                          <p>
                            <span className="font-bold">
                              {t("influencerDashboard.campaignName")} :
                            </span>{" "}
                            {item.title}
                          </p>
                          <p>
                            <span className="font-bold">
                              {t("influencerDashboard.currentTask")} :
                            </span>{" "}
                            {t("influencerDashboard.publishContent")}
                          </p>
                        </div>
                      </CardContent>

                      <div
                        className={cn(
                          "absolute bottom-0 h-11 bg-white px-6 py-2 shadow-[0_-2px_10px_rgba(0,0,0,0.03)] transition-all sm:h-13 sm:px-8 sm:py-3",
                          isRTL
                            ? "left-0 rounded-tr-[20px]"
                            : "right-0 rounded-tl-[20px]",
                        )}>
                        <Link
                          to={`/dashboard/influencer/${item.id}/publish`}
                          className="cursor-pointer text-[11px] font-bold text-[#232323] underline underline-offset-4 decoration-2 hover:text-black sm:text-[15px]">
                          {t("influencerDashboard.publishContent")}
                        </Link>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </section>

          <Dialog
            open={!!selectedCampaign}
            onOpenChange={() => setSelectedCampaign(null)}>
            <DialogContent className="w-[92%] max-w-lg overflow-hidden rounded-[30px] p-0 sm:rounded-[40px] border-0 [&>button]:hidden">
              <DialogHeader className="bg-[rgba(111,66,193,0.04)] px-8 py-6 relative">
                <DialogTitle
                  className={cn(
                    "text-xl font-bold text-[#1a1a1a] sm:text-2xl",
                    isRTL ? "text-right" : "text-left",
                  )}>
                  {t("influencerDashboard.viewDetails")}
                </DialogTitle>
              </DialogHeader>

              <ScrollArea className="max-h-[70vh] p-8">
                {selectedCampaign && (
                  <div
                    className={cn(
                      "space-y-8",
                      isRTL ? "text-right" : "text-left",
                    )}
                    dir={isRTL ? "rtl" : "ltr"}>
                    <div>
                      <h4 className="mb-4 text-lg font-black text-[rgba(111,66,193,1)]">
                        {t("influencerDashboard.campaignName")}
                      </h4>
                      <p className="text-base leading-relaxed text-[#444]">
                        {selectedCampaign.campaignName ||
                          selectedCampaign.brand ||
                          selectedCampaign.companyName}
                      </p>
                    </div>

                    <Separator className="bg-[#eef1e6]" />

                    <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
                      <div>
                        <h4 className="mb-2 text-sm font-bold text-[#888]">
                          {t("influencerDashboard.date")}
                        </h4>
                        <p className="text-base font-medium text-[#1a1a1a]">
                          {selectedCampaign.date}
                        </p>
                      </div>
                      <div>
                        <h4 className="mb-2 text-sm font-bold text-[#888]">
                          {t("influencerDashboard.suggestedBudget")}
                        </h4>
                        <p className="text-base font-medium text-[#1a1a1a]">
                          {selectedCampaign.budget} {isRTL ? "ريال" : "SAR"}
                        </p>
                      </div>
                    </div>

                    <Separator className="bg-[#eef1e6]" />

                    <div>
                      <h4 className="mb-4 text-lg font-black text-[rgba(111,66,193,1)]">
                        {t("influencerDashboard.contentType")}
                      </h4>
                      <p className="text-base leading-relaxed text-[#444]">
                        {selectedCampaign.type}
                      </p>
                    </div>

                    {selectedCampaign.description && (
                      <>
                        <Separator className="bg-[#eef1e6]" />
                        <div>
                          <h4 className="mb-4 text-lg font-black text-[rgba(111,66,193,1)]">
                            {t(
                              "influencerDashboard.campaignDescription",
                              "Campaign Description",
                            )}
                          </h4>
                          <p className="text-base leading-relaxed text-[#444]">
                            {selectedCampaign.description}
                          </p>
                        </div>
                      </>
                    )}
                  </div>
                )}
              </ScrollArea>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 p-8 pt-0">
                <Button
                  asChild
                  className="h-12 min-w-40 rounded-full bg-[linear-gradient(135deg,rgba(111,66,193,1),rgba(201,162,39,1))] font-bold text-white hover:opacity-90">
                  <Link to="/dashboard/influencer/cooperation">
                    {t("nav.cooperation")}
                  </Link>
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => setSelectedCampaign(null)}
                  className="h-12 min-w-32 rounded-full font-bold text-[#888] hover:bg-[#f8f9f4]">
                  {isRTL ? "إغلاق" : "Close"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          <section className="mb-12 sm:mb-20">
            <div className="mb-10 text-center">
              <h2 className="relative inline-block pb-1 text-base font-bold text-[#1a1a1a] sm:text-2xl">
                {t("influencerDashboard.newCooperationRequests")}
                <span className="absolute bottom-0 left-0 h-0.5 w-full bg-[#1a1a1a]" />
              </h2>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:mx-auto sm:max-w-250">
              {cooperationRequestCards.map((item, index) => (
                  <div
                    key={item.id}
                    className={cn(
                      index > 0 && !showAllUpcomingMobile && "hidden sm:block",
                    )}>
                    {/* Mobile Layout */}
                    <div className="mb-8 block sm:hidden">
                      <div className="rounded-[30px] bg-[rgba(111,66,193,0.04)] p-6 text-center">
                        <div className="mb-4 flex items-center justify-center gap-2">
                          <span className="text-xl font-black tracking-tighter text-[#1a1a1a] uppercase">
                            {item.brand}
                          </span>
                          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#1a1a1a] text-white">
                            <span className="text-xs">✦</span>
                          </div>
                        </div>
                        <div className="space-y-2.5 text-[14px] text-[#232323]">
                          <p className="flex items-center justify-center gap-1.5">
                            <span className="font-bold">
                              {t("influencerDashboard.contentType")} :
                            </span>{" "}
                            {getMasterDataTranslation(
                              "campaignTypes",
                              item.typeId,
                              item.type,
                            )}
                          </p>
                          <p className="flex items-center justify-center gap-1.5">
                            <span className="font-bold">
                              {t("influencerDashboard.date")} :
                            </span>{" "}
                            {getMasterDataTranslation(
                              "executionTimes",
                              item.dateId,
                              item.date,
                            )}
                          </p>
                          <p className="flex items-center justify-center gap-1.5">
                            <span className="font-bold">
                              {t("influencerDashboard.suggestedBudget")} :
                            </span>{" "}
                            {getMasterDataTranslation(
                              "budgetRanges",
                              item.budgetId,
                              item.budget,
                            )}{" "}
                            {isRTL ? "ريال" : "SAR"}
                          </p>
                        </div>
                      </div>
                      <div
                        className={cn(
                          "mt-4 flex items-center gap-4",
                          isRTL ? "flex-row" : "flex-row-reverse",
                        )}>
                        <Button
                          onClick={() => setSelectedCampaign(item)}
                          className="h-12 flex-1 rounded-full bg-[linear-gradient(135deg,rgba(111,66,193,1),rgba(201,162,39,1))] text-sm font-bold text-white shadow-none">
                          {t("influencerDashboard.viewDetails")}
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() =>
                            handleReject(item.requestId ?? item.id, item.campaignId)
                          }
                          className="h-12 flex-1 rounded-full border-2 border-dashed border-[#f87171] bg-white text-sm font-bold text-[#f87171] shadow-none">
                          {respondMutation.isPending &&
                          String(respondMutation.variables?.requestId) ===
                            String(item.id)
                            ? t("cooperation.rejecting")
                            : t("influencerDashboard.reject")}
                        </Button>
                      </div>
                    </div>

                    {/* Desktop Layout */}
                    <Card className="group hidden sm:block overflow-hidden rounded-[25px] border-0 bg-[rgba(111,66,193,0.04)] p-0 shadow-none sm:rounded-[30px]">
                      <CardContent
                        className={cn(
                          "flex flex-col items-center justify-between gap-6 p-6 sm:flex-row sm:p-8",
                          isRTL ? "sm:flex-row" : "sm:flex-row-reverse",
                        )}>
                        {/* Brand / Logo Section */}
                        <div
                          className={cn(
                            "flex min-w-30 items-center justify-center sm:justify-end",
                            isRTL ? "sm:order-1" : "sm:order-3",
                          )}>
                          <div className="flex items-center gap-2">
                            <span className="text-xl font-black tracking-tighter text-[#1a1a1a] sm:text-2xl uppercase">
                              {item.brand}
                            </span>
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#1a1a1a] text-white">
                              <span className="text-xs">✦</span>
                            </div>
                          </div>
                        </div>

                        {/* Info Section */}
                        <div
                          className={cn(
                            "flex-1 space-y-2 text-[13px] text-[#232323] sm:space-y-2.5 sm:text-[15px]",
                            isRTL
                              ? "sm:order-2 text-right"
                              : "sm:order-2 text-left",
                          )}>
                          <p>
                            <span className="font-bold">
                              {t("influencerDashboard.contentType")} :
                            </span>{" "}
                            {getMasterDataTranslation(
                              "campaignTypes",
                              item.typeId,
                              item.type,
                            )}
                          </p>
                          <p>
                            <span className="font-bold">
                              {t("influencerDashboard.date")} :
                            </span>{" "}
                            {getMasterDataTranslation(
                              "executionTimes",
                              item.dateId,
                              item.date,
                            )}
                          </p>
                          <p>
                            <span className="font-bold">
                              {t("influencerDashboard.suggestedBudget")} :
                            </span>{" "}
                            {getMasterDataTranslation(
                              "budgetRanges",
                              item.budgetId,
                              item.budget,
                            )}{" "}
                            {isRTL ? "ريال" : "SAR"}
                          </p>
                        </div>

                        {/* Buttons Section */}
                        <div
                          className={cn(
                            "flex items-center gap-3 sm:gap-4",
                            isRTL ? "sm:order-3" : "sm:order-1",
                          )}>
                          <Button
                            onClick={() => setSelectedCampaign(item)}
                            className="h-10 rounded-full bg-[linear-gradient(135deg,rgba(111,66,193,1),rgba(201,162,39,1))] px-6 text-sm font-bold text-white shadow-none hover:opacity-90 sm:h-12 sm:px-8 sm:text-base">
                            {t("influencerDashboard.viewDetails")}
                          </Button>
                          <Button
                            variant="outline"
                            onClick={() =>
                              handleReject(
                                item.requestId ?? item.id,
                                item.campaignId,
                              )
                            }
                            className="h-10 rounded-full border-[#fca5a5] bg-white px-6 text-sm font-bold text-[#f87171] shadow-none hover:bg-[#fff5f5] hover:text-[#ef4444] sm:h-12 sm:px-8 sm:text-base whitespace-nowrap">
                            {respondMutation.isPending &&
                            String(respondMutation.variables?.requestId) ===
                              String(item.id)
                              ? t("cooperation.rejecting")
                              : t("influencerDashboard.reject")}
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                ))}
              {cooperationRequestCards.length > 0 && (
                <Button
                  type="button"
                  onClick={() => setShowAllUpcomingMobile((value) => !value)}
                  className="mx-auto bg-transparent mt-2 block text-[15px] text-[rgba(111,66,193,0.7)] underline underline-offset-4 sm:hidden">
                  {showAllUpcomingMobile
                    ? t("influencerDashboard.showLess", "Show less")
                    : t("influencerDashboard.showAll", "Show all")}
                </Button>
              )}
            </div>
          </section>

          <section className="relative mb-7 overflow-hidden pb-2">
            <div
              className={cn(
                "absolute top-20 h-24 w-24 rounded-full border border-[rgba(111,66,193,0.2)] sm:h-32 sm:w-32",
                isRTL ? "-left-4" : "-right-4",
              )}
              aria-hidden="true"
            />
            <div
              className={cn(
                "absolute top-28 h-14 w-14 rounded-full border border-dotted border-[rgba(111,66,193,0.3)] sm:h-20 sm:w-20",
                isRTL ? "left-2" : "right-2",
              )}
              aria-hidden="true"
            />

            <SectionTitle
              title={t("influencerDashboard.latestActivities")}
              subtitle={t("influencerDashboard.latestActivitiesSubtitle")}
            />

            <div
              className="relative z-10 -mx-3 flex max-w-none items-center justify-center gap-1 overflow-hidden px-0 pb-2 pt-1 sm:mx-auto sm:max-w-2xl sm:items-end sm:gap-0"
              aria-label={t("influencerDashboard.latestActivities")}>
              {postsCollage.map((item) => (
                <div
                  key={item.id}
                  className={cn(
                    "relative shrink-0 overflow-hidden rounded-lg bg-white shadow-[0_8px_22px_rgba(0,0,0,0.08)]",
                    item.className,
                    item.featured
                      ? "z-30 shadow-[0_12px_40px_rgba(0,0,0,0.18)] sm:scale-110"
                      : "z-10 sm:-mx-4",
                  )}>
                  <img
                    src={item.src}
                    alt={item.alt}
                    className={cn(
                      "h-full w-full object-cover",
                      item.featured && "brightness-90",
                    )}
                  />
                </div>
              ))}
              {postsCollage.length === 0 ? (
                <p className="text-center text-xs text-[#8b8b8b]">
                  {t("influencerDashboard.empty")}
                </p>
              ) : null}
            </div>
          </section>

          <section>
            <div className="sm:hidden">
              <SectionTitle
                title={t(
                  "influencerDashboard.recommendedCampaigns",
                  "Campaigns That Match Your Audience",
                )}
              />
            </div>
            <div className="mb-8 hidden text-center sm:block">
              <h2 className="inline-block border-b border-[#1f1f1f] pb-1 text-base font-bold text-[#232323]">
                {t(
                  "influencerDashboard.recommendedCampaigns",
                  "Campaigns That Match Your Audience",
                )}
              </h2>
            </div>

            <div className="-mx-2 flex snap-x gap-3 overflow-x-auto px-2 pb-1 [scrollbar-width:none] sm:mx-auto sm:grid sm:max-w-147.5 sm:grid-cols-2 sm:gap-4 sm:overflow-visible sm:px-0">
              {recommendedCampaignCards.map((campaign) => (
                <Card
                  key={campaign.id}
                  className="w-[88%] shrink-0 snap-center overflow-hidden rounded-sm border border-[#ecece7] bg-white py-0 shadow-sm sm:w-auto sm:rounded-[8px] sm:shadow-[0_4px_12px_rgba(0,0,0,0.03)]">
                  <CardContent
                    className={cn(
                      "grid min-h-0 grid-cols-[1fr_5.5rem] gap-2 p-2 sm:grid-cols-[1fr_6.4rem] sm:gap-3 sm:p-2",
                      !isRTL &&
                        "grid-cols-[5.5rem_1fr] sm:grid-cols-[6.4rem_1fr]",
                    )}>
                    {campaign.image ? (
                      <img
                        src={campaign.image}
                        alt={campaign.campaignName || campaign.type}
                        className={cn(
                          "h-28 w-full rounded-sm object-cover sm:h-40 sm:rounded-md",
                          !isRTL && "order-first",
                        )}
                      />
                    ) : (
                      <div
                        className={cn(
                          "flex h-28 w-full items-center justify-center rounded-sm bg-[rgba(111,66,193,0.08)] text-2xl font-black text-[rgba(111,66,193,0.75)] sm:h-40 sm:rounded-md",
                          !isRTL && "order-first",
                        )}>
                        {(campaign.brand || campaign.campaignName || campaign.type)
                          .trim()
                          .charAt(0)
                          .toUpperCase()}
                      </div>
                    )}

                    <div
                      className={cn(
                        "flex flex-col justify-between gap-3",
                        isRTL ? "text-right" : "text-left",
                      )}>
                      <div>
                        <h3 className="text-[8px] font-bold leading-4 text-[#252525] sm:text-[12px]">
                          {getMasterDataTranslation(
                            "campaignTypes",
                            typeof campaign.typeId === "number"
                              ? campaign.typeId
                              : undefined,
                            campaign.campaignName || campaign.type,
                          )}
                        </h3>
                        <div className="mt-1.5 space-y-0.5 text-[7px] leading-3.5 text-[#7a7a7a] sm:mt-3 sm:space-y-3 sm:text-[11px] sm:leading-5">
                          <p className="sm:text-[#9a9a9a]">
                            {t(
                              "influencerDashboard.targetAudience",
                              "Target audience",
                            )}{" "}
                            :
                          </p>
                          <p className="bg-[#f8f8f5] py-1 text-[#7a7a7a]">
                            {getMasterDataTranslation(
                              "targetAudiences",
                              campaign.targetAudienceId,
                              campaign.audience ?? "",
                            )}
                          </p>
                          {campaign.platform || campaign.platformId ? (
                            <p>
                              {getMasterDataTranslation(
                                "platforms",
                                campaign.platformId,
                                campaign.platform ?? "",
                              ).toUpperCase()}
                            </p>
                          ) : null}
                          <p>
                            {t("influencerDashboard.budget")} :{" "}
                            <span className="font-bold text-[#1d1d1d]">
                              {campaign.budget}
                            </span>
                          </p>
                        </div>
                      </div>

                      <Button
                        asChild
                        variant="outline"
                        className="h-6 rounded-none border-[#d9d9d9] bg-white px-2 text-[8px] font-semibold text-[#454545] shadow-none hover:bg-[#f8f8f5] sm:h-9 sm:text-[12px]">
                        <Link
                          to={`/dashboard/influencer/${campaign.campaignId}/offers`}
                          onClick={() => {
                            sessionStorage.setItem(
                              "selectedCampaignId",
                              String(campaign.campaignId),
                            );
                          }}>
                          {t(
                            "influencerDashboard.applyToCampaign",
                            "Apply to campaign",
                          )}
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}

export default InfluencerDashboard;
