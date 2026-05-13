import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
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

import { Button } from "@/components/ui/Button";

type PhotoesProps = {
  data?: LandingSection | null;
};

function Photoes({ data }: PhotoesProps) {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language.startsWith("ar");
  const title = sectionText(data, "title", t("campaignTitle"), isRTL);
  const description = sectionText(
    data,
    "description",
    t("campaignDesc"),
    isRTL,
  );
  const apiImages = getImageList(data?.content);
  const image1 = apiImages[0] ?? im1;
  const image2 = apiImages[1] ?? im2;
  const image3 = apiImages[2] ?? im3;

  return (
    <section className="relative w-full overflow-hidden bg-white mt-12 py-4 lg:py-6 font-['IBM_Plex_Sans_Arabic']">
      {/* Background Decorative Spirals - Fixed positions */}
      <img
        src={style}
        alt=""
        className={cn(
          "pointer-events-none absolute w-64 opacity-15 lg:w-96",
          "-left-24 top-0",
        )}
      />
      <img
        src={style}
        alt=""
        className={cn(
          "pointer-events-none absolute w-64 opacity-15 lg:w-96",
          "-right-24 bottom-0 rotate-180",
        )}
      />

      <div className="container mx-auto px-4 ">
        <div
          className="flex flex-col gap-2 lg:flex-row lg:items-stretch"
          style={{ direction: "ltr" }}>
          {/* Dark Card - Fixed to Left side */}
          <Card
            className={cn(
              "relative flex flex-col justify-start rounded-[40px] border-0 bg-[#171717] p-3 text-white shadow-none lg:w-[35%] lg:p-6",
              // Inverted corner cutout always at bottom-right (inner corner when card is on left)
              "[mask-image:radial-gradient(circle_at_bottom_right,transparent_45px,black_46px)] lg:[mask-image:radial-gradient(circle_at_bottom_right,transparent_65px,black_66px)]",
            )}>
            <CardContent
              dir={isRTL ? "rtl" : "ltr"}
              className={cn(
                "flex h-full flex-col justify-start p-0 mt-15",
                isRTL ? "text-right" : "text-left",
              )}>
              <div className="space-y-2">
                <h2
                  className={cn(
                    "font-bold leading-tight text-white",
                    isRTL ? "text-2xl lg:text-3xl" : "text-xl lg:text-2xl",
                  )}>
                  {title}
                </h2>
                <p
                  className={cn(
                    "max-w-md text-white/80 leading-relaxed",
                    isRTL ? "text-lg lg:text-xl" : "text-base lg:text-lg",
                  )}>
                  {description}
                </p>
              </div>

              <div
                className={cn(
                  "mt-35  flex flex-col gap-2",
                  isRTL ? "items-start ms-15" : "items-start ms-60",
                )}>
                <div className="flex -space-x-4 ">
                  {avatarsTop.map((img, index) => (
                    <Avatar
                      key={`avatar-top-${index}`}
                      className="h-10 w-10 border-2 border-[#171717] ring-0">
                      <AvatarImage
                        src={img}
                        alt={`user-top-${index + 1}`}
                        className="object-cover"
                      />
                    </Avatar>
                  ))}
                </div>
                <div className="flex -space-x-4">
                  {avatarsBottom.map((img, index) => (
                    <Avatar
                      key={`avatar-bottom-${index}`}
                      className="h-10 w-10 border-2 border-[#171717] ring-0">
                      <AvatarImage
                        src={img}
                        alt={`user-bottom-${index + 1}`}
                        className="object-cover"
                      />
                    </Avatar>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Image Grid - Fixed to Right side */}
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:flex-1 lg:grid-cols-2 lg:grid-rows-2 lg:max-h-[480px]">
            {/* Column 1 (Two stacked images) */}
            <div className="flex flex-col gap-2 lg:row-span-2">
              <div className="overflow-hidden rounded-[40px] bg-[#E0E0E0] lg:h-[45%]">
                <img
                  src={image1}
                  alt="Campaign 1"
                  className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
                />
              </div>
              <div className="overflow-hidden rounded-[40px] bg-[#E0E0E0] lg:flex-1">
                <img
                  src={image3}
                  alt="Campaign 3"
                  className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
                />
              </div>
            </div>

            {/* Column 2 (One tall image + try free button) */}
            <div className="flex flex-col gap-2 lg:row-span-2">
              <div className="overflow-hidden rounded-[40px] bg-[#E0E0E0] lg:h-[82%]">
                <img
                  src={image2}
                  alt="Campaign 2"
                  className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
                />
              </div>
              <Button
                variant="ghost"
                className="w-full h-full rounded-[40px] bg-[#C8D9A9] text-[#171717] hover:bg-[#B5C898] transition-colors font-bold text-lg lg:flex-1">
                {t("TryFree")}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Photoes;
