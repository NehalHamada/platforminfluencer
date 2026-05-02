import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useTranslation } from "react-i18next";
import {
  FaFacebookF,
  FaInstagram,
  FaSnapchatGhost,
  FaTiktok,
  FaTwitter,
  FaYoutube,
} from "react-icons/fa";
import { IoCamera } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import hero from "/assets/Hero.png";
import us1 from "/assets/huser1.png";
import us2 from "/assets/huser2.png";
import us3 from "/assets/huser3.png";
import us4 from "/assets/huser4.png";
import us5 from "/assets/huser5.png";
import type { LandingSection } from "@/types/landing.types";
import { sectionText } from "@/utils/landing";

const images = [us1, us2, us3, us4, us5];

const apiIconMap = {
  "icon-ig": FaInstagram,
  "icon-tt": FaTiktok,
  "icon-yt": FaYoutube,
  "icon-fb": FaFacebookF,
  "icon-sc": FaSnapchatGhost,
} as const;

const floatingIcons = [
  {
    id: "twitter",
    icon: FaTwitter,
    color: "text-blue-400",
    mobileY: [0, -16, 0],
    desktopY: [0, -16, 0],
    duration: 4,
    position: "top-20 lg:top-60",
    sideClass: {
      rtl: "left-6 lg:left-50",
      ltr: "right-6 lg:right-50",
    },
    mobileClass: {
      rtl: "left-12 top-[27%]",
      ltr: "right-12 top-[34%]",
    },
  },
  {
    id: "facebook",
    icon: FaFacebookF,
    color: "text-blue-600",
    mobileY: [0, 16, 0],
    desktopY: [0, 16, 0],
    duration: 5,
    position: "top-40 lg:top-75",
    sideClass: {
      rtl: "left-6 lg:left-40",
      ltr: "right-6 lg:right-40",
    },
    mobileClass: {
      rtl: "left-24 top-[40%]",
      ltr: "right-24 top-[49%]",
    },
  },
  {
    id: "camera",
    icon: IoCamera,
    color: "text-pink-400",
    mobileY: [0, -14, 0],
    desktopY: [0, -14, 0],
    duration: 6,
    position: "top-66 lg:top-95",
    sideClass: {
      rtl: "left-10 lg:left-30",
      ltr: "right-10 lg:right-30",
    },
    mobileClass: {
      rtl: "left-6 top-[36%]",
      ltr: "right-6 top-[40%]",
    },
  },
];

type HeroProps = {
  data: LandingSection;
};

