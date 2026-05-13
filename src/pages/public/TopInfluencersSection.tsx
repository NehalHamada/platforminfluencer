import { Button } from "@/components/ui/Button";
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { FaInstagram, FaTiktok } from "react-icons/fa";
import inf1 from "/assets/tImg1.png";
import inf2 from "/assets/tImg2.png";
import inf3 from "/assets/tImg3.png";
import type { LandingCollection } from "@/types/landing.types";
import { isRecord, sectionText } from "@/utils/landing";

type TopInfluencersSectionProps = {
  data?: LandingCollection | null;
};

const fallbackImages = [inf1, inf2, inf3];

const isUsableImage = (value: unknown): value is string =>
  typeof value === "string" &&
  value.trim().length > 0 &&
  !value.includes("example.com");

const readString = (record: Record<string, unknown> | null, key: string) => {
  const value = record?.[key];
  return typeof value === "string" && value.trim() ? value : null;
};

const getProfile = (user: Record<string, unknown>) => {
  const profile = user.influencer_profile;
  return isRecord(profile) ? profile : null;
};

const orderUsersByContentIds = (
  users: Record<string, unknown>[],
  content: Record<string, unknown> | null | undefined,
) => {
  const userIds = content?.user_ids;
  if (!Array.isArray(userIds)) return users;

  const order = new Map(
    userIds
      .filter((id): id is number => typeof id === "number")
      .map((id, index) => [id, index]),
  );

  return [...users].sort((a, b) => {
    const aId = typeof a.id === "number" ? a.id : null;
    const bId = typeof b.id === "number" ? b.id : null;
    const aOrder =
      aId !== null
        ? order.get(aId) ?? Number.MAX_SAFE_INTEGER
        : Number.MAX_SAFE_INTEGER;
    const bOrder =
      bId !== null
        ? order.get(bId) ?? Number.MAX_SAFE_INTEGER
        : Number.MAX_SAFE_INTEGER;

    return aOrder - bOrder;
  });
};

