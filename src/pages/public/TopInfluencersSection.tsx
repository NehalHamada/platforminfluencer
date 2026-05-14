import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
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

const getImageUrl = (value: unknown): string | null => {
  if (typeof value !== "string" || value.trim().length === 0) return null;
  const url = value.trim();
  if (url.startsWith("http")) return url;
  return `https://influplatformapi.idealfuture.sa${url.startsWith("/") ? "" : "/"}${url}`;
};

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
        ? (order.get(aId) ?? Number.MAX_SAFE_INTEGER)
        : Number.MAX_SAFE_INTEGER;
    const bOrder =
      bId !== null
        ? (order.get(bId) ?? Number.MAX_SAFE_INTEGER)
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
  const apiInfluencers = orderUsersByContentIds(
    apiUsers,
    data?.info?.content,
  ).map((user, index) => {
    const profile = getProfile(user);
    const fameLevel = profile?.fame_level;
    const fameLevelName = isRecord(fameLevel)
      ? readString(fameLevel, "name")
      : null;
    return {
      id: typeof user.id === "number" ? user.id : index + 1,
      image:
        getImageUrl(user.avatar) ||
        fallbackImages[index % fallbackImages.length],
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
    <section
      dir={isRTL ? "rtl" : "ltr"}
      className="font-ibm-plex bg-[#fafafa] px-4 py-12 md:py-20">
      <div className="mx-auto max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="mx-auto max-w-3xl text-center">
          <h2
            className={cn(
              "mx-auto wrap-break-words text-center font-bold text-[#202020]",
              isRTL ? "text-2xl md:text-[32px]" : "text-xl md:text-[26px]",
            )}>
            {title}
          </h2>

          <p
            className={cn(
              "mx-auto mt-4 wrap-break-words text-center font-medium leading-[1.75] text-[#606060]",
              isRTL ? "text-lg md:text-[20px]" : "text-base md:text-[16px]",
            )}>
            {description}
          </p>
        </motion.div>

        {/* Mobile Carousel */}
        <div className="mt-14 md:hidden">
          <Card className="mx-auto w-full max-w-[20rem] overflow-visible rounded-[18px] border-0 bg-transparent py-0 shadow-none ring-0">
            <div className="pt-12">
              <div className="relative aspect-4/3 w-full rounded-[14px] bg-[#f5f4f0]">
                <img
                  src={activeInfluencer.image}
                  alt={activeInfluencer.name}
                  className="absolute bottom-0 left-1/2 h-[125%] w-auto -translate-x-1/2 object-contain object-bottom drop-shadow-md"
                />
              </div>
            </div>

            <CardContent className="mt-3 p-0">
              <div className="flex flex-col rounded-[12px] bg-[#efeee9] px-4 py-3">
                <div className="text-start text-[15px] font-bold text-[#222]">
                  {activeInfluencer.name}
                </div>

                <div className="mt-2 flex flex-row items-center justify-between">
                  <div className="text-start text-[14px] font-medium text-[#7a7a7a]">
                    {activeInfluencer.followers}
                  </div>
                  <div className="flex flex-row items-center gap-1.5">
                    <div className="flex h-7 w-7 items-center justify-center rounded-[6px] border border-[#dadaca] bg-transparent text-[#9b9b9b]">
                      <FaInstagram size={14} aria-hidden="true" />
                    </div>
                    <div className="flex h-7 w-7 items-center justify-center rounded-[6px] border border-[#dadaca] bg-transparent text-[#9b9b9b]">
                      <FaTiktok size={14} aria-hidden="true" />
                    </div>
                  </div>
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
              <ChevronLeft size={16} />
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
              <ChevronRight size={16} />
            </Button>
          </div>
        </div>

        {/* Desktop Grid */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.1 } } }}
          className="hidden mt-16 md:grid md:grid-cols-3 md:gap-5">
          {influencers.map((item) => (
            <motion.div
              key={item.id}
              variants={{
                hidden: { opacity: 0, y: 30, scale: 0.96 },
                visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] } }
              }}>
            <Card
              className="mx-auto w-full max-w-[18rem] overflow-visible rounded-[18px] border-0 bg-transparent py-0 shadow-none ring-0 md:max-w-none">
              <div className="pt-12 lg:pt-16">
                <div className="relative aspect-4/3 w-full rounded-[14px] bg-[#f5f4f0]">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="absolute bottom-0 left-1/2 h-[125%] w-auto -translate-x-1/2 object-contain object-bottom drop-shadow-md"
                  />
                </div>
              </div>

              <CardContent className="mt-3 p-0">
                <div className="flex flex-col rounded-[12px] bg-[#efeee9] px-4 py-3">
                  <div className="text-start text-[14px] lg:text-[15px] font-bold text-[#222]">
                    {item.name}
                  </div>

                  <div className="mt-2 flex flex-row items-center justify-between">
                    <div className="text-start text-[13px] lg:text-[14px] font-medium text-[#7a7a7a]">
                      {item.followers}
                    </div>
                    <div className="flex flex-row items-center gap-1.5">
                      <div className="flex h-6 w-6 lg:h-7 lg:w-7 items-center justify-center rounded-[6px] border border-[#d2d2c5] bg-transparent text-[#9b9b9b] transition-colors hover:border-[#b7c58d]">
                        <FaInstagram size={13} aria-hidden="true" />
                      </div>
                      <div className="flex h-6 w-6 lg:h-7 lg:w-7 items-center justify-center rounded-[6px] border border-[#d2d2c5] bg-transparent text-[#9b9b9b] transition-colors hover:border-[#b7c58d]">
                        <FaTiktok size={13} aria-hidden="true" />
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

export default TopInfluencersSection;
