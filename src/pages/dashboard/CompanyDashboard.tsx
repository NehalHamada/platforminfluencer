import {
  BadgeCheck,
  Bookmark,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Star,
} from "lucide-react";
import { FaInstagram, FaTiktok } from "react-icons/fa";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Outlet, useLocation, useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useInfluencerDiscoveryQuery } from "@/queries/dashboard/useInfluencerDiscoveryQuery";
import type { InfluencerDiscoveryItem } from "@/types/dashboard.types";
import { getInfluencerReviewSummary } from "@/utils/influencerReviews";

import hero from "/assets/Hero.png";
import latestCampaign1 from "/assets/res1.jpg";
import latestCampaign2 from "/assets/res3.jpg";
import latestCampaign3 from "/assets/res2.jpg";
import latestCampaign4 from "/assets/tImg1.png";
import latestCampaign5 from "/assets/tImg2.png";
import matchingPhotoPrimary from "/assets/tImg1.png";
import matchingPhotoSecondary from "/assets/res1.jpg";

type DashboardInfluencer = {
  id: number;
  name: string;
  image: string | null;
  category: string | null;
  followers: string | number | null;
  engagement: string | number | null;
  rating?: number | null;
  reviewsCount?: number | null;
};

const staticLatestCampaignPosts = [
  { id: 1, image: latestCampaign1 },
  { id: 2, image: latestCampaign2 },
  { id: 3, image: latestCampaign3 },
  { id: 4, image: latestCampaign4 },
  { id: 5, image: latestCampaign5 },
];

function PlatformIcons() {
  return (
    <div className="flex items-center gap-1.5">
      <span className="flex h-3.5 w-3.5 items-center justify-center rounded-[3px] bg-[linear-gradient(135deg,#833ab4,#fd1d1d,#fcb045)] text-white">
        <FaInstagram className="text-[9px]" aria-hidden="true" />
      </span>
      <span className="flex h-3.5 w-3.5 items-center justify-center rounded-[3px] bg-black text-white">
        <FaTiktok className="text-[8px]" aria-hidden="true" />
      </span>
    </div>
  );
}

