import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { useTranslation } from "react-i18next";
import hero from "/assets/Hero.png";

type CooperationCard = {
  id: number;
  company: string;
  contentType: string;
  date: string;
  budget: string;
};

function Cooperation() {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.dir() === "rtl";

  const items: CooperationCard[] = [
    {
      id: 1,
      company: "Glowth",
      contentType: isRTL ? "عناية بالبشرة" : "Skincare",
      date: "20-3-2026",
      budget: isRTL ? "10000 ريال" : "SAR 10000",
    },
    {
      id: 2,
      company: "Glowth",
      contentType: isRTL ? "عناية بالبشرة" : "Skincare",
      date: "20-3-2026",
      budget: isRTL ? "10000 ريال" : "SAR 10000",
    },
    {
      id: 3,
      company: "Glowth",
      contentType: isRTL ? "عناية بالبشرة" : "Skincare",
      date: "20-3-2026",
      budget: isRTL ? "10000 ريال" : "SAR 10000",
    },
    {
      id: 4,
      company: "Glowth",
      contentType: isRTL ? "عناية بالبشرة" : "Skincare",
      date: "20-3-2026",
      budget: isRTL ? "10000 ريال" : "SAR 10000",
    },
  ];

  return (
    <section
      dir={isRTL ? "rtl" : "ltr"}
      className="relative -mt-24 overflow-x-hidden bg-[rgba(255,255,255,1)]">
      <div className="relative h-44 w-full overflow-hidden sm:h-85">
        <img
          src={hero}
          alt={t("cooperation.heroAlt")}
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-black/60" />
      </div>

      <div className="relative z-10 -mt-1  bg-[rgba(255,255,255,1)] px-2 pb-20 pt-4 sm:-mt-10 sm:rounded-t-[34px] sm:px-6 sm:pb-8 sm:pt-6 lg:rounded-t-[42px] lg:px-10 lg:pt-8">
        <div className="mx-auto max-w-7xl">
          <div className="bg-transparent py-0  sm:rounded-[28px] sm:bg-white sm:shadow-[0_16px_48px_rgba(28,30,24,0.06)]">
            <CardContent className="p-0 sm:p-8">
              <div className="mx-auto max-w-5xl">
                <CardHeader className="items-center px-0 pb-0 text-center">
                  <CardTitle className="text-sm font-semibold text-[#20201d] sm:text-3xl sm:underline">
                    {t("cooperation.title")}
                  </CardTitle>
                </CardHeader>

                <div className="mt-4 grid grid-cols-1 gap-3 sm:mt-8 sm:gap-5 md:grid-cols-2">
                  {items.map((item) => (
                    <Card
                      key={item.id}
                      className="rounded-[10px]  bg-[rgba(255,255,255,1)] py-0 shadow-[0_4px_14px_rgba(24,24,20,0.03)] sm:rounded-[18px] sm:shadow-[0_6px_18px_rgba(24,24,20,0.03)]">
                      <CardContent className="px-4 py-3 sm:p-4">
                        <dl
                          className={cn(
                            "grid grid-cols-1 gap-y-2 text-center sm:gap-x-5 sm:gap-y-4 sm:grid-cols-2",
                            isRTL ? "sm:text-right" : "sm:text-left",
                          )}>
                          <div className="flex items-center justify-center gap-1 sm:block sm:space-y-1">
                            <dt className="text-[10px] font-bold text-[#2c2c27] sm:text-sm sm:font-semibold">
                              {t("cooperation.companyName")} :
                            </dt>
                            <dd className="text-[10px] text-[#66665f] sm:text-sm">
                              {item.company}
                            </dd>
                          </div>

                          <div className="flex items-center justify-center gap-1 sm:block sm:space-y-1">
                            <dt className="text-[10px] font-bold text-[#2c2c27] sm:text-sm sm:font-semibold">
                              {t("cooperation.contentType")} :
                            </dt>
                            <dd className="text-[10px] text-[#66665f] sm:text-sm">
                              {item.contentType}
                            </dd>
                          </div>

                          <div className="flex items-center justify-center gap-1 sm:block sm:space-y-1">
                            <dt className="text-[10px] font-bold text-[#2c2c27] sm:text-sm sm:font-semibold">
                              {t("cooperation.date")} :
                            </dt>
                            <dd className="text-[10px] text-[#66665f] sm:text-sm">
                              {item.date}
                            </dd>
                          </div>

                          <div className="flex items-center justify-center gap-1 sm:block sm:space-y-1">
                            <dt className="text-[10px] font-bold text-[#2c2c27] sm:text-sm sm:font-semibold">
                              {t("cooperation.budget")} :
                            </dt>
                            <dd className="text-[10px] text-[#66665f] sm:text-sm">
                              {item.budget}
                            </dd>
                          </div>
                        </dl>

                        <Separator className="my-2 bg-[#ece7dd] sm:my-5" />

                        <div
                          dir="ltr"
                          className="grid grid-cols-2 gap-2 sm:hidden">
                          <Button
                            type="button"
                            variant="outline"
                            className="h-5 rounded-full border border-[#ea9f9f] bg-white text-[9px] font-medium text-[#e25d5d] hover:bg-[#fff7f7]">
                            {t("cooperation.reject")}
                          </Button>
                          <Button
                            type="button"
                            variant="outline"
                            className="h-5 rounded-full border border-[#aacd9f] bg-white text-[9px] font-medium text-[#5faa55] hover:bg-[#f7fcf5]">
                            {t("cooperation.accept")}
                          </Button>
                        </div>

                        <div className="hidden grid-cols-1 gap-3 sm:grid sm:grid-cols-2">
                          <Button
                            type="button"
                            variant="outline"
                            className="h-11 rounded-full border border-[#ea9f9f] bg-white text-sm font-medium text-[#e25d5d] hover:bg-[#fff7f7]">
                            {t("cooperation.reject")}
                          </Button>
                          <Button
                            type="button"
                            variant="outline"
                            className="h-11 rounded-full border border-[#aacd9f] bg-white text-sm font-medium text-[#5faa55] hover:bg-[#f7fcf5]">
                            {t("cooperation.accept")}
                          </Button>
                        </div>

                        <Button
                          type="button"
                          variant="outline"
                          className="mt-1.5 h-5 w-full rounded-full border-0 bg-[#ededed] text-[9px] font-medium text-[#6f6d66] hover:bg-[#ededed] sm:mt-3 sm:h-11 sm:border sm:border-[#d7d4ca] sm:bg-white sm:text-sm sm:hover:bg-[#faf9f5]">
                          {t("cooperation.negotiate")}
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </CardContent>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Cooperation;
