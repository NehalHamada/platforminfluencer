import { Outlet } from "react-router-dom";

import Footer from "@/components/common/Footer";
import Navbar from "@/components/common/Navbar";
import { Card, CardContent } from "@/components/ui/card";

function MainLayout() {
  return (
    <div className="flex min-h-screen w-full flex-col overflow-x-hidden bg-[#F9F9F9]">
      <Navbar />

      <main className="w-full flex-1">
        <Card className="w-full border-0 bg-transparent py-0 shadow-none ring-0">
          <CardContent className="p-0">
            <Outlet />
          </CardContent>
        </Card>
      </main>

      <Footer />
    </div>
  );
}

export default MainLayout;
