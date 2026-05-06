import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight, Lock, Upload } from "lucide-react";

import hero from "/assets/Hero.png";

import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

type PaymentMethod = "visa" | "mastercard" | "mada";

function CreateCampaignPayment() {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.dir() === "rtl";
  const [selectedPayment, setSelectedPayment] = useState<PaymentMethod>("mada");
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const getValue = (id: string) =>
      (form.querySelector(`#${id}`) as HTMLInputElement)?.value || "";

    navigate("/dashboard/company/sure-create-campaign", {
      state: {
        totalPrice: getValue("total-price"),
        postsCount: getValue("posts-count"),
        adPlan: getValue("ad-plan"),
        executionDate: getValue("execution-date"),
        campaignName: getValue("campaign-name"),
        contentLink: getValue("content-link"),
        paymentMethod: selectedPayment,
      },
    });
  };

  const fieldClass = cn(
    "h-11 rounded-full border-[#d9d7cf] bg-white px-4 text-sm text-[#2f2f2b] placeholder:text-[#8b8b84] focus-visible:border-[#9aa883] focus-visible:ring-1 focus-visible:ring-[#9aa883]/30",
    isRTL ? "text-right" : "text-left",
  );

  const labelClass = cn(
    "text-sm font-medium text-[#2f2f2b]",
    isRTL ? "text-right" : "text-left",
  );

  return (
    <section
      dir={isRTL ? "rtl" : "ltr"}
      className="relative -mt-24 overflow-hidden bg-white">
      <div className="relative h-100 overflow-hidden sm:h-70 lg:h-90">
        <img
          src={hero}
          alt={t("campaignPayment.heroAlt", "Campaign payment hero")}
          className="h-full w-full object-cover"
        />
        <div
          className={cn(
            "absolute inset-x-0 bottom-8 z-10 text-white px-6 sm:bottom-10 sm:px-10 lg:px-16",
            isRTL ? "text-right" : "text-left",
          )}>
          <h1 className="inline-block border-b-2 border-white pb-2 text-[26px] font-semibold text-white sm:text-[32px] lg:text-[38px]">
            {t("campaignPayment.title", "إنشاء حملة")}
          </h1>
        </div>
        <div className="absolute inset-0 bg-black/55" />
      </div>

      <div className="relative z-10 -mt-4 rounded-t-[28px] bg-white px-4 pb-12 pt-7 sm:-mt-6 sm:px-6 sm:pt-9 lg:-mt-8 lg:rounded-t-[40px] lg:px-10 lg:pb-16">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto max-w-[900px]">
            <Card className="rounded-[24px] border-0! ring-0! bg-white shadow-[0_14px_35px_rgba(34,34,31,0.06)] sm:rounded-[28px]">
              <CardContent className="p-5 sm:p-7 lg:p-8">
                <form
                  onSubmit={handleSubmit}
                  className="space-y-5 sm:space-y-6">
                  <div className="grid grid-cols-1 gap-x-7 gap-y-4 sm:gap-y-5 md:grid-cols-2">
                    <div className="order-1 md:order-5 flex flex-col gap-2">
                      <Label htmlFor="campaign-name" className={labelClass}>
                        {t("campaignPayment.campaignName", "اسم الحملة")}
                      </Label>
                      <Input
                        id="campaign-name"
                        placeholder={t(
                          "campaignPayment.campaignNamePlaceholder",
                          "تجربة المنتج الجديد + Glow",
                        )}
                        className={fieldClass}
                      />
                    </div>

                    <div className="order-2 md:order-1 flex flex-col gap-2">
                      <Label htmlFor="total-price" className={labelClass}>
                        {t("campaignPayment.totalPrice", "السعرالإجمالي")}
                      </Label>
                      <Input
                        id="total-price"
                        placeholder={t(
                          "campaignPayment.totalPricePlaceholder",
                          "ر.س29500",
                        )}
                        className={fieldClass}
                      />
                    </div>

                    <div className="order-3 md:order-2 flex flex-col gap-2">
                      <Label htmlFor="posts-count" className={labelClass}>
                        {t("campaignPayment.postsCount", "عدد المنشورات")}
                      </Label>
                      <Input
                        id="posts-count"
                        placeholder={t(
                          "campaignPayment.postsCountPlaceholder",
                          "1 بوست + 1 أستوري",
                        )}
                        className={fieldClass}
                      />
                    </div>

                    <div className="order-4 md:order-4 flex flex-col gap-2">
                      <Label htmlFor="execution-date" className={labelClass}>
                        {t("campaignPayment.executionDate", "موعد التنفيذ")}
                      </Label>
                      <Input
                        id="execution-date"
                        placeholder={t(
                          "campaignPayment.executionDatePlaceholder",
                          "3 - 20 - 2026",
                        )}
                        className={fieldClass}
                      />
                    </div>

                    <div className="order-5 md:order-3 flex flex-col gap-2">
                      <Label htmlFor="ad-plan" className={labelClass}>
                        {t("campaignPayment.adPlan", "الخطة الإعلانية")}
                      </Label>
                      <Input
                        id="ad-plan"
                        placeholder={t(
                          "campaignPayment.adPlanPlaceholder",
                          "لا يمكن التعامل مع اي شركة منافسة قبل انتهاء هذا الاعلان",
                        )}
                        className={fieldClass}
                      />
                    </div>

                    <div className="order-6 md:order-6 flex flex-col gap-2">
                      <Label htmlFor="content-link" className={labelClass}>
                        {t("campaignPayment.contentLink", "اضافة ملفات اضافيه")}
                      </Label>
                      <div className="relative">
                        <Input
                          id="content-link"
                          placeholder={t(
                            "campaignPayment.contentLinkPlaceholder",
                            "اضافة ملفات اضافيه",
                          )}
                          className={cn(fieldClass, isRTL ? "pl-20" : "pr-20")}
                        />
                        <div
                          className={cn(
                            "absolute top-1/2 -translate-y-1/2 flex items-center gap-2",
                            isRTL ? "left-3" : "right-3",
                          )}>
                          <span className="text-xs text-[#8b8b84]">69</span>
                          <button
                            type="button"
                            className="flex h-7 w-7 items-center justify-center rounded-full text-[#8b8b84] hover:text-[#2f2f2b] transition-colors"
                            aria-label={t(
                              "campaignPayment.uploadFiles",
                              "Upload files",
                            )}>
                            <Upload size={14} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  <Separator className="bg-[#e8e6df]" />
                  <p
                    className={cn(
                      "text-sm font-medium text-[#2f2f2b]",
                      isRTL ? "text-right" : "text-left",
                    )}>
                    {t("campaignPayment.addPaymentCard", "اضافة بطاقة الدفع")}
                  </p>

                  <div
                    dir="ltr"
                    className="grid grid-cols-1 gap-3 sm:grid-cols-3 sm:gap-4">
                    <button
                      type="button"
                      onClick={() => setSelectedPayment("visa")}
                      className={cn(
                        "flex h-14 items-center justify-center rounded-xl border transition-all duration-200 order-3 sm:order-1",
                        selectedPayment === "visa"
                          ? "border-[#9aa883] bg-[#f8f9f5]"
                          : "border-[#e8e6df] bg-white hover:border-[#d0cec4]",
                      )}>
                      <span
                        className="text-[18px] font-bold tracking-wide"
                        style={{
                          color: "#1A1F71",
                          fontFamily: "'Arial', sans-serif",
                          fontStyle: "italic",
                        }}>
                        VISA
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setSelectedPayment("mastercard")}
                      className={cn(
                        "flex h-14 items-center justify-center rounded-xl border transition-all duration-200 order-2 sm:order-2",
                        selectedPayment === "mastercard"
                          ? "border-[#9aa883] bg-[#f8f9f5]"
                          : "border-[#e8e6df] bg-white hover:border-[#d0cec4]",
                      )}>
                      <svg
                        width="36"
                        height="22"
                        viewBox="0 0 36 22"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg">
                        <circle cx="11" cy="11" r="9" fill="#EB001B" />
                        <circle cx="25" cy="11" r="9" fill="#F79E1B" />
                        <path
                          d="M18 3.5a9 9 0 0 1 0 15 9 9 0 0 1 0-15z"
                          fill="#FF5F00"
                        />
                      </svg>
                    </button>

                    <button
                      type="button"
                      onClick={() => setSelectedPayment("mada")}
                      className={cn(
                        "flex h-14 items-center justify-center rounded-xl border transition-all duration-200 order-1 sm:order-3",
                        selectedPayment === "mada"
                          ? "border-[#9aa883] bg-[#f8f9f5]"
                          : "border-[#e8e6df] bg-white hover:border-[#d0cec4]",
                      )}>
                      <div className="flex items-center gap-1.5">
                        <svg
                          width="14"
                          height="14"
                          viewBox="0 0 14 14"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg">
                          <circle cx="4.5" cy="7" r="4" fill="#009B4D" />
                          <circle cx="9.5" cy="7" r="4" fill="#00B2E3" />
                        </svg>
                        <span
                          className="text-[15px] font-bold"
                          style={{ color: "#003B2A" }}>
                          مدى
                        </span>
                      </div>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 gap-x-7 gap-y-4 sm:gap-y-5 md:grid-cols-2">
                    <div className="order-2 md:order-1 flex flex-col gap-2">
                      <Label htmlFor="card-number" className={labelClass}>
                        {t("campaignPayment.cardNumber", "رقم البطاقة")}
                      </Label>
                      <div className="relative">
                        <Input
                          id="card-number"
                          placeholder="3354 8766 **** ****"
                          className={cn(fieldClass, isRTL ? "pl-12" : "pr-12")}
                        />
                        <Lock
                          size={16}
                          className={cn(
                            "absolute top-1/2 -translate-y-1/2 text-[#8b8b84]",
                            isRTL ? "left-4" : "right-4",
                          )}
                        />
                      </div>
                    </div>

                    <div className="order-1 md:order-2 flex flex-col gap-2">
                      <Label htmlFor="card-holder" className={labelClass}>
                        {t("campaignPayment.cardHolder", "اسم المالك")}
                      </Label>
                      <Input
                        id="card-holder"
                        placeholder={t(
                          "campaignPayment.cardHolderPlaceholder",
                          "محمد حسين",
                        )}
                        className={fieldClass}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-x-7 gap-y-4 sm:gap-y-5 md:grid-cols-2">
                    <div className="flex flex-col gap-2">
                      <Label htmlFor="expiry" className={labelClass}>
                        {t("campaignPayment.expiry", "صلاحية حتى")}
                      </Label>
                      <Input
                        id="expiry"
                        placeholder={t(
                          "campaignPayment.expiryPlaceholder",
                          "20 سبتمبر 2025 م",
                        )}
                        className={fieldClass}
                      />
                    </div>

                    <div className="flex flex-col gap-2">
                      <Label htmlFor="cvv" className={labelClass}>
                        {t("campaignPayment.cvv", "رمز الحماية")}
                      </Label>
                      <Input
                        id="cvv"
                        type="password"
                        placeholder="***"
                        maxLength={4}
                        className={fieldClass}
                      />
                    </div>
                  </div>

                  <div
                    className={cn(
                      "flex pt-1",
                      isRTL ? "justify-start" : "justify-end",
                    )}>
                    <Button
                      type="submit"
                      className="group relative inline-flex h-11 min-w-[168px] items-center justify-center rounded-full bg-[#9aa883] px-6 text-sm font-medium text-white shadow-[0_8px_18px_rgba(154,168,131,0.35)] transition hover:scale-[1.02] hover:bg-[#8f9d78] disabled:cursor-not-allowed disabled:opacity-70 sm:h-12 sm:min-w-[182px]">
                      <span
                        className={cn(
                          "absolute top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full bg-[#f3f7eb] text-[#8c9878] sm:h-8 sm:w-8",
                          isRTL ? "left-2" : "right-2",
                        )}>
                        {isRTL ? (
                          <ChevronLeft size={18} />
                        ) : (
                          <ChevronRight size={18} />
                        )}
                      </span>

                      <span className={isRTL ? "pr-6" : "pl-6"}>
                        {t("campaignPayment.submit", "حفظ البطاقة")}
                      </span>
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}

export default CreateCampaignPayment;