function SuggestedInfluencerCard({
  item,
  isRTL,
  className,
}: {
  item: DashboardInfluencer;
  isRTL: boolean;
  className?: string;
}) {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const handleFollowClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigate("/dashboard/company/contact");
  };
  const reviewSummary = getInfluencerReviewSummary({
    influencerId: item.id,
    influencerName: item.name,
  });
  const rating = reviewSummary?.average ?? item.rating ?? null;
  const reviewsCount = reviewSummary?.count ?? item.reviewsCount ?? null;

  return (
    <Card
      className={cn(
        "h-full overflow-hidden rounded-[12px] border border-[#ecebe6] bg-white py-0 shadow-[0_4px_12px_rgba(28,28,22,0.04)]",
        className,
      )}>
      <div className="px-2.5 pt-2.5">
        <img
          src={item.image ?? ""}
          alt={item.name}
          className="h-56 w-full rounded-[9px] object-cover object-center sm:h-44 lg:h-33"
        />
      </div>

      <CardContent className="flex flex-1 flex-col px-2.5 pb-2.5 pt-2">
        <div className="flex items-center justify-between gap-2">
          <PlatformIcons />
          <h3 className="truncate text-[10px] font-medium text-[#111111]">
            {item.name}
          </h3>
        </div>

        <div className="mt-3 grid grid-cols-2 text-[#161616]">
          <div className="space-y-0.5 text-right">
            <p className="text-[11px] font-medium leading-none">
              {item.followers != null ? String(item.followers) : "—"}
            </p>
            <p className="text-[10px] text-[#4f4f4b]">
              {t("companyDashboard.followers")}
            </p>
          </div>
          <div className="space-y-0.5 border-s border-[#eeeef0] text-right">
            <p className="text-[11px] font-medium leading-none">
              {item.engagement != null ? String(item.engagement) : "—"}
            </p>
            <p className="text-[10px] text-[#4f4f4b]">
              {t("companyDashboard.engagementRate")}
            </p>
          </div>
        </div>

        <div className="mt-3 flex items-center justify-center gap-1 text-[11px] text-[#62625d]">
          <span>{item.category ?? ""}</span>
          <BadgeCheck className="h-3 w-3 fill-[#a7b78e] text-white" />
        </div>

        {rating ? (
          <div className="mt-2 flex items-center justify-center gap-1 text-[10px] font-medium text-[#7b806f]">
            <Star className="h-3.5 w-3.5 fill-[#f5c988] text-[#f5c988]" />
            <span>{rating.toFixed(1)}</span>
            {reviewsCount ? (
              <span className="text-[#9a9a91]">
                ({reviewsCount} {isRTL ? "تقييم" : "reviews"})
              </span>
            ) : null}
          </div>
        ) : null}

        <div
          className={cn(
            "mt-auto flex items-center gap-2 pt-5",
            isRTL && "flex-row",
          )}>
          <Button
            type="button"
            variant="outline"
            size="icon-xs"
            aria-label={t("companyDashboard.saveInfluencer")}
            className="h-6.5 w-6.5 rounded-[6px] border-[#d9d98f] bg-white text-[#8f9d75] hover:bg-[#fbfbf3]">
            <Bookmark className="h-3.5 w-3.5" />
          </Button>

          <Button
            type="button"
            variant="outline"
            className="h-6.5 flex-1 gap-1 rounded-[6px] border-0 bg-[#eef1e9] px-2 text-[10px] font-normal text-[#7f8c67] hover:bg-[#e7ecdf]"
            onClick={handleFollowClick}>
            {t("companyDashboard.sendMessage")}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function BrowseAllInfluencersCard({
  suggested,
  isRTL,
}: {
  suggested: DashboardInfluencer[];
  isRTL: boolean;
}) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const goToExplore = () => navigate("/dashboard/company/explore");

  return (
    <Card
      role="button"
      tabIndex={0}
      onClick={goToExplore}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          goToExplore();
        }
      }}
      className="relative min-h-full cursor-pointer overflow-hidden rounded-[12px] border-0 bg-[#fbf8ee] py-0 shadow-none">
      <CardContent className="relative flex h-full min-h-71 flex-col items-center justify-center px-5 py-8 text-center">
        <div className="absolute left-7 top-31 h-12 w-12 rotate-45 rounded-lg bg-[#bfceb0]" />
        <div className="absolute left-10 top-43 h-6 w-6 rotate-45 rounded-[3px] bg-[#bfceb0]" />

        <Button
          type="button"
          size="icon-sm"
          aria-label={t("companyDashboard.browseAll")}
          onClick={(event) => {
            event.stopPropagation();
            goToExplore();
          }}
          className="mb-7 h-6 w-6 rounded-full bg-[#fde58f] text-[#9aa172] hover:bg-[#f9dc78]">
          {isRTL ? (
            <ChevronLeft className="h-3.5 w-3.5" />
          ) : (
            <ChevronRight className="h-3.5 w-3.5" />
          )}
        </Button>

        <p className="text-[13px] font-medium text-[#1d1d19]">
          {t("companyDashboard.browseAll")}
        </p>
        <p className="mt-2 text-[13px] text-[#a7b78e]">
          {t("companyDashboard.browseAllCount")}
        </p>

        <div className="absolute bottom-9 right-8 h-15 w-15 overflow-hidden rounded-full border-4 border-[#fbf8ee]">
          <img
            src={suggested[0]?.image ?? ""}
            alt=""
            className="h-full w-full object-cover"
          />
        </div>
        <div className="absolute bottom-8 right-21 h-7 w-7 overflow-hidden rounded-full border-3 border-[#fbf8ee]">
          <img
            src={suggested[1]?.image ?? ""}
            alt=""
            className="h-full w-full object-cover"
          />
        </div>
        <div className="absolute bottom-5 right-15 h-9 w-9 overflow-hidden rounded-full border-3 border-[#fbf8ee]">
          <img
            src={suggested[2]?.image ?? ""}
            alt=""
            className="h-full w-full object-cover"
          />
        </div>
      </CardContent>
    </Card>
  );
}

