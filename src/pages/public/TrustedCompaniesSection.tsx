import CompanyCard from "@/components/common/CompanyCard";
import { cn } from "@/lib/utils";
import { useTranslation } from "react-i18next";
import "../../index.css";
import type { LandingSection } from "@/types/landing.types";
import { getString, isRecord, sectionText } from "@/utils/landing";

type TrustedCompaniesSectionProps = {
  data?: LandingSection | null;
};

type CompanyRowItem = {
  id: number;
  icon: string;
  name: string;
  sub: string;
};

function TrustedCompaniesSection({ data }: TrustedCompaniesSectionProps) {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.dir() === "rtl";
  const contentItems = Array.isArray(data?.content?.partners)
    ? data.content.partners
    : Array.isArray(data?.content?.companies)
      ? data.content.companies
      : [];
  const apiCompanies = contentItems.filter(isRecord);

  const fallbackFirstRow: CompanyRowItem[] = [
    {
      id: 1,
      icon: "puzzle",
      name: t("trustedCompanies.items.1.name"),
      sub: t("trustedCompanies.items.1.sub"),
    },
    {
      id: 2,
      icon: "grid",
      name: t("trustedCompanies.items.2.name"),
      sub: t("trustedCompanies.items.2.sub"),
    },
    {
      id: 3,
      icon: "bars",
      name: t("trustedCompanies.items.3.name"),
      sub: t("trustedCompanies.items.3.sub"),
    },
    {
      id: 4,
      icon: "circle",
      name: t("trustedCompanies.items.4.name"),
      sub: t("trustedCompanies.items.4.sub"),
    },
    {
      id: 1,
      icon: "puzzle",
      name: t("trustedCompanies.items.1.name"),
      sub: t("trustedCompanies.items.1.sub"),
    },
  ];

  const fallbackSecondRow: CompanyRowItem[] = [
    {
      id: 5,
      icon: "grid",
      name: t("trustedCompanies.items.5.name"),
      sub: t("trustedCompanies.items.5.sub"),
    },
    {
      id: 6,
      icon: "circle",
      name: t("trustedCompanies.items.6.name"),
      sub: t("trustedCompanies.items.6.sub"),
    },
    {
      id: 7,
      icon: "puzzle",
      name: t("trustedCompanies.items.7.name"),
      sub: t("trustedCompanies.items.7.sub"),
    },
    {
      id: 8,
      icon: "grid",
      name: t("trustedCompanies.items.8.name"),
      sub: t("trustedCompanies.items.8.sub"),
    },
    {
      id: 5,
      icon: "grid",
      name: t("trustedCompanies.items.5.name"),
      sub: t("trustedCompanies.items.5.sub"),
    },
  ];
  const apiRows = apiCompanies.map((company, index) => ({
    id: typeof company.id === "number" ? company.id : index + 1,
    icon: typeof company.icon === "string" ? company.icon : "grid",
    name:
      getString(company, "name") ||
      t(`trustedCompanies.items.${(index % 8) + 1}.name`),
    sub:
      getString(company, "sub") ||
      getString(company, "desc") ||
      getString(company, "description") ||
      t(`trustedCompanies.items.${(index % 8) + 1}.sub`),
  }));
  const firstRow =
    isRTL && apiRows.length ? apiRows.slice(0, 5) : fallbackFirstRow;
  const secondRow =
    isRTL && apiRows.length ? apiRows.slice(5, 10) : fallbackSecondRow;
  const title = sectionText(data, "title", "", isRTL);
  const description = sectionText(
    data,
    "description",
    t("trustedCompanies.desc"),
    isRTL,
  );

  return (
    <section
      dir={isRTL ? "rtl" : "ltr"}
      className="mb-10 overflow-hidden bg-[#f4f4f2] py-12 md:py-16 mt-4">
      <div className="mx-auto max-w-6xl px-4 text-center">
        <h2
          className={cn(
            "font-bold leading-tight text-[#2f3133]",
            isRTL
              ? "text-2xl sm:text-[30px] md:text-[50px]"
              : "text-xl sm:text-2xl md:text-[38px]",
          )}>
          {title || (
            <>
              {t("trustedCompanies.title1")}{" "}
              <span className="text-[#aeb98e]">
                {t("trustedCompanies.count")}
              </span>{" "}
              {t("trustedCompanies.title2")}
            </>
          )}
        </h2>

        <h2
          className={cn(
            "mt-2 font-bold leading-[1.2] text-[#2f3133]",
            isRTL
              ? "text-2xl sm:text-[30px] md:text-[50px]"
              : "text-xl sm:text-2xl md:text-[38px]",
          )}>
          {t("trustedCompanies.title3")}
        </h2>

        <p
          className={cn(
            "mx-auto mt-6 max-w-175 leading-6 text-[#6f7174]",
            isRTL
              ? "text-xs sm:text-[13px] md:text-sm"
              : "text-[11px] sm:text-xs md:text-[13px]",
          )}>
          {description}
        </p>
      </div>

      <div className="mt-12 space-y-7 overflow-hidden">
        <div className="relative overflow-hidden">
          <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-20 bg-linear-to-r from-[#f4f4f2] to-transparent md:w-40" />
          <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-20 bg-linear-to-l from-[#f4f4f2] to-transparent md:w-40" />

          <div className="marquee-track">
            {firstRow.map((item, index) => (
              <CompanyCard
                key={`row1-a-${item.id}-${index}`}
                name={item.name}
                sub={item.sub}
                icon={item.icon}
              />
            ))}
          </div>
        </div>

        <div className="relative overflow-hidden">
          <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-20 bg-linear-to-r from-[#f4f4f2] to-transparent md:w-40" />
          <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-20 bg-linear-to-l from-[#f4f4f2] to-transparent md:w-40" />

          <div className="marquee-track-reverse">
            {secondRow.map((item, index) => (
              <CompanyCard
                key={`row2-a-${item.id}-${index}`}
                name={item.name}
                sub={item.sub}
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
