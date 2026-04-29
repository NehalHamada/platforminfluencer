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

function OverviewSection() {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.dir() === "rtl";

  const platforms = [
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

  return (
    <section
      dir={isRTL ? "rtl" : "ltr"}
      className="mb-5 overflow-hidden px-4 py-8 sm:px-5 sm:py-10 md:px-6 md:py-16">
      <div className="mx-auto w-full max-w-6xl">
        <div className="mb-6 flex flex-wrap items-center justify-center gap-2 lg:justify-start">
          <h2 className="text-2xl font-bold text-[#202020] sm:text-[28px] md:text-[34px]">
            {t("overview.title")}
          </h2>
          <Eye className="h-6 w-6 text-[#b7bcc5]" aria-hidden="true" />
          <Eye className="h-6 w-6 text-[#b7bcc5]" aria-hidden="true" />
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-[minmax(0,1.6fr)_minmax(16rem,0.5fr)]">
          <Card className="w-full rounded-[24px] border-0 bg-[#ecece9] py-0 shadow-none">
            <CardContent className="p-4 sm:p-5 md:p-7">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {platforms.map((item) => (
                  <Card
                    key={item.id}
                    className="w-full rounded-[20px] border-0 bg-white py-0 shadow-[0_6px_20px_rgba(0,0,0,0.06)]">
                    <CardContent className="p-4 sm:p-5">
                      <div
                        className={cn(
                          "mb-4 flex flex-col items-center gap-3 sm:items-start",
                          isRTL
                            ? "sm:flex-row-reverse sm:justify-between"
                            : "sm:flex-row sm:justify-between",
                        )}>
                        <div
                          className={cn(
                            "min-w-0 flex-1 text-center",
                            isRTL ? "sm:text-right" : "sm:text-left",
                          )}>
                          <CardTitle className="text-lg font-bold text-[#222] sm:text-xl">
                            {item.followers}
                          </CardTitle>
                          <CardDescription className="mt-1 text-sm text-[#8b8b8b] sm:text-[15px]">
                            {item.label}
                          </CardDescription>
                        </div>

                        <div
                          className={cn(
                            "flex h-14 w-14 shrink-0 items-center justify-center rounded-[16px]",
                            item.bg,
                          )}>
                          {item.icon}
                        </div>
                      </div>

                      <p className="break-all text-sm text-[#6f6f6f] sm:text-[15px]">
                        {item.link}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="flex w-full rounded-[24px] border-0 bg-[linear-gradient(135deg,#9ba287,#b2b89c,#9ba287)] py-0 text-white shadow-none">
            <CardContent className="flex min-h-40 w-full flex-col justify-center p-5 text-center sm:p-6 md:p-8 lg:min-h-full">
              <p
                className={cn(
                  "mx-auto max-w-[20rem] text-xl font-semibold leading-[1.7] sm:text-[22px] md:text-[26px] lg:mx-0 lg:max-w-none lg:text-[30px]",
                  isRTL ? "lg:text-right" : "lg:text-left",
                )}>
                {t("overview.sideCard")}
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}

export default OverviewSection;
