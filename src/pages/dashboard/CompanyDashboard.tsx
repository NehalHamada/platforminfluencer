import {
  BadgeCheck,
  Bookmark,
  ChevronLeft,
  ChevronRight,
  Plus,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { FaInstagram, FaTiktok } from "react-icons/fa";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Outlet, useLocation, useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useInfluencerDiscoveryQuery } from "@/queries/dashboard/useInfluencerDiscoveryQuery";
import type { InfluencerDiscoveryItem } from "@/types/dashboard.types";

import hero from "/assets/Hero.png";
import latestCampaign1 from "/assets/iphone1.png";
import latestCampaign2 from "/assets/iphone2.png";
import latestCampaign3 from "/assets/iphone3.png";
import latestCampaign4 from "/assets/tImg1.png";
import latestCampaign5 from "/assets/tImg2.png";

type DashboardInfluencer = {
  id: number;
  name: string;
  image: string | null;
  category: string | null;
  followers: string | number | null;
  engagement: string | number | null;
};

const staticLatestCampaignPosts = [
  { id: 1, image: latestCampaign1 },
  { id: 2, image: latestCampaign2 },
  { id: 3, image: latestCampaign3 },
  { id: 4, image: latestCampaign4 },
  { id: 5, image: latestCampaign5 },
];

