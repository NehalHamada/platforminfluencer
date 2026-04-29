import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useTranslation } from "react-i18next";

import AboutPlatformSection from "./AboutPlatformSection";
import CampaignShowcaseSection from "./CampaignShowcaseSection";
import FeaturesSection from "./FeaturesSection";
import Hero from "./Hero";
import InfluencersSection from "./InfluencersSection";
import OverviewSection from "./OverviewSection";
import Photoes from "./Photoes";
import ResultsLanding from "./ResultsLanding";
import TopInfluencersSection from "./TopInfluencersSection";
import TrustedCompaniesSection from "./TrustedCompaniesSection";
import WhyChooseUs from "./WhyChooseUs";
import { useLandingPageQuery } from "@/queries/landing/useLandingPageQuery";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

function Landing() {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.dir() === "rtl";
  const lang = i18n.language.startsWith("ar") ? "ar" : "en";
  const { data, isLoading, isError } = useLandingPageQuery(lang);

  if (isLoading) {
    return (
      <main
        dir={isRTL ? "rtl" : "ltr"}
        className="min-h-screen w-full bg-background">
        <Card className="min-h-screen rounded-none border-0 bg-transparent py-0 shadow-none">
          <CardContent className="space-y-6 px-4 py-28 sm:px-6 lg:px-8">
            <Skeleton className="h-[70vh] w-full rounded-3xl" />
            <Skeleton className="mx-auto h-8 w-2/3 rounded-full" />
            <Skeleton className="mx-auto h-4 w-1/2 rounded-full" />
          </CardContent>
        </Card>
      </main>
    );
  }

  if (isError || !data) {
    return (
      <main
        dir={isRTL ? "rtl" : "ltr"}
        className="flex min-h-screen w-full items-center justify-center bg-background px-4">
        <Alert variant="destructive" className="max-w-md">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>{t("errorTitle", "Something went wrong")}</AlertTitle>
          <AlertDescription>
            {t("errorDescription", "Unable to load landing page data.")}
          </AlertDescription>
        </Alert>
      </main>
    );
  }

  const sections = [
    { id: "hero", component: <Hero data={data.hero} /> },
    { id: "photoes", component: <Photoes /> },
    { id: "results", component: <ResultsLanding /> },
    { id: "about-platform", component: <AboutPlatformSection /> },
    { id: "influencers", component: <InfluencersSection /> },
    { id: "campaign-showcase", component: <CampaignShowcaseSection /> },
    { id: "overview", component: <OverviewSection /> },
    { id: "top-influencers", component: <TopInfluencersSection /> },
    { id: "features", component: <FeaturesSection /> },
    { id: "why-choose-us", component: <WhyChooseUs /> },
    { id: "trusted-companies", component: <TrustedCompaniesSection /> },
  ];

  return (
    <main
      dir={isRTL ? "rtl" : "ltr"}
      className="min-h-screen w-full bg-background">
      <Card className="min-h-screen rounded-none border-0 bg-transparent py-0 shadow-none ring-0">
        <CardContent className="space-y-0 px-0">
          {sections.map((section, index) => (
            <div key={section.id}>
              <section
                aria-labelledby={`${section.id}-section`}
                className="w-full">
                <div id={`${section.id}-section`} className="sr-only">
                  {section.id}
                </div>
                {section.component}
              </section>

              {index < sections.length - 1 ? (
                <Separator
                  className="mx-auto max-w-6xl bg-border/40"
                  decorative
                />
              ) : null}
            </div>
          ))}
        </CardContent>
      </Card>
    </main>
  );
}

export default Landing;
