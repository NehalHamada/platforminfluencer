import {
  ChevronLeft,
  ChevronRight,
  Eye,
  Heart,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Outlet, useLocation } from "react-router-dom";

import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

import hero from "/assets/Hero.png";

type DashboardCopy = {
  featuredTitle: string;
  featuredSubtitle: string;
  currentCampaignsTitle: string;
  campaignStatus: string;
  campaignTitle: string;
  campaignSubtitle: string;
  ctaText: string;
  ctaButton: string;
  monitorTitle: string;
  monitorSubtitle: string;
  whyTitle: string;
  whySubtitle: string;
  profileButton: string;
};

const copy = (isRTL: boolean): DashboardCopy =>
  isRTL
    ? {
        featuredTitle: "مؤثرون متميزون لك",
        featuredSubtitle: "ابحث عن المؤثر الأنسب لحملتك بسهولة",
        currentCampaignsTitle: "حملاتك الحالية المفعلة",
        campaignStatus: "نشطة الآن",
        campaignTitle: "إدارة حملاتك أصبحت أوضح",
        campaignSubtitle:
          "تابع الأداء والميزانية والمراحل الجارية من واجهة واحدة منظمة",
        ctaText:
          "أنشئ حملتك القادمة وحدد المؤثرين والميزانية والجمهور المستهدف من مكان واحد.",
        ctaButton: "ابدأ الآن",
        monitorTitle: "نظام متابعة فعال",
        monitorSubtitle: "لإدارة حملاتك",
        whyTitle: "لماذا منصتنا؟",
        whySubtitle: "حل متكامل لإدارة التعاونات مع المؤثرين باحترافية وأمان",
        profileButton: "عرض الملف",
      }
    : {
        featuredTitle: "Featured creators for you",
        featuredSubtitle: "Find the right influencer for your next campaign",
        currentCampaignsTitle: "Your active campaigns",
        campaignStatus: "Active now",
        campaignTitle: "Campaign management made clearer",
        campaignSubtitle:
          "Track performance, budget, and live execution stages from one place",
        ctaText:
          "Launch your next campaign with clear goals, curated creators, and a tighter workflow.",
        ctaButton: "Start now",
        monitorTitle: "Powerful tracking system",
        monitorSubtitle: "to manage your campaigns",
        whyTitle: "Why our platform?",
        whySubtitle:
          "A complete solution to manage influencer collaborations with clarity and confidence",
        profileButton: "View profile",
      };

const featuredInfluencers = (isRTL: boolean) => [
  {
    id: 1,
    image:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=500&q=80",
    name: isRTL ? "يوسف" : "Yousef",
    category: isRTL ? "تقنية" : "Tech",
    followers: "10k",
    engagement: "2.1%",
  },
  {
    id: 2,
    image:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=500&q=80",
    name: isRTL ? "سارة" : "Sara",
    category: isRTL ? "موضة" : "Fashion",
    followers: "12k",
    engagement: "2.8%",
  },
  {
    id: 3,
    image:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=500&q=80",
    name: isRTL ? "نور" : "Nour",
    category: isRTL ? "جمال" : "Beauty",
    followers: "9k",
    engagement: "2.4%",
  },
];

const whyPlatformItems = (isRTL: boolean) => [
  {
    id: 1,
    text: isRTL
      ? "جميع المؤثرين مرشحون لضمان الجودة والمصداقية."
      : "All influencers are curated to ensure quality and credibility.",
  },
  {
    id: 2,
    text: isRTL
      ? "تواصل مع المؤثرين بدون وسطاء أو تعقيد."
      : "Connect with creators directly without middle layers.",
  },
  {
    id: 3,
    text: isRTL
      ? "تابع التعاونات والميزانيات والنتائج من لوحة واحدة."
      : "Track collaborations, budgets, and results from one dashboard.",
  },
];

