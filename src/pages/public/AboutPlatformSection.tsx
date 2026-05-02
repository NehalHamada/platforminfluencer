import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useTranslation } from "react-i18next";
import bgImg from "/assets/platImg2.png";
import centerImg from "/assets/platImg.png";
import profileImg from "/assets/platImg1.png";
import logoImg from "/assets/platLogo.png";
import type { LandingSection } from "@/types/landing.types";
import { getString, sectionText } from "@/utils/landing";

type AboutPlatformSectionProps = {
  data?: LandingSection | null;
};

function AboutPlatformSection({ data }: AboutPlatformSectionProps) {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.dir() === "rtl";
  const content = data?.content;
  const cardTitle =
    (isRTL && getString(content, "about_title")) || t("aboutPlatform.cardTitle");
  const cardDesc =
    (isRTL && getString(content, "about_desc")) ||
    sectionText(data, "description", t("aboutPlatform.cardDesc"), isRTL);

  const stats = [
    {
      id: 1,
      value: getString(content, "exp_years") || t("aboutPlatform.stats.1.value"),
      label: t("aboutPlatform.stats.1.label"),
    },
    {
      id: 2,
      value:
        getString(content, "campaigns_count") ||
        t("aboutPlatform.stats.2.value"),
      label: t("aboutPlatform.stats.2.label"),
    },
    {
      id: 3,
      value:
        getString(content, "happy_clients") || t("aboutPlatform.stats.3.value"),
      label: t("aboutPlatform.stats.3.label"),
    },
  ];

  return (
    <section
      dir={isRTL ? "rtl" : "ltr"}
      className="relative overflow-hidden bg-[#f5f5f2] px-4 py-8 sm:px-6 lg:px-8">
      <div className="relative mx-auto max-w-6xl">
        <div className="md:hidden">
          <div className="relative overflow-hidden rounded-[28px] bg-[linear-gradient(180deg,rgba(255,255,255,0.92),rgba(246,246,241,0.9))] px-5 py-6 shadow-[0_12px_34px_rgba(0,0,0,0.06)]">
            <img
              src={centerImg}
              alt=""
              className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-8"
            />

            <div className="relative z-10">
              <div
                className={cn(
                  "mb-5 flex items-center gap-4",
                  isRTL ? "flex-row" : "flex-row-reverse",
                )}>
                <h3 className="shrink-0 text-[2rem] font-bold text-[#24245a]">
                  {cardTitle}
                </h3>
                <Separator className="h-0.5 flex-1 bg-[#24245a]" />
              </div>

              <div
                className={cn("space-y-5", isRTL ? "text-right" : "text-left")}>
                <p className="text-[1.35rem] leading-[1.9] text-[#5b5b76]">
                  {cardDesc}
                </p>

                <div className="relative overflow-hidden rounded-[26px] bg-[#1c1c1c]">
                  <img
                    src={centerImg}
                    alt={t("aboutPlatform.centerAlt")}
                    className="h-48 w-full object-cover opacity-80"
                  />
                  <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.12)_0%,rgba(0,0,0,0.48)_100%)]" />
                  <div className="absolute left-0 bottom-0 h-30 w-14 rounded-tr-[24px] bg-[#f5f5f2]" />
                  <div className="absolute right-0 bottom-0 h-13 w-35 rounded-tl-[24px] bg-[#f5f5f2]" />

                  <div className="absolute inset-x-0 bottom-0 flex items-center justify-start px-4">
                    <div className="shrink-0">
                      <Button
                        type="button"
                        className={cn(
                          "h-11 rounded-full border-0 bg-[#a9bb88] px-2 text-base text-white shadow-sm hover:bg-[#98ac76]",
                          isRTL ? "flex-row" : "flex-row",
                        )}
                        aria-label={t("aboutPlatform.readMore")}>
                        <span>{t("aboutPlatform.readMore")}</span>
                        {isRTL ? (
                          <ChevronLeft size={18} />
                        ) : (
                          <ChevronRight size={18} />
                        )}
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="pt-2 text-center">
                  <h4 className="text-[1.9rem] font-bold leading-[1.8] text-[#2b2b2b]">
                    {t("aboutPlatform.title1")} {t("aboutPlatform.title2")}
                    <br />
                    {t("aboutPlatform.title3")}
                  </h4>
                </div>

                <div
                  className={cn(
                    "space-y-5 pt-3",
                    isRTL ? "text-right" : "text-left",
                  )}>
                  {stats.map((item) => (
                    <div key={item.id}>
                      <div className="text-[2rem] font-semibold text-[#2c2c2c]">
                        {item.value}
                      </div>
                      <div className="mt-1  text-[1.35rem] text-[#55557a]">
                        {item.label}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="hidden md:block">
          <header className="mx-auto max-w-4xl text-center">
            <div className="flex flex-col items-center justify-center gap-3 md:flex-row md:gap-3">
              <h2 className="max-w-[16rem] wrap-break-words text-center text-[28px] font-bold text-[#1f1f1f] sm:max-w-[20rem] md:max-w-none md:text-[50px]">
                {t("aboutPlatform.title1")}
              </h2>

              <img
                src={logoImg}
                alt={t("aboutPlatform.logoAlt")}
                className="h-12 w-12 object-contain md:h-20 md:w-20"
              />

              <h2 className="max-w-[16rem] wrap-break-words text-center text-[28px] font-bold text-[#1f1f1f] sm:max-w-[20rem] md:max-w-none md:text-[50px]">
                {t("aboutPlatform.title2")}
              </h2>
            </div>

            <h3 className="mx-auto mt-3 max-w-[16rem] wrap-break-words text-center text-[28px] font-bold text-[#1f1f1f] sm:max-w-88 md:max-w-none md:text-[50px]">
              {t("aboutPlatform.title3")}
            </h3>
          </header>

          <div className="mt-8 flex flex-col items-center gap-8">
            <div className="relative flex w-full flex-col items-center justify-center gap-8 lg:min-h-130">
              <div className="order-1 w-full lg:absolute lg:left-1/2 lg:top-1/2 lg:z-10 lg:w-117.5 lg:-translate-x-1/2 lg:-translate-y-1/2">
                <div className="relative mx-auto w-full max-w-[20rem] sm:max-w-md lg:max-w-117.5">
                  <Card className="relative overflow-hidden rounded-[28px] border-0 bg-[#1c1c1c] py-0 shadow-[0_12px_30px_rgba(0,0,0,0.14)]">
                    <img
                    src={centerImg}
                      alt={t("aboutPlatform.centerAlt")}
                      className="h-64 w-full object-cover opacity-85 sm:h-72 md:h-80"
                    />
                    <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.12)_0%,rgba(0,0,0,0.42)_100%)]" />
                    <div className="absolute left-0 bottom-0 h-55 w-18 rounded-tr-[28px] bg-[#f5f5f2]" />
                    <div className="absolute right-0 bottom-0 h-17 w-40 rounded-tl-[28px] bg-[#f5f5f2]" />

                    <div className="absolute inset-x-0 bottom-0 -right-2 flex justify-start px-5">
                      <Button
                        type="button"
                        className={cn(
                          "absolute h-12 rounded-full border-0 bg-[#a9bb88] px-3 bottom-1 text-base text-white shadow-sm hover:bg-[#98ac76]",
                          isRTL ? "flex-row" : "flex-row",
                        )}
                        aria-label={t("aboutPlatform.readMore")}>
                        <span>{t("aboutPlatform.readMore")}</span>
                        {isRTL ? (
                          <ChevronLeft size={18} />
                        ) : (
                          <ChevronRight size={18} />
                        )}
                      </Button>
                    </div>
                  </Card>
                </div>
              </div>

              <div className="order-2 w-full lg:absolute lg:left-10 lg:top-1/2 lg:z-20 lg:w-71.25 lg:-translate-y-1/2">
                <div className="relative mx-auto w-full max-w-[20rem] sm:max-w-[24rem] lg:max-w-71.25">
                  <div className="pointer-events-none absolute -top-7 left-4 z-10">
                    <Avatar className="h-16 w-16 border-4 border-white shadow-md sm:h-19.5 sm:w-19.5">
                      <AvatarImage
                        src={profileImg}
                        alt={t("aboutPlatform.profileAlt")}
                      />
                    </Avatar>
                  </div>
                  <div className="pointer-events-none absolute -top-7 left-18 z-10 sm:left-25">
                    <Avatar className="h-16 w-16 border-4 border-white shadow-md sm:h-19.5 sm:w-19.5">
                      <AvatarImage
                        src={bgImg}
                        alt={t("aboutPlatform.profileAlt")}
                      />
                    </Avatar>
                  </div>

                  <Card className="absolute -top-20 rounded-[20px] border-0 bg-white/88 py-0 shadow-[0_10px_30px_rgba(0,0,0,0.10)] backdrop-blur-sm">
                    <CardContent className="p-5 pt-14">
                      <div className="mb-4 flex items-center justify-center gap-3 lg:justify-start">
                        <h4 className="text-[20px] font-bold text-[#233a8b] md:text-[24px]">
                          {cardTitle}
                        </h4>
                        <Separator className="h-0.5 flex-1 bg-[#6d6de3]" />
                      </div>

                      <p
                        className={cn(
                          "text-center text-[13px] leading-7 text-[#505050]",
                          isRTL ? "lg:text-right" : "lg:text-left",
                        )}>
                        {cardDesc}
                      </p>

                      <div className="mt-4 flex justify-center lg:justify-start">
                        <Button
                          type="button"
                          size="icon"
                          className="h-10 w-10 rounded-xl border-0 bg-[#adc28b] text-white shadow-sm hover:bg-[#9fb87a]"
                          aria-label={t("aboutPlatform.readMore")}>
                          {isRTL ? (
                            <ChevronLeft size={18} />
                          ) : (
                            <ChevronRight size={18} />
                          )}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>

              <div className="order-3 grid w-full grid-cols-1 gap-6 text-center sm:grid-cols-3 lg:absolute lg:right-13.75 lg:top-1/2 lg:z-20 lg:w-41.25 lg:-translate-y-1/2 lg:grid-cols-1">
                {stats.map((item) => (
                  <Card
                    key={item.id}
                    className={cn(
                      "rounded-[18px] border-0 bg-transparent py-0 shadow-none",
                      isRTL ? "lg:text-right" : "lg:text-left",
                    )}>
                    <CardContent className="p-0 text-center">
                      <div className="text-[38px] font-semibold leading-none text-[#1b1b1b] md:text-[56px]">
                        {item.value}
                      </div>
                      <div className="mt-2 text-[14px] text-[#444] md:text-[20px]">
                        {item.label}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default AboutPlatformSection;
