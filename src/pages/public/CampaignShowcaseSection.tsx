import { Button } from "@/components/ui/Button";
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
      className="bg-white  md:mb-10 lg:mb-4 sm:mt-40 overflow-visible">
      <div className="relative w-full bg-[rgba(29,29,29,1)] py-12 md:py-16 lg:py-20">
        {/* Decorative background gradient */}
        <div className="absolute inset-y-0 left-0 hidden w-64 bg-[radial-gradient(circle_at_left_center,rgba(182,192,131,0.1),transparent_70%)] md:block" />

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Pagination Dots (Inside container for alignment) */}
          <div className="absolute left-4 top-1/2 z-20 hidden -translate-y-1/2 flex-col gap-5 md:flex lg:left-8">
            <span className="size-3 rounded-full border-2 border-white/10 transition-colors hover:border-white/30" />
            <span className="size-3 rounded-full border-2 border-white/10 transition-colors hover:border-white/30" />
            <span className="size-3 rounded-full bg-[#b7c58d]" />
          </div>

          <div className="relative z-10 grid items-center gap-16 lg:grid-cols-12 lg:gap-20">
            {/* Phone Mockups Column - Overflowing */}
            <div
              className={cn(
                "relative mx-auto w-full lg:col-span-6 h-[180px] sm:h-[250px] lg:h-[300px] max-md:mt-10",
                isRTL ? "order-2" : "order-2 lg:order-1",
              )}>
              {/* Mobile pagination dots */}
              <div className="absolute right-4 top-[20%] -translate-y-1/2 flex flex-col gap-3 md:hidden z-20">
                <span className="size-[14px] rounded-full border-[1.5px] border-neutral-500 bg-transparent" />
                <span className="size-[14px] rounded-full border-[1.5px] border-neutral-500 bg-transparent" />
                <span className="size-[14px] rounded-full bg-[#b7c58d]" />
              </div>

              <div className="absolute top-[80%] md:top-1/2 left-[42%] md:left-1/2 -translate-x-1/2 -translate-y-1/2 w-[260px] h-[320px] md:w-full md:max-w-[340px] lg:max-w-[380px] md:h-[420px] lg:h-[460px]">
                {/* Phone 1 (Back Left - Elevated) */}
                <img
                  src={phone1}
                  alt={t("campaignShowcase.items.1.alt")}
                  className="absolute left-[0%] top-[-15%] max-md:top-[-5%] z-10 w-[48%] -rotate-6 rounded-[2rem] shadow-2xl transition-transform duration-700 hover:rotate-0"
                />

                {/* Phone 3 (Back Right - Slightly Elevated) */}
                <img
                  src={phone3}
                  alt={t("campaignShowcase.items.3.alt")}
                  className="absolute right-[0%] top-[-10%] max-md:top-[0%] z-10 w-[48%] rotate-6 rounded-[2rem] shadow-2xl transition-transform duration-700 hover:rotate-0"
                />

                {/* Phone 2 (Front Center - Lowered) */}
                <img
                  src={phone2}
                  alt={t("campaignShowcase.items.2.alt")}
                  className="absolute left-[24%] top-[10%] max-md:top-[15%] z-30 w-[52%] rounded-[2rem] shadow-[0_40px_80px_rgba(0,0,0,0.7)] transition-transform duration-700 hover:scale-[1.03]"
                />

                {/* Decorative Orb */}
                <img
                  src={orbImg}
                  alt=""
                  className="absolute left-[105%] top-[30%] z-5 size-12 object-contain drop-shadow-2xl transition-all duration-700 hover:scale-110 lg:size-20 max-md:hidden"
                />
              </div>
            </div>

            {/* Text Content Column */}
            <div
              className={cn(
                "lg:col-span-6",
                isRTL
                  ? "order-1 text-right lg:order-1"
                  : "order-1 text-center lg:order-2 lg:text-left",
              )}>
              <h2
                className={cn(
                  "font-lemonada font-extrabold text-white leading-tight",
                  isRTL
                    ? "text-[28px] leading-snug sm:text-4xl md:text-5xl lg:text-6xl"
                    : "text-2xl sm:text-3xl md:text-4xl lg:text-5xl",
                )}>
                {isRTL ? (
                  <>
                    {/* Desktop Title */}
                    <div className="hidden md:block">
                      <span className="relative inline-block pb-1.5">
                        {t("campaignShowcase.title1")}
                        <div className="absolute bottom-0 left-0 h-[4px] w-full rounded-full bg-[#b7c58d]" />
                      </span>
                      <span className="mt-3 block">
                        {t("campaignShowcase.title2")}
                      </span>
                    </div>

                    {/* Mobile Title */}
                    <div className="block md:hidden">
                      <span className="inline-block border-b-2 border-white pb-1">
                        {t("campaignShowcase.title1")}
                      </span>
                      <span className="mt-3 block w-fit border-b-2 border-white pb-1">
                        {t("campaignShowcase.title2")}
                      </span>
                    </div>
                  </>
                ) : (
                  title
                )}
              </h2>

              <p
                className={cn(
                  "font-ibm-plex mt-5 text-neutral-400 leading-relaxed md:mt-8 lg:max-w-xl",
                  isRTL
                    ? "text-[15px] sm:text-lg md:text-xl lg:text-2xl"
                    : "text-sm sm:text-base md:text-lg lg:text-xl",
                )}>
                {description}
              </p>

              <div
                className={cn(
                  "mt-8 flex flex-wrap items-center gap-6 md:mt-10",
                  isRTL
                    ? "justify-end md:justify-start"
                    : "justify-center lg:justify-start",
                )}>
                {/* Desktop Button */}
                <Button
                  className="hidden md:flex font-ibm-plex group relative h-auto items-center gap-3 rounded-full bg-[#b7c58d] px-5 py-2.5 text-base font-bold text-white transition-all hover:scale-[1.02] hover:bg-[#a8b67d] active:scale-[0.98] lg:px-7 lg:py-3.5 lg:text-lg"
                  aria-label={t("campaignShowcase.button")}>
                  <div className="flex size-8 items-center justify-center rounded-full bg-white/20 transition-colors group-hover:bg-white/30 lg:size-10">
                    {isRTL ? <ArrowLeft size={18} /> : <ArrowRight size={18} />}
                  </div>
                  <span>{t("campaignShowcase.button")}</span>
                </Button>

                {/* Mobile Button */}
                <div className="flex md:hidden items-center justify-start gap-3 w-full cursor-pointer">
                  <span className="font-bold text-[#b7c58d] text-[16px]">
                    {t("campaignShowcase.button")}
                  </span>
                  <div className="flex size-9 items-center justify-center rounded-full bg-[#b7c58d] text-white">
                    {isRTL ? <ArrowLeft size={18} /> : <ArrowRight size={18} />}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default CampaignShowcaseSection;