function SectionHeader({
  title,
  subtitle,
  isRTL,
}: {
  title: string;
  subtitle?: string;
  isRTL: boolean;
}) {
  return (
    <header
      className={cn(
        "space-y-1.5 sm:space-y-2",
        isRTL ? "text-right" : "text-left",
      )}>
      <h2 className="text-lg font-semibold text-[#1d1d1a] sm:text-2xl">
        {title}
      </h2>
      {subtitle ? (
        <p className="text-xs leading-6 text-[#6f6f68] sm:text-sm sm:leading-7">
          {subtitle}
        </p>
      ) : null}
    </header>
  );
}

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
    navigate("/dashboard/company/messages");
  };

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
              {item.followers != null
                ? String(item.followers)
                : "—"}
            </p>
            <p className="text-[10px] text-[#4f4f4b]">
              {t("companyDashboard.followers")}
            </p>
          </div>
          <div className="space-y-0.5 border-s border-[#eeeef0] text-right">
            <p className="text-[11px] font-medium leading-none">
              {item.engagement != null
                ? String(item.engagement)
                : "—"}
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
            <Plus className="h-3 w-3" />
            {t("companyDashboard.follow")}
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
        }),
      ),
    [discoveryData?.data],
  );

  useEffect(() => {
    if (featuredIndex >= dashboardInfluencers.length) {
      setFeaturedIndex(0);
    }
  }, [dashboardInfluencers.length, featuredIndex]);

  if (location.pathname !== "/dashboard/company") {
    return <Outlet />;
  }

  const activeFeatured = dashboardInfluencers[featuredIndex];
  const goFeaturedPrev = () => {
    setFeaturedIndex((prev) =>
      prev <= 0 ? dashboardInfluencers.length - 1 : prev - 1,
    );
  };
  const goFeaturedNext = () => {
    setFeaturedIndex((prev) => (prev + 1) % dashboardInfluencers.length);
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

      <main className="relative -mt-5 rounded-t-[26px]  px-3 pb-8 pt-4 sm:-mt-8 sm:rounded-t-[34px] sm:px-4 sm:pb-10 sm:pt-6 lg:rounded-t-[42px] lg:px-8 lg:pt-8">
        <div className="mx-auto max-w-7xl space-y-4 sm:space-y-6 lg:space-y-8">
          {dashboardInfluencers.length > 0 && (
            <section className="pt-1 sm:pt-2">
              <header className="mx-auto max-w-2xl text-center">
                <h2 className="text-[19px] font-bold leading-tight text-[#232320] sm:text-3xl">
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
                      aria-pressed={featuredIndex === index}
                      className={cn(
                        "h-1.5 rounded-full transition-all",
                        featuredIndex === index
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

          <section>
            <Card className="overflow-hidden rounded-[22px] border-0 bg-[linear-gradient(95deg,#23261f_0%,#5d684f_100%)] py-0 text-white shadow-[0_12px_28px_rgba(26,26,20,0.08)] sm:rounded-[28px]">
              <CardContent className="px-4 py-5 text-center sm:px-8 sm:py-8">
                <div className="mx-auto mb-3 flex h-9 w-9 items-center justify-center rounded-full bg-white/10 sm:mb-4 sm:h-11 sm:w-11">
                  <Sparkles className="h-4 w-4 text-white sm:h-5 sm:w-5" />
                </div>
                <p className="mx-auto max-w-2xl text-xs leading-6 text-white/90 sm:text-base sm:leading-7">
                  {t("companyDashboard.ctaText")}
                </p>

                <Button
                  type="button"
                  onClick={() => navigate("/dashboard/company/create")}
                  className="mt-4 h-9 rounded-full border border-[#9cac86] bg-[#7a8866]/80 px-4 text-xs text-white hover:bg-[#7a8866] sm:mt-5 sm:h-11 sm:px-6 sm:text-base">
                  {t("companyDashboard.ctaButton")}
                  {isRTL ? (
                    <ChevronLeft className="h-4 w-4" />
                  ) : (
                    <ChevronRight className="h-4 w-4" />
                  )}
                </Button>
              </CardContent>
            </Card>
          </section>

          <section>
            <SectionHeader
              title={t("companyDashboard.monitorTitle")}
              subtitle={t("companyDashboard.monitorSubtitle")}
              isRTL={isRTL}
            />

            <div className="mt-3 md:hidden">
              <Card className="overflow-hidden rounded-[24px] border-0 bg-white py-0 shadow-[0_10px_24px_rgba(26,26,20,0.06)]">
                <CardContent className="p-4">
                  <div className="relative mx-auto h-64 w-full max-w-60">
                    <div className="absolute left-6 top-6 h-40 w-20 overflow-hidden rounded-full shadow-lg">
                      <img
                        src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=500&q=80"
                        alt={t("companyDashboard.influencerAvatarAlt")}
                        className="h-full w-full object-cover"
                      />
                    </div>

                    <div className="absolute right-6 top-0 h-44 w-22 overflow-hidden rounded-full shadow-lg">
                      <img
                        src="https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=500&q=80"
                        alt={t("companyDashboard.influencerAvatarAlt")}
                        className="h-full w-full object-cover"
                      />
                    </div>
                  </div>

                  <div
                    className={cn("mt-3 text-center", isRTL && "text-right")}>
                    <h3 className="text-[1.45rem] font-semibold leading-normal text-[#aab48f]">
                      {t("companyDashboard.matchingTitle")}
                    </h3>
                    <p className="mt-3 text-sm leading-7 text-[#4f4f4b]">
                      {t("companyDashboard.matchingDesc")}
                    </p>
                  </div>

                  <div className="mt-5 space-y-4">
                    {whyItems.map((item) => (
                      <div
                        key={`mobile-monitor-${item.id}`}
                        className={cn(
                          "flex items-start gap-3",
                          isRTL ? "flex-row-reverse text-right" : "text-left",
                        )}>
                        <div className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#e7ecd9] text-[#91a06f]">
                          <ShieldCheck className="h-3.5 w-3.5" />
                        </div>
                        <p className="text-sm leading-7 text-[#4f4f4b]">
                          {item.text}
                        </p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="mt-3 hidden md:grid md:grid-cols-1 md:gap-3 lg:grid-cols-[1.15fr_340px] lg:gap-5">
              <div className="space-y-3 sm:space-y-4">
                {monitorItems.map((item) => (
                  <Card
                    key={`monitor-${item.id}`}
                    className="rounded-[18px] border-0 bg-[#edf1e5] py-0 shadow-none sm:rounded-[22px]">
                    <CardContent className="px-4 py-4 sm:px-5 sm:py-5">
                      <div
                        className={cn(
                          "space-y-1.5 sm:space-y-2",
                          isRTL ? "text-right" : "text-left",
                        )}>
                        <p className="text-sm font-semibold text-[#5b7249] sm:text-base">
                          {item.title}
                        </p>
                        <p className="text-xs leading-6 text-[#65655f] sm:text-sm sm:leading-7">
                          {item.desc}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <Card className="overflow-hidden rounded-[22px] border-0 bg-white/75 py-0 shadow-[0_10px_24px_rgba(26,26,20,0.06)] sm:rounded-[28px]">
                <CardContent className="relative mx-auto h-52 w-full max-w-56 p-4 sm:h-72 sm:max-w-76">
                  <div
                    className={cn(
                      "absolute bottom-4 z-10 h-28 w-14 overflow-hidden rounded-full border-[3px] border-white shadow-md sm:h-40 sm:w-20",
                      isRTL ? "right-4" : "left-4",
                    )}>
                    <img
                      src="https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=500&q=80"
                      alt={t("companyDashboard.influencerAvatarAlt")}
                      className="h-full w-full object-cover"
                    />
                  </div>

                  <div
                    className={cn(
                      "absolute top-4 h-36 w-20 overflow-hidden rounded-full border-[3px] border-white shadow-lg sm:h-56 sm:w-32",
                      isRTL ? "left-8" : "right-8",
                    )}>
                    <img
                      src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=500&q=80"
                      alt={t("companyDashboard.influencerAvatarAlt")}
                      className="h-full w-full object-cover"
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
          </section>

          <section>
            <div className="md:hidden">
              <Card className="overflow-hidden rounded-[24px] border-0 bg-white py-0 shadow-[0_10px_24px_rgba(26,26,20,0.06)]">
                <CardContent className="p-4">
                  <div className={cn("text-center", isRTL && "text-right")}>
                    <h2 className="text-[1.7rem] font-bold text-[#1f1f1f]">
                      {t("companyDashboard.whyTitle")}
                    </h2>
                    <p className="mt-2 text-sm leading-7 text-[#666666]">
                      {t("companyDashboard.whySubtitle")}
                    </p>
                  </div>

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
                </CardContent>
              </Card>
            </div>

            <div className="hidden md:grid md:grid-cols-1 md:items-start md:gap-4 lg:grid-cols-[1fr_1.05fr] lg:gap-6">
              <div
                className={cn(
                  "space-y-3 sm:space-y-4",
                  isRTL ? "text-right" : "text-left",
                )}>
                <div>
                  <h2 className="text-lg font-bold text-[#1f1f1f] sm:text-2xl">
                    {t("companyDashboard.whyTitle")}
                  </h2>
                  <p className="mt-2 text-xs leading-6 text-[#666666] sm:text-sm sm:leading-7">
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
                        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#ece9fb] text-xs font-semibold text-[#8d84c7] sm:h-8 sm:w-8 sm:text-sm">
                          {item.id}
                        </div>
                        <p className="text-xs leading-6 text-[#4f4f4f] sm:text-sm sm:leading-7">
                          {item.text}
                        </p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              <Card className="overflow-hidden rounded-[22px] border-0 bg-white/80 py-0 shadow-[0_12px_30px_rgba(26,26,20,0.06)] sm:rounded-[28px]">
                <CardContent className="relative h-68 p-4 sm:h-108 sm:p-5">
                  <div className="absolute right-4 top-4 h-14 w-14 overflow-hidden rounded-full shadow-md sm:right-5 sm:h-20 sm:w-20">
                    <img
                      src="https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=300&q=80"
                      alt={t("companyDashboard.influencerAlt")}
                      className="h-full w-full object-cover"
                    />
                  </div>

                  <div className="absolute left-6 top-6 h-14 w-14 overflow-hidden rounded-full shadow-md sm:left-10 sm:top-8 sm:h-20 sm:w-20">
                    <img
                      src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80"
                      alt={t("companyDashboard.influencerAlt")}
                      className="h-full w-full object-cover"
                    />
                  </div>

                  <div className="absolute right-12 top-18 h-14 w-14 overflow-hidden rounded-full shadow-md sm:right-20 sm:top-28 sm:h-20 sm:w-20">
                    <img
                      src="https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=300&q=80"
                      alt={t("companyDashboard.influencerAlt")}
                      className="h-full w-full object-cover"
                    />
                  </div>

                  <div className="absolute left-3 top-32 h-20 w-14 overflow-hidden rounded-[16px] border-[3px] border-white shadow-lg sm:left-6 sm:top-52 sm:h-32 sm:w-20 sm:rounded-[22px]">
                    <img
                      src="https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?auto=format&fit=crop&w=300&q=80"
                      alt={t("companyDashboard.phonePreviewAlt")}
                      className="h-full w-full object-cover"
                    />
                  </div>

                  <div className="absolute right-4 top-36 h-20 w-14 overflow-hidden rounded-[16px] border-[3px] border-white shadow-lg sm:right-10 sm:top-56 sm:h-32 sm:w-20 sm:rounded-[22px]">
                    <img
                      src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=300&q=80"
                      alt={t("companyDashboard.phonePreviewAlt")}
                      className="h-full w-full object-cover"
                    />
                  </div>

                  <div className="absolute left-1/2 top-40 h-20 w-14 -translate-x-1/2 overflow-hidden rounded-[16px] border-[3px] border-white shadow-lg sm:top-64 sm:h-32 sm:w-20 sm:rounded-[22px]">
                    <img
                      src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80"
                      alt={t("companyDashboard.phonePreviewAlt")}
                      className="h-full w-full object-cover"
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}

export default CompanyDashboard;
