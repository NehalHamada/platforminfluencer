import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  CircleDollarSign,
  Globe,
  Heart,
  ImageIcon,
  MessageCircleMore,
  PlayCircle,
  Star,
} from "lucide-react";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import hero from "/assets/Hero.png";
import { useNavigate } from "react-router-dom";
import { useInfluencerDiscoveryQuery } from "@/queries/dashboard/useInfluencerDiscoveryQuery";

type WorkFilter = "all" | "reels" | "photos";

type BrandCard = {
  id: number;
  name: string;
  category: string;
  note: string;
};

type WorkCard = {
  id: number;
  title: string;
  type: WorkFilter;
  image: string;
  likes: string;
  platform: string;
};

type ReviewCard = {
  id: number;
  title: string;
  date: string;
  amount: string;
  status: string;
};

const profileImage =
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=900&q=80";

function InfluencerProfile() {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.dir() === "rtl";
  const profileQuery = useInfluencerDiscoveryQuery({ search: "nehal" });
  const [activeFilter, setActiveFilter] = useState<WorkFilter>("all");
  const [brandIndex, setBrandIndex] = useState(0);
  const [mobileWorkIndex, setMobileWorkIndex] = useState(0);
  const navigate = useNavigate();
  const influencer = profileQuery.data?.data?.[0];
  const influencerName = influencer?.name || "Sara Hamed";
  const influencerAvatar = influencer?.image || profileImage;
  const influencerInitials = influencerName
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const brandCards: BrandCard[] = [
    {
      id: 1,
      name: "FINANCE",
      category: t("influencerProfile.brandCategory"),
      note: t("influencerProfile.brandNote"),
    },
    {
      id: 2,
      name: "GROWTH",
      category: t("influencerProfile.brandCategory"),
      note: t("influencerProfile.brandNote"),
    },
    {
      id: 3,
      name: "FINANCE",
      category: t("influencerProfile.brandCategory"),
      note: t("influencerProfile.brandNote"),
    },
  ];

  const works = useMemo<WorkCard[]>(
    () => [
      {
        id: 1,
        title: "LaRoche",
        type: "photos",
        image:
          "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=700&q=80",
        likes: "6.5k",
        platform: "Instagram",
      },
      {
        id: 2,
        title: "Lanbela",
        type: "reels",
        image:
          "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=700&q=80",
        likes: "8.2k",
        platform: "TikTok",
      },
      {
        id: 3,
        title: "Dark V.I.P",
        type: "photos",
        image:
          "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?auto=format&fit=crop&w=700&q=80",
        likes: "5.1k",
        platform: "Instagram",
      },
      {
        id: 4,
        title: "LaRoche",
        type: "reels",
        image:
          "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=700&q=80",
        likes: "7.4k",
        platform: "TikTok",
      },
    ],
    [],
  );

  const reviews: ReviewCard[] = [
    {
      id: 1,
      title: t("influencerProfile.reviewTitle"),
      date: "20-10-2026",
      amount: "7800 SAR",
      status: t("influencerProfile.reviewStatus"),
    },
    {
      id: 2,
      title: t("influencerProfile.reviewTitle"),
      date: "20-10-2026",
      amount: "7800 SAR",
      status: t("influencerProfile.reviewStatus"),
    },
    {
      id: 3,
      title: t("influencerProfile.reviewTitle"),
      date: "20-10-2026",
      amount: "7800 SAR",
      status: t("influencerProfile.reviewStatus"),
    },
  ];

  const filteredWorks = useMemo(() => {
    if (activeFilter === "all") return works;
    return works.filter((work) => work.type === activeFilter);
  }, [activeFilter, works]);

  const activeBrand = brandCards[brandIndex];
  const activeWork =
    filteredWorks[Math.min(mobileWorkIndex, filteredWorks.length - 1)] ??
    filteredWorks[0];

  const filters: Array<{ key: WorkFilter; label: string }> = [
    { key: "all", label: t("influencerProfile.filterAll") },
    { key: "photos", label: t("influencerProfile.filterPhotos") },
    { key: "reels", label: t("influencerProfile.filterReels") },
  ];

  const metricCards = [
    {
      label: t("influencerProfile.statFollowers"),
      value: isRTL ? "120 ألف متابع" : "120k followers",
      tone: "bg-[#fbf1e8] text-[#ba8e61]",
    },
    {
      label: t("influencerProfile.statEngagement"),
      value: isRTL ? "4.9 معدل التفاعل" : "4.9 engagement rate",
      tone: "bg-[#f4f2fb] text-[#8d88a8]",
    },
    {
      label: isRTL ? "متوسط المشاهدات" : "Average views",
      value: isRTL ? "45 ألف مشاهدة" : "45k views",
      tone: "bg-[#fbf8df] text-[#b0a14f]",
    },
  ];

  const categoryChips = ["Beauty", "Tech", "Lifestyle"];
  const platformChips = ["Tiktok", "Snapchat", "instagram"];

  return (
    <section
      dir={isRTL ? "rtl" : "ltr"}
      className="relative -mt-24 overflow-x-hidden ">
      <div className="relative h-70 w-full overflow-hidden sm:h-56 lg:h-64">
        <img
          src={hero}
          alt={t("influencerProfile.heroAlt")}
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-black/60 backdrop-blur-[1px]" />
      </div>

      <div className="relative z-10 -mt-4 rounded-t-[24px] bg-white px-2.5 pb-8 pt-4 sm:-mt-8 sm:rounded-t-[36px] sm:px-5 lg:rounded-t-[42px] lg:px-8 lg:pt-7">
        <div className="mx-auto max-w-6xl space-y-4 sm:space-y-5">
          <Card className="rounded-[26px] border-0 bg-white py-0 shadow-[0_16px_48px_rgba(28,30,24,0.06)]">
            <CardContent className="p-3 sm:p-5 lg:p-6">
              <div
                className={cn(
                  "flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between",
                  isRTL && "lg:flex-row-reverse",
                )}>
                <div
                  className={cn(
                    "flex items-center gap-3",
                    isRTL ? "flex-row-reverse" : "flex-row",
                  )}>
                  <Avatar className="h-11 w-11 border-2 border-[#ece7dd]">
                    <AvatarImage src={influencerAvatar} alt={influencerName} />
                    <AvatarFallback>{influencerInitials}</AvatarFallback>
                  </Avatar>

                  <div className={isRTL ? "text-right" : "text-left"}>
                    <h1 className="text-base font-semibold text-[#23231f] sm:text-lg">
                      {profileQuery.isLoading
                        ? t("campaigns.loading", "Loading...")
                        : influencerName}
                    </h1>
                    <div
                      className={cn(
                        "mt-1 flex items-center gap-1 text-xs text-[rgba(111,66,193,1)]",
                        isRTL
                          ? "flex-row-reverse justify-start"
                          : "justify-start",
                      )}>
                      <Globe className="h-3.5 w-3.5" />
                      <span>{t("influencerProfile.activeNow")}</span>
                    </div>
                  </div>
                </div>

                <div
                  className={cn(
                    "flex flex-wrap items-center gap-2 max-sm:justify-between",
                    isRTL ? "justify-start" : "justify-end",
                  )}>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() =>
                      navigate("/dashboard/company/contact", {
                        state: {
                          influencerId: influencer?.id,
                          influencerName,
                        },
                      })
                    }
                    className={cn(
                      "h-9 rounded-full border-[#ddd8cd] bg-white px-3 text-xs text-[#53524b] hover:bg-[#faf8f2] sm:h-10 sm:px-4 sm:text-sm",
                      isRTL && "flex-row-reverse",
                    )}>
                    <MessageCircleMore className="h-4 w-4" />
                    <span>{t("influencerProfile.startChat")}</span>
                  </Button>
                </div>
              </div>

              <Separator className="my-3 bg-[#ece7dd] sm:my-4" />

              <div className="">
                <div className="space-y-4">
                  <div className={`${isRTL ? "text-right" : "text-left"} `}>
                    <p className="mt-1 text-center text-[11px] leading-6 text-[#66655e] sm:mt-3 sm:text-sm sm:leading-7">
                      {t("influencerProfile.bio")}
                    </p>
                  </div>

                  <div className="space-y-3">
                    <div className="grid grid-cols-3 gap-2 sm:gap-3">
                      {categoryChips.map((chip) => (
                        <div
                          key={chip}
                          className="rounded-[8px] bg-[#f7f5f0] px-2 py-2 text-center text-[11px] font-medium text-[#2e2d28] sm:rounded-[10px] sm:px-3 sm:py-3 sm:text-sm">
                          {chip}
                        </div>
                      ))}
                    </div>

                    <div className="grid grid-cols-3 gap-2 sm:gap-3">
                      {platformChips.map((chip) => (
                        <div
                          key={chip}
                          className={cn(
                            "flex items-center justify-center gap-1 rounded-[8px] bg-[#f7f5f0] px-2 py-2 text-[11px] font-medium text-[#6a685f] sm:gap-1.5 sm:rounded-[10px] sm:px-3 sm:py-3 sm:text-sm",
                            isRTL && "flex-row-reverse",
                          )}>
                          <span>{chip}</span>
                          <span className="flex h-3.5 w-3.5 items-center justify-center rounded-full bg-[rgba(111,66,193,1)] text-white sm:h-4 sm:w-4">
                            <Globe className="h-2.5 w-2.5" />
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-2 sm:grid-cols-3 sm:gap-3">
                    {metricCards.map((item) => (
                      <Card
                        key={item.label}
                        className="rounded-[16px] border border-[#f0ede5] bg-[#fcfbf8] py-0 shadow-none">
                        <CardContent className="p-2.5 sm:p-4">
                          <div
                            className={cn(
                              "flex items-center justify-between gap-3",
                              isRTL && "flex-row-reverse",
                            )}>
                            <p
                              className={cn(
                                "text-xs font-semibold text-[#2a2925] sm:text-sm",
                                isRTL ? "text-right" : "text-left",
                              )}>
                              {item.label}
                            </p>
                            <span
                              className={cn(
                                "inline-flex rounded-[8px] px-2 py-1.5 text-[11px] font-medium sm:px-3 sm:py-2 sm:text-sm",
                                item.tone,
                              )}>
                              {item.value}
                            </span>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <section>
            <div className="mb-4 text-center">
              <h2 className="text-lg font-semibold text-[#252520] sm:text-xl">
                {t("influencerProfile.similarBrands")}
              </h2>
            </div>

            <div className="hidden grid-cols-1 gap-4 lg:grid-cols-3 sm:grid">
              {brandCards.map((card) => (
                <Card
                  key={card.id}
                  className="rounded-[18px] border border-[#ece7dd] bg-white py-0 shadow-none">
                  <CardContent className="p-5">
                    <div className={isRTL ? "text-right" : "text-left"}>
                      <h3 className="text-lg font-semibold text-[#1f1f1b]">
                        {card.name}
                      </h3>
                      <p className="mt-2 text-sm text-[#696860]">
                        {card.category}
                      </p>
                      <div
                        className={cn(
                          "mt-3 flex items-center gap-1 text-[#d8b955]",
                          isRTL
                            ? "flex-row-reverse justify-start"
                            : "justify-start",
                        )}>
                        {Array.from({ length: 5 }).map((_, idx) => (
                          <Star
                            key={idx}
                            size={13}
                            className="fill-current"
                            aria-hidden="true"
                          />
                        ))}
                      </div>
                      <p className="mt-3 text-sm leading-6 text-[#7a7870]">
                        {card.note}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="sm:hidden">
              <Card className="rounded-[18px] border border-[#ece7dd] bg-white py-0 shadow-none">
                <CardContent className="p-4">
                  <div className={isRTL ? "text-right" : "text-left"}>
                    <h3 className="text-base font-semibold text-[#1f1f1b]">
                      {activeBrand.name}
                    </h3>
                    <p className="mt-2 text-xs text-[#696860]">
                      {activeBrand.category}
                    </p>
                    <div
                      className={cn(
                        "mt-3 flex items-center gap-1 text-[#d8b955]",
                        isRTL
                          ? "flex-row-reverse justify-start"
                          : "justify-start",
                      )}>
                      {Array.from({ length: 5 }).map((_, idx) => (
                        <Star
                          key={idx}
                          size={12}
                          className="fill-current"
                          aria-hidden="true"
                        />
                      ))}
                    </div>
                    <p className="mt-3 text-xs leading-6 text-[#7a7870]">
                      {activeBrand.note}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div
              className={cn(
                "mt-3 flex items-center justify-center gap-2 text-[#b8b6ae] sm:mt-4",
                isRTL && "flex-row-reverse",
              )}>
              <Button
                type="button"
                size="icon-sm"
                variant="outline"
                onClick={() =>
                  setBrandIndex((prev) =>
                    isRTL
                      ? (prev + 1) % brandCards.length
                      : prev <= 0
                        ? brandCards.length - 1
                        : prev - 1,
                  )
                }
                className="rounded-full border-[#e6e2d8] bg-white">
                {isRTL ? <ChevronLeft size={14} /> : <ChevronLeft size={14} />}
              </Button>
              <Button
                type="button"
                size="icon-sm"
                variant="outline"
                onClick={() =>
                  setBrandIndex((prev) =>
                    isRTL
                      ? prev <= 0
                        ? brandCards.length - 1
                        : prev - 1
                      : (prev + 1) % brandCards.length,
                  )
                }
                className="rounded-full border-[#e6e2d8] bg-white">
                {isRTL ? (
                  <ChevronRight size={14} />
                ) : (
                  <ChevronRight size={14} />
                )}
              </Button>
            </div>
          </section>

          <section>
            <div
              className={cn(
                "mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between",
                isRTL && "sm:flex-row-reverse",
              )}>
              <h2 className="text-center text-lg font-semibold text-[#252520] sm:text-xl">
                {t("influencerProfile.worksTitle")}
              </h2>

              <div
                className={cn(
                  "flex flex-wrap items-center justify-center gap-2",
                  isRTL ? "sm:justify-start" : "sm:justify-end",
                )}>
                {filters.map((filter) => (
                  <Button
                    key={filter.key}
                    type="button"
                    variant={
                      activeFilter === filter.key ? "secondary" : "outline"
                    }
                    size="sm"
                    onClick={() => setActiveFilter(filter.key)}
                    className={cn(
                      "rounded-full px-4",
                      activeFilter === filter.key
                        ? "border-0 bg-[rgba(111,66,193,0.1)] text-[rgba(111,66,193,1)] hover:bg-[rgba(111,66,193,0.15)]"
                        : "border-[#e5e1d8] bg-white text-[#727169] hover:bg-[#faf9f5]",
                    )}>
                    {filter.label}
                  </Button>
                ))}
              </div>
            </div>

            <div className="hidden grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3 sm:grid">
              {filteredWorks.map((work) => (
                <Card
                  key={work.id}
                  className="overflow-hidden rounded-[18px] border border-[#ebe6dc] bg-white py-0 shadow-none">
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={work.image}
                      alt={work.title}
                      className="h-full w-full object-cover"
                    />
                    <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0)_35%,rgba(0,0,0,0.42)_100%)]" />
                    <div
                      className={cn(
                        "absolute inset-x-0 top-0 flex items-center justify-between px-3 pt-3 text-white",
                        isRTL && "flex-row-reverse",
                      )}>
                      <Badge className="border-0 bg-white/15 text-white hover:bg-white/15">
                        {work.platform}
                      </Badge>
                      {work.type === "reels" ? (
                        <PlayCircle size={18} aria-hidden="true" />
                      ) : (
                        <ImageIcon size={18} aria-hidden="true" />
                      )}
                    </div>
                  </div>

                  <CardContent className="p-3">
                    <div
                      className={cn(
                        "flex items-center justify-between gap-2",
                        isRTL && "flex-row-reverse",
                      )}>
                      <p className="text-sm font-medium text-[#2c2c27]">
                        {work.title}
                      </p>
                      <div
                        className={cn(
                          "flex items-center gap-1 text-[#8a8880]",
                          isRTL && "flex-row-reverse",
                        )}>
                        <Heart size={13} aria-hidden="true" />
                        <span className="text-xs">{work.likes}</span>
                      </div>
                    </div>

                    <div className="mt-3 grid grid-cols-4 gap-2">
                      {Array.from({ length: 4 }).map((_, index) => (
                        <div
                          key={index}
                          className="h-14 overflow-hidden rounded-[10px] bg-[#f4f1ea]">
                          <img
                            src={work.image}
                            alt={work.title}
                            className="h-full w-full object-cover"
                          />
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="sm:hidden">
              <Card className="overflow-hidden rounded-[18px] border border-[#ebe6dc] bg-white py-0 shadow-none">
                <div className="relative h-44 overflow-hidden">
                  <img
                    src={activeWork.image}
                    alt={activeWork.title}
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0)_35%,rgba(0,0,0,0.42)_100%)]" />
                </div>

                <CardContent className="p-3">
                  <div
                    className={cn(
                      "flex items-center justify-between gap-2",
                      isRTL && "flex-row-reverse",
                    )}>
                    <p className="text-xs font-medium text-[#2c2c27]">
                      {activeWork.title}
                    </p>
                    <div
                      className={cn(
                        "flex items-center gap-1 text-[#8a8880]",
                        isRTL && "flex-row-reverse",
                      )}>
                      <Heart size={12} aria-hidden="true" />
                      <span className="text-[11px]">{activeWork.likes}</span>
                    </div>
                  </div>

                  <div className="mt-3 grid grid-cols-4 gap-2">
                    {Array.from({ length: 4 }).map((_, index) => (
                      <div
                        key={index}
                        className="h-12 overflow-hidden rounded-[8px] bg-[#f4f1ea]">
                        <img
                          src={activeWork.image}
                          alt={activeWork.title}
                          className="h-full w-full object-cover"
                        />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            <div
              className={cn(
                "mt-3 flex items-center justify-center gap-2 text-[#b8b6ae] sm:hidden",
                isRTL && "flex-row-reverse",
              )}>
              <Button
                type="button"
                size="icon-sm"
                variant="outline"
                onClick={() =>
                  setMobileWorkIndex((prev) =>
                    isRTL
                      ? (prev + 1) % filteredWorks.length
                      : prev <= 0
                        ? filteredWorks.length - 1
                        : prev - 1,
                  )
                }
                className="h-7 w-7 rounded-full border-[#e6e2d8] bg-white">
                {isRTL ? <ChevronRight size={12} /> : <ChevronLeft size={12} />}
              </Button>
              <div className="h-1.5 w-10 rounded-full bg-[rgba(111,66,193,0.3)]" />
              <Button
                type="button"
                size="icon-sm"
                variant="outline"
                onClick={() =>
                  setMobileWorkIndex((prev) =>
                    isRTL
                      ? prev <= 0
                        ? filteredWorks.length - 1
                        : prev - 1
                      : (prev + 1) % filteredWorks.length,
                  )
                }
                className="h-7 w-7 rounded-full border-[#e6e2d8] bg-white">
                {isRTL ? <ChevronLeft size={12} /> : <ChevronRight size={12} />}
              </Button>
            </div>
          </section>

          <section>
            <div className="mb-4 text-center">
              <h2 className="text-lg font-semibold text-[#252520] sm:text-xl">
                {t("influencerProfile.reviewsTitle")}
              </h2>
            </div>

            <div className="hidden grid-cols-1 gap-4 lg:grid-cols-3 sm:grid">
              {reviews.map((review) => (
                <Card
                  key={review.id}
                  className="rounded-[18px] border-0 bg-[rgba(26,20,37,1)] py-0 text-white shadow-[0_8px_24px_rgba(0,0,0,0.12)]">
                  <CardContent className="p-4">
                    <div className={isRTL ? "text-right" : "text-left"}>
                      <div
                        className={cn(
                          "flex items-center justify-between gap-3",
                          isRTL && "flex-row-reverse",
                        )}>
                        <span className="text-sm font-medium text-white/95">
                          {review.title}
                        </span>
                        <div
                          className={cn(
                            "flex items-center gap-1 text-[#d3b35f]",
                            isRTL && "flex-row-reverse",
                          )}>
                          <Star
                            size={13}
                            className="fill-current"
                            aria-hidden="true"
                          />
                          <span className="text-xs">4.8</span>
                        </div>
                      </div>

                      <div className="mt-4 space-y-2 text-sm text-white/80">
                        <p>{review.date}</p>
                        <p>{review.amount}</p>
                        <p className="text-[rgba(111,66,193,0.5)]">{review.status}</p>
                      </div>

                      <div
                        className={cn(
                          "mt-4 flex items-center gap-2 text-white/50",
                          isRTL
                            ? "flex-row-reverse justify-start"
                            : "justify-start",
                        )}>
                        <CalendarDays size={13} aria-hidden="true" />
                        <CircleDollarSign size={13} aria-hidden="true" />
                        <MessageCircleMore size={13} aria-hidden="true" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="-mx-2 flex gap-3 overflow-x-auto px-2 pb-1 sm:hidden">
              {reviews.map((review) => (
                <Card
                  key={review.id}
                  className="min-w-42 rounded-[16px] border-0 bg-[rgba(26,20,37,1)] py-0 text-white shadow-[0_8px_24px_rgba(0,0,0,0.12)]">
                  <CardContent className="p-3">
                    <div className={isRTL ? "text-right" : "text-left"}>
                      <div
                        className={cn(
                          "flex items-center justify-between gap-2",
                          isRTL && "flex-row-reverse",
                        )}>
                        <span className="text-[11px] font-medium text-white/95">
                          {review.title}
                        </span>
                        <div
                          className={cn(
                            "flex items-center gap-1 text-[#d3b35f]",
                            isRTL && "flex-row-reverse",
                          )}>
                          <Star
                            size={11}
                            className="fill-current"
                            aria-hidden="true"
                          />
                          <span className="text-[10px]">4.8</span>
                        </div>
                      </div>

                      <div className="mt-3 space-y-1.5 text-[11px] text-white/80">
                        <p>{review.date}</p>
                        <p>{review.amount}</p>
                        <p className="text-[rgba(111,66,193,0.5)]">{review.status}</p>
                      </div>

                      <div
                        className={cn(
                          "mt-3 flex items-center gap-2 text-white/50",
                          isRTL
                            ? "flex-row-reverse justify-start"
                            : "justify-start",
                        )}>
                        <CalendarDays size={11} aria-hidden="true" />
                        <CircleDollarSign size={11} aria-hidden="true" />
                        <MessageCircleMore size={11} aria-hidden="true" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        </div>
      </div>
    </section>
  );
}

export default InfluencerProfile;
