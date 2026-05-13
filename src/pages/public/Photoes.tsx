import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import { useTranslation } from "react-i18next";
import im1 from "/assets/image1.png";
import im2 from "/assets/image2.png";
import im3 from "/assets/image3.png";
import style from "/assets/style.png";
import us1 from "/assets/user1.png";
import us2 from "/assets/user2.png";
import us3 from "/assets/user3.png";
import type { LandingSection } from "@/types/landing.types";
import { getImageList, sectionText } from "@/utils/landing";

const avatarsTop = [us1, us2, us3];
const avatarsBottom = [us1, us2, us3];

type PhotoesProps = {
  data?: LandingSection | null;
};

function Photoes({ data }: PhotoesProps) {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language.startsWith("ar");
  const title = sectionText(data, "title", t("campaignTitle"), isRTL);
  const description = sectionText(data, "description", t("campaignDesc"), isRTL);
  const apiImages = getImageList(data?.content);
  const image1 = apiImages[0] ?? im1;
  const image2 = apiImages[1] ?? im2;
  const image3 = apiImages[2] ?? im3;

  // RATIONALE: OVERLAP = how many px image3's wrapper slides LEFT over the black card.
  // The same value drives the mask-image circle radius on the card so the "bite"
  // in the card's bottom-right corner matches the image wrapper's left edge exactly.
  const OVERLAP = 52; // px

  return (
    <section className="relative w-full overflow-hidden bg-white mt-8 py-2 lg:py-4 font-['IBM_Plex_Sans_Arabic']">
      {/* Background decorative spirals */}
      <img src={style} alt="" aria-hidden="true"
        className="pointer-events-none absolute -left-24 top-0 w-64 opacity-15 lg:w-96" />
      <img src={style} alt="" aria-hidden="true"
        className="pointer-events-none absolute -right-24 bottom-0 w-64 rotate-180 opacity-15 lg:w-96" />

      <div className="mx-auto max-w-4xl px-6 lg:px-10">
        {/*
          LAYOUT (always LTR regardless of language):
          ┌──────────────────┬──────────────┬──────────────┐
          │                  │   image1     │              │
          │   BLACK CARD     │  (balloon)   │   image2     │
          │   (cutout at     ├──────────────┤   (tall)     │
          │   bottom-right)  │  [image3   ◄─┤              │
          │                  │   overlaps]  ├──────────────┤
          └──────────────────┘              │  TryFree btn │
                                            └──────────────┘

          image3 has negative margin-left = -OVERLAP so it slides
          LEFT into the black card's bottom-right area.
          Black card has mask-image cutout at BOTTOM-RIGHT with radius = OVERLAP.
        */}
        {/* Mobile Layout */}
        <div className="flex flex-col gap-4 lg:hidden" style={{ direction: "ltr" }}>
          {/* Black Card - Exact copy */}
          <div
            className={cn(
              "relative shrink-0 rounded-[40px] bg-[#171717] text-white",
              "p-5",
            )}
            style={{
              WebkitMaskImage: `radial-gradient(circle at bottom right, transparent ${OVERLAP - 2}px, black ${OVERLAP}px)`,
              maskImage: `radial-gradient(circle at bottom right, transparent ${OVERLAP - 2}px, black ${OVERLAP}px)`,
            }}
          >
            <div
              dir={isRTL ? "rtl" : "ltr"}
              className={cn(
                "flex h-full flex-col",
                isRTL ? "text-right" : "text-left",
              )}
            >
              <div className="space-y-3">
                <h2
                  className={cn(
                    "font-bold leading-tight text-white",
                    isRTL ? "text-2xl" : "text-xl",
                  )}
                >
                  {title}
                </h2>
                <p
                  className={cn(
                    "text-white/80 leading-relaxed",
                    isRTL ? "text-base" : "text-sm",
                  )}
                >
                  {description}
                </p>
              </div>

              <div className="mt-6 flex flex-col items-start gap-2">
                <div className="flex -space-x-3">
                  {avatarsTop.map((img, i) => (
                    <Avatar key={`m-t${i}`} className="h-9 w-9 border-2 border-[#171717]">
                      <AvatarImage src={img} alt={`user-${i}`} className="object-cover" />
                    </Avatar>
                  ))}
                </div>
                <div className="flex -space-x-3 ms-4">
                  {avatarsBottom.map((img, i) => (
                    <Avatar key={`m-b${i}`} className="h-9 w-9 border-2 border-[#171717]">
                      <AvatarImage src={img} alt={`user-b${i}`} className="object-cover" />
                    </Avatar>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Images Grid */}
          <div className="flex gap-3 h-[320px]">
            {/* Left Column (2 stacked images) */}
            <div className="flex flex-1 flex-col gap-3">
              <div className="flex-1 overflow-hidden rounded-[24px] bg-[#E0E0E0]">
                <img
                  src={image1}
                  alt="Campaign 1"
                  className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
                />
              </div>
              <div className="flex-1 overflow-hidden rounded-[24px] bg-[#E0E0E0]">
                <img
                  src={image3}
                  alt="Campaign 3"
                  className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
                />
              </div>
            </div>
            
            {/* Right Column (1 tall image) */}
            <div className="flex-1 overflow-hidden rounded-[24px] bg-[#E0E0E0]">
              <img
                src={image2}
                alt="Campaign 2"
                className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
              />
            </div>
          </div>

          {/* Try Free Button */}
          <Button
            variant="ghost"
            className="mt-2 w-full rounded-[40px] bg-[#C8D9A9] py-6 text-base font-bold text-[#171717] transition-colors hover:bg-[#B5C898]"
          >
            {t("TryFree")}
          </Button>
        </div>

        {/* Desktop Layout (Restored Original) */}
        <div
          className="hidden flex-row items-stretch gap-2 lg:flex"
          style={{ direction: "ltr" }}
        >
          {/* ── Column 1: Black card ── */}
          <div
            className={cn(
              "relative shrink-0 rounded-[40px] bg-[#171717] text-white",
              "p-4 lg:p-6",
              "lg:w-[35%]",
            )}
            style={{
              // Circular bite at bottom-right corner — radius matches OVERLAP
              WebkitMaskImage: `radial-gradient(circle at bottom right, transparent ${OVERLAP - 2}px, black ${OVERLAP}px)`,
              maskImage: `radial-gradient(circle at bottom right, transparent ${OVERLAP - 2}px, black ${OVERLAP}px)`,
            }}
          >
            <div
              dir={isRTL ? "rtl" : "ltr"}
              className={cn(
                "flex h-full flex-col",
                isRTL ? "text-right" : "text-left",
              )}
            >
              {/* RATIONALE: No spacer — content starts at top of card as per design */}

              <div className="space-y-3">
                <h2
                  className={cn(
                    "font-bold leading-tight text-white",
                    isRTL ? "text-2xl lg:text-3xl" : "text-xl lg:text-2xl",
                  )}
                >
                  {title}
                </h2>
                <p
                  className={cn(
                    "text-white/80 leading-relaxed",
                    isRTL ? "text-base lg:text-lg" : "text-sm lg:text-base",
                  )}
                >
                  {description}
                </p>
              </div>

              {/* Avatar group — staggered two rows, below the text */}
              <div
                className={cn(
                  "mt-6 flex flex-col gap-2",
                  "items-start",
                )}
              >
                <div className="flex -space-x-3">
                  {avatarsTop.map((img, i) => (
                    <Avatar key={`t${i}`} className="h-9 w-9 border-2 border-[#171717]">
                      <AvatarImage src={img} alt={`user-${i}`} className="object-cover" />
                    </Avatar>
                  ))}
                </div>
                <div className="flex -space-x-3 ms-4">
                  {avatarsBottom.map((img, i) => (
                    <Avatar key={`b${i}`} className="h-9 w-9 border-2 border-[#171717]">
                      <AvatarImage src={img} alt={`user-b${i}`} className="object-cover" />
                    </Avatar>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* ── Column 2: image1 (top) + image3 interlocking (bottom) ── */}
          <div className="flex flex-col gap-2 lg:flex-1">
            {/* image1 — balloon girl */}
            <div className="overflow-hidden rounded-[40px] bg-[#E0E0E0] h-28 lg:h-[54%]">
              <img
                src={image1}
                alt="Campaign 1"
                className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
              />
            </div>

            {/*
              image3 wrapper — the interlock element:
              - bg-white p-2  → white padding = section bg color → visible as "gap"
              - rounded-[40px] → outer rounding
              - negative margin-left (-OVERLAP px) slides it LEFT over the black card
              - z-10 so it sits ON TOP of the card's mask area
            */}
            <div
              className="relative z-10 flex-1 rounded-[40px] bg-white p-4"
              style={{ marginLeft: `-${OVERLAP}px` }}
            >
              <div className="overflow-hidden rounded-[28px] bg-[#E0E0E0] h-full min-h-20 max-h-28 lg:max-h-36">
                <img
                  src={image3}
                  alt="Campaign 3"
                  className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
                />
              </div>
            </div>
          </div>

          {/* ── Column 3: image2 (tall) + Try Free button ── */}
          <div className="flex flex-col gap-2 lg:w-[20%]">
            <div className="overflow-hidden rounded-[40px] bg-[#E0E0E0] h-28 lg:flex-1">
              <img
                src={image2}
                alt="Campaign 2"
                className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
              />
            </div>
            <Button
              variant="ghost"
              className="rounded-[40px] bg-[#C8D9A9] text-[#171717] hover:bg-[#B5C898] transition-colors font-bold text-base py-6"
            >
              {t("TryFree")}
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Photoes;
