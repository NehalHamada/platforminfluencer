import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { ArrowLeft } from "lucide-react";
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
    <section
      dir={isRTL ? "rtl" : "ltr"}
      className="relative overflow-hidden bg-[#f3f3f3] py-7 sm:py-9 lg:py-12">
      <img
        src={style}
        alt=""
        className="pointer-events-none absolute -right-6 -top-4 w-24 opacity-25 sm:w-28 lg:-right-8 lg:top-0 lg:w-40"
      />

      <img
        src={style}
        alt=""
        className="pointer-events-none absolute -bottom-8 -left-6 w-24 rotate-180 opacity-25 sm:w-28 lg:-left-8 lg:w-40"
      />

      <div className="mx-auto max-w-[980px] px-4 sm:px-6 lg:px-8">
        <div
          dir="ltr"
          className="grid grid-cols-1 gap-2 md:grid-cols-[390px_260px_190px] md:items-start">
          <Card className="relative min-h-[15.5rem] overflow-hidden rounded-[24px] border-0 bg-[#171717] py-0 text-white shadow-none md:h-[315px]">
            <div className="pointer-events-none absolute bottom-0 right-0 hidden h-30 w-25 rounded-tl-[16px] bg-[#f3f3f3] md:block" />
            <CardContent
              dir={isRTL ? "rtl" : "ltr"}
              className={cn(
                "relative z-10 flex h-full flex-col px-6 py-6 sm:px-8 md:px-7 md:py-8",
                isRTL ? "items-center text-center" : "items-center text-center",
              )}>
              <div className="w-full max-w-[275px]">
                <h2
                  className={cn(
                    "font-bold leading-normal text-white",
                    isRTL
                      ? "text-xl sm:text-2xl md:text-[1.05rem]"
                      : "text-lg sm:text-xl md:text-[0.92rem]",
                  )}>
                  {title}
                </h2>

                <p
                  className={cn(
                    "mt-4 text-white/78",
                    isRTL
                      ? "text-sm leading-7 sm:text-[0.95rem] md:text-[0.82rem] md:leading-6"
                      : "text-xs leading-6 sm:text-sm md:text-[0.72rem] md:leading-5",
                  )}>
                  {description}
                </p>
              </div>

              <div
                dir="ltr"
                className="mt-auto mb-9 flex rounded-full backdrop-blur-sm md:absolute md:bottom-[58px] md:right-[122px] md:mb-0">
                <div className="flex flex-col items-end gap-1.5">
                  <div className="flex -space-x-2">
                    {avatarsTop.map((img, index) => (
                      <Avatar
                        key={`avatar-top-${index}`}
                        className="h-7 w-7 ring-2 ring-[#171717]">
                        <AvatarImage
                          src={img}
                          alt={`user-top-${index + 1}`}
                          className="object-cover"
                        />
                      </Avatar>
                    ))}
                  </div>

                  <div className="flex -space-x-2">
                    {avatarsBottom.map((img, index) => (
                      <Avatar
                        key={`avatar-bottom-${index}`}
                        className="h-7 w-7 ring-2 ring-[#171717]">
                        <AvatarImage
                          src={img}
                          alt={`user-bottom-${index + 1}`}
                          className="object-cover"
                        />
                      </Avatar>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex flex-col gap-2 md:h-[315px]">
            <Card className="h-36 overflow-hidden rounded-[24px] border-0 py-0 shadow-none sm:h-44 md:h-[183px]">
              <img
                src={image1}
                alt="image-1"
                className="block h-full w-full rounded-[24px] object-cover"
              />
            </Card>

            <Card className="h-36 overflow-hidden rounded-[24px] border-0 py-0 shadow-none sm:h-44 md:h-[124px]">
              <img
                src={image3}
                alt="image-3"
                className="block h-full w-full rounded-[24px] object-cover"
              />
            </Card>
          </div>

          <div className="flex flex-col gap-2 md:h-[315px]">
            <Card className="h-36 overflow-hidden rounded-[24px] border-0 py-0 shadow-none sm:h-44 md:flex-1">
              <img
                src={image2}
                alt="image-2"
                className="block h-full w-full rounded-[24px] object-cover"
              />
            </Card>

            <Button
              type="button"
              dir={isRTL ? "rtl" : "ltr"}
              className="h-12 w-full rounded-full border-0 bg-[#c8d9a9] px-6 text-base font-semibold text-[#2f3329] shadow-none hover:bg-[#bfd19f] md:h-12 md:text-sm">
              <ArrowLeft size={16} aria-hidden="true" />
              <span>{t("TryFree")}</span>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Photoes;