function TopInfluencersSection({ data }: TopInfluencersSectionProps) {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.dir() === "rtl";
  const [currentIndex, setCurrentIndex] = useState(0);

  const apiUsers =
    data?.users?.filter((user): user is Record<string, unknown> =>
      isRecord(user),
    ) ?? [];
  const apiInfluencers =
    orderUsersByContentIds(apiUsers, data?.info?.content)
      .map((user, index) => {
        const profile = getProfile(user);
        const fameLevel = profile?.fame_level;
        const fameLevelName = isRecord(fameLevel)
          ? readString(fameLevel, "name")
          : null;
        return {
          id: typeof user.id === "number" ? user.id : index + 1,
          image: isUsableImage(user.avatar)
            ? user.avatar
            : fallbackImages[index % fallbackImages.length],
          name:
            typeof user.name === "string"
              ? user.name
              : t(`topInfluencers2.items.${(index % 3) + 1}.name`),
          followers:
            typeof user.followers === "string"
              ? user.followers
              : typeof user.followers_count === "number"
                ? `${user.followers_count}`
                : fameLevelName ||
                  readString(profile, "content_field") ||
                  t(`topInfluencers2.items.${(index % 3) + 1}.followers`),
        };
      });

  const influencers = apiInfluencers.length
    ? apiInfluencers
    : [
    {
      id: 1,
      image: inf1,
      name: t("topInfluencers2.items.1.name"),
      followers: t("topInfluencers2.items.1.followers"),
    },
    {
      id: 2,
      image: inf2,
      name: t("topInfluencers2.items.2.name"),
      followers: t("topInfluencers2.items.2.followers"),
    },
    {
      id: 3,
      image: inf3,
      name: t("topInfluencers2.items.3.name"),
      followers: t("topInfluencers2.items.3.followers"),
    },
  ];
  const title = sectionText(
    data?.info,
    "title",
    t("topInfluencers2.title"),
    isRTL,
  );
  const description = sectionText(
    data?.info,
    "description",
    t("topInfluencers2.desc"),
    isRTL,
  );

  const goPrev = () => {
    setCurrentIndex((prev) => (prev <= 0 ? influencers.length - 1 : prev - 1));
  };

  const goNext = () => {
    setCurrentIndex((prev) => (prev + 1) % influencers.length);
  };

  const activeInfluencer = influencers[currentIndex];

  return (
    <section dir={isRTL ? "rtl" : "ltr"} className="px-4 py-10 md:py-14">
      <div className="mx-auto max-w-6xl">
        <div className="mx-auto max-w-4xl text-center">
          <h2
            className={cn(
              "mx-auto max-w-[18rem] wrap-break-words text-center font-bold text-[#202020] sm:max-w-md md:max-w-none",
              isRTL ? "text-2xl md:text-[32px]" : "text-xl md:text-[26px]",
            )}>
            {title}
          </h2>

          <p
            className={cn(
              "mx-auto mt-4 max-w-[20rem] wrap-break-words text-center font-semibold leading-[1.75] text-[#383838] sm:max-w-136 md:max-w-none",
              isRTL ? "text-lg md:text-[28px]" : "text-base md:text-[22px]",
            )}>
            {description}
          </p>
        </div>

        <div className="mt-10 md:hidden">
          <Card className="mx-auto w-full max-w-[24rem] rounded-[18px] bg-transparent py-0 shadow-none">
            <div className="overflow-hidden rounded-[18px] bg-[#efefeb]">
              <img
                src={activeInfluencer.image}
                alt={activeInfluencer.name}
                className="mx-auto aspect-[4/5] w-full object-cover"
              />
            </div>

            <CardContent className="mt-4 rounded-[16px] bg-[#ececea] px-4 py-4">
              <div
                className={cn(
                  "flex items-end justify-between gap-3",
                  isRTL && "flex-row-reverse",
                )}>
                <div
                  className={cn(
                    "flex items-center gap-2",
                    isRTL && "flex-row-reverse",
                  )}>
                  <div className="flex h-7 w-7 items-center justify-center rounded bg-[#d8d8d8] text-[#9b9b9b]">
                    <FaInstagram size={13} aria-hidden="true" />
                  </div>
                  <div className="flex h-7 w-7 items-center justify-center rounded bg-[#d8d8d8] text-[#9b9b9b]">
                    <FaTiktok size={13} aria-hidden="true" />
                  </div>
                </div>

                <div className={cn("text-right", !isRTL && "text-left")}>
                  <CardTitle className="text-[18px] font-medium text-[#2a2a2a]">
                    {activeInfluencer.name}
                  </CardTitle>
                  <CardDescription className="mt-1 text-[16px] text-[#6f6f6f]">
                    {activeInfluencer.followers}
                  </CardDescription>
                </div>
              </div>
            </CardContent>
          </Card>

          <div
            className={cn(
              "mt-8 flex items-center justify-center gap-4",
              isRTL && "flex-row-reverse",
            )}>
            <Button
              type="button"
              size="icon-sm"
              variant="outline"
              onClick={isRTL ? goNext : goPrev}
              aria-label={isRTL ? t("Influencers.next") : t("Influencers.prev")}
              className="h-8 w-8 rounded-full border-[#98a77e] text-[#7d8b65] hover:bg-white">
              {isRTL ? <ChevronLeft size={16} /> : <ChevronLeft size={16} />}
            </Button>

            <div className="flex items-center gap-2">
              {influencers.map((_, index) => (
                <Button
                  key={index}
                  type="button"
                  size="icon-xs"
                  variant="ghost"
                  onClick={() => setCurrentIndex(index)}
                  aria-label={`Go to slide ${index + 1}`}
                  aria-pressed={currentIndex === index}
                  className={cn(
                    "rounded-full p-0 transition-all duration-300 hover:bg-transparent",
                    currentIndex === index
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
              onClick={isRTL ? goPrev : goNext}
              aria-label={isRTL ? t("Influencers.prev") : t("Influencers.next")}
              className="h-8 w-8 rounded-full border-[#98a77e] text-[#7d8b65] hover:bg-white">
              {isRTL ? <ChevronRight size={16} /> : <ChevronRight size={16} />}
            </Button>
          </div>
        </div>

        <div className="hidden md:grid md:grid-cols-3 md:gap-4">
          {influencers.map((item) => (
            <Card
              key={item.id}
              className="mx-auto w-full max-w-[18rem] rounded-[18px] bg-transparent py-0 shadow-none md:max-w-none">
              <div className="overflow-hidden rounded-[14px] bg-[#e8e8e5]">
                <img
                  src={item.image}
                  alt={item.name}
                  className="mx-auto aspect-[4/5] w-full object-cover md:px-8"
                />
              </div>

              <CardContent
                className={cn(
                  "mt-3 rounded-[12px] bg-[#e9e9e7] px-4 py-3 text-center",
                  isRTL ? "md:text-right" : "md:text-left",
                )}>
                <div
                  className={cn(
                    "flex flex-col items-center justify-center gap-3 md:flex-row md:items-center md:justify-between",
                    isRTL ? "md:flex-row-reverse" : "md:flex-row",
                  )}>
                  <div
                    className={cn(
                      "flex items-center gap-2",
                      isRTL ? "md:order-2" : "md:order-1",
                    )}>
                    <div className="flex h-6 w-6 items-center justify-center rounded bg-[#d8d8d8] text-[#9b9b9b]">
                      <FaInstagram size={12} aria-hidden="true" />
                    </div>
                    <div className="flex h-6 w-6 items-center justify-center rounded bg-[#d8d8d8] text-[#9b9b9b]">
                      <FaTiktok size={12} aria-hidden="true" />
                    </div>
                  </div>

                  <div
                    className={cn(
                      "text-center",
                      isRTL
                        ? "md:order-1 md:text-left"
                        : "md:order-2 md:text-right",
                    )}>
                    <CardTitle className="text-[18px] font-medium text-[#2a2a2a]">
                      {item.name}
                    </CardTitle>
                    <CardDescription className="mt-1 text-[16px] text-[#6f6f6f]">
                      {item.followers}
                    </CardDescription>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

export default TopInfluencersSection;
