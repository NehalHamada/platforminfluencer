import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import hero from "/assets/Hero.png";
import bellImg from "/assets/bell.png";
import facebookImg from "/assets/facebook.png";
import giftImg from "/assets/popImg.png";
import instagramImg from "/assets/instagram.png";
import chatImg from "/assets/icon1.png";
import twitterImg from "/assets/twitter.png";
import us1 from "/assets/huser1.png";
import us2 from "/assets/huser2.png";
import us3 from "/assets/huser3.png";
import us4 from "/assets/huser4.png";
import us5 from "/assets/huser5.png";
import type { LandingSection } from "@/types/landing.types";
import { sectionText } from "@/utils/landing";

const communityImages = [us1, us2, us3, us4, us5];

const assetByIconKey = {
  "icon-ig": instagramImg,
  "icon-tt": twitterImg,
  "icon-yt": giftImg,
  "icon-fb": facebookImg,
  "icon-sc": chatImg,
  instagram: instagramImg,
  tiktok: twitterImg,
  youtube: giftImg,
  facebook: facebookImg,
  snapchat: chatImg,
} as const;

const defaultFloatingIconKeys = [
  "icon-ig",
  "bell",
  "icon-tt",
  "icon-fb",
  "icon-sc",
  "icon-yt",
] as const;

type FloatingIconKey =
  | keyof typeof assetByIconKey
  | (typeof defaultFloatingIconKeys)[number];

const isUsableImageUrl = (value: unknown): value is string =>
  typeof value === "string" &&
  value.trim().length > 0 &&
  !value.includes("example.com");

const getContentImages = (content: LandingSection["content"]) => {
  const images = content?.images;

  if (!Array.isArray(images)) return [];

  return images.filter(isUsableImageUrl);
};

const getContentIcons = (
  content: LandingSection["content"],
): FloatingIconKey[] => {
  const icons = content?.icons;

  if (!Array.isArray(icons)) return [...defaultFloatingIconKeys];

  const validIcons = icons.filter(
    (icon): icon is keyof typeof assetByIconKey =>
      typeof icon === "string" && icon in assetByIconKey,
  );

  if (!validIcons.length) return [...defaultFloatingIconKeys];

  return [
    validIcons[0] ?? "icon-ig",
    "bell",
    validIcons[1] ?? "icon-tt",
    validIcons[2] ?? "icon-fb",
    validIcons[3] ?? "icon-sc",
    validIcons[4] ?? "icon-yt",
  ];
};

const floatingAssets = [
  {
    id: "icon-ig",
    y: [0, -20, 0],
    duration: 4,
    pos: {
      mobile: "left-[7%] top-[31%] w-12",
      arabic: "left-[2%] top-[25%] w-24 xl:left-[3%] xl:top-[22%] xl:w-28",
      english: "right-[2%] top-[25%] w-24 xl:right-[3%] xl:top-[22%] xl:w-28",
    },
  },
  {
    id: "bell",
    y: [0, 15, 0],
    duration: 5,
    pos: {
      mobile: "left-[31%] top-[31%] w-12",
      arabic: "left-[15%] top-[18%] w-20 xl:left-[18%] xl:top-[16%] xl:w-24",
      english: "right-[15%] top-[18%] w-20 xl:right-[18%] xl:top-[16%] xl:w-24",
    },
  },
  {
    id: "icon-tt",
    y: [0, -15, 0],
    duration: 4.5,
    pos: {
      mobile: "left-[17%] top-[38%] w-12",
      arabic: "left-[4%] top-[45%] w-22 xl:left-[6%] xl:top-[42%] xl:w-26",
      english: "right-[4%] top-[45%] w-22 xl:right-[6%] xl:top-[42%] xl:w-26",
    },
  },
  {
    id: "icon-fb",
    y: [0, 12, 0],
    duration: 6,
    pos: {
      mobile: "left-[42%] top-[40%] w-10",
      arabic: "left-[16%] top-[55%] w-16 xl:left-[18%] xl:top-[52%] xl:w-20",
      english: "right-[16%] top-[55%] w-16 xl:right-[18%] xl:top-[52%] xl:w-20",
    },
  },
  {
    id: "icon-sc",
    y: [0, -10, 0],
    duration: 5.5,
    pos: {
      mobile: "left-[25%] top-[49%] w-10",
      arabic:
        "left-[12%] bottom-[15%] w-20 xl:left-[14%] xl:bottom-[12%] xl:w-24",
      english:
        "right-[12%] bottom-[15%] w-20 xl:right-[14%] xl:bottom-[12%] xl:w-24",
    },
  },
  {
    id: "icon-yt",
    y: [0, 10, 0],
    duration: 7,
    pos: {
      mobile: "left-[22%] top-[54%] w-13",
      arabic: "left-[3%] bottom-[8%] w-24 xl:left-[5%] xl:bottom-[5%] xl:w-28",
      english:
        "right-[3%] bottom-[8%] w-24 xl:right-[5%] xl:bottom-[5%] xl:w-28",
    },
  },
];

