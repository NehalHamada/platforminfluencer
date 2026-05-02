import { Button } from "@/components/ui/Button";
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight, Music2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { FaFacebook, FaInstagram } from "react-icons/fa";
import inf1 from "/assets/infImg1.png";
import inf2 from "/assets/infImg2.png";
import inf3 from "/assets/infImg3.png";
import type { LandingCollection } from "@/types/landing.types";
import { isRecord, sectionText } from "@/utils/landing";

type InfluencersSectionProps = {
  data?: LandingCollection | null;
};

function InfluencersSection({ data }: InfluencersSectionProps) {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.dir() === "rtl";
  const [isMobile, setIsMobile] = useState(
    typeof window !== "undefined" ? window.innerWidth < 768 : false,
  );

  const influencers = useMemo(() => {
    const apiUsers =
      data?.users
        ?.map((user, index) => {
          if (!isRecord(user)) return null;
          const name =
            typeof user.name === "string"
              ? user.name
              : t(`Influencers.items.${(index % 3) + 1}.name`);
          const image = [inf1, inf2, inf3][index % 3];
          const followers =
            typeof user.followers === "string"
              ? user.followers
              : typeof user.followers_count === "number"
                ? `${user.followers_count}`
                : t(`Influencers.items.${(index % 3) + 1}.followers`);

          return {
            id: typeof user.id === "number" ? user.id : index + 1,
            image,
            name,
            handle:
              typeof user.username === "string"
                ? `@${user.username}`
                : typeof user.handle === "string"
                  ? user.handle
                  : t(`Influencers.items.${(index % 3) + 1}.handle`),
            category1:
              typeof user.content_field === "string"
                ? user.content_field
                : t(`Influencers.items.${(index % 3) + 1}.category1`),
            category2:
              typeof user.type === "string"
                ? user.type
                : t(`Influencers.items.${(index % 3) + 1}.category2`),
            followers,
            accent: "bg-[rgba(199,199,199,0.13)]",
          };
        })
        .filter((user): user is NonNullable<typeof user> => !!user) ?? [];

    return apiUsers.length
      ? apiUsers
      : [
      {
        id: 1,
        image: inf1,
        name: t("Influencers.items.1.name"),
        handle: t("Influencers.items.1.handle"),
        category1: t("Influencers.items.1.category1"),
        category2: t("Influencers.items.1.category2"),
        followers: t("Influencers.items.1.followers"),
        accent: "bg-[rgba(199,199,199,0.13)]",
      },
      {
        id: 2,
        image: inf2,
        name: t("Influencers.items.2.name"),
        handle: t("Influencers.items.2.handle"),
        category1: t("Influencers.items.2.category1"),
        category2: t("Influencers.items.2.category2"),
        followers: t("Influencers.items.2.followers"),
        accent: "bg-[rgba(199,199,199,0.13)]",
      },
      {
        id: 3,
        image: inf3,
        name: t("Influencers.items.3.name"),
        handle: t("Influencers.items.3.handle"),
        category1: t("Influencers.items.3.category1"),
        category2: t("Influencers.items.3.category2"),
        followers: t("Influencers.items.3.followers"),
        accent: "bg-[rgba(199,199,199,0.13)]",
      },
      {
        id: 4,
        image: inf2,
        name: t("Influencers.items.1.name"),
        handle: t("Influencers.items.1.handle"),
        category1: t("Influencers.items.1.category1"),
        category2: t("Influencers.items.1.category2"),
        followers: t("Influencers.items.1.followers"),
        accent: "bg-[rgba(199,199,199,0.13)]",
      },
      {
        id: 5,
        image: inf3,
        name: t("Influencers.items.2.name"),
        handle: t("Influencers.items.2.handle"),
        category1: t("Influencers.items.2.category1"),
        category2: t("Influencers.items.2.category2"),
        followers: t("Influencers.items.2.followers"),
        accent: "bg-[rgba(199,199,199,0.13)]",
      },
      {
        id: 6,
        image: inf1,
        name: t("Influencers.items.3.name"),
        handle: t("Influencers.items.3.handle"),
        category1: t("Influencers.items.3.category1"),
        category2: t("Influencers.items.3.category2"),
        followers: t("Influencers.items.3.followers"),
        accent: "bg-[rgba(199,199,199,0.13)]",
      },
    ];
  }, [data?.users, t]);

  const title = sectionText(data?.info, "title", t("Influencers.title"), isRTL);
  const description = sectionText(
    data?.info,
    "description",
    t("Influencers.desc"),
    isRTL,
  );

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const cardsPerPage = isMobile ? 1 : 3;
  const totalPages = Math.ceil(influencers.length / cardsPerPage);
  const [currentPage, setCurrentPage] = useState(0);

  const visibleInfluencers = useMemo(() => {
    const start = currentPage * cardsPerPage;
    const end = start + cardsPerPage;
    return influencers.slice(start, end);
  }, [cardsPerPage, currentPage, influencers]);

  const goNext = () => {
    setCurrentPage((prev) => {
      if (prev >= totalPages - 1) return 0;
      return prev + 1;
    });
  };

  const goPrev = () => {
    setCurrentPage((prev) => {
      if (prev <= 0) return totalPages - 1;
      return prev - 1;
    });
  };

  const activeMobile = visibleInfluencers[0];
  const previousMobile =
    influencers[currentPage <= 0 ? influencers.length - 1 : currentPage - 1];
  const nextMobile =
    influencers[currentPage >= influencers.length - 1 ? 0 : currentPage + 1];

  return (
    <section
      dir={isRTL ? "rtl" : "ltr"}
      className="overflow-hidden bg-[#f3f3f3] px-4 py-12 md:py-16">
      <div className="mx-auto max-w-6xl">
        <div className="mx-auto max-w-3xl text-center sm:p-7">
          <h2 className="mx-auto max-w-[18rem] wrap-break-words text-center text-3xl font-bold leading-tight text-[#2f2f2f] sm:max-w-md md:max-w-none md:text-5xl">
            {title}
          </h2>

          <p className="mx-auto mt-4 max-w-[20rem] wrap-break-words text-center text-base leading-8 text-[#555] sm:max-w-lg sm:text-lg md:max-w-none md:text-[22px]">
            {description}
          </p>
        </div>

        <div className="mt-10">
          <div className="relative md:hidden">
            {activeMobile ? (
              <div className="relative mx-auto flex max-w-88 items-center justify-center overflow-hidden">
                <Card className="absolute -left-21 top-1/2 h-68 w-34 -translate-y-1/2 overflow-hidden rounded-[20px] border-0 bg-[rgba(143,134,172,0.04)] py-0 opacity-90 shadow-none">
                  <img
                    src={isRTL ? nextMobile.image : previousMobile.image}
                    alt={isRTL ? nextMobile.name : previousMobile.name}
                    className="h-full w-full object-cover"
                  />
                </Card>

                <Card className="relative z-10 w-full max-w-[16rem] overflow-hidden rounded-[18px] border-0 bg-[rgba(143,134,172,0.04)] py-0 shadow-[0_8px_24px_rgba(0,0,0,0.06)]">
                  <CardContent className="px-3 pt-3 pb-0">
                    <CardTitle className="text-[14px] font-semibold text-[rgba(167,183,142,1)]">
                      {activeMobile.name}
                    </CardTitle>

                    <CardDescription className="mt-1 text-[12px] text-[rgba(98,98,98,1)]">
                      {activeMobile.handle}
                    </CardDescription>

                    <div className="mt-2 flex flex-wrap gap-1">
                      <span className="rounded bg-[rgba(216,216,216,0.2)] px-2 py-1 text-[10px] text-[rgba(98,98,98,1)]">
                        {activeMobile.category1}
                      </span>

                      <span className="rounded bg-[rgba(216,216,216,0.2)] px-2 py-1 text-[10px] text-[rgba(98,98,98,1)]">
                        {activeMobile.category2}
                      </span>
                    </div>
                  </CardContent>

                  <div
                    className={cn(
                      "absolute top-21 z-10 flex flex-col gap-2",
                      isRTL ? "left-2" : "right-2",
                    )}>
                    <div className="flex h-5 w-5 items-center justify-center rounded bg-white/80 text-[#c2c2c2]">
                      <FaInstagram size={12} aria-hidden="true" />
                    </div>

                    <div className="flex h-5 w-5 items-center justify-center rounded bg-white/80 text-[#c2c2c2]">
                      <FaFacebook size={12} aria-hidden="true" />
                    </div>

                    <div className="flex h-5 w-5 items-center justify-center rounded bg-white/80 text-[#c2c2c2]">
                      <Music2 size={12} aria-hidden="true" />
                    </div>
                  </div>

                  <div className="mt-2">
                    <img
                      src={activeMobile.image}
                      alt={activeMobile.name}
                      className="mx-auto h-80 w-full object-cover"
                    />
                  </div>

                  <div
                    className={cn(
                      "absolute bottom-0 left-0 right-0 px-3 py-2 text-center text-[12px] text-[rgba(222,212,255,1)]",
                      activeMobile.accent,
                    )}>
                    {activeMobile.followers}
                  </div>
                </Card>

                <Card className="absolute -right-21 top-1/2 h-68 w-34 -translate-y-1/2 overflow-hidden rounded-[20px] border-0 bg-[rgba(143,134,172,0.04)] py-0 opacity-90 shadow-none">
                  <img
                    src={isRTL ? previousMobile.image : nextMobile.image}
                    alt={isRTL ? previousMobile.name : nextMobile.name}
                    className="h-full w-full object-cover"
                  />
                </Card>
              </div>
            ) : null}
          </div>

          <div className="hidden md:grid md:grid-cols-2 md:gap-5 lg:grid-cols-3">
            {visibleInfluencers.map((item) => (
              <Card
                key={item.id}
                className="relative mx-auto w-full max-w-[16rem] overflow-hidden rounded-[16px] border-0 bg-[rgba(143,134,172,0.04)] py-0 shadow-[0_8px_24px_rgba(0,0,0,0.06)] sm:max-w-none">
                <CardContent className="px-3 pt-3 pb-0">
                  <CardTitle className="text-[14px] font-semibold text-[rgba(167,183,142,1)]">
                    {item.name}
                  </CardTitle>

                  <CardDescription className="mt-1 text-[12px] text-[rgba(98,98,98,1)]">
                    {item.handle}
                  </CardDescription>

                  <div className="mt-2 flex flex-wrap gap-1">
                    <span className="rounded bg-[rgba(216,216,216,0.2)] px-2 py-1 text-[10px] text-[rgba(98,98,98,1)]">
                      {item.category1}
                    </span>

                    <span className="rounded bg-[rgba(216,216,216,0.2)] px-2 py-1 text-[10px] text-[rgba(98,98,98,1)]">
                      {item.category2}
                    </span>
                  </div>
                </CardContent>

                <div
                  className={cn(
                    "absolute top-21 z-10 flex flex-col gap-2",
                    isRTL ? "left-2" : "right-2",
                  )}>
                  <div className="flex h-5 w-5 items-center justify-center rounded bg-white/80 text-[#c2c2c2]">
                    <FaInstagram size={12} aria-hidden="true" />
                  </div>

                  <div className="flex h-5 w-5 items-center justify-center rounded bg-white/80 text-[#c2c2c2]">
                    <FaFacebook size={12} aria-hidden="true" />
                  </div>

                  <div className="flex h-5 w-5 items-center justify-center rounded bg-white/80 text-[#c2c2c2]">
                    <Music2 size={12} aria-hidden="true" />
                  </div>
                </div>

                <div className="mt-2">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="mx-auto h-80 object-cover sm:h-70 md:h-65 md:w-full md:pl-30 md:pr-30"
                  />
                </div>

                <div
                  className={cn(
                    "absolute bottom-0 left-0 right-0 px-3 py-2 text-center text-[12px] text-[rgba(222,212,255,1)]",
                    item.accent,
                  )}>
                  {item.followers}
                </div>
              </Card>
            ))}
          </div>

          <div className="mt-8 flex items-center justify-center gap-3 md:justify-between">
            <Button
              type="button"
              onClick={isRTL ? goNext : goPrev}
              variant="outline"
              size="icon"
              className="h-8 w-8 shrink-0 rounded-full border-[#98a77e] text-[#7d8b65] hover:bg-white md:h-10 md:w-10 md:border-[#a7a3c9] md:text-[#7d79a8]"
              aria-label={
                isRTL ? t("Influencers.next") : t("Influencers.prev")
              }>
              {isRTL ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
            </Button>

            <Button
              type="button"
              onClick={isRTL ? goPrev : goNext}
              variant="outline"
              size="icon"
              className="h-8 w-8 shrink-0 rounded-full border-[#98a77e] text-[#7d8b65] hover:bg-white md:h-10 md:w-10 md:border-[#a7a3c9] md:text-[#7d79a8]"
              aria-label={
                isRTL ? t("Influencers.prev") : t("Influencers.next")
              }>
              {isRTL ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}

export default InfluencersSection;
