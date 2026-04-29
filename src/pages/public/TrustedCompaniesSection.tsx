import CompanyCard from "@/components/common/CompanyCard";
import { Card, CardContent, CardDescription, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useTranslation } from "react-i18next";
import "../../index.css";

function TrustedCompaniesSection() {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.dir() === "rtl";

  const firstRow = [
    { id: 1, icon: "puzzle" },
    { id: 2, icon: "grid" },
    { id: 3, icon: "bars" },
    { id: 4, icon: "circle" },
    { id: 1, icon: "puzzle" },
  ];

  const secondRow = [
    { id: 5, icon: "grid" },
    { id: 6, icon: "circle" },
    { id: 7, icon: "puzzle" },
    { id: 8, icon: "grid" },
    { id: 5, icon: "grid" },
  ];

  return (
    <section
      dir={isRTL ? "rtl" : "ltr"}
      className="mt-4 overflow-hidden bg-[#f4f4f2] py-14 md:py-20">
      <div className="mx-auto max-w-6xl px-4">
        <Card className="border-0 bg-transparent py-0 shadow-none">
          <CardContent className="p-0">
            <div className="mx-auto text-center">
              <CardTitle className="text-[28px] font-bold leading-tight text-[#2f3133] sm:text-[34px] md:text-[58px]">
                {t("trustedCompanies.title1")}{" "}
                <span className="text-[#aeb98e]">
                  {t("trustedCompanies.count")}
                </span>{" "}
                {t("trustedCompanies.title2")}
              </CardTitle>

              <CardTitle className="mt-2 text-[28px] font-bold leading-[1.2] text-[#2f3133] sm:text-[34px] md:text-[58px]">
                {t("trustedCompanies.title3")}
              </CardTitle>

              <CardDescription className="mx-auto mt-6 max-w-175 text-[13px] leading-6 text-[#6f7174] sm:text-[14px] md:text-[16px]">
                {t("trustedCompanies.desc")}
              </CardDescription>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mt-12 space-y-7 overflow-hidden">
        <div className="relative overflow-hidden">
          <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-20 bg-linear-to-r from-[#f4f4f2] to-transparent md:w-40" />
          <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-20 bg-linear-to-l from-[#f4f4f2] to-transparent md:w-40" />

          <div className="marquee-track">
            {firstRow.map((item, index) => (
              <CompanyCard
                key={`row1-a-${item.id}-${index}`}
                name={t(`trustedCompanies.items.${item.id}.name`)}
                sub={t(`trustedCompanies.items.${item.id}.sub`)}
                icon={item.icon}
              />
            ))}
          </div>
        </div>

        <Separator className="mx-auto max-w-6xl bg-[#e4e4df]" />

        <div className="relative overflow-hidden">
          <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-20 bg-linear-to-r from-[#f4f4f2] to-transparent md:w-40" />
          <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-20 bg-linear-to-l from-[#f4f4f2] to-transparent md:w-40" />

          <div className="marquee-track-reverse">
            {secondRow.map((item, index) => (
              <CompanyCard
                key={`row2-a-${item.id}-${index}`}
                name={t(`trustedCompanies.items.${item.id}.name`)}
                sub={t(`trustedCompanies.items.${item.id}.sub`)}
                icon={item.icon}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default TrustedCompaniesSection;
