import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useTranslation } from "react-i18next";
import hero from "/assets/Hero.optimized.jpg";
import { useAboutUsQuery } from "@/queries/about/useAboutUsQuery";

function WhoUs() {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.dir() === "rtl";
  const { data: aboutUs } = useAboutUsQuery();

  const paragraphs = aboutUs?.description
    ? [aboutUs.description]
    : [
        t("whoUs.paragraphs.1"),
        t("whoUs.paragraphs.2"),
        t("whoUs.paragraphs.3"),
      ];

  return (
    <section
      dir={isRTL ? "rtl" : "ltr"}
      className="relative -mt-24 overflow-x-hidden">
      <div className="relative h-64 w-full overflow-hidden sm:h-56 lg:h-84">
        <img
          src={hero}
          alt={t("whoUs.heroAlt")}
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-black/62" />
      </div>

      <div className="absolute inset-x-0 top-52 z-20 px-4 sm:top-34 sm:px-6 lg:top-68 ">
        <div>
          <div className={cn(isRTL ? "text-right" : "text-left")}>
            <span className="inline-block text-sm font-medium text-white underline underline-offset-4 sm:text-base">
              {t("whoUs.kicker")}
            </span>
          </div>
        </div>
      </div>

      <div className="relative z-10 -mt-4 sm:-mt-6">
        <div className="">
          <Card className="rounded-t-[24px] rounded-b-none border-0 bg-white py-0 shadow-none sm:rounded-t-[28px]">
            <CardContent className="px-4 py-6 sm:px-8 sm:py-8">
              <div className="mx-auto max-w-4xl">
                <h1 className="text-center text-base font-semibold text-[#232320] sm:text-lg lg:text-[1.15rem]">
                  {aboutUs?.title || t("whoUs.title")}
                </h1>

                <div className="mt-6 space-y-5 text-center text-[11px] leading-6 text-[#494842] sm:mt-7 sm:text-sm sm:leading-8 lg:text-[15px]">
                  {paragraphs.map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}

export default WhoUs;