function Hero({ data }: HeroProps) {
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language.startsWith("ar");
  const navigate = useNavigate();

  const content = data.content;
  const visitCount =
    typeof content?.visit_count === "string" ? content.visit_count : "95k+";
  const visitText =
    isArabic && typeof content?.visit_text === "string"
      ? content.visit_text
      : t("JoinUsToday");

  const navigateToLoginForRole = (role: "company" | "influencer") => {
    navigate(`/login?role=${role}`);
  };

  const apiIconNames = Array.isArray(content?.icons)
    ? (content.icons as string[])
    : [];

  const displayedFloatingIcons = floatingIcons.map((item, index) => {
    const apiIconName = apiIconNames[index];
    const ApiIcon = apiIconMap[apiIconName as keyof typeof apiIconMap];

    return {
      ...item,
      icon: ApiIcon || item.icon,
    };
  });

  return (
    <section
      dir={isArabic ? "rtl" : "ltr"}
      className="relative -mt-24 min-h-[560px] overflow-hidden px-4 pb-8 pt-28 sm:min-h-[620px] sm:px-6 lg:min-h-[680px] lg:px-8 lg:pt-32">
      <img
        src={hero}
        alt="hero"
        className="absolute inset-0 mx-auto h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-black/50" />

      <div className="relative z-10 flex min-h-[500px] items-end pb-10 sm:min-h-[560px] sm:items-center sm:pb-0 lg:min-h-[620px]">
        <div
          className={cn(
            "w-full max-w-92 sm:max-w-xl lg:max-w-2xl",
            isArabic
              ? "mx-auto text-center sm:mx-0 sm:mr-0 sm:text-right"
              : "mx-auto text-center sm:mx-0 sm:ml-0 sm:text-left",
          )}>
          <h1 className="text-[1.9rem] leading-normal font-bold text-white sm:text-4xl md:text-5xl lg:text-6xl">
            {sectionText(data, "title", t("heroTitle"), isArabic)}
          </h1>

          <p className="mt-3 max-w-lg text-base leading-8 text-white/90 sm:mt-4 sm:text-base md:text-lg lg:text-xl">
            {sectionText(data, "description", t("heroDesc"), isArabic)}
          </p>

          <div
            className={cn(
              "mt-6 flex items-center gap-3",
              isArabic
                ? "flex-row justify-center sm:justify-start"
                : "flex-row justify-center sm:justify-start",
            )}>
            <Button
              onClick={() => navigateToLoginForRole("influencer")}
              variant="brand"
              className={cn(
                "relative z-10 h-12 min-w-0 flex-1 rounded-full px-4 text-base shadow-[0_10px_30px_rgba(167,183,142,0.25)] sm:w-auto sm:flex-none sm:px-5",
                isArabic ? "flex-row" : "flex-row",
              )}>
              <span>{t("infBtn")}</span>
              {isArabic ? <ArrowLeft size={18} /> : <ArrowRight size={18} />}
            </Button>

            <Button
              onClick={() => navigateToLoginForRole("company")}
              variant="outline"
              className={cn(
                "h-12 min-w-0 flex-1 rounded-full border-[rgba(255,219,195,1)] bg-black/20 px-4 text-base text-[rgba(167,183,142,1)] hover:bg-white/10 hover:text-[rgba(167,183,142,1)] sm:w-auto sm:flex-none sm:px-5",
                isArabic ? "flex-row" : "flex-row",
              )}>
              <span>{t("compBtn")}</span>
              {isArabic ? <ArrowLeft size={18} /> : <ArrowRight size={18} />}
            </Button>
          </div>

          <div
            className={cn(
              "mt-8 flex items-center justify-start gap-3 sm:mt-8 sm:justify-end",
              isArabic ? "flex-row-reverse" : "flex-row-reverse",
            )}>
            <span className="text-base text-white sm:text-lg">{visitText}</span>
            <span className="text-lg font-semibold text-white sm:text-xl">
              {visitCount}
            </span>

            <div
              className={cn(
                "flex items-center -space-x-3",
                isArabic && "flex-row-reverse space-x-reverse",
              )}>
              {images.map((image, index) => (
                <img
                  key={image}
                  src={image}
                  className="h-10 w-10 rounded-full border-2 border-white sm:h-10 sm:w-10"
                  alt={`community member ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {displayedFloatingIcons.map(
        ({ id, icon: Icon, color, mobileY, duration, mobileClass }) => (
          <motion.div
            key={id}
            animate={{ y: mobileY }}
            transition={{ repeat: Infinity, duration }}
            className={cn(
              "absolute z-10 md:hidden",
              isArabic ? mobileClass.rtl : mobileClass.ltr,
            )}>
            <Card className="rounded-2xl border border-white/20 bg-white/70 py-0 shadow-lg backdrop-blur-md">
              <CardContent className="p-3">
                <Icon className={cn("text-xl", color)} aria-hidden="true" />
              </CardContent>
            </Card>
          </motion.div>
        ),
      )}

      {displayedFloatingIcons.map(
        ({
          id,
          icon: Icon,
          color,
          desktopY,
          duration,
          position,
          sideClass,
        }) => (
          <motion.div
            key={`${id}-desktop`}
            animate={{ y: desktopY }}
            transition={{ repeat: Infinity, duration }}
            className={cn(
              "absolute hidden rounded-xl md:block",
              position,
              isArabic ? sideClass.rtl : sideClass.ltr,
            )}>
            <Card className="rounded-xl border-0 bg-white py-0 shadow-lg">
              <CardContent className="p-3">
                <Icon className={cn("text-xl", color)} aria-hidden="true" />
              </CardContent>
            </Card>
          </motion.div>
        ),
      )}
    </section>
  );
}

export default Hero;
