import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { BsHddStack } from "react-icons/bs";
import chI1 from "/assets/choImg1.png";
import chI2 from "/assets/choImg2.png";
import chI3 from "/assets/choImg3.png";
import chI4 from "/assets/choImg4.png";
import type { LandingSection } from "@/types/landing.types";
import {
  getImageList,
  getString,
  isRecord,
  sectionText,
} from "@/utils/landing";

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

  const title = sectionText(data, "title", t("whyChooseUs"), true);

  const features = apiPoints.length
    ? apiPoints.map((point, index) =>
        t(
          getString(point, "title") ||
            getString(point, "desc") ||
            `feature${(index % 4) + 1}`,
        ),
      )
    : [t("feature1"), t("feature2"), t("feature3"), t("feature4")];

  return (
    <section
      dir={isRTL ? "rtl" : "ltr"}
      className="font-ibm-plex overflow-hidden bg-[rgba(26,20,37,1)] px-4 py-16 md:py-24 mt-3">
      <div className="mx-auto flex max-w-6xl flex-col-reverse gap-12 md:grid md:grid-cols-2 md:gap-20 md:items-center">
        {/* Mobile Text Section */}
        <div className="flex w-full flex-col md:hidden">
          <div className="w-full text-center">
            <div className="mb-10 inline-block border-b-[1.5px] border-white pb-2">
              <h2 className="text-[18px] font-semibold tracking-wide text-white">
                {isRTL ? "ما الذي يميزنا ؟" : title}
              </h2>
            </div>
          </div>

          <ul className="mt-2 flex w-full flex-col gap-6">
            {(isRTL
              ? [
                  "سهولة الوصول لمؤثرين موثوقين",
                  "اسعار واضحة",
                  "تواصل داخل المنصة",
                  "دفع مضمون",
                ]
              : features
            ).map((item, index) => (
              <li
                key={index}
                className={cn(
                  "flex w-full items-center gap-4",
                  isRTL ? "justify-end" : "justify-start",
                  [
                    "",
                    isRTL ? "pr-10" : "pl-10",
                    isRTL ? "pr-20" : "pl-20",
                    isRTL ? "pr-30" : "pl-30",
                  ][index] ?? "",
                )}
                dir="ltr">
                {isRTL ? (
                  <>
                    <span className="text-right text-[12px] leading-relaxed text-[#dcdcdc]">
                      {item}
                    </span>
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[10px] bg-[rgba(111,66,193,0.2)] text-[rgba(201,162,39,1)] shadow-sm">
                      <BsHddStack size={20} aria-hidden="true" />
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[10px] bg-[rgba(111,66,193,0.2)] text-[rgba(201,162,39,1)] shadow-sm">
                      <BsHddStack size={20} aria-hidden="true" />
                    </div>
                    <span className="text-left text-[12px] leading-relaxed text-[#dcdcdc]">
                      {item}
                    </span>
                  </>
                )}
              </li>
            ))}
          </ul>
        </div>

        {/* Desktop Text Section (Restored Original) */}
        <div className="hidden w-full flex-col items-start text-start md:flex">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="mb-10 inline-block border-b-2 border-[#e1e1e1] pb-3">
            <h2 className="text-[22px] font-semibold tracking-wide text-white">
              {title}
            </h2>
          </motion.div>

          <motion.ul
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={{
              hidden: {},
              visible: { transition: { staggerChildren: 0.1 } },
            }}
            className="flex w-full flex-col gap-6">
            {features.map((item, index) => (
              <motion.li
                key={index}
                variants={{
                  hidden: { opacity: 0, x: -24 },
                  visible: {
                    opacity: 1,
                    x: 0,
                    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
                  },
                }}
                className="flex w-full items-center justify-start gap-4">
                {/* Icon (DOM Order 1 => Right in RTL, Left in LTR) */}
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[10px] bg-[rgba(111,66,193,0.2)] text-[rgba(201,162,39,1)] shadow-sm">
                  <BsHddStack size={18} aria-hidden="true" />
                </div>

                {/* Text (DOM Order 2 => Left in RTL, Right in LTR) */}
                <span className="text-[13px] leading-relaxed text-[#dcdcdc]">
                  {item}
                </span>
              </motion.li>
            ))}
          </motion.ul>
        </div>

        {/* Photos Section (DOM Order 2 => Left in RTL, Right in LTR) */}
        <div className="flex w-full justify-center">
          <div className="grid w-full max-w-md grid-cols-3 grid-rows-2 gap-3 sm:gap-4">
            <img
              src={images[0]}
              alt="Feature 1"
              className="row-span-2 h-full min-h-50 w-full object-cover sm:min-h-62.5 md:min-h-87.5"
            />
            <img
              src={images[1]}
              alt="Feature 2"
              className="h-full min-h-23.75 w-full object-cover sm:min-h-30 md:min-h-42.5"
            />
            <img
              src={images[2]}
              alt="Feature 3"
              className="row-span-2 h-full min-h-50 w-full object-cover sm:min-h-62.5 md:min-h-87.5"
            />
            <img
              src={images[3]}
              alt="Feature 4"
              className="h-full min-h-23.75 w-full object-cover sm:min-h-30 md:min-h-42.5"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

export default WhyChooseUs;
