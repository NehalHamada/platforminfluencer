import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";
import { useTranslation } from "react-i18next";
import chI1 from "/assets/choImg1.png";
import chI2 from "/assets/choImg2.png";
import chI3 from "/assets/choImg3.png";
import chI4 from "/assets/choImg4.png";
import type { LandingSection } from "@/types/landing.types";
import { getImageList, getString, isRecord, sectionText } from "@/utils/landing";

type WhyChooseUsProps = {
  data?: LandingSection | null;
};

function WhyChooseUs({ data }: WhyChooseUsProps) {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.dir() === "rtl";
  const apiPoints = Array.isArray(data?.content?.points)
    ? data.content.points.filter(isRecord)
    : [];
  const apiImages = getImageList(data?.content);
  const images = [chI1, chI2, chI3, chI4].map(
    (fallback, index) => apiImages[index] ?? fallback,
  );
  const title = sectionText(data, "title", t("whyChooseUs"), isRTL);
  const features =
    isRTL && apiPoints.length
      ? apiPoints.map(
          (point, index) =>
            getString(point, "title") ||
            getString(point, "desc") ||
            t(`feature${(index % 4) + 1}`),
        )
      : [t("feature1"), t("feature2"), t("feature3"), t("feature4")];

  return (
    <section
      dir={isRTL ? "rtl" : "ltr"}
      className="bg-linear-to-r from-black via-[#0c0c0c] to-black px-4 py-16 md:py-20">
      <div className="mx-auto grid max-w-6xl items-center gap-12 md:grid-cols-2">
        <div className="flex justify-center md:order-2">
          <Card className="w-full max-w-120 border-0 bg-transparent py-0 shadow-none">
            <CardContent className="grid grid-cols-3 grid-rows-2 gap-3 p-0 sm:gap-4">
              <img
                src={images[0]}
                className="row-span-2 h-64 w-full rounded-3xl object-cover sm:h-80 md:h-105"
                alt=""
              />
              <img
                src={images[1]}
                className="h-30 w-full rounded-3xl object-cover sm:h-40 md:h-50.5"
                alt=""
              />
              <img
                src={images[2]}
                className="row-span-2 h-64 w-full rounded-3xl object-cover sm:h-80 md:h-105"
                alt=""
              />
              <img
                src={images[3]}
                className="h-30 w-full rounded-3xl object-cover sm:h-40 md:h-50.5"
                alt=""
              />
            </CardContent>
          </Card>
        </div>

        <div className="flex justify-center md:order-1">
          <Card className="w-full max-w-90 border-0 bg-transparent py-0 text-white shadow-none">
            <CardContent
              className={cn(
                "p-0 text-center",
                isRTL ? "md:text-right" : "md:text-left",
              )}>
              <CardTitle className="mb-6 text-3xl font-bold text-white underline">
                {title}
              </CardTitle>

              <ul className="space-y-4">
                {features.map((item, index) => (
                  <li
                    key={index}
                    className={cn(
                      "flex items-center justify-center gap-3",
                      isRTL
                        ? "flex-row md:flex-row md:justify-start"
                        : "flex-row md:justify-start",
                      isRTL ? "justify-start ms-17" : "justify-start ms-15",
                    )}>
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/10 backdrop-blur-md">
                      <Check size={16} aria-hidden="true" />
                    </div>
                    <span className="text-sm opacity-90 md:text-base">
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}

export default WhyChooseUs;
