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

const fallbackImages = [inf1, inf2, inf3];

const isUsableImage = (value: unknown): value is string =>
  typeof value === "string" &&
  value.trim().length > 0 &&
  !value.includes("example.com");

const readString = (record: Record<string, unknown>, key: string) => {
  const value = record[key];
  return typeof value === "string" && value.trim() ? value : null;
};

const getProfile = (user: Record<string, unknown>) => {
  const profile = user.influencer_profile;
  return isRecord(profile) ? profile : null;
};

const getPlatformsLabel = (user: Record<string, unknown>) => {
  const platforms = user.platforms;

  if (!Array.isArray(platforms)) return null;

  const names = platforms
    .map((platform) => {
      if (!isRecord(platform)) return null;
      return readString(platform, "name");
    })
    .filter((name): name is string => !!name);

  return names.length ? names.join(" / ") : null;
};

const orderUsersByContentIds = (
  users: Record<string, unknown>[],
  infoContent: Record<string, unknown> | null | undefined,
) => {
  const userIds = infoContent?.user_ids;

  if (!Array.isArray(userIds)) return users;

  const order = new Map(
    userIds
      .filter((id): id is number => typeof id === "number")
      .map((id, index) => [id, index]),
  );

  return [...users].sort((a, b) => {
    const aId = typeof a.id === "number" ? a.id : null;
    const bId = typeof b.id === "number" ? b.id : null;
    const aOrder = aId !== null ? order.get(aId) : undefined;
    const bOrder = bId !== null ? order.get(bId) : undefined;

    return (
      (aOrder ?? Number.MAX_SAFE_INTEGER) - (bOrder ?? Number.MAX_SAFE_INTEGER)
    );
  });
};

