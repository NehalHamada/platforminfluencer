import { Outlet, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";


import LanguageToggle from "@/components/common/LanguageToggle";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

function AuthLayout() {
  const location = useLocation();
  const { i18n } = useTranslation();
  const isArabic = i18n.language === "ar";

  const isFullBleedAuthPage =
    [
      "/register/company/complete",
      "/register/influencer/complete",
      "/register/influencer/payment",
    ].indexOf(location.pathname) !== -1;

  return (
    <div className="flex min-h-screen flex-col bg-[#F9F9F9]">
      <div
        className={cn("fixed top-4 z-[80]", isArabic ? "left-4" : "right-4")}>
        <LanguageToggle className="me-0 bg-black/20 text-white backdrop-blur-sm hover:bg-black/30 hover:text-white lg:bg-white/80 lg:text-[#333] lg:hover:bg-white lg:hover:text-[#111]" />
      </div>

      <main
        className={cn(
          "flex flex-1 pb-10",
          isFullBleedAuthPage
            ? "items-stretch justify-stretch px-0 pt-0"
            : "items-center justify-center px-4 pt-28 sm:px-6",
        )}>
        <Card
          className={cn(
            "w-full border-0 bg-transparent py-0 shadow-none ring-0",
            isFullBleedAuthPage ? "" : "max-w-fit",
          )}>
          <CardContent
            className={cn(
              "p-0",
              isFullBleedAuthPage ? "" : "flex justify-center sm:p-2",
            )}>
            <Outlet />
          </CardContent>
        </Card>
      </main>
    </div>
  );
}

export default AuthLayout;
