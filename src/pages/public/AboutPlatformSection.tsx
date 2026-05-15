import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { ChevronRight } from "lucide-react";
import { useTranslation } from "react-i18next";
import centerImg from "/assets/platImg.png";
import profileImg from "/assets/platImg1.png";
import logoImg from "/assets/platLogo.png";
import bgImage from "/assets/login-register.png";
import type { LandingSection } from "@/types/landing.types";
import { getImageList, getString, sectionText } from "@/utils/landing";

// RATIONALE: Using the mask-image technique from Photoes.tsx to create perfect geometric interlocks.
const FONT_IMPORT = `
@import url('https://fonts.googleapis.com/css2?family=Underdog&display=swap');
.font-underdog { font-family: 'Underdog', cursive; }
`;

type AboutPlatformSectionProps = {
  data?: LandingSection | null;
};

function AboutPlatformSection({ data }: AboutPlatformSectionProps) {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.dir() === "rtl";
  const content = data?.content;

  const cardTitle =
    getString(content, isRTL ? "about_title" : "about_title_en") ||
    t("aboutPlatform.cardTitle", "Know us");

  const cardDesc =
    getString(content, isRTL ? "about_desc" : "about_desc_en") ||
    sectionText(data, "description", t("aboutPlatform.cardDesc"), isRTL);

  const apiImages = getImageList(content);
  const mainImage = apiImages[0] ?? centerImg;
  const profileImage = apiImages[1] ?? profileImg;

  const stats = [
    {
      id: 1,
      value:
        getString(content, "exp_years") || t("aboutPlatform.stats.1.value"),
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
      className={cn(
        "relative overflow-hidden bg-[#f5f5f2] font-['IBM_Plex_Sans_Arabic'] py-16 px-4 sm:px-6 lg:px-8",
      )}>
      <style>{FONT_IMPORT}</style>

      {/* ── Background Image ── */}
      <img
        src={bgImage}
        alt=""
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-[0.1]"
      />

      <div className="relative mx-auto max-w-7xl">
        {/* ── Header: Title with Logo ── */}
        <motion.header
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="mb-4 text-center">
          <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2">
            <span
              className={cn(
                "font-bold text-[#1a1a1a] leading-tight",
                isRTL ? "text-2xl md:text-[38px]" : "text-xl md:text-[30px]",
              )}>
              {t("aboutPlatform.title1")}
            </span>
            <img
              src={logoImg}
              alt=""
              className="h-14 w-14 object-contain md:h-18 md:w-18"
            />
            <span
              className={cn(
                "font-bold text-[#1a1a1a] leading-tight",
                isRTL ? "text-2xl md:text-[38px]" : "text-xl md:text-[30px]",
              )}>
              {t("aboutPlatform.title2")}
            </span>
          </div>
          <h2
            className={cn(
              "mt-2 font-bold text-[#1a1a1a] leading-tight",
              isRTL ? "text-2xl md:text-[38px]" : "text-xl md:text-[30px]",
            )}>
            {t("aboutPlatform.title3")}
          </h2>
        </motion.header>

        <div className={cn("flex flex-col gap-12 lg:flex-row lg:items-center")}>
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={{
              hidden: {},
              visible: { transition: { staggerChildren: 0.12 } },
            }}
            className={cn(
              "flex flex-row flex-wrap justify-center gap-x-12 gap-y-6 lg:flex-col lg:justify-center lg:gap-4 lg:w-[18%]",
              isRTL ? "text-right lg:items-end" : "text-left lg:items-start",
            )}>
            {stats.map((item) => (
              <motion.div
                key={item.id}
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: {
                    opacity: 1,
                    y: 0,
                    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
                  },
                }}
                className="flex flex-col">
                <span
                  className={cn(
                    "font-underdog leading-none text-[#1a1a1a] font-bold",
                    isRTL
                      ? "text-[36px] md:text-[46px]"
                      : "text-[28px] md:text-[36px]",
                  )}>
                  {item.value}
                </span>
                <span
                  className={cn(
                    "mt-2 text-[#555] font-medium",
                    isRTL ? "text-lg md:text-xl" : "text-base md:text-lg",
                  )}>
                  {item.label}
                </span>
              </motion.div>
            ))}
          </motion.div>

          {/* ── Main Area: Interlocking Image and Cards ── */}
          <div className="relative flex-1">
            <div className="relative w-full lg:max-w-2xl">
              {/* ── IMAGE CONTAINER WITH MASK CUTOUTS ── */}
              <div
                className="
    relative overflow-hidden rounded-[20px]
    bg-[rgba(26,20,37,1)] shadow-2xl

    [mask-imageradial-gradient(circle_at_bottom_left,transparent_59px,black_60px),radial-gradient(circle_at_bottom_right,transparent_59px,black_60px)]
    [-webkit-mask-image:radial-gradient(circle_at_bottom_left,transparent_59px,black_60px),radial-gradient(circle_at_bottom_right,transparent_59px,black_60px)]

    [mask-intersect]
    [-webkit-mask-composite:source-over]
  ">
                <img
                  src={mainImage}
                  alt=""
                  className="aspect-video lg:aspect-21/9 w-full object-cover opacity-90 transition-transform duration-700 hover:scale-105"
                />

                <div className="absolute inset-0 bg-linear-to-t from-black/40 via-transparent to-transparent" />
              </div>

              {/* ── "اعرف المزيد" Area (Bottom Right in RTL, Bottom Left in LTR) ── */}
              <div className="lg:absolute lg:bottom-0 ltr:lg:left-0 rtl:lg:right-0 z-30 mt-6 lg:mt-0">
                <div className="flex h-18.5 lg:h- w-full lg:w-55 items-center justify-center rounded-[15px] lg:rounded-none ltr:lg:rounded-tr-[15px] rtl:lg:rounded-tl-[15px] bg-[rgba(111,66,193,0.08)] backdrop-blur-sm">
                  <Button
                    type="button"
                    className="h-12 rounded-[15px] bg-[linear-gradient(135deg,rgba(111,66,193,1),rgba(201,162,39,1))] px-10 text-white hover:opacity-90 font-bold text-lg shadow-sm">
                    <span>{t("aboutPlatform.readMore")}</span>
                    <ChevronRight
                      className={cn(
                        "ms-2",
                        !isRTL && "rotate-0",
                        isRTL && "rotate-180",
                      )}
                      size={20}
                    />
                  </Button>
                </div>
              </div>

              {/* ── "تعرف علينا" Card (Bottom Left in RTL, Bottom Right in LTR) ── */}
              <div className="lg:absolute lg:bottom-0.5 ltr:lg:right-45 rtl:lg:right-120 z-20 w-full lg:w-87.5 mt-8 lg:mt-0">
                <div className="rounded-[20px] lg:rounded-none ltr:lg:rounded-tl-[20px] rtl:lg:rounded-tr-[20px] p-5 lg:p-3 backdrop-blur-md shadow-lg lg:shadow-none">
                  <div
                    className={cn(
                      "space-y-4",
                      isRTL ? "text-right" : "text-left",
                    )}>
                    {/* Header with long separator */}
                    <div
                      className={cn(
                        "flex items-center gap-3",
                        isRTL ? "flex-row-reverse" : "flex-row",
                      )}>
                      <h3 className="text-2xl font-bold text-[#1a1a3a]">
                        {cardTitle}
                      </h3>
                      <div className="h-0.5 flex-1 bg-[#1a1a3a]/30" />
                    </div>

                    {/* Main description text */}
                    <p className="text-[14px] leading-relaxed text-[#1a1a3a] font-bold">
                      {cardDesc}
                    </p>

                    {/* Secondary smaller description text */}
                    <div
                      className={cn(
                        "flex items-end justify-between gap-4",
                        !isRTL && "flex-row-reverse",
                      )}>
                      <p className="text-[11px] leading-relaxed text-[#1a1a3a]/80 max-w-45">
                        {cardDesc}
                      </p>
                      <Button
                        size="icon"
                        className="h-12 w-12 rounded-sm bg-[linear-gradient(135deg,rgba(111,66,193,1),rgba(201,162,39,1))] text-white hover:opacity-90 shadow-md border-0 shrink-0">
                        <svg
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="3"
                          strokeLinecap="round"
                          strokeLinejoin="round">
                          <line x1="7" y1="7" x2="17" y2="17"></line>
                          <polyline points="17 7 17 17 7 17"></polyline>
                        </svg>
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              {/* ── Floating Avatar (Top Left in RTL, Top Right in LTR) ── */}
              <div className="hidden lg:block absolute top-3 ltr:-right-40 rtl:-left-40 z-30">
                <div className="relative h-28 w-28">
                  <svg
                    viewBox="0 0 100 100"
                    className="absolute inset-0 h-full w-full animate-[spin_25s_linear_infinite]">
                    <path
                      id="circle"
                      fill="transparent"
                      d="M 50, 50 m -38, 0 a 38,38 0 1,1 76,0 a 38,38 0 1,1 -76,0"
                    />
                    <text className="fill-[#555] text-[7.5px] uppercase tracking-[0.25em] font-bold">
                      <textPath href="#circle">
                        PRASHANT KUMAR SINGH • PRASHANT KUMAR SINGH •
                      </textPath>
                    </text>
                  </svg>
                  <div className="absolute inset-4 overflow-hidden rounded-full shadow-xl">
                    <img
                      src={profileImage}
                      alt=""
                      className="h-full w-full object-cover"
                    />
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

export default AboutPlatformSection;