function InfluencersSection({ data }: InfluencersSectionProps) {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.dir() === "rtl";
  const [isMobile, setIsMobile] = useState(
    typeof window !== "undefined" ? window.innerWidth < 768 : false,
  );

  const influencers = useMemo(() => {
    const apiUsers =
      data?.users?.filter((user): user is Record<string, unknown> =>
        isRecord(user),
      ) ?? [];

    const orderedApiUsers = orderUsersByContentIds(
      apiUsers,
      data?.info?.content,
    );

    const mappedApiUsers = orderedApiUsers.map((user, index) => {
      const profile = getProfile(user);
      const fameLevel = profile?.fame_level;
      const fameLevelName = isRecord(fameLevel)
        ? readString(fameLevel, "name")
        : null;
      const platformsLabel = getPlatformsLabel(user);
      const email = readString(user, "email");
      const name =
        typeof user.name === "string"
          ? user.name
          : t(`Influencers.items.${(index % 3) + 1}.name`);
      const image = isUsableImage(user.avatar)
        ? user.avatar
        : fallbackImages[index % fallbackImages.length];
      const followers =
        typeof user.followers === "string"
          ? user.followers
          : typeof user.followers_count === "number"
            ? `${user.followers_count}`
            : fameLevelName ||
              readString(profile ?? {}, "country") ||
              t(`Influencers.items.${(index % 3) + 1}.followers`);

      return {
        id: typeof user.id === "number" ? user.id : index + 1,
        image,
        name,
        handle:
          typeof user.username === "string"
            ? `@${user.username}`
            : typeof user.handle === "string"
              ? user.handle
              : email
                ? `@${email.split("@")[0]}`
                : t(`Influencers.items.${(index % 3) + 1}.handle`),
        category1:
          readString(profile ?? {}, "content_field") ||
          readString(user, "content_field") ||
          t(`Influencers.items.${(index % 3) + 1}.category1`),
        category2:
          platformsLabel ||
          fameLevelName ||
          (typeof user.type === "string"
            ? user.type
            : t(`Influencers.items.${(index % 3) + 1}.category2`)),
        followers,
        accent: "bg-[rgba(199,199,199,0.13)]",
      };
    });

    return mappedApiUsers.length
      ? mappedApiUsers
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
          {
            id: 7,
            image: inf3,
            name: t("Influencers.items.1.name"),
            handle: t("Influencers.items.1.handle"),
            category1: t("Influencers.items.1.category1"),
            category2: t("Influencers.items.1.category2"),
            followers: t("Influencers.items.1.followers"),
            accent: "bg-[rgba(199,199,199,0.13)]",
          },
          {
            id: 8,
            image: inf1,
            name: t("Influencers.items.2.name"),
            handle: t("Influencers.items.2.handle"),
            category1: t("Influencers.items.2.category1"),
            category2: t("Influencers.items.2.category2"),
            followers: t("Influencers.items.2.followers"),
            accent: "bg-[rgba(199,199,199,0.13)]",
          },
          {
            id: 9,
            image: inf2,
            name: t("Influencers.items.3.name"),
            handle: t("Influencers.items.3.handle"),
            category1: t("Influencers.items.3.category1"),
            category2: t("Influencers.items.3.category2"),
            followers: t("Influencers.items.3.followers"),
            accent: "bg-[rgba(199,199,199,0.13)]",
          },
        ];
  }, [data?.info?.content, data?.users, t]);

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
  const [currentPage, setCurrentPage] = useState(0);

  const visibleInfluencers = useMemo(() => {
    const start = currentPage * cardsPerPage;
    const end = start + cardsPerPage;
    return influencers.slice(start, end);
  }, [cardsPerPage, currentPage, influencers]);

  const goNext = () => {
    const pages = Math.ceil(influencers.length / cardsPerPage);
    setCurrentPage((prev) => (prev >= pages - 1 ? 0 : prev + 1));
  };

  const goPrev = () => {
    const pages = Math.ceil(influencers.length / cardsPerPage);
    setCurrentPage((prev) => (prev <= 0 ? pages - 1 : prev - 1));
  };

  const activeMobile = visibleInfluencers[0];

  return (
    <section
      dir={isRTL ? "rtl" : "ltr"}
      className="overflow-hidden bg-[#f3f3f3] px-4 py-4 md:py-15 mt-4">
      <div className="mx-auto max-w-6xl">
        <div className="mx-auto max-w-3xl text-center sm:p-7">
          <h2
            className={cn(
              "mx-auto max-w-[18rem] wrap-break-words text-center font-bold leading-tight text-[#2f2f2f] sm:max-w-md md:max-w-none",
              isRTL ? "text-2xl md:text-4xl" : "text-xl md:text-3xl",
            )}>
            {title}
          </h2>

          <p
            className={cn(
              "mx-auto mt-4 max-w-[20rem] wrap-break-words text-center leading-7 text-[#555] sm:max-w-lg md:max-w-none",
              isRTL
                ? "text-sm sm:text-base md:text-[19px]"
                : "text-xs sm:text-sm md:text-[16px]",
            )}>
            {description}
          </p>
        </div>

        <div className="relative mt-10">
          {/* Left arrow (Desktop only) */}
          <Button
            type="button"
            onClick={isRTL ? goNext : goPrev}
            variant="outline"
            size="icon"
            className="hidden absolute left-0 top-1/2 -translate-y-1/2 z-10 h-9 w-9 rounded-full border-gray-300 bg-white text-gray-500 shadow-sm hover:bg-gray-50 hover:text-gray-700 md:flex md:h-11 md:w-11"
            aria-label={isRTL ? t("Influencers.next") : t("Influencers.prev")}>
            <ChevronLeft size={18} />
          </Button>

          {/* Right arrow (Desktop only) */}
          <Button
            type="button"
            onClick={isRTL ? goPrev : goNext}
            variant="outline"
            size="icon"
            className="hidden absolute right-0 top-1/2 -translate-y-1/2 z-10 h-9 w-9 rounded-full border-gray-300 bg-white text-gray-500 shadow-sm hover:bg-gray-50 hover:text-gray-700 md:flex md:h-11 md:w-11"
            aria-label={isRTL ? t("Influencers.prev") : t("Influencers.next")}>
            <ChevronRight size={18} />
          </Button>

          <div className="px-10 md:px-14">
            <div className="relative md:hidden">
              {activeMobile ? (
                <>
                  <div className="relative mx-auto flex items-center justify-center overflow-hidden py-2">
                    <Card className="relative w-full max-w-[18rem] overflow-hidden rounded-[18px] border-0 bg-[rgba(143,134,172,0.04)] py-0 shadow-[0_8px_24px_rgba(0,0,0,0.06)]">
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
                          className="mx-auto aspect-3/4 w-full object-cover max-h-56"
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
                  </div>

                  {/* Mobile Arrows Centered Below Cards */}
                  <div
                    className="mt-6 flex items-center justify-center gap-4"
                    dir="ltr">
                    <Button
                      type="button"
                      onClick={isRTL ? goNext : goPrev}
                      variant="outline"
                      size="icon"
                      className="h-9 w-9 rounded-full border border-gray-400 bg-transparent text-gray-500 hover:bg-gray-100 shadow-sm">
                      <ChevronLeft size={16} />
                    </Button>
                    <Button
                      type="button"
                      onClick={isRTL ? goPrev : goNext}
                      variant="outline"
                      size="icon"
                      className="h-9 w-9 rounded-full border border-gray-400 bg-transparent text-gray-500 hover:bg-gray-100 shadow-sm">
                      <ChevronRight size={16} />
                    </Button>
                  </div>
                </>
              ) : null}
            </div>

            <div className="hidden md:grid md:grid-cols-2 md:gap-8 lg:grid-cols-3">
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
                      className="mx-auto aspect-3/4 w-full object-cover max-h-48"
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
          </div>
        </div>
      </div>
    </section>
  );
}

export default InfluencersSection;
