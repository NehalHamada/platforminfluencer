import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { ChevronDown } from "lucide-react";
import { useTranslation } from "react-i18next";
import featImg from "/assets/featImg.jpg";

function FeaturesSection() {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.dir() === "rtl";

  const features = [{ id: "1" }, { id: "2" }, { id: "3" }, { id: "4" }];

  return (
    <section
      className="mb-8 overflow-hidden bg-[#e7e6dc] px-4 py-8"
      dir={isRTL ? "rtl" : "ltr"}>
      <div className="mx-auto max-w-6xl">
        <Card className="relative overflow-hidden rounded-2xl border-0 py-0 shadow-none">
          <img
            src={featImg}
            alt={t("features.bannerAlt")}
            className="h-24 w-full object-cover sm:h-28 md:h-35"
          />
          <div className="absolute inset-0 bg-[rgba(205,205,205,0.47)]" />
        </Card>

        <div className="mt-10 grid grid-cols-1 gap-x-10 gap-y-8 md:grid-cols-2 md:gap-x-14">
          {features.map((item) => (
            <Card
              key={item.id}
              className="mx-auto w-full max-w-[20rem] border-0 bg-transparent py-0 shadow-none sm:max-w-[24rem] md:max-w-none">
              <CardContent className="p-2">
                <div
                  className={cn(
                    "mb-3 flex flex-col items-center justify-start text-center md:items-start md:justify-between md:text-start",
                    isRTL ? "md:flex-row" : "md:flex-row",
                  )}>
                  <div
                    className={cn(
                      "flex w-full min-w-0 flex-col items-center justify-center gap-2 text-center md:justify-start",
                      isRTL ? "md:flex-row" : "md:flex-row",
                    )}>
                    <div className="flex h-8 w-8 items-center justify-center rounded-full border border-[#7d7d75] text-sm text-[#2f2f2f]">
                      {item.id}
                    </div>

                    <CardTitle className="min-w-0 max-w-[16rem] wrap-break-words text-center text-[16px] font-medium leading-normal text-[#2b2b2b] sm:max-w-[20rem] sm:text-[19px] md:max-w-none md:text-start md:text-[22px]">
                      {t(`features.items.${item.id}.title`)}
                    </CardTitle>

                    <ChevronDown
                      className="h-4 w-4 shrink-0 text-[#2f2f2f] md:mt-1"
                      aria-hidden="true"
                    />
                  </div>
                </div>

                <div className={cn(isRTL ? "md:pr-10" : "md:pl-10")}>
                  <CardDescription className="mx-auto max-w-[18rem] wrap-break-words text-center text-[13px] leading-7 text-[#55554f] sm:max-w-88 sm:text-[14px] md:mx-0 md:max-w-xl md:text-start md:text-[15px]">
                    {t(`features.items.${item.id}.desc`)}
                  </CardDescription>
                </div>

                {item.id !== features[features.length - 1].id && (
                  <Separator className="mt-6 bg-[#cfcdbf] md:hidden" />
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

export default FeaturesSection;
