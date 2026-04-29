import { ChevronLeft, ChevronRight } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/Button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import type { RegistrationSuccessPopupProps } from "@/types/ui.types";

import LogoIcon from "./LogoIcon";

function RegistrationSuccessPopup({
  open,
  title,
  description,
  image,
  userType,
  buttonText,
  onClose,
}: RegistrationSuccessPopupProps) {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language.startsWith("ar");

  const handleNavigate = () => {
    onClose?.();
    if (userType === "company") {
      navigate("/dashboard/company");
    } else {
      navigate("/dashboard/influencer");
    }
  };

  return (
    <Dialog open={open} onOpenChange={(nextOpen) => !nextOpen && onClose?.()}>
      <DialogContent
        showCloseButton={false}
        className="w-full max-w-117.5 overflow-hidden rounded-[28px] border-0 bg-white p-0 shadow-2xl">
        <Card className="max-h-[90vh] border-0 bg-white py-0 shadow-none ring-0">
          <CardContent className="overflow-y-auto p-0">
            <div className="px-6 pb-10 pt-8 text-center sm:px-8">
              <div className="mx-auto mb-6 flex justify-center">
                <img
                  src={image}
                  alt={title}
                  className="h-45 w-auto object-contain sm:h-52.5"
                />
              </div>

              <DialogHeader className="items-center text-center">
                <DialogTitle className="mb-3 text-[24px] font-semibold leading-[1.6] text-[#2C2C2C]">
                  {title}
                </DialogTitle>
                <DialogDescription className="mx-auto mb-8 max-w-75 text-[15px] leading-[1.9] text-[#6B6B6B]">
                  {description}
                </DialogDescription>
              </DialogHeader>

              <Button
                type="button"
                onClick={handleNavigate}
                className="relative mx-auto flex h-11 min-w-42.5 items-center justify-center rounded-full bg-[#A8B18E] px-6 text-sm font-medium text-white transition hover:opacity-90">
                <span
                  className={cn(
                    "absolute top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full bg-white text-[#6E765E]",
                    isArabic ? "left-2" : "right-2",
                  )}>
                  {isArabic ? (
                    <ChevronLeft size={16} />
                  ) : (
                    <ChevronRight size={16} />
                  )}
                </span>
                {buttonText || t("registrationSuccess.goToDashboard")}
              </Button>
            </div>

            <div className="bg-[linear-gradient(90deg,#1B1B1B_0%,#313425_50%,#1B1B1B_100%)] px-6 py-8 text-center text-white sm:px-8">
              <div className="mb-4 flex justify-center">
                <LogoIcon />
              </div>

              <p className="mx-auto mb-6 max-w-[320px] text-sm leading-7 text-white/90">
                {t("registrationSuccess.footerText")}
              </p>

              <form
                className="flex items-center justify-center gap-3"
                onSubmit={(event) => event.preventDefault()}
                dir={isArabic ? "rtl" : "ltr"}>
                <Button
                  type="submit"
                  size="icon-lg"
                  className="rounded-full bg-[#A8B18E] text-white hover:opacity-90">
                  {isArabic ? (
                    <ChevronLeft size={18} />
                  ) : (
                    <ChevronRight size={18} />
                  )}
                </Button>

                <label htmlFor="registration-success-email" className="sr-only">
                  {t("registrationSuccess.emailPlaceholder")}
                </label>
                <Input
                  id="registration-success-email"
                  type="email"
                  placeholder={t("registrationSuccess.emailPlaceholder")}
                  className={cn(
                    "h-11 w-full max-w-62.5 rounded-full border border-white/30 bg-transparent px-4 text-sm text-white placeholder:text-white/60 focus-visible:border-white/50 focus-visible:ring-white/20",
                    isArabic ? "text-right" : "text-left",
                  )}
                />
              </form>
            </div>
          </CardContent>
        </Card>
      </DialogContent>
    </Dialog>
  );
}

export default RegistrationSuccessPopup;
