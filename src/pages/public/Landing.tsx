import { Card, CardContent } from "@/components/ui/card";
import { useTranslation } from "react-i18next";

import AboutPlatformSection from "./AboutPlatformSection";
import CampaignShowcaseSection from "./CampaignShowcaseSection";
import FeaturesSection from "./FeaturesSection";

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
import Hero from "./Hero";
import LazySection from "@/components/common/LazySection";

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

  return (
    <main
      dir={isRTL ? "rtl" : "ltr"}
      className="min-h-screen w-full bg-background">
      <Card className="min-h-screen rounded-none border-0 bg-transparent py-0 shadow-none ring-0">
        <CardContent className="space-y-0 px-0">
          {/* Hero — always rendered immediately (above the fold) */}
          <section aria-labelledby="hero-section" className="w-full">
            <div id="hero-section" className="sr-only">hero</div>
            <Hero data={data.hero} />
          </section>

          {/* Photoes — close to fold, render eagerly */}
          <section aria-labelledby="photoes-section" className="w-full">
            <div id="photoes-section" className="sr-only">photoes</div>
            <Photoes data={data.part2} />
          </section>

          {/* Below-the-fold sections — lazy loaded */}
          <LazySection id="results-lazy" minHeight="300px" rootMargin="300px">
            <section aria-labelledby="results-section" className="w-full">
              <div id="results-section" className="sr-only">results</div>
              <ResultsLanding data={data.success_results} />
            </section>
          </LazySection>

          <LazySection id="about-platform-lazy" minHeight="300px">
            <section aria-labelledby="about-platform-section" className="w-full">
              <div id="about-platform-section" className="sr-only">about-platform</div>
              <AboutPlatformSection data={data.footer_info} />
            </section>
          </LazySection>

          <LazySection id="influencers-lazy" minHeight="400px">
            <section aria-labelledby="influencers-section" className="w-full">
              <div id="influencers-section" className="sr-only">influencers</div>
              <InfluencersSection data={data.famous_influencers} />
            </section>
          </LazySection>

          <LazySection id="campaign-showcase-lazy" minHeight="400px">
            <section aria-labelledby="campaign-showcase-section" className="w-full">
              <div id="campaign-showcase-section" className="sr-only">campaign-showcase</div>
              {/* Mobile spacing between CampaignShowcase and the next section (Overview) */}
              <CampaignShowcaseSection data={data.impact_campaigns} />
            </section>
          </LazySection>

          {/* Spacer between CampaignShowcase and Overview */}
          <div className="h-10 lg:h-6" />

          <LazySection id="overview-lazy" minHeight="300px">
            <section aria-labelledby="overview-section" className="w-full">
              <div id="overview-section" className="sr-only">overview</div>
              <OverviewSection data={data.platform_overview} />
            </section>
          </LazySection>

          <LazySection id="top-influencers-lazy" minHeight="400px">
            <section aria-labelledby="top-influencers-section" className="w-full">
              <div id="top-influencers-section" className="sr-only">top-influencers</div>
              <TopInfluencersSection data={data.latest_stars} />
            </section>
          </LazySection>

          <LazySection id="features-lazy" minHeight="300px">
            <section aria-labelledby="features-section" className="w-full">
              <div id="features-section" className="sr-only">features</div>
              <FeaturesSection data={data.part8} />
            </section>
          </LazySection>

          <LazySection id="why-choose-us-lazy" minHeight="400px">
            <section aria-labelledby="why-choose-us-section" className="w-full">
              <div id="why-choose-us-section" className="sr-only">why-choose-us</div>
              <WhyChooseUs data={data.our_diff} />
            </section>
          </LazySection>

          <LazySection id="trusted-companies-lazy" minHeight="300px">
            <section aria-labelledby="trusted-companies-section" className="w-full">
              <div id="trusted-companies-section" className="sr-only">trusted-companies</div>
              <TrustedCompaniesSection data={data.trusted_by} />
            </section>
          </LazySection>
        </CardContent>
      </Card>
    </main>
  );
}

export default Landing;
