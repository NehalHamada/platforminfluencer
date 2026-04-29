import { useState } from "react";
import { ShieldCheck } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Outlet, useLocation } from "react-router-dom";

import hero from "/assets/Hero.png";

import { Button } from "@/components/ui/Button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { InfluencerDashboardResponse } from "@/types/dashboard.types";

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

  const isRTL = i18n.dir() === "rtl";

  const data: InfluencerDashboardResponse = {
    profile: {
      name: isRTL ? "سارة حامد" : "Sara Hamed",
      avatar:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=500&q=80",
    },
    currentInfo: [
      {
        id: 1,
        date: "20-3-2026",
        title: isRTL ? "تجربة منتج جديد" : "New product trial",
        company: isRTL ? "نشر المحتوى" : "Publish content",
      },
      {
        id: 2,
        date: "20-3-2026",
        title: isRTL ? "تجربة منتج جديد" : "New product trial",
        company: isRTL ? "نشر المحتوى" : "Publish content",
      },
    ],
    upcomingCampaigns: [
      {
        id: 1,
        brand: "Glow",
        type: isRTL ? "عناية بالبشرة" : "Skincare",
        date: "20-3-2026",
        budget: isRTL ? "10000 ريال" : "SAR 10000",
        status: "pending",
      },
      {
        id: 2,
        brand: "Vivid",
        type: isRTL ? "عناية بالبشرة" : "Skincare",
        date: "20-3-2026",
        budget: isRTL ? "10000 ريال" : "SAR 10000",
        status: "accepted",
      },
    ],
    activities: [
      {
        id: 1,
        image: "/assets/platImg.png",
        title: isRTL ? "حملة Glow" : "Glow Campaign",
        platform: "Instagram",
        followers: isRTL ? "250 ألف" : "250K",
        budget: isRTL ? "7000 ريال" : "SAR 7000",
      },
      {
        id: 2,
        image: "/assets/infImg2.png",
        title: isRTL ? "حملة Beauty Pro" : "Beauty Pro",
        platform: "TikTok",
        followers: isRTL ? "180 ألف" : "180K",
        budget: isRTL ? "6300 ريال" : "SAR 6300",
      },
      {
        id: 3,
        image: "/assets/iphone2.png",
        title: isRTL ? "تعاون جديد" : "New Collab",
        platform: "Snapchat",
        followers: isRTL ? "120 ألف" : "120K",
        budget: isRTL ? "4100 ريال" : "SAR 4100",
      },
    ],
  };

  const activityCollage = [
    {
      id: 1,
      src: "/assets/platImg1.png",
      alt: isRTL ? "نشاط حملة سابق" : "Previous campaign activity",
      className: "h-9 w-12 sm:h-14 sm:w-20",
    },
    {
      id: 2,
      src: "/assets/platImg.png",
      alt: isRTL ? "نشاط محتوى" : "Content activity",
      className: "h-14 w-14 sm:h-[5.5rem] sm:w-[5.5rem]",
    },
    {
      id: 3,
      src: "/assets/iphone2.png",
      alt: isRTL ? "نشاط إنستجرام" : "Instagram activity",
      className: "h-20 w-16 sm:h-[7.5rem] sm:w-[6.5rem]",
      featured: true,
    },
    {
      id: 4,
      src: "/assets/user1.png",
      alt: isRTL ? "نشاط مؤثرة" : "Influencer activity",
      className: "h-14 w-14 sm:h-[5.5rem] sm:w-[5.5rem]",
    },
    {
      id: 5,
      src: "/assets/infImg3.png",
      alt: isRTL ? "نشاط تعاون" : "Collaboration activity",
      className: "h-9 w-12 sm:h-14 sm:w-20",
    },
  ];

  const recommendedCampaigns = [
    {
      id: 1,
      image: "/assets/choImg3.png",
      title: isRTL ? "حملة اطلاق عطر جديد" : "New perfume launch",
      platform: "INSTAGRAM",
      followers: isRTL ? "نساء 18 - 30 سنة" : "Women 18 - 30",
      budget: "1200$",
    },
    {
      id: 2,
      image: "/assets/choImg4.png",
      title: isRTL ? "حملة اطلاق عطر جديد" : "New perfume launch",
      platform: "INSTAGRAM",
      followers: isRTL ? "نساء 18 - 30 سنة" : "Women 18 - 30",
      budget: "1200$",
    },
  ];

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
                  {t("influencerDashboard.verify")}
                </p>
              </div>

              <Avatar className="h-7 w-7 sm:h-9 sm:w-9">
                <AvatarImage
                  src={data.profile.avatar}
                  alt={data.profile.name}
                />
                <AvatarFallback>{data.profile.name.slice(0, 1)}</AvatarFallback>
              </Avatar>
            </div>
          </div>

          <section className="mb-6 sm:mb-10">
            <div className="sm:hidden">
              <SectionTitle title={t("influencerDashboard.currentInfo")} />
            </div>
            <div className={cn("mb-6 hidden sm:block text-center")}>
              <h2 className="inline-block  border-b border-[#1f1f1f] pb-1 text-base font-bold text-[#232323]">
                مهامك الحالية
              </h2>
            </div>

            <div className="grid grid-cols-1 gap-2.5 sm:mx-auto sm:max-w-147.5 sm:grid-cols-2 sm:gap-4">
              {data.currentInfo.map((item) => (
                <div key={item.id} className="relative pb-5 sm:pb-7">
                  <Card className="rounded-sm border-0 bg-[#ededed] py-0 shadow-none sm:overflow-hidden sm:rounded-[8px]">
                    <CardContent className="px-2 py-1.5 sm:px-0 sm:py-0">
                      <div className="mb-1.5 bg-[#e2e4dd] py-1 text-center text-[8px] text-[#8c8c8c] sm:mb-0 sm:bg-[#dedede] sm:px-5 sm:py-2 sm:text-[12px]">
                        <span className="hidden text-[#879b6d] sm:inline">
                          الموعد النهائي للتنفيذ :
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
                            اسم الحملة :
                          </span>{" "}
                          {item.title}
                        </p>
                        <p>
                          <span className="hidden font-bold text-[#282828] sm:inline">
                            المهمة الحالية :
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
                        FINANCE
                      </div>

                      <div
                        className={cn(
                          "mt-4 space-y-3 text-[13px] leading-5 text-[#303030] sm:mt-0 sm:flex sm:items-center sm:justify-end sm:gap-8 sm:space-y-0 sm:text-[12px] sm:leading-5 sm:text-[#303030]",
                          isRTL ? "sm:text-right" : "sm:text-left",
                        )}>
                        <strong className="hidden shrink-0 text-lg font-black tracking-[-0.04em] text-[#090909] sm:block">
                          FINANCE
                        </strong>

                        <div className="space-y-3 sm:space-y-2">
                          <p>
                            <span className="font-bold text-[#242424]">
                              نوع المحتوى :
                            </span>{" "}
                            {item.type}
                          </p>
                          <p>
                            <span className="font-bold text-[#242424]">
                              الموعد :
                            </span>{" "}
                            {item.date}
                          </p>
                          <p>
                            <span className="font-bold text-[#242424]">
                              الميزانية المقترحة :
                            </span>{" "}
                            {item.budget}
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
                    {showAllUpcomingMobile ? "عرض أقل" : "عرض الكل"}
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
              {activityCollage.map((item, index) => (
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
            </div>
          </section>

          <section>
            <div className="sm:hidden">
              <SectionTitle
                title={
                  isRTL
                    ? "حملات تناسب جمهورك"
                    : "Campaigns That Match Your Audience"
                }
              />
            </div>
            <div className="mb-8 hidden text-center sm:block">
              <h2 className="inline-block border-b border-[#1f1f1f] pb-1 text-base font-bold text-[#232323]">
                حملات تناسب جمهورك
              </h2>
            </div>

            <div className="-mx-2 flex snap-x gap-3 overflow-x-auto px-2 pb-1 [scrollbar-width:none] sm:mx-auto sm:grid sm:max-w-147.5 sm:grid-cols-2 sm:gap-4 sm:overflow-visible sm:px-0">
              {recommendedCampaigns.map((campaign) => (
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
                          {campaign.title}
                        </h3>
                        <div className="mt-1.5 space-y-0.5 text-[7px] leading-3.5 text-[#7a7a7a] sm:mt-3 sm:space-y-3 sm:text-[11px] sm:leading-5">
                          <p className="sm:text-[#9a9a9a]">الجمهور المطلوب :</p>
                          <p className="bg-[#f8f8f5] py-1 text-[#7a7a7a]">
                            {campaign.followers}
                          </p>
                          <p>{campaign.platform}</p>
                          <p>
                            الميزانية :{" "}
                            <span className="font-bold text-[#1d1d1d]">
                              {campaign.budget}
                            </span>
                          </p>
                        </div>
                      </div>

                      <Button
                        type="button"
                        variant="outline"
                        className="h-6 rounded-none border-[#d9d9d9] bg-white px-2 text-[8px] font-semibold text-[#454545] shadow-none hover:bg-[#f8f8f5] sm:h-9 sm:text-[12px]">
                        {isRTL ? "التقديم علي الحملة" : "Apply to campaign"}
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
