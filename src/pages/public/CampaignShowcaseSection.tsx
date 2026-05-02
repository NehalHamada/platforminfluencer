import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useTranslation } from "react-i18next";
import orbImg from "/assets/cc2.png";
import phone1 from "/assets/iphone1.png";
import phone2 from "/assets/iphone2.png";
import phone3 from "/assets/iphone3.png";
import type { LandingCollection } from "@/types/landing.types";
import { sectionText } from "@/utils/landing";

type CampaignShowcaseSectionProps = {
  data?: LandingCollection | null;
};

function CampaignShowcaseSection({ data }: CampaignShowcaseSectionProps) {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.dir() === "rtl";
  const title = sectionText(
    data?.info,
    "title",
    `${t("campaignShowcase.title1")} ${t("campaignShowcase.title2")}`,
    isRTL,
  );
  const description = sectionText(
    data?.info,
    "description",
    t("campaignShowcase.desc"),
    isRTL,
  );

  return (
    <section
      dir={isRTL ? "rtl" : "ltr"}
      className="bg-[#171717] px-4 py-8 sm:px-5 md:py-12">
      <div className="mx-auto max-w-6xl">
        <Card className="relative overflow-hidden border-0 bg-transparent py-0 shadow-none">
          <div className="absolute inset-y-0 left-0 hidden w-45 bg-[radial-gradient(circle_at_left_center,rgba(182,192,131,0.35),transparent_60%)] md:block" />

          <div className="absolute left-8 top-1/2 z-20 hidden -translate-y-1/2 flex-col gap-4 md:flex">
            <span className="h-5 w-5 rounded-full border border-[#9f9f9f]" />
            <span className="h-5 w-5 rounded-full border border-[#9f9f9f]" />
            <span className="h-5 w-5 rounded-full bg-[#b7c58d]" />
          </div>

          <CardContent className="relative z-10 grid items-center gap-8 px-2 py-6 sm:px-4 sm:py-8 md:min-h-125 md:grid-cols-2 md:gap-10 md:px-12">
            <div
              className={cn(
                "relative mx-auto h-72 w-full max-w-76 sm:h-88 sm:max-w-92 md:h-110 md:max-w-105",
                isRTL ? "order-2 md:order-2" : "order-2 md:order-1",
              )}>
              <img
                src={phone1}
                alt={t("campaignShowcase.items.1.alt")}
                className="absolute left-[7%] top-[2%] z-10 h-48 w-auto sm:h-60 md:left-[0%] md:top-[2%] md:h-82.5"
              />

              <img
                src={phone2}
                alt={t("campaignShowcase.items.2.alt")}
                className="absolute left-[35%] top-[20%] z-30 h-50 w-auto -translate-x-1/2 sm:h-64 md:left-[37%] md:top-[24%] md:h-85"
              />

              <img
                src={phone3}
                alt={t("campaignShowcase.items.3.alt")}
                className="absolute right-[31%] top-[4%] z-20 h-48 w-auto sm:h-60 md:right-[20%] md:top-[-2%] md:h-82.5"
              />

              <img
                src={orbImg}
                alt=""
                className="absolute bottom-[30%] right-[20%] z-10 h-12 w-12 object-contain sm:h-19 sm:w-19 md:bottom-[20%] md:right-[10%] md:h-23.75 md:w-23.75"
              />
            </div>

            <div
              className={cn(
                "mx-auto max-w-107.5",
                isRTL
                  ? "order-1 text-center md:order-1 md:text-right"
                  : "order-1 text-center md:order-2 md:text-left",
              )}>
              <h2 className="text-2xl font-bold leading-normal text-white sm:text-3xl md:text-[52px] md:leading-[1.35]">
                {title}
              </h2>

              <p className="mt-4 text-sm leading-7 text-[#7e7e7e] sm:mt-6 sm:text-base sm:leading-8 md:max-w-105 md:text-[26px] md:leading-[1.8] lg:text-[30px]">
                {description}
              </p>

              <div className="mt-6 flex flex-wrap items-center justify-center gap-3 sm:mt-8 sm:gap-4 md:justify-start">
                <span className="text-xl font-semibold text-[#b7c58d] sm:text-2xl md:text-[34px]">
                  {t("campaignShowcase.button")}
                </span>

                <Button
                  type="button"
                  size="icon-lg"
                  className="rounded-xl border-0 bg-[#b7c58d] text-white transition hover:opacity-90"
                  aria-label={t("campaignShowcase.button")}>
                  {isRTL ? <ArrowLeft size={22} /> : <ArrowRight size={22} />}
                </Button>
              </div>
            </div>
          </CardContent>

          <div className="absolute left-3 top-1/2 z-20 flex -translate-y-1/2 flex-col gap-3 sm:left-6 md:hidden">
            <span className="h-4 w-4 rounded-full border border-[#9f9f9f]" />
            <span className="h-4 w-4 rounded-full border border-[#9f9f9f]" />
            <span className="h-4 w-4 rounded-full bg-[#b7c58d]" />
          </div>
        </Card>
      </div>
    </section>
  );
}

export default CampaignShowcaseSection;
