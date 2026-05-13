import { cn } from "@/lib/utils";
import { useTranslation } from "react-i18next";
import { FaCaretDown } from "react-icons/fa";
import featImg from "/assets/featImg.jpg";
import type { LandingSection } from "@/types/landing.types";
import { getImage, getString, isRecord, sectionText } from "@/utils/landing";

type FeaturesSectionProps = {
  data?: LandingSection | null;
};

function FeaturesSection({ data }: FeaturesSectionProps) {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.dir() === "rtl";

  const apiPoints = Array.isArray(data?.content?.points)
    ? data.content.points.filter(isRecord)
    : [];

  const featureImage = getImage(data?.content, "image") ?? featImg;

  const features = apiPoints.length
    ? apiPoints.map((point, index) => ({
        id: String(index + 1),
        title: t(
          getString(point, "title") ||
            `features.items.${(index % 4) + 1}.title`,
        ),
        desc: t(
          getString(point, "desc") || `features.items.${(index % 4) + 1}.desc`,
        ),
      }))
    : [{ id: "1" }, { id: "2" }, { id: "3" }, { id: "4" }].map((item) => ({
        id: item.id,
        title: t(`features.items.${item.id}.title`),
        desc: t(`features.items.${item.id}.desc`),
      }));

  return (
    <section
      className="font-ibm-plex overflow-hidden bg-[rgba(167,183,142,0.15)] px-4 py-8 md:py-12"
      dir={isRTL ? "rtl" : "ltr"}>
      <div className="mx-auto max-w-5xl">
        {/* Mobile Layout */}
        <div className="flex flex-col md:hidden">
          {/* Title */}
          <div className="mb-8 w-full text-center">
            <h2 className="inline-block border-b-[1.5px] border-[#333] pb-2 text-[20px] font-bold text-[#2c2c2c]">
              {sectionText(data, "title", "كيف نخلق القيمة", true)}
            </h2>
          </div>

          <div className="flex flex-col gap-6">
            {features.slice(0, 2).map((item, index) => (
              <div
                key={item.id}
                className={cn(
                  "flex w-full items-start gap-4",
                  index % 2 === 0 ? "px-6" : "px-0"
                )}
                dir="ltr">
                {isRTL ? (
                  <>
                    <div className="flex w-full flex-1 flex-col items-end pt-1 text-right">
                      <div className="flex w-full items-start justify-between gap-2">
                        <FaCaretDown className="mt-1 h-5 w-5 shrink-0 text-[#2c2c2c]" aria-hidden="true" />
                        <h3 className="text-right text-[16px] font-bold text-[#2c2c2c]">
                          {item.title}
                        </h3>
                      </div>
                      <p className="mt-1 w-full text-right text-[13px] leading-relaxed text-[#606060]">
                        {item.desc}
                      </p>
                    </div>
                    <div className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[#333] text-[14px] font-medium text-[#333]">
                      {item.id}
                    </div>
                  </>
                ) : (
                  <>
                    <div className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[#333] text-[14px] font-medium text-[#333]">
                      {item.id}
                    </div>
                    <div className="flex w-full flex-1 flex-col items-start pt-1 text-left">
                      <div className="flex w-full items-start justify-between gap-2">
                        <h3 className="text-left text-[16px] font-bold text-[#2c2c2c]">
                          {item.title}
                        </h3>
                        <FaCaretDown className="mt-1 h-5 w-5 shrink-0 text-[#2c2c2c]" aria-hidden="true" />
                      </div>
                      <p className="mt-1 w-full text-left text-[13px] leading-relaxed text-[#606060]">
                        {item.desc}
                      </p>
                    </div>
                  </>
                )}
              </div>
            ))}
            
            {/* Image in the middle for mobile */}
            <div className="relative mx-auto my-2 w-full overflow-hidden rounded-[10px] shadow-sm">
              <img
                src={featureImage}
                alt={t("features.bannerAlt")}
                className="h-28 w-full object-cover sm:h-36"
              />
              <div className="absolute inset-0 bg-[rgba(205,205,205,0.47)]" />
            </div>

            {features.slice(2).map((item, index) => (
              <div
                key={item.id}
                className={cn(
                  "flex w-full items-start gap-4",
                  index % 2 === 0 ? "px-6" : "px-0" // index 0 is Item 3, index 1 is Item 4
                )}
                dir="ltr">
                {isRTL ? (
                  <>
                    <div className="flex w-full flex-1 flex-col items-end pt-1 text-right">
                      <div className="flex w-full items-start justify-between gap-2">
                        <FaCaretDown className="mt-1 h-5 w-5 shrink-0 text-[#2c2c2c]" aria-hidden="true" />
                        <h3 className="text-right text-[16px] font-bold text-[#2c2c2c]">
                          {item.title}
                        </h3>
                      </div>
                      <p className="mt-1 w-full text-right text-[13px] leading-relaxed text-[#606060]">
                        {item.desc}
                      </p>
                    </div>
                    <div className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[#333] text-[14px] font-medium text-[#333]">
                      {item.id}
                    </div>
                  </>
                ) : (
                  <>
                    <div className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[#333] text-[14px] font-medium text-[#333]">
                      {item.id}
                    </div>
                    <div className="flex w-full flex-1 flex-col items-start pt-1 text-left">
                      <div className="flex w-full items-start justify-between gap-2">
                        <h3 className="text-left text-[16px] font-bold text-[#2c2c2c]">
                          {item.title}
                        </h3>
                        <FaCaretDown className="mt-1 h-5 w-5 shrink-0 text-[#2c2c2c]" aria-hidden="true" />
                      </div>
                      <p className="mt-1 w-full text-left text-[13px] leading-relaxed text-[#606060]">
                        {item.desc}
                      </p>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Desktop Layout (Restored Original) */}
        <div className="hidden md:block">
          {/* Banner Image */}
          <div className="relative mx-auto w-full overflow-hidden rounded-[20px] shadow-sm">
            <img
              src={featureImage}
              alt={t("features.bannerAlt")}
              className="h-28 w-full object-cover sm:h-36 md:h-48 lg:h-56"
            />
            <div className="absolute inset-0 bg-[rgba(205,205,205,0.47)]" />
          </div>

          {/* Features Staggered Grid */}
          <div className="mt-8 grid grid-cols-1 gap-x-12 gap-y-8 md:mt-12 md:grid-cols-2 md:gap-y-10">
            {features.map((item, index) => (
              <div
                key={item.id}
                className={cn(
                  "flex items-start gap-4",
                  index % 2 !== 0 && "md:mt-10", // Staggers the left column in RTL
                )}>
                {/* Number Circle */}
                <div className="mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[#8b8b8b] text-[15px] font-medium text-[#333]">
                  {item.id}
                </div>

                {/* Content */}
                <div className="flex flex-1 flex-col pt-1">
                  {/* Title & Arrow */}
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="text-[16px] font-semibold text-[#2c2c2c] md:text-[18px]">
                      {item.title}
                    </h3>
                    <FaCaretDown
                      className="mt-1 h-5 w-5 shrink-0 text-[#2c2c2c]"
                      aria-hidden="true"
                    />
                  </div>

                  {/* Description */}
                  <p className="mt-3 text-[13px] leading-relaxed text-[#606060] md:text-[14px]">
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default FeaturesSection;
