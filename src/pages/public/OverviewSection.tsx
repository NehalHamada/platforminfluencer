import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Eye } from "lucide-react";
import { useTranslation } from "react-i18next";
import {
  FaFacebookF,
  FaInstagram,
  FaTiktok,
  FaTwitch,
  FaYoutube,
} from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import type { LandingSection } from "@/types/landing.types";
import { isRecord, sectionText } from "@/utils/landing";

type OverviewSectionProps = {
  data?: LandingSection | null;
};

function OverviewSection({ data }: OverviewSectionProps) {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.dir() === "rtl";
  const apiPlatforms = Array.isArray(data?.content?.platforms)
    ? data.content.platforms.filter(isRecord)
    : [];

  const getPlatformIcon = (icon: unknown) => {
    const iconName = typeof icon === "string" ? icon.toLowerCase() : "";
    if (iconName.includes("yt") || iconName.includes("youtube")) {
      return <FaYoutube className="text-[28px] text-white" />;
    }
    if (iconName.includes("fb") || iconName.includes("facebook")) {
      return <FaFacebookF className="text-[28px] text-white" />;
    }
    if (iconName.includes("tt") || iconName.includes("tiktok")) {
      return <FaTiktok className="text-[28px] text-black" />;
    }
    return <FaInstagram className="text-[28px] text-white" />;
  };

  const getPlatformBg = (icon: unknown) => {
    const iconName = typeof icon === "string" ? icon.toLowerCase() : "";
    if (iconName.includes("yt") || iconName.includes("youtube"))
      return "bg-[#FF0000]";
    if (iconName.includes("fb") || iconName.includes("facebook"))
      return "bg-[#1877F2]";
    if (iconName.includes("tt") || iconName.includes("tiktok"))
      return "bg-white";
    return "bg-gradient-to-br from-[#833AB4] via-[#FD1D1D] to-[#FCAF45]";
  };

  const getPlatformLabel = (platform: Record<string, unknown>) => {
    if (isRTL && typeof platform.type === "string") return platform.type;

    const iconName =
      typeof platform.icon === "string" ? platform.icon.toLowerCase() : "";
    if (iconName.includes("yt") || iconName.includes("youtube")) {
      return t("overview.cards.youtube.label");
    }
    if (iconName.includes("fb") || iconName.includes("facebook")) {
      return t("overview.cards.facebook.label");
    }
    if (iconName.includes("tt") || iconName.includes("tiktok")) {
      return t("overview.cards.tiktok.label");
    }
    return t("overview.cards.instagram.label");
  };

  const fallbackPlatforms = [
    {
      id: 1,
      icon: <FaInstagram className="text-[28px] text-white" />,
      bg: "bg-gradient-to-br from-[#833AB4] via-[#FD1D1D] to-[#FCAF45]",
      followers: t("overview.cards.instagram.followers"),
      label: t("overview.cards.instagram.label"),
      link: t("overview.cards.instagram.link"),
    },
    {
      id: 2,
      icon: <FaYoutube className="text-[28px] text-white" />,
      bg: "bg-[#FF0000]",
      followers: t("overview.cards.youtube.followers"),
      label: t("overview.cards.youtube.label"),
      link: t("overview.cards.youtube.link"),
    },
    {
      id: 3,
      icon: <FaFacebookF className="text-[28px] text-white" />,
      bg: "bg-[#1877F2]",
      followers: t("overview.cards.facebook.followers"),
      label: t("overview.cards.facebook.label"),
      link: t("overview.cards.facebook.link"),
    },
    {
      id: 4,
      icon: <FaTiktok className="text-[28px] text-black" />,
      bg: "bg-white",
      followers: t("overview.cards.tiktok.followers"),
      label: t("overview.cards.tiktok.label"),
      link: t("overview.cards.tiktok.link"),
    },
    {
      id: 5,
      icon: <FaXTwitter className="text-[28px] text-white" />,
      bg: "bg-black",
      followers: t("overview.cards.x.followers"),
      label: t("overview.cards.x.label"),
      link: t("overview.cards.x.link"),
    },
    {
      id: 6,
      icon: <FaTwitch className="text-[28px] text-white sm:text-center" />,
      bg: "bg-[#9146FF]",
      followers: t("overview.cards.twitch.followers"),
      label: t("overview.cards.twitch.label"),
      link: t("overview.cards.twitch.link"),
    },
  ];

  const platforms = apiPlatforms.length
    ? apiPlatforms.map((platform, index) => ({
        id: index + 1,
        icon: getPlatformIcon(platform.icon),
        bg: getPlatformBg(platform.icon),
        followers:
          typeof platform.followers === "string"
            ? platform.followers
            : t("overview.cards.instagram.followers"),
        label: getPlatformLabel(platform),
        link:
          typeof platform.link === "string"
            ? platform.link
            : t("overview.cards.instagram.link"),
      }))
    : fallbackPlatforms;

  const sideText = sectionText(
    data,
    "description",
    t("overview.sideCard"),
    isRTL,
  );

  return (
    <section dir={isRTL ? "rtl" : "ltr"} className="overflow-hidden ">
      <div className="mx-auto w-full max-w-6xl">
        {/* Mobile Layout */}
        <div className="flex flex-col gap-4 lg:hidden">
          {/* Mobile Title */}
          <div className="mb-2 flex items-center justify-start gap-2 px-1">
            <h2 className="font-bold text-[#202020] text-[20px] sm:text-[22px]">
              {sectionText(data, "title", t("overview.title"), isRTL)}
            </h2>
            <Eye className="h-5 w-5 text-[#b7bcc5]" aria-hidden="true" />
            <Eye className="h-5 w-5 text-[#b7bcc5]" aria-hidden="true" />
          </div>

          {/* Text Card (TOP on mobile) */}
          <Card className="flex w-full rounded-[20px] border-0 ring-0 bg-[rgba(167,183,142,1)] py-0 text-white shadow-none">
            <CardContent className="flex w-full flex-col justify-center p-6 text-center">
              <p className="mx-auto font-semibold leading-[1.6] text-[18px] sm:text-[20px]">
                {sideText}
              </p>
            </CardContent>
          </Card>

          {/* Social Media Cards (BOTTOM on mobile) */}
          <Card className="w-full rounded-[20px] border-0 ring-0 bg-[rgba(167,183,142,0.1)] py-0 shadow-none">
            <CardContent className="p-3 sm:p-4">
              <div className="flex flex-wrap justify-center gap-2 sm:gap-3">
                {platforms.map((item) => (
                  <div
                    key={item.id}
                    className="flex w-[30%] min-w-[105px] max-w-[130px] shrink-0 flex-col items-center justify-start rounded-[12px] bg-transparent p-1">
                    <div className="mb-2 flex w-full flex-row items-center justify-between gap-1 sm:gap-2">
                      <div
                        className={cn(
                          "flex h-8 w-8 sm:h-10 sm:w-10 shrink-0 items-center justify-center rounded-[8px] sm:rounded-[10px]",
                          item.bg,
                        )}>
                        <div className="scale-[0.6] sm:scale-75">
                          {item.icon}
                        </div>
                      </div>
                      <div className="flex min-w-0 flex-1 flex-col items-end justify-center text-right">
                        <span className="w-full truncate text-[11px] sm:text-[13px] font-bold text-[#222]">
                          {item.followers}
                        </span>
                        <span className="w-full truncate text-[9px] sm:text-[11px] text-[#8b8b8b]">
                          {item.label}
                        </span>
                      </div>
                    </div>
                    <p
                      className="w-full truncate text-center text-[9px] sm:text-[11px] text-[#6f6f6f]"
                      dir="ltr">
                      {item.link}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Desktop Layout (Restored Original) */}
        <div className="hidden lg:block">
          <div className="mb-6 mt-10 flex flex-wrap items-center justify-center gap-2 lg:justify-start">
            <h2
              className={cn(
                "font-bold text-[#202020]",
                isRTL
                  ? "text-xl sm:text-2xl md:text-[30px]"
                  : "text-lg sm:text-xl md:text-[24px]",
              )}>
              {sectionText(data, "title", t("overview.title"), isRTL)}
            </h2>
            <Eye className="h-6 w-6 text-[#b7bcc5]" aria-hidden="true" />
            <Eye className="h-6 w-6 text-[#b7bcc5]" aria-hidden="true" />
          </div>

          <div className="flex flex-col items-stretch gap-4 lg:flex-row">
            <Card className="w-full rounded-[24px] border-0 ring-0 bg-[rgba(167,183,142,0.1)] py-0 shadow-none lg:w-fit lg:max-w-[75%]">
              <CardContent className="h-full p-4 sm:p-5 md:p-6">
                <div className="flex h-full flex-wrap content-start gap-4">
                  {platforms.map((item) => (
                    <Card
                      key={item.id}
                      className="w-full shrink-0 grow rounded-[20px] border-0 ring-0 bg-transparent py-0 shadow-none sm:w-[calc(50%-0.5rem)] lg:w-[220px] lg:flex-initial">
                      <CardContent className="p-4 sm:p-5">
                        <div className="mb-4 flex flex-row items-center justify-between gap-3">
                          <div
                            className={cn(
                              "flex h-12 w-12 shrink-0 items-center justify-center rounded-[14px]",
                              item.bg,
                            )}>
                            {item.icon}
                          </div>

                          <div className="min-w-0 flex-1 text-center">
                            <CardTitle
                              className={cn(
                                "font-bold text-[#222]",
                                isRTL
                                  ? "text-base sm:text-lg"
                                  : "text-sm sm:text-base",
                              )}>
                              {item.followers}
                            </CardTitle>
                            <CardDescription
                              className={cn(
                                "mt-1 text-[#8b8b8b]",
                                isRTL
                                  ? "text-[13px] sm:text-sm"
                                  : "text-xs sm:text-[13px]",
                              )}>
                              {item.label}
                            </CardDescription>
                          </div>
                        </div>

                        <p
                          className={cn(
                            "break-all text-center text-[#6f6f6f]",
                            isRTL
                              ? "text-[12px] sm:text-[13px]"
                              : "text-[11px] sm:text-[12px]",
                          )}>
                          {item.link}
                        </p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="flex w-full flex-1 rounded-[24px] border-0 ring-0 bg-[rgba(167,183,142,1)] py-0 text-white shadow-none">
              <CardContent className="flex w-full flex-col justify-center p-5 text-center sm:p-6 md:p-8">
                <p
                  className={cn(
                    "mx-auto max-w-[20rem] font-semibold leading-[1.7] lg:mx-0 lg:max-w-none",
                    isRTL
                      ? "text-lg sm:text-xl md:text-[23px] lg:text-[26px]"
                      : "text-base sm:text-lg md:text-[19px] lg:text-[22px]",
                    isRTL ? "lg:text-right" : "lg:text-left",
                  )}>
                  {sideText}
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}

export default OverviewSection;
