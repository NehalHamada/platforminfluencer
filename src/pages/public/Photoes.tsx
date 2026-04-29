import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { ArrowBigLeft, ArrowBigRight } from "lucide-react";
import { useTranslation } from "react-i18next";
import im1 from "/assets/image1.png";
import im2 from "/assets/image2.png";
import im3 from "/assets/image3.png";
import style from "/assets/style.png";
import us1 from "/assets/user1.png";
import us2 from "/assets/user2.png";
import us3 from "/assets/user3.png";

const avatarsTop = [us1, us2, us3];
const avatarsBottom = [us1, us2, us3];

function Photoes() {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language.startsWith("ar");

  return (
    <section
      dir={isRTL ? "rtl" : "ltr"}
      className="relative overflow-hidden bg-[#f3f3f3] py-8 sm:py-10 lg:py-14">
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

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div dir="ltr" className="grid grid-cols-2 gap-4 lg:hidden">
          <div className="col-span-2">
            <div className="relative mx-auto w-full max-w-[24rem]">
              <Card className="relative z-10 flex h-full w-full rounded-[24px] border-0 bg-[#1b1b1b] py-0 text-white shadow-none sm:rounded-[28px]">
                <CardContent
                  className={cn(
                    "relative flex h-full flex-col px-5 py-6 pb-14 sm:px-7 sm:py-7",
                    isRTL ? "items-end text-right" : "items-start text-left",
                  )}>
                  <div className="absolute bottom-0 left-0 h-18 w-20 rounded-tr-[30px] bg-[#f3f3f3]" />
                  <div className="absolute bottom-12 left-0 h-12 w-12 rounded-full bg-[#f3f3f3]" />

                  <div className="relative z-10 w-full max-w-84">
                    <h2 className="text-[1.9rem] font-bold leading-[1.6]">
                      {t("campaignTitle")}
                    </h2>

                    <p className="mt-4 text-base leading-8 text-white/85">
                      {t("campaignDesc")}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          <div className="col-span-1">
            <div className="flex h-full flex-col gap-4">
              <Card className="overflow-hidden rounded-[24px] border-0 py-0 shadow-none">
                <img
                  src={im1}
                  alt="image-1"
                  className="block h-44 w-full rounded-2xl object-cover"
                />
              </Card>

              <Card className="overflow-hidden rounded-[24px] border-0 py-0 shadow-none">
                <img
                  src={im3}
                  alt="image-3"
                  className="block h-36 w-full rounded-2xl object-cover"
                />
              </Card>
            </div>
          </div>

          <div className="col-span-1">
            <Card className="h-full overflow-hidden rounded-[30px] border-0 py-0 shadow-none">
              <img
                src={im2}
                alt="image-2"
                className="block h-full min-h-88 w-full rounded-2xl object-cover"
              />
            </Card>
          </div>
        </div>

        <div className="hidden lg:grid lg:grid-cols-12 lg:items-stretch lg:gap-4">
          <div
            className={cn(
              "lg:col-span-5",
              isRTL ? "lg:order-3" : "lg:order-1",
            )}>
            <Card className="flex h-full w-full rounded-[36px] border-0 bg-[#08090c] py-0 text-white shadow-none lg:min-h-116">
              <CardContent
                className={cn(
                  "flex h-full flex-col px-8 py-8",
                  isRTL
                    ? "items-center text-center"
                    : "items-center text-center",
                )}>
                <div className="w-full max-w-[92%]">
                  <h2 className="text-2xl font-bold leading-normal">
                    {t("campaignTitle")}
                  </h2>

                  <p className="mt-8 text-xl leading-10 text-white/85">
                    {t("campaignDesc")}
                  </p>
                </div>

                <div
                  dir="ltr"
                  className="mt-auto mb-5 flex w-full flex-col items-center gap-4">
                  <div className="flex -space-x-3">
                    {avatarsTop.map((img, index) => (
                      <Avatar
                        key={`desktop-top-${index}`}
                        className="h-14 w-14 border-2 border-white">
                        <AvatarImage
                          src={img}
                          alt={`user-top-${index + 1}`}
                          className="object-cover"
                        />
                      </Avatar>
                    ))}
                  </div>

                  <div className="flex -space-x-3">
                    {avatarsBottom.map((img, index) => (
                      <Avatar
                        key={`desktop-bottom-${index}`}
                        className="h-14 w-14 border-2 border-white">
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
          </div>

          <div className="lg:order-2 lg:col-span-3">
            <div className="flex h-full flex-col gap-4">
              <Card className="overflow-hidden rounded-[28px] border-0 py-0 shadow-none">
                <img
                  src={im1}
                  alt="image-1"
                  className="block h-88 w-full rounded-2xl object-cover"
                />
              </Card>

              <Card className="overflow-hidden rounded-[28px] border-0 py-0 shadow-none">
                <img
                  src={im3}
                  alt="image-3"
                  className="block h-44 w-full rounded-2xl object-cover"
                />
              </Card>
            </div>
          </div>

          <div
            className={cn(
              "lg:col-span-4",
              isRTL ? "lg:order-1" : "lg:order-3",
            )}>
            <div className="flex h-full flex-col gap-4">
              <Card className="overflow-hidden rounded-[28px] border-0 py-0 shadow-none">
                <img
                  src={im2}
                  alt="image-2"
                  className="block h-116 w-full rounded-2xl object-cover"
                />
              </Card>

              <Button
                type="button"
                variant="default"
                className="h-16 w-full cursor-pointer items-center justify-center rounded-full px-6 text-xl font-medium text-[#2f2f2f] transition hover:bg-[#cad9aa]">
                <span className="text-white">{t("TryFree")}</span>
                <span className="ms-3 inline-flex items-center text-white">
                  {isRTL ? (
                    <ArrowBigLeft size={22} />
                  ) : (
                    <ArrowBigRight size={22} />
                  )}
                </span>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Photoes;
