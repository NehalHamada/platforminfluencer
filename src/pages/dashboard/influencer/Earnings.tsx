import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { CircleAlert, CreditCard, Landmark, Wallet } from "lucide-react";
import { useTranslation } from "react-i18next";
import hero from "/assets/Hero.png";
import type { EarningRow } from "@/types/dashboard.types";

function Earnings() {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.dir() === "rtl";

  const rows: EarningRow[] = [
    {
      id: 1,
      campaignName: isRTL ? "تجربة منتج جديد" : "New Product Trial",
      companyName: "Growth",
      date: "20-3-2026",
      amount: "7000 ريال سعودي",
      status: "pending",
    },
    {
      id: 2,
      campaignName: isRTL ? "تجربة منتج جديد" : "New Product Trial",
      companyName: "Growth",
      date: "20-3-2026",
      amount: "7000 ريال سعودي",
      status: "completed",
    },
    {
      id: 3,
      campaignName: isRTL ? "تجربة منتج جديد" : "New Product Trial",
      companyName: "Growth",
      date: "20-3-2026",
      amount: "7000 ريال سعودي",
      status: "completed",
    },
    {
      id: 4,
      campaignName: isRTL ? "تجربة منتج جديد" : "New Product Trial",
      companyName: "Growth",
      date: "20-3-2026",
      amount: "7000 ريال سعودي",
      status: "completed",
    },
  ];

  const summaryCards = [
    {
      id: "available",
      icon: CreditCard,
      label: t("earn.availableBalance"),
      value: t("earn.availableBalanceValue"),
    },
    {
      id: "transfer",
      icon: Landmark,
      label: t("earn.transferCode"),
      value: t("earn.transferCodeValue"),
    },
    {
      id: "total",
      icon: Wallet,
      label: t("earn.totalIncome"),
      value: t("earn.totalIncomeValue"),
    },
  ];

  return (
    <section
      dir={isRTL ? "rtl" : "ltr"}
      className="relative -mt-24 overflow-x-hidden bg-[#f3f3ef]">
      <div className="relative h-44 w-full overflow-hidden sm:h-85">
        <img
          src={hero}
          alt={t("earn.heroAlt")}
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-black/65" />
      </div>

      <div className="relative z-10 -mt-1 rounded-t-[10px] bg-[#f7f6f2] px-2 pb-20 pt-4 sm:-mt-10 sm:rounded-t-[34px] sm:px-6 sm:pb-8 sm:pt-6 lg:rounded-t-[42px] lg:px-10 lg:pt-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-4 text-center sm:mb-6">
            <h1 className="text-sm font-semibold text-[#20201d] sm:text-3xl lg:text-[38px]">
              {t("earn.title")}
            </h1>
          </div>

          <Card className="border-0 bg-transparent py-0 shadow-none sm:rounded-[28px] sm:bg-white sm:shadow-[0_16px_48px_rgba(28,30,24,0.06)]">
            <CardContent className="space-y-5 p-0 sm:space-y-8 sm:p-6 lg:p-8">
              <div className="grid grid-cols-1 gap-2 sm:gap-3 md:grid-cols-3">
                {summaryCards.map(({ id, icon: Icon, label, value }) => (
                  <Card
                    key={id}
                    className="rounded-[3px] border border-[#ece7dd] bg-white py-0 shadow-none sm:rounded-[14px] sm:bg-[#fbfaf7]">
                    <CardContent className="px-3 py-2 sm:p-4">
                      <div
                        className={cn(
                          "flex items-center justify-between gap-3",
                          isRTL ? "flex-row text-right" : "text-left",
                        )}>
                        <div className="space-y-1 sm:space-y-2">
                          <p className="text-[10px] font-semibold text-[#44443f] sm:text-sm">
                            {label}
                          </p>
                          <p className="text-[9px] text-[#8a8a82] sm:text-sm">
                            {value}
                          </p>
                        </div>

                        <div className="rounded-full bg-[#f2efe7] p-1.5 text-[#b2a9cf] sm:p-2">
                          <Icon
                            size={14}
                            aria-hidden="true"
                            className="sm:h-4 sm:w-4"
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <div
                className={cn(
                  "flex items-start gap-2 text-[9px] leading-4 text-[#706f67] sm:items-center sm:text-sm",
                  isRTL ? "flex-row-reverse justify-center" : "justify-center",
                )}>
                <CircleAlert
                  size={15}
                  aria-hidden="true"
                  className="text-[#6c6a62]"
                />
                <p className="max-w-58 text-center sm:max-w-none">
                  {t("earn.transferNote")}
                </p>
              </div>

              <section className="space-y-3 sm:space-y-4">
                <h2
                  className={cn(
                    "text-sm font-semibold text-[#2a2a26] underline underline-offset-2 sm:text-lg sm:no-underline",
                    isRTL ? "text-right" : "text-left",
                  )}>
                  {t("earn.transactionsTitle")}
                </h2>

                <div className="space-y-3 sm:hidden">
                  {rows.map((row) => {
                    const isCompleted = row.status === "completed";

                    return (
                      <Card
                        key={row.id}
                        className="rounded-lg border-0 bg-white py-0 shadow-none">
                        <CardContent className="px-3 py-3">
                          <div className="grid grid-cols-[5.25rem_1fr] items-start gap-3">
                            <p
                              className={cn(
                                "text-lg font-semibold text-[#696969]",
                                isRTL ? "text-right" : "text-left",
                              )}>
                              {row.companyName}
                            </p>
                            <div className="bg-[#eef2e8] py-1.5 text-center text-[12px] font-medium text-[#788968]">
                              {isCompleted
                                ? t("earn.statusCompleted")
                                : t("earn.statusPending")}
                            </div>
                          </div>

                          <div
                            className={cn(
                              "mt-5 space-y-4 pb-1 text-base leading-5 text-[#555]",
                              isRTL ? "text-right" : "text-left",
                            )}>
                            <p>{row.campaignName}</p>
                            <p>{row.date}</p>
                            <p>{row.amount}</p>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>

                <Card className="hidden overflow-hidden rounded-[20px] border border-[#ede9df] bg-[#fffdfa] py-0 shadow-none sm:block">
                  <div className="overflow-x-auto">
                    <table className="min-w-full text-sm">
                      <thead className="bg-[#faf8f4] text-[#6c6b63]">
                        <tr>
                          {[
                            t("earn.campaign"),
                            t("earn.company"),
                            t("earn.date"),
                            t("earn.amount"),
                            t("earn.status"),
                          ].map((header) => (
                            <th
                              key={header}
                              scope="col"
                              className={cn(
                                "border-b border-[#ede9df] px-4 py-4 font-medium",
                                isRTL ? "text-right" : "text-left",
                              )}>
                              {header}
                            </th>
                          ))}
                        </tr>
                      </thead>

                      <tbody>
                        {rows.map((row) => {
                          const isCompleted = row.status === "completed";

                          return (
                            <tr
                              key={row.id}
                              className="border-b border-[#f1eee6] last:border-b-0">
                              <td
                                className={cn(
                                  "px-4 py-4 text-[#3e3d38]",
                                  isRTL ? "text-right" : "text-left",
                                )}>
                                {row.campaignName}
                              </td>
                              <td
                                className={cn(
                                  "px-4 py-4 text-[#6d6c65]",
                                  isRTL ? "text-right" : "text-left",
                                )}>
                                {row.companyName}
                              </td>
                              <td
                                className={cn(
                                  "px-4 py-4 text-[#6d6c65]",
                                  isRTL ? "text-right" : "text-left",
                                )}>
                                {row.date}
                              </td>
                              <td
                                className={cn(
                                  "px-4 py-4 text-[#6d6c65]",
                                  isRTL ? "text-right" : "text-left",
                                )}>
                                {row.amount}
                              </td>
                              <td
                                className={cn(
                                  "px-4 py-4",
                                  isRTL ? "text-right" : "text-left",
                                )}>
                                <Badge
                                  variant={isCompleted ? "success" : "outline"}
                                  className={cn(
                                    "rounded-full px-3 py-1 text-xs font-medium",
                                    isCompleted
                                      ? ""
                                      : "border-[#f1d2b0] bg-[#fff5e8] text-[#d08b45]",
                                  )}>
                                  {isCompleted
                                    ? t("earn.statusCompleted")
                                    : t("earn.statusPending")}
                                </Badge>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </Card>
              </section>

              <Separator className="hidden bg-[#ece7dd] sm:block" />

              <section className="space-y-3 sm:space-y-4">
                <h2
                  className={cn(
                    "text-sm font-semibold text-[#2a2a26] underline underline-offset-2 sm:text-lg sm:no-underline",
                    isRTL ? "text-right" : "text-left",
                  )}>
                  {t("earn.payoutMethodTitle")}
                </h2>

                <div className="grid grid-cols-1 gap-2 sm:gap-5 lg:grid-cols-[1fr_1.4fr]">
                  <div
                    className={cn(
                      isRTL ? "lg:order-2 text-right" : "text-left",
                    )}>
                    <p className="cursor-pointer text-[9px] text-[#8b88a1] underline underline-offset-4 sm:text-sm">
                      {t("earn.switchPayout")}
                    </p>
                  </div>

                  <Card
                    className={cn(
                      "rounded-[3px] border-0 bg-white py-0 shadow-none sm:rounded-[14px] sm:bg-[#f5f3f8]",
                      isRTL ? "lg:order-1 text-right" : "text-left",
                    )}>
                    <CardHeader className="px-3 pt-3 pb-0 sm:px-5 sm:pt-5">
                      <CardTitle className="text-[10px] font-semibold text-[#2d2c28] sm:text-sm">
                        {t("earn.transferTo")} :
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="px-3 pt-2 pb-3 sm:px-5 sm:pt-3 sm:pb-5">
                      <CardDescription className="text-[9px] text-[#6f6d67] sm:text-sm">
                        {t("earn.payoutHint")}
                      </CardDescription>
                    </CardContent>
                  </Card>
                </div>
              </section>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}

export default Earnings;