const monitorItems = (isRTL: boolean) => [
  {
    title: isRTL ? "تقارير مستمرة" : "Continuous reports",
    description: isRTL
      ? "اعرف مستوى الوصول والتفاعل وحالة التنفيذ أولاً بأول."
      : "See reach, engagement, and execution progress in real time.",
  },
  {
    title: isRTL ? "اختيار أسرع" : "Faster selection",
    description: isRTL
      ? "قارن بين المؤثرين بناءً على بيانات واضحة ومباشرة."
      : "Compare influencers using clear and direct performance data.",
  },
  {
    title: isRTL ? "قرار أوضح" : "Sharper decisions",
    description: isRTL
      ? "تحكم أفضل في الميزانية والنتائج والمرحلة الحالية للحملة."
      : "Make better calls around budget, outcomes, and current campaign stage.",
  },
];

const campaignImages = [
  "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=600&q=80",
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

function CompanyDashboard() {
  const { i18n } = useTranslation();
  const isRTL = i18n.dir() === "rtl";
  const location = useLocation();
  const [featuredIndex, setFeaturedIndex] = useState(0);
  const text = copy(isRTL);
  const featured = featuredInfluencers(isRTL);
  const whyItems = whyPlatformItems(isRTL);
  const monitor = monitorItems(isRTL);

  if (location.pathname !== "/dashboard/company") {
    return <Outlet />;
  }

  const activeFeatured = featured[featuredIndex];
  const goFeaturedPrev = () => {
    setFeaturedIndex((prev) => (prev <= 0 ? featured.length - 1 : prev - 1));
  };
  const goFeaturedNext = () => {
    setFeaturedIndex((prev) => (prev + 1) % featured.length);
  };

  return (
    <div
      dir={isRTL ? "rtl" : "ltr"}
      className="min-h-screen bg-[#efefef] text-[#1f1f1f]">
      <section className="relative h-32 overflow-hidden sm:h-52 lg:h-64">
        <img
          src={hero}
          alt="Company dashboard hero"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-black/65" />
      </section>

      <main className="relative -mt-5 rounded-t-[26px] bg-[#f7f6f2] px-3 pb-8 pt-4 sm:-mt-8 sm:rounded-t-[34px] sm:px-4 sm:pb-10 sm:pt-6 lg:rounded-t-[42px] lg:px-8 lg:pt-8">
        <div className="mx-auto max-w-7xl space-y-4 sm:space-y-6 lg:space-y-8">
          <section>
            <SectionHeader
              title={text.featuredTitle}
              subtitle={text.featuredSubtitle}
              isRTL={isRTL}
            />

            <div className="mt-3 md:hidden">
              <Card className="overflow-hidden rounded-[24px] border-0 bg-white py-0 shadow-[0_10px_24px_rgba(26,26,20,0.06)]">
                <img
                  src={activeFeatured.image}
                  alt={activeFeatured.name}
                  className="h-64 w-full object-cover"
                />

                <CardContent className="p-4">
                  <div
                    className={cn(
                      "flex items-start justify-between gap-3",
                      isRTL && "flex-row  ",
                    )}>
                    <div
                      className={cn(
                        "flex items-center gap-2",
                        isRTL && "flex-row",
                      )}>
                      <div className="flex h-7 w-7 items-center justify-center rounded-md bg-[#ffeff0] text-[#eb4d5c]">
                        <Heart className="h-4 w-4" />
                      </div>
                      <div className="flex h-7 w-7 items-center justify-center rounded-md bg-[#f4f2fb] text-[#121212]">
                        <Eye className="h-4 w-4" />
                      </div>
                    </div>

                    <div
                      className={cn(
                        "space-y-1",
                        isRTL ? "text-right" : "text-left",
                      )}>
                      <h3 className="text-[1.1rem] font-semibold text-[#262622]">
                        {activeFeatured.name}
                      </h3>
                      <p className="text-sm text-[#7c7a72]">
                        {activeFeatured.category}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 grid grid-cols-2 gap-3 rounded-[18px] bg-[#fbfaf7] px-4 py-4">
                    <div
                      className={cn(
                        "space-y-1",
                        isRTL ? "text-right" : "text-left",
                      )}>
                      <p className="text-[1.2rem] font-semibold text-[#1f1f1a]">
                        4.8
                      </p>
                      <p className="text-sm text-[#7a786f]">
                        {isRTL ? "معدل التفاعل" : "Engagement"}
                      </p>
                    </div>

                    <div
                      className={cn(
                        "space-y-1 border-s border-[#ebe7db] ps-4",
                        isRTL ? "text-right" : "text-left",
                      )}>
                      <p className="text-[1.2rem] font-semibold text-[#1f1f1a]">
                        250k
                      </p>
                      <p className="text-sm text-[#7a786f]">
                        {isRTL ? "متابع" : "Followers"}
                      </p>
                    </div>
                  </div>

                  <div
                    className={cn(
                      "mt-4 flex items-center justify-between gap-3 rounded-[18px] border border-[#efede4] bg-[#fcfbf8] px-3 py-3",
                      isRTL && "flex-row-reverse",
                    )}>
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      className="h-11 w-11 rounded-[14px] border-[#eadf95] bg-white text-[#7f8d69] hover:bg-[#fffdf5]">
                      <Heart className="h-4 w-4" />
                    </Button>

                    <Button
                      type="button"
                      variant="outline"
                      className="h-11 flex-1 rounded-[14px] border-0 bg-[#eef1e8] text-[#7f8d69] hover:bg-[#e6ebdd]">
                      {isRTL ? "إرسال رساله" : "Send message"}
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <div
                className={cn(
                  "mt-4 flex items-center justify-center gap-4",
                  isRTL && "flex-row-reverse",
                )}>
                <Button
                  type="button"
                  size="icon-sm"
                  variant="outline"
                  onClick={isRTL ? goFeaturedNext : goFeaturedPrev}
                  className="h-8 w-8 rounded-full border-[#98a77e] text-[#7d8b65] hover:bg-white">
                  {isRTL ? (
                    <ChevronRight size={16} />
                  ) : (
                    <ChevronLeft size={16} />
                  )}
                </Button>

                <div className="flex items-center gap-2">
                  {featured.map((_, index) => (
                    <Button
                      key={index}
                      type="button"
                      size="icon-xs"
                      variant="ghost"
                      onClick={() => setFeaturedIndex(index)}
                      aria-pressed={featuredIndex === index}
                      className={cn(
                        "rounded-full p-0 transition-all duration-300 hover:bg-transparent",
                        featuredIndex === index
                          ? "h-1.5 w-10 bg-[#cfd6bd]"
                          : "h-2.5 w-2.5 bg-[#d8ddcf]",
                      )}
                    />
                  ))}
                </div>

                <Button
                  type="button"
                  size="icon-sm"
                  variant="outline"
                  onClick={isRTL ? goFeaturedPrev : goFeaturedNext}
                  className="h-8 w-8 rounded-full border-[#98a77e] text-[#7d8b65] hover:bg-white">
                  {isRTL ? (
                    <ChevronLeft size={16} />
                  ) : (
                    <ChevronRight size={16} />
                  )}
                </Button>
              </div>
            </div>

            <div className="mt-3 hidden md:grid md:grid-cols-2 md:gap-4 xl:grid-cols-3">
              {featured.map((item) => (
                <Card
                  key={item.id}
                  className="overflow-hidden rounded-[18px] border-0 bg-white py-0 shadow-[0_10px_24px_rgba(26,26,20,0.06)] sm:rounded-[22px]">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="h-36 w-full object-cover sm:h-52"
                  />

                  <CardContent className="p-3 sm:p-4">
                    <div
                      className={cn(
                        "flex items-start justify-between gap-3",
                        isRTL && "flex-row",
                      )}>
                      <div
                        className={cn(
                          "space-y-1",
                          isRTL ? "text-right" : "text-left",
                        )}>
                        <h3 className="text-sm font-semibold text-[#262622] sm:text-base">
                          {item.name}
                        </h3>
                        <p className="text-xs text-[#8a877f] sm:text-sm">
                          {item.category}
                        </p>
                      </div>

                      <Badge className="rounded-full bg-[#eef2e6] px-2.5 py-1 text-[11px] text-[#718059] hover:bg-[#eef2e6] sm:px-3 sm:text-xs">
                        {item.followers}
                      </Badge>
                    </div>

                    <div
                      className={cn(
                        "mt-3 flex items-center justify-between text-xs text-[#6e6d67] sm:mt-4 sm:text-sm",
                        isRTL && "flex-row-reverse",
                      )}>
                      <div
                        className={cn(
                          "flex items-center gap-1.5",
                          isRTL && "flex-row-reverse",
                        )}>
                        <Heart className="h-3.5 w-3.5 text-[#8b87a9] sm:h-4 sm:w-4" />
                        <span>{item.engagement}</span>
                      </div>

                      <div
                        className={cn(
                          "flex items-center gap-1.5",
                          isRTL && "flex-row-reverse",
                        )}>
                        <Eye className="h-3.5 w-3.5 text-[#8b87a9] sm:h-4 sm:w-4" />
                        <span>{item.followers}</span>
                      </div>
                    </div>

                    <Button
                      type="button"
                      variant="outline"
                      className="mt-3 h-9 w-full rounded-full border-[#dbd7cd] bg-white text-xs text-[#44443e] hover:bg-[#faf8f2] sm:mt-4 sm:h-11 sm:text-sm">
                      {text.profileButton}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

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
                      {isRTL ? "شاهد احدث حملاتنا" : "See our latest campaigns"}
                    </h3>
                  </div>

                  <div className="relative mx-auto mt-8 h-72 w-full max-w-84">
                    <div className="absolute left-7 top-[4.9rem] z-10 h-36 w-[4.6rem] overflow-hidden rounded-[1.6rem] border-[3.5px] border-[#1f1f1c] bg-white shadow-md">
                      <img
                        src={campaignImages[4]}
                        alt="Campaign preview"
                        className="h-full w-full object-cover"
                      />
                    </div>

                    <div className="absolute left-18 top-[2.15rem] z-20 h-[10.6rem] w-23 overflow-hidden rounded-[1.8rem] border-[3.5px] border-[#1f1f1c] bg-white shadow-lg">
                      <img
                        src={campaignImages[3]}
                        alt="Campaign preview"
                        className="h-full w-full object-cover"
                      />
                    </div>

                    <div className="absolute left-45 top-0 z-30 h-[12.2rem] w-[6.6rem] -translate-x-1/2 overflow-hidden rounded-[2rem] border-[3.5px] border-[#1f1f1c] bg-white shadow-xl">
                      <img
                        src={campaignImages[2]}
                        alt="Campaign preview"
                        className="h-full w-full object-cover"
                      />
                    </div>

                    <div className="absolute right-11 top-[2.15rem] z-20 h-[10.6rem] w-23 overflow-hidden rounded-[1.8rem] border-[3.5px] border-[#1f1f1c] bg-white shadow-lg">
                      <img
                        src={campaignImages[1]}
                        alt="Campaign preview"
                        className="h-full w-full object-cover"
                      />
                    </div>

                    <div className="absolute right-0 top-[4.9rem] z-10 h-36 w-[4.6rem] overflow-hidden rounded-[1.6rem] border-[3.5px] border-[#1f1f1c] bg-white shadow-md">
                      <img
                        src={campaignImages[0]}
                        alt="Campaign preview"
                        className="h-full w-full object-cover"
                      />
                    </div>
                  </div>
                </div>

                <div className="hidden md:block">
                  <div className="text-center">
                    <h3 className="text-3xl font-bold text-[#20201d] underline underline-offset-4 lg:text-[2.3rem]">
                      {isRTL ? "شاهد احدث حملاتنا" : "See our latest campaigns"}
                    </h3>
                  </div>

                  <div className="relative mx-auto mt-10 h-96 w-full max-w-176 lg:h-104 lg:max-w-3xl">
                    <div className="absolute right-135 top-[7.2rem] z-10 h-46 w-[6.4rem] overflow-hidden rounded-[2.1rem] border-4 border-[#1f1f1c] bg-white shadow-md lg:left-30 lg:h-50 lg:w-28">
                      <img
                        src={campaignImages[0]}
                        alt="Campaign preview"
                        className="h-full w-full object-cover"
                      />
                    </div>

                    <div className="absolute right-105 top-12 z-20 h-64 w-36 overflow-hidden rounded-[2.5rem] border-4 border-[#1f1f1c] bg-white shadow-lg lg:left-50 lg:h-68 lg:w-[9.6rem]">
                      <img
                        src={campaignImages[1]}
                        alt="Campaign preview"
                        className="h-full w-full object-cover"
                      />
                    </div>

                    <div className="absolute left-1/2 top-0 z-30 h-72 w-[10.2rem] -translate-x-1/2 overflow-hidden rounded-[2.7rem] border-4 border-[#1f1f1c] bg-white shadow-xl lg:h-78 lg:w-44">
                      <img
                        src={campaignImages[2]}
                        alt="Campaign preview"
                        className="h-full w-full object-cover"
                      />
                    </div>

                    <div className="absolute right-80 top-12 z-20 h-64 w-36 overflow-hidden rounded-[2.5rem] border-4 border-[#1f1f1c] bg-white shadow-lg lg:right-50 lg:h-68 lg:w-[9.6rem]">
                      <img
                        src={campaignImages[3]}
                        alt="Campaign preview"
                        className="h-full w-full object-cover"
                      />
                    </div>

                    <div className="absolute right-6 top-[7.2rem] z-10 h-46 w-[6.4rem] overflow-hidden rounded-[2.1rem] border-4 border-[#1f1f1c] bg-white shadow-md lg:right-30 lg:h-50 lg:w-28">
                      <img
                        src={campaignImages[4]}
                        alt="Campaign preview"
                        className="h-full w-full object-cover"
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>

          <section>
            <Card className="overflow-hidden rounded-[22px] border-0 bg-[linear-gradient(95deg,#23261f_0%,#5d684f_100%)] py-0 text-white shadow-[0_12px_28px_rgba(26,26,20,0.08)] sm:rounded-[28px]">
              <CardContent className="px-4 py-5 text-center sm:px-8 sm:py-8">
                <div className="mx-auto mb-3 flex h-9 w-9 items-center justify-center rounded-full bg-white/10 sm:mb-4 sm:h-11 sm:w-11">
                  <Sparkles className="h-4 w-4 text-white sm:h-5 sm:w-5" />
                </div>
                <p className="mx-auto max-w-2xl text-xs leading-6 text-white/90 sm:text-base sm:leading-7">
                  {text.ctaText}
                </p>

                <Button
                  type="button"
                  className="mt-4 h-9 rounded-full border border-[#9cac86] bg-[#7a8866]/80 px-4 text-xs text-white hover:bg-[#7a8866] sm:mt-5 sm:h-11 sm:px-6 sm:text-base">
                  {text.ctaButton}
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
              title={text.monitorTitle}
              subtitle={text.monitorSubtitle}
              isRTL={isRTL}
            />

            <div className="mt-3 md:hidden">
              <Card className="overflow-hidden rounded-[24px] border-0 bg-white py-0 shadow-[0_10px_24px_rgba(26,26,20,0.06)]">
                <CardContent className="p-4">
                  <div className="relative mx-auto h-64 w-full max-w-60">
                    <div className="absolute left-6 top-6 h-40 w-20 overflow-hidden rounded-full shadow-lg">
                      <img
                        src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=500&q=80"
                        alt="Influencer preview"
                        className="h-full w-full object-cover"
                      />
                    </div>

                    <div className="absolute right-6 top-0 h-44 w-22 overflow-hidden rounded-full shadow-lg">
                      <img
                        src="https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=500&q=80"
                        alt="Influencer preview"
                        className="h-full w-full object-cover"
                      />
                    </div>
                  </div>

                  <div
                    className={cn("mt-3 text-center", isRTL && "text-right")}>
                    <h3 className="text-[1.45rem] font-semibold leading-normal text-[#aab48f]">
                      {isRTL
                        ? "نظام - مطابقة حملات المؤثرين"
                        : "Influencer campaign matching system"}
                    </h3>
                    <p className="mt-3 text-sm leading-7 text-[#4f4f4b]">
                      {isRTL
                        ? "يتبع نظامنا عملية تحديد وبحث واختيار مصممة خصيصًا لمطابقة الحملات الإعلانية مع المؤثرين المناسبين."
                        : "Our system follows a clear search, selection, and matching flow built for campaign alignment."}
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
                {monitor.map((item) => (
                  <Card
                    key={item.title}
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
                          {item.description}
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
                      alt="Influencer preview"
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
                      alt="Influencer preview"
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
                      {text.whyTitle}
                    </h2>
                    <p className="mt-2 text-sm leading-7 text-[#666666]">
                      {text.whySubtitle}
                    </p>
                  </div>

                  <div className="relative mx-auto mt-5 h-44 w-full max-w-60">
                    <div className="absolute left-1/2 top-0 h-14 w-14 -translate-x-1/2 overflow-hidden rounded-full shadow-md">
                      <img
                        src="https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=300&q=80"
                        alt="Influencer avatar"
                        className="h-full w-full object-cover"
                      />
                    </div>

                    <div className="absolute right-4 top-5 h-14 w-14 overflow-hidden rounded-full shadow-md">
                      <img
                        src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80"
                        alt="Influencer avatar"
                        className="h-full w-full object-cover"
                      />
                    </div>

                    <div className="absolute left-4 top-5 h-14 w-14 overflow-hidden rounded-full shadow-md">
                      <img
                        src="https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=300&q=80"
                        alt="Influencer avatar"
                        className="h-full w-full object-cover"
                      />
                    </div>

                    <div className="absolute left-7 top-24 h-12 w-12 overflow-hidden rounded-full shadow-md">
                      <img
                        src="https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?auto=format&fit=crop&w=300&q=80"
                        alt="Phone preview"
                        className="h-full w-full object-cover"
                      />
                    </div>

                    <div className="absolute left-1/2 top-18 h-12 w-12 -translate-x-1/2 overflow-hidden rounded-full shadow-md">
                      <img
                        src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80"
                        alt="Phone preview"
                        className="h-full w-full object-cover"
                      />
                    </div>

                    <div className="absolute right-7 top-24 h-12 w-12 overflow-hidden rounded-full shadow-md">
                      <img
                        src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=300&q=80"
                        alt="Phone preview"
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
                    {text.whyTitle}
                  </h2>
                  <p className="mt-2 text-xs leading-6 text-[#666666] sm:text-sm sm:leading-7">
                    {text.whySubtitle}
                  </p>
                </div>

                <div className="space-y-3">
                  {whyItems.map((item) => (
                    <Card
                      key={item.id}
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
                      alt="Influencer avatar"
                      className="h-full w-full object-cover"
                    />
                  </div>

                  <div className="absolute left-6 top-6 h-14 w-14 overflow-hidden rounded-full shadow-md sm:left-10 sm:top-8 sm:h-20 sm:w-20">
                    <img
                      src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80"
                      alt="Influencer avatar"
                      className="h-full w-full object-cover"
                    />
                  </div>

                  <div className="absolute right-12 top-18 h-14 w-14 overflow-hidden rounded-full shadow-md sm:right-20 sm:top-28 sm:h-20 sm:w-20">
                    <img
                      src="https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=300&q=80"
                      alt="Influencer avatar"
                      className="h-full w-full object-cover"
                    />
                  </div>

                  <div className="absolute left-3 top-32 h-20 w-14 overflow-hidden rounded-[16px] border-[3px] border-white shadow-lg sm:left-6 sm:top-52 sm:h-32 sm:w-20 sm:rounded-[22px]">
                    <img
                      src="https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?auto=format&fit=crop&w=300&q=80"
                      alt="Phone preview"
                      className="h-full w-full object-cover"
                    />
                  </div>

                  <div className="absolute right-4 top-36 h-20 w-14 overflow-hidden rounded-[16px] border-[3px] border-white shadow-lg sm:right-10 sm:top-56 sm:h-32 sm:w-20 sm:rounded-[22px]">
                    <img
                      src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=300&q=80"
                      alt="Phone preview"
                      className="h-full w-full object-cover"
                    />
                  </div>

                  <div className="absolute left-1/2 top-40 h-20 w-14 -translate-x-1/2 overflow-hidden rounded-[16px] border-[3px] border-white shadow-lg sm:top-64 sm:h-32 sm:w-20 sm:rounded-[22px]">
                    <img
                      src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80"
                      alt="Phone preview"
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
