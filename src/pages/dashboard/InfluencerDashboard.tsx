import { useMemo, useState } from "react";
import { ShieldCheck } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Link, Outlet, useLocation } from "react-router-dom";

import hero from "/assets/Hero.png";

import { Button } from "@/components/ui/Button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useCollaborationRequestsQuery } from "@/queries/campaigns/useCollaborationRequestsQuery";
import { useInfluencerDashboardQuery } from "@/queries/dashboard/useInfluencerDashboardQuery";
import { useInfluencerPostsQuery } from "@/queries/dashboard/useInfluencerPostsQuery";
import { useAuthStore } from "@/store/auth.store";
import type { AuthUser } from "@/types/auth.types";
import type { InfluencerDashboardResponse } from "@/types/dashboard.types";

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

      const candidate = user as { id?: unknown; name?: unknown; type?: unknown };
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
    parseUser(localStorage.getItem("user")) ||
    parseUser(localStorage.getItem("auth-storage"))
  );
};

const getRequestCompanyName = (request: {
  company?: { company_name?: string; name?: string } | null;
  campaign?: {
    company_name?: string;
    user?: { company_name?: string; name?: string } | null;
  };
  user?: { name?: string } | null;
}) =>
  request.company?.company_name ??
  request.company?.name ??
  request.campaign?.user?.company_name ??
  request.campaign?.company_name ??
  request.campaign?.user?.name ??
  request.user?.name ??
  "-";

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
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const [showAllUpcomingMobile, setShowAllUpcomingMobile] = useState(false);
  const authUser = useAuthStore((state) => state.user);
  const {
    data: dashboardData,
    isLoading,
    isError,
  } = useInfluencerDashboardQuery();
  const { data: postsData } = useInfluencerPostsQuery();
  const collaborationRequestsQuery = useCollaborationRequestsQuery();

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

  const activityFallbackImages = [
    "/assets/platImg1.png",
    "/assets/platImg.png",
    "/assets/iphone2.png",
    "/assets/user1.png",
    "/assets/infImg3.png",
  ];

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
  const profileInitial = data.profile.name.trim().charAt(0).toUpperCase() || "U";
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
  const recommendedCampaignCards = data.upcomingCampaigns.map((campaign, index) => ({
        id: campaign.id,
        image: index % 2 === 0 ? "/assets/choImg3.png" : "/assets/choImg4.png",
        title: campaign.type,
        platform: getMasterDataTranslation(
          "platforms",
          campaign.platformId,
          "Instagram",
        ).toUpperCase(),
        followers: getMasterDataTranslation(
          "targetAudiences",
          campaign.targetAudienceId,
          isRTL ? "نساء 18 - 30 سنة" : "Women 18 - 30",
        ),
        budget: getMasterDataTranslation(
          "budgetRanges",
          campaign.budgetId,
          campaign.budget,
        ),
        typeId: campaign.typeId,
      }));
  const cooperationRequests = useMemo(
    () =>
      (collaborationRequestsQuery.data?.data ?? [])
        .filter((request) => request.campaign)
        .map((request) => {
          const campaign = request.campaign!;
          return {
            id: request.id,
            companyName: getRequestCompanyName(request),
            contentType:
              campaign.campaign_type?.name ??
              campaign.campaignType?.name ??
              campaign.campaign_type_name ??
              campaign.idea ??
              "-",
            date:
              campaign.execution_time?.name ??
              campaign.executionTime?.name ??
              campaign.created_at ??
              "-",
            budget:
              request.price !== undefined && request.price !== null
                ? String(request.price)
                : (campaign.budget_range?.name ??
                  campaign.budgetRange?.name ??
                  campaign.budget_range_name ??
                  "-"),
            status: request.status,
          };
        }),
    [collaborationRequestsQuery.data?.data],
  );
  const postsCollage = (postsData?.data ?? data.activities)
    .slice(0, 5)
    .map((item, index) => ({
      id: item.id,
      src: item.image || activityFallbackImages[index % activityFallbackImages.length],
      alt: item.title || (isRTL ? "نشاط حديث" : "Recent activity"),
      className:
        index === 0 || index === 4
          ? "h-9 w-12 sm:h-14 sm:w-20"
          : index === 2
            ? "h-20 w-16 sm:h-[7.5rem] sm:w-[6.5rem]"
            : "h-14 w-14 sm:h-[5.5rem] sm:w-[5.5rem]",
      featured: index === 2,
    }));

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
          <div
            className={cn(
              "mb-5 flex items-start justify-end gap-4 sm:mb-8 sm:justify-between",
              isRTL ? "flex-row" : "flex-row",
            )}>
            <Button
              variant="outline"
              className="hidden h-6 rounded-sm border-[#d9d9d9] bg-white px-3 text-[9px] text-[#666666] shadow-none hover:bg-[#fafafa] sm:inline-flex">
              {t("influencerDashboard.verify")}
              <ShieldCheck className="h-3.5 w-3.5" />
            </Button>

            <div className="flex items-center gap-2 sm:gap-3">
              <div className={isRTL ? "text-right" : "text-left"}>
                <p className="text-[10px] font-medium text-[#2f2f2f] sm:text-sm">
                  {data.profile.name}
                </p>
                <p className="mt-0.5 text-[8px] font-medium text-[#8a9f68] sm:hidden">
                  {isLoading
                    ? t("influencerDashboard.loading")
                    : isError
                      ? t("influencerDashboard.error")
                      : t("influencerDashboard.verify")}
                </p>
              </div>

              <Avatar className="h-7 w-7 sm:h-9 sm:w-9">
                <AvatarImage
                  src={data.profile.avatar || undefined}
                  alt={data.profile.name}
                />
                <AvatarFallback
                  className={cn("text-xs font-semibold text-white", avatarColor)}>
                  {profileInitial}
                </AvatarFallback>
              </Avatar>
            </div>
          </div>

          <section className="mb-6 sm:mb-10">
            <div className="sm:hidden">
              <SectionTitle title={t("influencerDashboard.currentInfo")} />
            </div>
            <div className={cn("mb-6 hidden sm:block text-center")}>
              <h2 className="inline-block  border-b border-[#1f1f1f] pb-1 text-base font-bold text-[#232323]">
                {t("influencerDashboard.currentInfo")}
              </h2>
            </div>

            <div className="grid grid-cols-1 gap-2.5 sm:mx-auto sm:max-w-147.5 sm:grid-cols-2 sm:gap-4">
              {data.currentInfo.map((item) => (
                <div key={item.id} className="relative pb-5 sm:pb-7">
                  <Card className="rounded-sm border-0 bg-[#ededed] py-0 shadow-none sm:overflow-hidden sm:rounded-[8px]">
                    <CardContent className="px-2 py-1.5 sm:px-0 sm:py-0">
                      <div className="mb-1.5 bg-[#e2e4dd] py-1 text-center text-[8px] text-[#8c8c8c] sm:mb-0 sm:bg-[#dedede] sm:px-5 sm:py-2 sm:text-[12px]">
                        <span className="hidden text-[#879b6d] sm:inline">
                          {t("influencerDashboard.deadline", "Deadline")} :
                        </span>{" "}
                        {item.date}
                      </div>

                      <div
                        className={cn(
                          "space-y-0.5 text-[8px] leading-4 text-[#555] sm:space-y-2 sm:px-5 sm:py-3 sm:text-[12px] sm:leading-5",
                          isRTL ? "text-right" : "text-left",
                        )}>
                        <p>
                          <span className="hidden font-bold text-[#282828] sm:inline">
                            {t("influencerDashboard.campaignName", "Campaign name")} :
                          </span>{" "}
                          {item.title}
                        </p>
                        <p>
                          <span className="hidden font-bold text-[#282828] sm:inline">
                            {t("influencerDashboard.currentTask", "Current task")} :
                          </span>{" "}
                          {item.company}
                        </p>
                      </div>
                    </CardContent>
                  </Card>

                  <Button
                    type="button"
                    className={cn(
                      "mt-1.5 bg-transparent text-[8px] font-medium text-[#4a4a4a] underline underline-offset-2 sm:absolute sm:bottom-0 sm:h-8 sm:min-w-22 sm:rounded-t-none sm:rounded-b-[8px] sm:bg-white sm:px-5 sm:text-[12px] sm:shadow-none hover:bg-white",
                      isRTL ? "text-right sm:right-0" : "text-left sm:left-0",
                    )}>
                    {t("influencerDashboard.editProfile")}
                  </Button>
                </div>
              ))}
            </div>
          </section>

          {(collaborationRequestsQuery.isLoading || cooperationRequests.length > 0) ? (
            <section className="mb-7 sm:mb-10">
              <SectionTitle title={t("cooperation.title")} />

              {collaborationRequestsQuery.isLoading ? (
                <div className="flex justify-center py-6">
                  <div className="h-7 w-7 animate-spin rounded-full border-2 border-[#94a67d] border-t-transparent" />
                </div>
              ) : (
                <div className="space-y-3 sm:mx-auto sm:max-w-147.5">
                  {cooperationRequests.map((item) => (
                    <Card
                      key={`cooperation-${item.id}`}
                      className="rounded-[10px] border border-[#eceee9] bg-white py-0 shadow-[0_6px_18px_rgba(0,0,0,0.05)] sm:rounded-[8px]">
                      <CardContent className="px-4 py-4 text-center sm:grid sm:min-h-24 sm:grid-cols-[15rem_1fr] sm:items-center sm:gap-8 sm:px-4 sm:py-3 sm:text-right">
                        <div className="text-[15px] font-bold tracking-tight text-[#161616] sm:hidden">
                          {item.companyName}
                        </div>

                        <div
                          className={cn(
                            "mt-4 space-y-3 text-[13px] leading-5 text-[#303030] sm:mt-0 sm:flex sm:items-center sm:justify-end sm:gap-8 sm:space-y-0 sm:text-[12px] sm:leading-5",
                            isRTL ? "sm:text-right" : "sm:text-left",
                          )}>
                          <strong className="hidden shrink-0 text-lg font-black text-[#090909] sm:block">
                            {item.companyName}
                          </strong>

                          <div className="space-y-3 sm:space-y-2">
                            <p>
                              <span className="font-bold text-[#242424]">
                                {t("cooperation.contentType")} :
                              </span>{" "}
                              {item.contentType}
                            </p>
                            <p>
                              <span className="font-bold text-[#242424]">
                                {t("cooperation.date")} :
                              </span>{" "}
                              {item.date}
                            </p>
                            <p>
                              <span className="font-bold text-[#242424]">
                                {t("cooperation.budget")} :
                              </span>{" "}
                              {item.budget}
                            </p>
                          </div>
                        </div>

                        <div className="hidden items-center justify-start gap-3 sm:flex">
                          <Badge className="flex h-9 w-28 items-center justify-center rounded-full bg-[#94a67d] px-5 text-sm font-medium text-white hover:bg-[#94a67d]">
                            {t(`influencerDashboard.status.${item.status}`, {
                              defaultValue: item.status,
                            })}
                          </Badge>

                          <Button
                            asChild
                            type="button"
                            variant="outline"
                            className="h-9 w-28 rounded-full border border-[#94a67d] bg-white px-6 text-sm font-medium text-[#555] shadow-none hover:bg-white">
                            <Link to="/dashboard/influencer/cooperation">
                              {t("cooperation.title")}
                            </Link>
                          </Button>
                        </div>

                        <div className="mt-4 grid grid-cols-2 gap-3 sm:hidden">
                          <Badge className="flex h-8 items-center justify-center rounded-full bg-[#94a67d] px-5 text-xs font-medium text-white hover:bg-[#94a67d]">
                            {t(`influencerDashboard.status.${item.status}`, {
                              defaultValue: item.status,
                            })}
                          </Badge>

                          <Button
                            asChild
                            type="button"
                            variant="outline"
                            className="h-8 rounded-full border border-[#94a67d] bg-white px-5 text-xs font-medium text-[#555] shadow-none hover:bg-white">
                            <Link to="/dashboard/influencer/cooperation">
                              {t("cooperation.title")}
                            </Link>
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </section>
          ) : null}

          <section className="mb-7 sm:mb-10">
            <SectionTitle title={t("influencerDashboard.upcomingCampaigns")} />

            <div className="space-y-3 sm:mx-auto sm:max-w-147.5">
              {data.upcomingCampaigns.map((item, index) => (
                <div
                  key={item.id}
                  className={cn(
                    index > 0 && !showAllUpcomingMobile && "hidden sm:block",
                  )}>
                  <Card className="rounded-[10px] border border-[#eceee9] bg-linear-to-b from-white to-[#eef2e8] py-0 shadow-[0_6px_18px_rgba(0,0,0,0.06)] sm:rounded-[8px] sm:border-0 sm:bg-linear-to-b sm:from-white sm:to-[#eef2e8] sm:shadow-[0_4px_16px_rgba(0,0,0,0.04)]">
                    <CardContent className="px-4 py-4 text-center sm:grid sm:min-h-25 sm:grid-cols-[15rem_1fr] sm:items-center sm:gap-8 sm:px-4 sm:py-3 sm:text-right">
                      <div className="text-[15px] font-bold tracking-tight text-[#161616] sm:hidden">
                        {item.brand}
                      </div>

                      <div
                        className={cn(
                          "mt-4 space-y-3 text-[13px] leading-5 text-[#303030] sm:mt-0 sm:flex sm:items-center sm:justify-end sm:gap-8 sm:space-y-0 sm:text-[12px] sm:leading-5 sm:text-[#303030]",
                          isRTL ? "sm:text-right" : "sm:text-left",
                        )}>
                        <strong className="hidden shrink-0 text-lg font-black tracking-[-0.04em] text-[#090909] sm:block">
                          {item.brand}
                        </strong>

                        <div className="space-y-3 sm:space-y-2">
                          <p>
                            <span className="font-bold text-[#242424]">
                              {t("influencerDashboard.contentType", "Content type")} :
                            </span>{" "}
                            {getMasterDataTranslation(
                              "campaignTypes",
                              item.typeId,
                              item.type,
                            )}
                          </p>
                          <p>
                            <span className="font-bold text-[#242424]">
                              {t("influencerDashboard.date", "Date")} :
                            </span>{" "}
                            {getMasterDataTranslation(
                              "executionTimes",
                              item.dateId,
                              item.date,
                            )}
                          </p>
                          <p>
                            <span className="font-bold text-[#242424]">
                              {t("influencerDashboard.suggestedBudget", "Suggested budget")} :
                            </span>{" "}
                            {getMasterDataTranslation(
                              "budgetRanges",
                              item.budgetId,
                              item.budget,
                            )}
                          </p>
                        </div>
                      </div>
                      <div className="hidden items-center justify-start gap-3 sm:flex">
                        <Badge className="flex h-9 w-28 items-center justify-center rounded-full bg-[#94a67d] px-5 text-sm font-medium text-white hover:bg-[#94a67d]">
                          {t(`influencerDashboard.status.${item.status}`)}
                        </Badge>

                        <Button
                          type="button"
                          variant="outline"
                          className="h-9 w-28 rounded-full border border-[#f06f67] bg-white px-6 text-sm font-medium text-[#555] shadow-none hover:bg-white">
                          {t("influencerDashboard.reject")}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>

                  <div className="mt-2 grid grid-cols-2 gap-3 sm:hidden">
                    <Button
                      type="button"
                      variant="outline"
                      className="h-8 rounded-full border border-dashed border-[#db8d88] bg-white px-5 text-xs font-medium text-[#b65a55] shadow-none hover:bg-white">
                      {t("influencerDashboard.reject")}
                    </Button>

                    <Badge className="flex h-8 items-center justify-center rounded-full bg-[#94a67d] px-5 text-xs font-medium text-white hover:bg-[#94a67d]">
                      {t(`influencerDashboard.status.${item.status}`)}
                    </Badge>
                  </div>

                  <Button
                    type="button"
                    onClick={() => setShowAllUpcomingMobile((value) => !value)}
                    className="mx-auto bg-transparent mt-4 block text-xs text-[#8b9870] underline underline-offset-2 sm:hidden">
                    {showAllUpcomingMobile
                      ? t("influencerDashboard.showLess", "Show less")
                      : t("influencerDashboard.showAll", "Show all")}
                  </Button>
                </div>
              ))}
            </div>
          </section>

          <section className="relative mb-7 overflow-hidden pb-2">
            <div
              className={cn(
                "absolute top-20 h-24 w-24 rounded-full border border-[#e1d39a]/45 sm:h-32 sm:w-32",
                isRTL ? "-left-4" : "-right-4",
              )}
              aria-hidden="true"
            />
            <div
              className={cn(
                "absolute top-28 h-14 w-14 rounded-full border border-dotted border-[#d8c57f] sm:h-20 sm:w-20",
                isRTL ? "left-2" : "right-2",
              )}
              aria-hidden="true"
            />

            <SectionTitle
              title={t("influencerDashboard.latestActivities")}
              subtitle={t("influencerDashboard.latestActivitiesSubtitle")}
            />

            <div
              className="relative z-10 -mx-3 flex max-w-none items-end justify-center gap-1 overflow-hidden px-0 pb-2 pt-1 sm:mx-auto sm:max-w-108 sm:px-1 sm:gap-2"
              aria-label={t("influencerDashboard.latestActivities")}>
              {postsCollage.map((item, index) => (
                <div
                  key={item.id}
                  className={cn(
                    "relative shrink-0 overflow-hidden rounded-lg bg-white shadow-[0_8px_22px_rgba(0,0,0,0.08)]",
                    item.className,
                    index === 1 && "-me-1 sm:-me-3",
                    index === 3 && "-ms-1 sm:-ms-3",
                    item.featured &&
                      "z-20 shadow-[0_12px_30px_rgba(0,0,0,0.18)]",
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
                title={
                  t(
                    "influencerDashboard.recommendedCampaigns",
                    "Campaigns That Match Your Audience",
                  )
                }
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
                    <img
                      src={campaign.image}
                      alt={campaign.title}
                      className={cn(
                        "h-28 w-full rounded-sm object-cover sm:h-40 sm:rounded-md",
                        !isRTL && "order-first",
                      )}
                    />

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
                            campaign.title,
                          )}
                        </h3>
                        <div className="mt-1.5 space-y-0.5 text-[7px] leading-3.5 text-[#7a7a7a] sm:mt-3 sm:space-y-3 sm:text-[11px] sm:leading-5">
                          <p className="sm:text-[#9a9a9a]">
                            {t("influencerDashboard.targetAudience", "Target audience")} :
                          </p>
                          <p className="bg-[#f8f8f5] py-1 text-[#7a7a7a]">
                            {campaign.followers}
                          </p>
                          <p>{campaign.platform}</p>
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
                          to="/dashboard/influencer/offers"
                          onClick={() => {
                            sessionStorage.setItem(
                              "selectedCampaignId",
                              String(campaign.id),
                            );
                          }}>
                          {t("influencerDashboard.applyToCampaign", "Apply to campaign")}
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
