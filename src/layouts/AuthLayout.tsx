import { Outlet, useLocation } from "react-router-dom";

import Footer from "@/components/common/Footer";
import Navbar from "@/components/common/Navbar";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

function AuthLayout() {
  const location = useLocation();

  const isFullBleedAuthPage =
    [
      "/register/company/complete",
      "/register/influencer/complete",
      "/register/influencer/payment",
    ].indexOf(location.pathname) !== -1;

  return (
    <div className="flex min-h-screen flex-col bg-[#F9F9F9]">
      <Navbar />

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

      <Footer />
    </div>
  );
}

export default AuthLayout;