type HeroProps = {
  data: LandingSection;
};

const renderHighlightedTitle = (title: string, isArabic: boolean) => {
  const parts = isArabic
    ? [
        { text: "متخصصين في ربط ", highlight: false },
        { text: "العلامات التجارية", highlight: true },
        { text: "\nبالمؤثرين لتنفيذ حملات تسويقية", highlight: true },
        { text: "\nرقمية مؤثرة", highlight: false },
      ]
    : [
        { text: "Specialists in ", highlight: false },
        { text: "Connecting Brands", highlight: true },
        { text: "\nwith Influencers", highlight: false },
        { text: " to execute", highlight: false },
        { text: "\nImpactful Campaigns", highlight: true },
      ];

  const canUseDesignedCopy = isArabic
    ? title.includes("العلامات") || title.includes("المؤثر")
    : title.toLowerCase().includes("connecting");

  if (!canUseDesignedCopy) return title;

  return parts.map((part, index) =>
    part.text === "\n" || part.text.startsWith("\n") ? (
      <span key={index}>
        <br />
        {part.text.replace("\n", "")}
      </span>
    ) : (
      <span
        key={index}
        className={part.highlight ? "text-[#A7B78E]" : undefined}>
        {part.text}
      </span>
    ),
  );
};

function Hero({ data }: HeroProps) {
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language.startsWith("ar");
  const navigate = useNavigate();

  const content = data.content;
  const title = sectionText(data, "title", t("heroTitle"), isArabic);
  const description = sectionText(data, "description", t("heroDesc"), isArabic);
  const contentImages = getContentImages(content);
  const heroImage = contentImages[0] ?? hero;
  const iconKeys = getContentIcons(content);
  const displayedFloatingAssets = floatingAssets.map((asset, index) => {
    const iconKey = iconKeys[index];

    return {
      ...asset,
      img:
        iconKey === "bell"
          ? bellImg
          : (assetByIconKey[iconKey as keyof typeof assetByIconKey] ??
            assetByIconKey[asset.id as keyof typeof assetByIconKey]),
    };
  });
  const visitCount =
    typeof content?.visit_count === "string" ? content.visit_count : "95K+";
  const visitText =
    typeof content?.visit_text === "string"
      ? content.visit_text
      : t("JoinUsToday");

  const navigateToLoginForRole = (role: "company" | "influencer") => {
    navigate(`/login?role=${role}`);
  };

  return (
    <section
      dir={isArabic ? "rtl" : "ltr"}
      className="relative -mt-24 overflow-hidden px-4 pb-10 pt-52 sm:px-6 lg:px-8 lg:pt-60 lg:pb-16 xl:pb-20 font-['IBM_Plex_Sans_Arabic']">
      <img
        src={heroImage}
        alt="hero background"
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-[rgba(0,0,0,0.52)]" />

      <div className="pointer-events-none absolute inset-0 lg:hidden">
        {displayedFloatingAssets.map((asset) => (
          <motion.img
            key={`${asset.id}-mobile`}
            src={asset.img}
            alt=""
            animate={{ y: asset.y }}
            transition={{
              repeat: Infinity,
              duration: asset.duration,
              ease: "easeInOut",
            }}
            className={cn(
              "absolute z-10 h-auto select-none drop-shadow-[0_12px_14px_rgba(0,0,0,0.28)]",
              asset.pos.mobile,
            )}
          />
        ))}
      </div>

      <div className="pointer-events-none absolute inset-0 hidden lg:block">
        {displayedFloatingAssets.map((asset) => (
          <motion.img
            key={asset.id}
            src={asset.img}
            alt=""
            animate={{ y: asset.y }}
            transition={{
              repeat: Infinity,
              duration: asset.duration,
              ease: "easeInOut",
            }}
            className={cn(
              "absolute z-10 h-auto select-none drop-shadow-[0_18px_22px_rgba(0,0,0,0.32)]",
              isArabic ? asset.pos.arabic : asset.pos.english,
            )}
          />
        ))}
      </div>

      <div
        className={cn(
          "relative z-20 mx-auto flex max-w-360 items-end justify-end pb-8 lg:items-center lg:justify-start lg:pb-0",
        )}>
        <div
          className={cn(
            "w-full max-w-88",
            isArabic
              ? "text-right lg:max-w-2xl xl:max-w-184"
              : "text-left lg:max-w-176",
          )}>
          <motion.h1
            initial={{ opacity: 0, y: 36 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            className={cn(
              "font-bold leading-[1.3] text-white drop-shadow-[0_8px_18px_rgba(0,0,0,0.36)]",
              isArabic
                ? "text-[1.35rem] lg:text-[clamp(1.5rem,3.2vw,3.5rem)]"
                : "text-[1.05rem] lg:text-[clamp(1.15rem,2.2vw,2.25rem)]",
            )}>
            {renderHighlightedTitle(title, isArabic)}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className={cn(
              "mt-5 max-w-2xl text-white/95 transition-all duration-300",
              isArabic
                ? "hidden text-[clamp(0.95rem,1.3vw,1.2rem)] leading-relaxed lg:block"
                : "hidden text-[clamp(0.8rem,1vw,0.95rem)] leading-relaxed lg:block",
            )}>
            {description}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.48, ease: [0.22, 1, 0.36, 1] }}
            className={cn(
              "mt-7 flex w-fit flex-nowrap items-center gap-2 lg:mt-10 lg:flex-wrap lg:gap-4",
              isArabic
                ? "ml-auto justify-end lg:ml-0 lg:justify-start"
                : "justify-start",
            )}>
            <Button
              onClick={() => navigateToLoginForRole("influencer")}
              className="h-9 min-w-30 cursor-pointer rounded-full bg-[#A7B78E] px-4 text-xs font-bold text-white hover:bg-[#9caf7f] sm:min-w-36 lg:h-11 lg:min-w-36 lg:px-6 lg:text-sm">
              <span>{t("infBtn")}</span>
              {isArabic ? <ArrowLeft size={17} /> : <ArrowLeft size={17} />}
            </Button>

            <Button
              onClick={() => navigateToLoginForRole("company")}
              variant="outline"
              className="h-9 min-w-30 cursor-pointer rounded-full border-[rgba(255,219,195,1)] bg-black/20 px-4 text-xs font-bold text-[rgba(167,183,142,1)] hover:bg-white/10 hover:text-[rgba(167,183,142,1)] sm:min-w-36 lg:h-11 lg:min-w-36 lg:px-6 lg:text-sm">
              <span>{t("compBtn")}</span>
              {isArabic ? <ArrowRight size={17} /> : <ArrowRight size={17} />}
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.65, ease: [0.22, 1, 0.36, 1] }}
            className={cn(
              "mt-9 flex w-fit items-center gap-2 text-white lg:mt-10 lg:gap-6",
              isArabic ? "ml-auto justify-end lg:ml-0" : "justify-start",
            )}>
            {/* Avatars First in RTL means they appear on the Right */}
            {isArabic ? (
              <>
                <div className="order-2 flex items-center -space-x-3 space-x-reverse lg:order-0 lg:-space-x-4">
                  {communityImages.map((image, index) => (
                    <img
                      key={`avatar-${index}`}
                      src={image}
                      className="h-8 w-8 rounded-full border-2 border-white object-cover shadow-2xl transition-transform hover:scale-110 lg:h-14 lg:w-14"
                      alt={`member ${index + 1}`}
                    />
                  ))}
                </div>
                <div className="order-1 flex flex-row-reverse items-baseline gap-1 lg:order-0 lg:flex-col lg:items-end lg:gap-0">
                  <span className="text-base font-black leading-none lg:text-6xl">
                    {visitCount}
                  </span>
                  <span className="text-[11px] font-medium text-white/90 lg:mt-1 lg:text-lg">
                    {visitText}
                  </span>
                </div>
              </>
            ) : (
              <>
                <div className="flex items-baseline gap-1 lg:flex-col lg:items-start lg:gap-0">
                  <span className="text-base font-black leading-none lg:text-6xl">
                    {visitCount}
                  </span>
                  <span className="text-[11px] font-medium text-white/90 lg:mt-1 lg:text-lg">
                    {visitText}
                  </span>
                </div>
                <div className="flex items-center -space-x-3 lg:-space-x-4">
                  {communityImages.map((image, index) => (
                    <img
                      key={`avatar-${index}`}
                      src={image}
                      className="h-8 w-8 rounded-full border-2 border-white object-cover shadow-2xl transition-transform hover:scale-110 lg:h-14 lg:w-14"
                      alt={`member ${index + 1}`}
                    />
                  ))}
                </div>
              </>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}

export default Hero;