function CompanyDashboard() {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.dir() === "rtl";
  const location = useLocation();
  const [featuredIndex, setFeaturedIndex] = useState(0);
  const navigate = useNavigate();
  const discoveryParams = useMemo(() => ({}), []);

  const { data: discoveryData } = useInfluencerDiscoveryQuery(discoveryParams);
  const latestCampaignPosts = staticLatestCampaignPosts;
  const dashboardInfluencers = useMemo<DashboardInfluencer[]>(
    () =>
      (discoveryData?.data ?? []).slice(0, 3).map(
        (item: InfluencerDiscoveryItem): DashboardInfluencer => ({
          id: item.id,
          name: item.name,
          image: item.image,
          category: item.category,
          followers: item.followers || null,
          engagement: item.engagement || null,
          rating: item.rating ?? null,
          reviewsCount: item.reviewsCount ?? null,
        }),
      ),
    [discoveryData?.data],
  );

  if (location.pathname !== "/dashboard/company") {
    return <Outlet />;
  }

  const activeFeaturedIndex =
    dashboardInfluencers.length === 0
      ? 0
      : Math.min(featuredIndex, dashboardInfluencers.length - 1);
  const activeFeatured = dashboardInfluencers[activeFeaturedIndex];
  const goFeaturedPrev = () => {
    setFeaturedIndex((prev) => {
      const total = dashboardInfluencers.length;
      if (total === 0) return 0;
      const safePrev = Math.min(prev, total - 1);
      return safePrev <= 0 ? total - 1 : safePrev - 1;
    });
  };
  const goFeaturedNext = () => {
    setFeaturedIndex((prev) => {
      const total = dashboardInfluencers.length;
      if (total === 0) return 0;
      return (Math.min(prev, total - 1) + 1) % total;
    });
  };

  const monitorItems = [
    {
      id: "1",
      title: t("companyDashboard.monitor.1.title"),
      desc: t("companyDashboard.monitor.1.desc"),
    },
    {
      id: "2",
      title: t("companyDashboard.monitor.2.title"),
      desc: t("companyDashboard.monitor.2.desc"),
    },
    {
      id: "3",
      title: t("companyDashboard.monitor.3.title"),
      desc: t("companyDashboard.monitor.3.desc"),
    },
  ];

  const whyItems = [
    { id: "1", text: t("companyDashboard.why.1") },
    { id: "2", text: t("companyDashboard.why.2") },
    { id: "3", text: t("companyDashboard.why.3") },
  ];

  return (
    <div dir={isRTL ? "rtl" : "ltr"} className="min-h-screen  text-[#1f1f1f]">
      <section className="relative h-32 overflow-hidden sm:h-52 lg:h-64">
        <img
          src={hero}
          alt="Company dashboard hero"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-black/65" />
      </section>

      <main className="relative -mt-5 rounded-t-[26px] bg-[#F9F9F9] px-3 pb-8 pt-4 sm:-mt-8 sm:rounded-t-[34px] sm:px-4 sm:pb-10 sm:pt-6 lg:rounded-t-[42px] lg:px-8 lg:pt-8">
        <div className="mx-auto max-w-7xl space-y-4 sm:space-y-6 lg:space-y-8">
          {dashboardInfluencers.length > 0 && (
            <section
              className="pt-1 sm:pt-2"
              style={{ fontFamily: "'IBM Plex Sans Arabic', sans-serif" }}>
              <header className="mx-auto max-w-2xl text-center">
                <h2
                  className="text-[19px] font-bold leading-tight text-[#232320] sm:text-3xl"
                  style={{ fontFamily: "'Lemonada', cursive" }}>
                  {t("companyDashboard.suggestedTitle")}
                </h2>
                <p className="mt-4 text-[11px] leading-5 text-[#565650] sm:text-sm">
                  {t("companyDashboard.suggestedSubtitle")}
                </p>
              </header>

              <div className="mt-6 grid grid-cols-1 items-stretch gap-4 sm:mt-10 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                <div className="sm:hidden">
                  {activeFeatured && (
                    <SuggestedInfluencerCard
                      item={activeFeatured}
                      isRTL={isRTL}
                    />
                  )}
                </div>
                {dashboardInfluencers[0] && (
                  <SuggestedInfluencerCard
                    item={dashboardInfluencers[0]}
                    isRTL={isRTL}
                    className="hidden sm:flex"
                  />
                )}
                {dashboardInfluencers[1] && (
                  <SuggestedInfluencerCard
                    item={dashboardInfluencers[1]}
                    isRTL={isRTL}
                    className="hidden sm:flex"
                  />
                )}
                <div className="hidden lg:flex lg:flex-col">
                  <BrowseAllInfluencersCard
                    suggested={dashboardInfluencers}
                    isRTL={isRTL}
                  />
                </div>
                {dashboardInfluencers[2] && (
                  <SuggestedInfluencerCard
                    item={dashboardInfluencers[2]}
                    isRTL={isRTL}
                    className="hidden md:flex"
                  />
                )}
              </div>

              <div
                className={cn(
                  "mt-5 flex items-center justify-center gap-5 sm:hidden",
                  isRTL && "flex-row-reverse",
                )}>
                <Button
                  type="button"
                  size="icon-xs"
                  variant="outline"
                  onClick={isRTL ? goFeaturedNext : goFeaturedPrev}
                  aria-label={t("companyDashboard.prev")}
                  className="h-4 w-4 rounded-full border-[#9baa81] bg-transparent p-0 text-[#83936c] hover:bg-white">
                  {isRTL ? (
                    <ChevronRight className="h-2.5 w-2.5" />
                  ) : (
                    <ChevronLeft className="h-2.5 w-2.5" />
                  )}
                </Button>

                <div className="flex items-center gap-1.5">
                  {dashboardInfluencers.map((_, index) => (
                    <Button
                      key={index}
                      type="button"
                      onClick={() => setFeaturedIndex(index)}
                      aria-label={`${t("companyDashboard.showInfluencer")} ${index + 1}`}
                      aria-pressed={activeFeaturedIndex === index}
                      className={cn(
                        "h-1.5 rounded-full transition-all",
                        activeFeaturedIndex === index
                          ? "w-9 bg-[#d8ddca]"
                          : "w-1.5 bg-[#d8ddca]",
                      )}
                    />
                  ))}
                </div>

                <Button
                  type="button"
                  size="icon-xs"
                  variant="outline"
                  onClick={isRTL ? goFeaturedPrev : goFeaturedNext}
                  aria-label={t("companyDashboard.next")}
                  className="h-4 w-4 rounded-full border-[#9baa81] bg-transparent p-0 text-[#83936c] hover:bg-white">
                  {isRTL ? (
                    <ChevronLeft className="h-2.5 w-2.5" />
                  ) : (
                    <ChevronRight className="h-2.5 w-2.5" />
                  )}
                </Button>
              </div>
            </section>
          )}

          {latestCampaignPosts.length > 0 && (
            <section>
              <Card className="overflow-hidden rounded-[24px] border-0 bg-white py-0 shadow-[0_12px_26px_rgba(26,26,20,0.06)] sm:rounded-[30px]">
                <CardContent className="relative px-3 py-5 sm:px-6 sm:py-8 lg:px-8 lg:py-10">
                  <div
                    aria-hidden="true"
                    className="absolute -inset-e-10 -top-6 hidden h-32 w-32 rounded-full border-18 border-[#ecebe6] opacity-80 lg:block"
                  />
                  <div className="md:hidden">
                    <div className="text-center">
                      <h3 className="text-[2rem] font-bold leading-tight text-[#20201d] underline underline-offset-4">
                        {t("companyDashboard.latestCampaignsTitle")}
                      </h3>
                    </div>

                    <div className="relative mx-auto mt-8 h-72 w-full max-w-84">
                      <div className="absolute left-7 top-[4.9rem] z-10 h-36 w-[4.6rem] overflow-hidden rounded-[1.6rem] border-[3.5px] border-[#1f1f1c] bg-white shadow-md">
                        <img
                          src={latestCampaignPosts[4]?.image ?? ""}
                          alt={t("companyDashboard.campaignPreviewAlt")}
                          className="h-full w-full object-cover"
                        />
                      </div>

                      <div className="absolute left-18 top-[2.15rem] z-20 h-[10.6rem] w-23 overflow-hidden rounded-[1.8rem] border-[3.5px] border-[#1f1f1c] bg-white shadow-lg">
                        <img
                          src={latestCampaignPosts[3]?.image ?? ""}
                          alt={t("companyDashboard.campaignPreviewAlt")}
                          className="h-full w-full object-cover"
                        />
                      </div>

                      <div className="absolute left-45 top-0 z-30 h-[12.2rem] w-[6.6rem] -translate-x-1/2 overflow-hidden rounded-[2rem] border-[3.5px] border-[#1f1f1c] bg-white shadow-xl">
                        <img
                          src={latestCampaignPosts[2]?.image ?? ""}
                          alt={t("companyDashboard.campaignPreviewAlt")}
                          className="h-full w-full object-cover"
                        />
                      </div>

                      <div className="absolute right-11 top-[2.15rem] z-20 h-[10.6rem] w-23 overflow-hidden rounded-[1.8rem] border-[3.5px] border-[#1f1f1c] bg-white shadow-lg">
                        <img
                          src={latestCampaignPosts[1]?.image ?? ""}
                          alt={t("companyDashboard.campaignPreviewAlt")}
                          className="h-full w-full object-cover"
                        />
                      </div>

                      <div className="absolute right-0 top-[4.9rem] z-10 h-36 w-[4.6rem] overflow-hidden rounded-[1.6rem] border-[3.5px] border-[#1f1f1c] bg-white shadow-md">
                        <img
                          src={latestCampaignPosts[0]?.image ?? ""}
                          alt={t("companyDashboard.campaignPreviewAlt")}
                          className="h-full w-full object-cover"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="hidden md:block">
                    <div className="text-center">
                      <h3 className="text-3xl font-bold text-[#20201d] underline underline-offset-4 lg:text-[2.3rem]">
                        {t("companyDashboard.latestCampaignsTitle")}
                      </h3>
                    </div>

                    <div className="relative mx-auto mt-10 h-96 w-full max-w-176 lg:h-104 lg:max-w-3xl">
                      <div className="absolute right-135 top-[7.2rem] z-10 h-46 w-[6.4rem] overflow-hidden rounded-[2.1rem] border-4 border-[#1f1f1c] bg-white shadow-md lg:left-30 lg:h-50 lg:w-28">
                        <img
                          src={latestCampaignPosts[0]?.image ?? ""}
                          alt={t("companyDashboard.campaignPreviewAlt")}
                          className="h-full w-full object-cover"
                        />
                      </div>

                      <div className="absolute right-105 top-12 z-20 h-64 w-36 overflow-hidden rounded-[2.5rem] border-4 border-[#1f1f1c] bg-white shadow-lg lg:left-50 lg:h-68 lg:w-[9.6rem]">
                        <img
                          src={latestCampaignPosts[1]?.image ?? ""}
                          alt={t("companyDashboard.campaignPreviewAlt")}
                          className="h-full w-full object-cover"
                        />
                      </div>

                      <div className="absolute left-1/2 top-0 z-30 h-72 w-[10.2rem] -translate-x-1/2 overflow-hidden rounded-[2.7rem] border-4 border-[#1f1f1c] bg-white shadow-xl lg:h-78 lg:w-44">
                        <img
                          src={latestCampaignPosts[2]?.image ?? ""}
                          alt={t("companyDashboard.campaignPreviewAlt")}
                          className="h-full w-full object-cover"
                        />
                      </div>

                      <div className="absolute right-80 top-12 z-20 h-64 w-36 overflow-hidden rounded-[2.5rem] border-4 border-[#1f1f1c] bg-white shadow-lg lg:right-50 lg:h-68 lg:w-[9.6rem]">
                        <img
                          src={latestCampaignPosts[3]?.image ?? ""}
                          alt={t("companyDashboard.campaignPreviewAlt")}
                          className="h-full w-full object-cover"
                        />
                      </div>

                      <div className="absolute right-6 top-[7.2rem] z-10 h-46 w-[6.4rem] overflow-hidden rounded-[2.1rem] border-4 border-[#1f1f1c] bg-white shadow-md lg:right-30 lg:h-50 lg:w-28">
                        <img
                          src={latestCampaignPosts[4]?.image ?? ""}
                          alt={t("companyDashboard.campaignPreviewAlt")}
                          className="h-full w-full object-cover"
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </section>
          )}

          <section className="flex justify-center">
            <Card
              className="w-full max-w-5xl overflow-hidden rounded-[22px] border-0 py-0 text-white shadow-[0_12px_28px_rgba(26,26,20,0.08)] sm:rounded-[28px]"
              style={{
                background:
                  "linear-gradient(135deg, rgba(167,183,142,1) 0%,   rgba(25,25,25,1) 100%)",
                fontFamily: "'IBM Plex Sans Arabic', sans-serif",
              }}>
              <CardContent className="relative px-4 py-14 text-center sm:px-8 sm:py-20 lg:px-12 lg:py-24">
                {/* Wireframe globe background */}
                <div className="pointer-events-none absolute inset-0 flex items-center justify-center overflow-hidden">
                  <svg
                    viewBox="0 0 400 400"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-[280px] w-[280px] opacity-25 sm:h-[340px] sm:w-[340px] lg:h-[400px] lg:w-[400px]"
                    aria-hidden="true">
                    {/* Outer circle */}
                    <circle
                      cx="200"
                      cy="200"
                      r="180"
                      stroke="url(#globe-grad)"
                      strokeWidth="0.8"
                    />
                    {/* Horizontal ellipses */}
                    <ellipse
                      cx="200"
                      cy="200"
                      rx="180"
                      ry="60"
                      stroke="url(#globe-grad)"
                      strokeWidth="0.6"
                    />
                    <ellipse
                      cx="200"
                      cy="200"
                      rx="180"
                      ry="120"
                      stroke="url(#globe-grad)"
                      strokeWidth="0.6"
                    />
                    <ellipse
                      cx="200"
                      cy="200"
                      rx="180"
                      ry="150"
                      stroke="url(#globe-grad)"
                      strokeWidth="0.6"
                    />
                    {/* Vertical ellipses */}
                    <ellipse
                      cx="200"
                      cy="200"
                      rx="60"
                      ry="180"
                      stroke="url(#globe-grad)"
                      strokeWidth="0.6"
                    />
                    <ellipse
                      cx="200"
                      cy="200"
                      rx="120"
                      ry="180"
                      stroke="url(#globe-grad)"
                      strokeWidth="0.6"
                    />
                    <ellipse
                      cx="200"
                      cy="200"
                      rx="150"
                      ry="180"
                      stroke="url(#globe-grad)"
                      strokeWidth="0.6"
                    />
                    {/* Tilted ellipses */}
                    <ellipse
                      cx="200"
                      cy="200"
                      rx="180"
                      ry="80"
                      stroke="url(#globe-grad)"
                      strokeWidth="0.5"
                      transform="rotate(30 200 200)"
                    />
                    <ellipse
                      cx="200"
                      cy="200"
                      rx="180"
                      ry="80"
                      stroke="url(#globe-grad)"
                      strokeWidth="0.5"
                      transform="rotate(-30 200 200)"
                    />
                    <ellipse
                      cx="200"
                      cy="200"
                      rx="180"
                      ry="80"
                      stroke="url(#globe-grad)"
                      strokeWidth="0.5"
                      transform="rotate(60 200 200)"
                    />
                    <ellipse
                      cx="200"
                      cy="200"
                      rx="180"
                      ry="80"
                      stroke="url(#globe-grad)"
                      strokeWidth="0.5"
                      transform="rotate(-60 200 200)"
                    />
                    {/* Horizontal lines */}
                    <line
                      x1="20"
                      y1="140"
                      x2="380"
                      y2="140"
                      stroke="url(#globe-grad)"
                      strokeWidth="0.4"
                    />
                    <line
                      x1="20"
                      y1="260"
                      x2="380"
                      y2="260"
                      stroke="url(#globe-grad)"
                      strokeWidth="0.4"
                    />
                    <line
                      x1="20"
                      y1="200"
                      x2="380"
                      y2="200"
                      stroke="url(#globe-grad)"
                      strokeWidth="0.5"
                    />
                    {/* Vertical line */}
                    <line
                      x1="200"
                      y1="20"
                      x2="200"
                      y2="380"
                      stroke="url(#globe-grad)"
                      strokeWidth="0.5"
                    />
                    {/* Rocket / satellite accent - small diagonal line with dot */}
                    <line
                      x1="260"
                      y1="80"
                      x2="290"
                      y2="50"
                      stroke="rgba(255,255,255,0.6)"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                    />
                    <circle
                      cx="295"
                      cy="45"
                      r="4"
                      fill="rgba(255,255,255,0.7)"
                    />
                    <line
                      x1="295"
                      y1="45"
                      x2="310"
                      y2="35"
                      stroke="rgba(255,255,255,0.3)"
                      strokeWidth="0.8"
                    />
                    <line
                      x1="295"
                      y1="45"
                      x2="305"
                      y2="55"
                      stroke="rgba(255,255,255,0.3)"
                      strokeWidth="0.8"
                    />
                    <defs>
                      <linearGradient
                        id="globe-grad"
                        x1="0"
                        y1="0"
                        x2="400"
                        y2="400">
                        <stop
                          offset="0%"
                          stopColor="rgba(167, 183, 142, 0.8)"
                        />
                        <stop
                          offset="100%"
                          stopColor="rgba(167, 183, 142, 0)"
                        />
                      </linearGradient>
                    </defs>
                  </svg>
                </div>

                {/* Content */}
                <div className="relative z-10">
                  <h3 className="mx-auto max-w-xl text-lg font-bold leading-relaxed text-white sm:text-2xl lg:text-[1.7rem]">
                    {t("companyDashboard.ctaTitle")}
                  </h3>

                  <p className="mx-auto mt-4 max-w-2xl text-[13px] leading-7 text-white/80 sm:mt-5 sm:text-base sm:leading-8">
                    {t("companyDashboard.ctaText")}
                  </p>

                  <Button
                    type="button"
                    onClick={() => navigate("/dashboard/company/create")}
                    className="mt-6 h-10 gap-2 rounded-full border border-white/20 bg-white/10 px-6 text-sm font-medium text-white backdrop-blur-sm hover:bg-white/20 sm:mt-8 sm:h-11 sm:px-8 sm:text-base">
                    {t("companyDashboard.ctaButton")}
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white/15">
                      {isRTL ? (
                        <ChevronLeft className="h-3.5 w-3.5" />
                      ) : (
                        <ChevronRight className="h-3.5 w-3.5" />
                      )}
                    </span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </section>

          <section>
            <Card className="overflow-hidden rounded-[28px] border-0 bg-[rgba(167,183,142,0.09)] py-0 shadow-none sm:rounded-[34px]">
              <CardContent className="relative px-5 py-8 sm:px-8 sm:py-10 lg:px-12 lg:py-12">
                <div className="absolute inset-0 opacity-60">
                  <div className="absolute inset-y-0 left-0 w-[72%] bg-[radial-gradient(circle_at_20%_50%,rgba(167,183,142,0.12),transparent_58%)]" />
                  <div className="absolute bottom-[-8%] left-[6%] h-[78%] w-[78%] rounded-full border border-[rgba(167,183,142,0.09)]" />
                  <div className="absolute bottom-[-14%] left-[10%] h-[66%] w-[66%] rounded-full border border-[rgba(167,183,142,0.08)]" />
                  <div className="absolute bottom-[-19%] left-[14%] h-[54%] w-[54%] rounded-full border border-[rgba(167,183,142,0.07)]" />
                </div>

                <div className="relative flex flex-col gap-10 lg:flex-row lg:items-center lg:justify-between lg:gap-14">
                  <div className="mx-auto flex w-full max-w-[320px] items-start justify-center gap-5 lg:mx-0 lg:w-[320px] lg:justify-end">
                    <div className="relative mt-14 h-[245px] w-[102px] overflow-hidden rounded-[999px] border-[4px] border-white bg-[#d9d9d9] shadow-[0_10px_30px_rgba(31,31,28,0.14)] sm:h-[300px] sm:w-[118px]">
                      <img
                        src={matchingPhotoPrimary}
                        alt={t("companyDashboard.influencerAvatarAlt")}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="relative h-[285px] w-[126px] overflow-hidden rounded-[999px] border-[4px] border-[#b97f85] bg-[#e7d0d2] shadow-[0_14px_34px_rgba(31,31,28,0.16)] sm:h-[348px] sm:w-[150px]">
                      <img
                        src={matchingPhotoSecondary}
                        alt={t("companyDashboard.influencerAvatarAlt")}
                        className="h-full w-full object-cover"
                      />
                    </div>
                  </div>

                  <div className="relative mx-auto w-full max-w-3xl text-center lg:mx-0 lg:flex-1 lg:text-right">
                    <h2 className="mx-auto text-[2rem] font-extrabold leading-[1.3] text-[#a7b78e] underline decoration-[2px] underline-offset-6 sm:text-[2.35rem] lg:mx-0 lg:max-w-[600px] lg:text-[3rem]">
                      {t("companyDashboard.matchingTitle")}
                    </h2>

                    <p className="mx-auto mt-6 max-w-2xl text-[15px] leading-8 text-[#272724] lg:mx-0 lg:max-w-[760px] lg:text-[1.05rem]">
                      {t("companyDashboard.matchingDesc")}
                    </p>

                    <div className="mt-8 space-y-8 lg:mt-12 lg:max-w-[760px]">
                      {monitorItems.map((item, index) => {
                        const isOddIndex = index % 2 === 0;
                        const alignRight = isRTL ? isOddIndex : !isOddIndex;

                        return (
                          <div
                            key={`monitor-${item.id}`}
                            className={cn(
                              "flex w-full",
                              alignRight ? "justify-start" : "justify-end",
                            )}>
                            <div className="flex flex-col items-center gap-2 lg:flex-row lg:items-start lg:gap-4">
                              <div className="mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#a7b78e] text-white">
                                <ShieldCheck className="h-3.5 w-3.5" />
                              </div>
                              <div
                                className={cn(
                                  "w-full max-w-[620px] space-y-1 lg:max-w-[540px]",
                                  isRTL ? "text-right" : "text-left",
                                )}>
                                <p className="text-[1.08rem] font-semibold leading-8 text-[#45453f] lg:text-[1.22rem]">
                                  {item.title}
                                </p>
                                <p className="text-[15px] leading-8 text-[#54544e]">
                                  {item.desc}
                                </p>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>

          <section style={{ fontFamily: "'IBM Plex Sans Arabic', sans-serif" }}>
            {/* Mobile version */}
            <div className="md:hidden">
              <div className="text-center">
                <h2
                  className="text-[1.5rem] font-bold text-[#1f1f1f]"
                  style={{ fontFamily: "'Lemonada', cursive" }}>
                  {t("companyDashboard.whyTitle")}
                </h2>
                <p className="mt-2 text-[12px] leading-6 text-[#666666]">
                  {t("companyDashboard.whySubtitle")}
                </p>
              </div>

              {/* Mobile photos grid */}
              <div className="relative mx-auto mt-5 h-44 w-full max-w-60">
                <div className="absolute left-1/2 top-0 h-14 w-14 -translate-x-1/2 overflow-hidden rounded-full shadow-md">
                  <img
                    src="https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=300&q=80"
                    alt={t("companyDashboard.influencerAlt")}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="absolute right-4 top-5 h-14 w-14 overflow-hidden rounded-full shadow-md">
                  <img
                    src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80"
                    alt={t("companyDashboard.influencerAlt")}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="absolute left-4 top-5 h-14 w-14 overflow-hidden rounded-full shadow-md">
                  <img
                    src="https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=300&q=80"
                    alt={t("companyDashboard.influencerAlt")}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="absolute left-7 top-24 h-12 w-12 overflow-hidden rounded-full shadow-md">
                  <img
                    src="https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?auto=format&fit=crop&w=300&q=80"
                    alt={t("companyDashboard.phonePreviewAlt")}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="absolute left-1/2 top-18 h-12 w-12 -translate-x-1/2 overflow-hidden rounded-full shadow-md">
                  <img
                    src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80"
                    alt={t("companyDashboard.phonePreviewAlt")}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="absolute right-7 top-24 h-12 w-12 overflow-hidden rounded-full shadow-md">
                  <img
                    src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=300&q=80"
                    alt={t("companyDashboard.phonePreviewAlt")}
                    className="h-full w-full object-cover"
                  />
                </div>
              </div>

              {/* Mobile numbered cards */}
              <div className="mt-5 space-y-3">
                {whyItems.map((item) => (
                  <Card
                    key={`mobile-why-${item.id}`}
                    className="rounded-[18px] border-0 bg-[#f7f7fb] py-0 shadow-none">
                    <CardContent
                      className={cn(
                        "flex items-center gap-3 px-4 py-4",
                        isRTL ? "flex-row-reverse" : "flex-row-reverse",
                      )}>
                      <p className="flex-1 text-sm leading-7 text-[#4f4f4f]">
                        {item.text}
                      </p>
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#efedf8] text-sm font-semibold text-[#8d84c7]">
                        {item.id}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Desktop version */}
            <div className="hidden md:block">
              <div className="grid items-start gap-6 lg:grid-cols-[1fr_1.1fr]">
                {/* Left side — text + numbered cards */}
                <div className={cn("space-y-4", isRTL ? "text-right" : "text-left")}>
                  <div>
                    <h2
                      className="text-2xl font-bold text-[#1f1f1f] lg:text-[1.7rem]"
                      style={{ fontFamily: "'Lemonada', cursive" }}>
                      {t("companyDashboard.whyTitle")}
                    </h2>
                    <p className="mt-2 text-sm leading-7 text-[#666666]">
                      {t("companyDashboard.whySubtitle")}
                    </p>
                  </div>

                  <div className="space-y-3">
                    {whyItems.map((item) => (
                      <Card
                        key={`why-${item.id}`}
                        className="rounded-[18px] border-0 bg-[#f1f1f5] py-0 shadow-none sm:rounded-[20px]">
                        <CardContent
                          className={cn(
                            "flex items-center gap-3 px-4 py-4",
                            isRTL && "flex-row",
                          )}>
                          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#ece9fb] text-sm font-semibold text-[#8d84c7]">
                            {item.id}
                          </div>
                          <p className="text-sm leading-7 text-[#4f4f4f]">
                            {item.text}
                          </p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>

                {/* Right side — circular photos with decorations */}
                <div className="relative min-h-[340px] lg:min-h-[380px]">
                  {/* Top row - 3 circular profile photos */}
                  <div className="absolute right-4 top-0 h-[88px] w-[88px] overflow-hidden rounded-full shadow-md lg:right-8 lg:h-[100px] lg:w-[100px]">
                    <img
                      src="https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=300&q=80"
                      alt={t("companyDashboard.influencerAlt")}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="absolute right-[42%] top-2 h-[80px] w-[80px] overflow-hidden rounded-full shadow-md lg:h-[90px] lg:w-[90px]">
                    <img
                      src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80"
                      alt={t("companyDashboard.influencerAlt")}
                      className="h-full w-full object-cover"
                    />
                    {/* Instagram badge */}
                    <div className="absolute bottom-1 right-1 flex h-5 w-5 items-center justify-center rounded-full bg-[linear-gradient(135deg,#833ab4,#fd1d1d,#fcb045)]">
                      <FaInstagram className="text-[10px] text-white" />
                    </div>
                  </div>
                  <div className="absolute left-4 top-4 h-[72px] w-[72px] overflow-hidden rounded-full shadow-md lg:left-8 lg:h-[82px] lg:w-[82px]">
                    <img
                      src="https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=300&q=80"
                      alt={t("companyDashboard.influencerAlt")}
                      className="h-full w-full object-cover"
                    />
                  </div>

                  {/* Emoji decorations */}
                  <span className="absolute right-[30%] top-[15%] text-lg" aria-hidden="true">❤️</span>
                  <span className="absolute left-[20%] top-[10%] text-sm" aria-hidden="true">🔥</span>
                  <span className="absolute right-[15%] top-[40%] text-sm" aria-hidden="true">🔥</span>
                  <span className="absolute left-[35%] top-[55%] text-xs" aria-hidden="true">❤️</span>
                  <span className="absolute right-[45%] top-[70%] text-xs" aria-hidden="true">🔥</span>

                  {/* Middle row - phone mockups */}
                  <div className="absolute left-[10%] top-[35%] h-[130px] w-[80px] overflow-hidden rounded-[20px] border-[3px] border-white shadow-lg lg:h-[150px] lg:w-[90px]">
                    <img
                      src="https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?auto=format&fit=crop&w=300&q=80"
                      alt={t("companyDashboard.phonePreviewAlt")}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="absolute right-[15%] top-[30%] h-[140px] w-[85px] overflow-hidden rounded-[20px] border-[3px] border-white shadow-lg lg:h-[160px] lg:w-[95px]">
                    <img
                      src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=300&q=80"
                      alt={t("companyDashboard.phonePreviewAlt")}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="absolute left-[38%] top-[40%] h-[130px] w-[80px] overflow-hidden rounded-[20px] border-[3px] border-white shadow-lg lg:h-[150px] lg:w-[90px]">
                    <img
                      src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80"
                      alt={t("companyDashboard.phonePreviewAlt")}
                      className="h-full w-full object-cover"
                    />
                  </div>

                  {/* Bottom circular photos */}
                  <div className="absolute bottom-0 left-[5%] h-[70px] w-[70px] overflow-hidden rounded-full shadow-md lg:h-[80px] lg:w-[80px]">
                    <img
                      src="https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=300&q=80"
                      alt={t("companyDashboard.influencerAlt")}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="absolute bottom-2 right-[25%] h-[65px] w-[65px] overflow-hidden rounded-full shadow-md lg:h-[75px] lg:w-[75px]">
                    <img
                      src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80"
                      alt={t("companyDashboard.influencerAlt")}
                      className="h-full w-full object-cover"
                    />
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}

export default CompanyDashboard;
