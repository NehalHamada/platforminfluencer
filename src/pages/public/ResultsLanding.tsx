import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import style from "/assets/image2.png";
import us from "/assets/user1.png";
import type { LandingCollection } from "@/types/landing.types";
import { sectionText } from "@/utils/landing";

const images = [style, style, style, style, us, us, us, us];

type ResultsLandingProps = {
  data?: LandingCollection | null;
};

function ResultsLanding({ data }: ResultsLandingProps) {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.dir() === "rtl";
  const resultImages = images;
  const title = sectionText(data?.info, "title", t("resultsTitle"), isRTL);
  const description = sectionText(data?.info, "description", t("resultsDesc"), isRTL);
  const [currentPage, setCurrentPage] = useState(0);
  const [imagesPerPage, setImagesPerPage] = useState(
    typeof window !== "undefined" && window.innerWidth < 640 ? 2 : 4,
  );

  useEffect(() => {
    const handleResize = () => {
      setImagesPerPage(window.innerWidth < 640 ? 2 : 4);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const totalPages = Math.ceil(resultImages.length / imagesPerPage);

  const pages = useMemo(() => {
    return Array.from({ length: totalPages }, (_, i) =>
      resultImages.slice(i * imagesPerPage, (i + 1) * imagesPerPage),
    );
  }, [imagesPerPage, resultImages, totalPages]);

  const safeCurrentPage = currentPage >= totalPages ? 0 : currentPage;
  const isMobile = imagesPerPage === 2;

  const previousPage =
    safeCurrentPage === 0 ? totalPages - 1 : safeCurrentPage - 1;
  const nextPage = safeCurrentPage === totalPages - 1 ? 0 : safeCurrentPage + 1;
  const activeMobileImage = pages[safeCurrentPage]?.[0] ?? resultImages[0];
  const previousMobileImage = pages[previousPage]?.[0] ?? resultImages[0];
  const nextMobileImage = pages[nextPage]?.[0] ?? resultImages[0];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPage((prev) => (prev + 1) % totalPages);
    }, 10000);

    return () => clearInterval(interval);
  }, [totalPages]);

  const goPrev = () => {
    setCurrentPage((prev) => (prev <= 0 ? totalPages - 1 : prev - 1));
  };

  const goNext = () => {
    setCurrentPage((prev) => (prev + 1) % totalPages);
  };

  return (
    <section className="w-full overflow-x-hidden bg-[rgba(130,140,114,0.06)] px-3 py-8 sm:px-5 md:px-6">
      <div className="mx-auto max-w-[20rem] text-center sm:max-w-lg md:max-w-3xl">
        <h2 className="mx-auto wrap-break-words text-xl font-bold text-[#899A6D] underline sm:text-2xl">
          {title}
        </h2>
        <p className="mx-auto mt-3 wrap-break-words text-sm leading-7 text-[#686868] sm:text-base sm:leading-8">
          {description}
        </p>
      </div>

      {isMobile ? (
        <>
          <div className="relative mt-10 flex items-center justify-center overflow-hidden">
            <Card className="absolute -left-14 top-1/2 h-75 w-22 -translate-y-1/2 overflow-hidden rounded-[18px] border-0 py-0 opacity-90 shadow-none">
              <img
                src={isRTL ? nextMobileImage : previousMobileImage}
                alt=""
                className="h-full w-full object-cover"
              />
            </Card>

            <Card className="relative z-10 h-90 w-[16rem] overflow-hidden rounded-[24px] border-0 py-0 shadow-[0_14px_30px_rgba(0,0,0,0.10)]">
              <img
                src={activeMobileImage}
                alt=""
                className="h-full w-full object-cover"
              />
            </Card>

            <Card className="absolute -right-14 top-1/2 h-75 w-22 -translate-y-1/2 overflow-hidden rounded-[18px] border-0 py-0 opacity-90 shadow-none">
              <img
                src={isRTL ? previousMobileImage : nextMobileImage}
                alt=""
                className="h-full w-full object-cover"
              />
            </Card>
          </div>

          <div
            className={cn(
              "mt-8 flex items-center justify-center gap-4",
              isRTL && "flex-row-reverse",
            )}>
            <Button
              type="button"
              size="icon-sm"
              variant="outline"
              onClick={isRTL ? goNext : goPrev}
              aria-label={t("resultsPrev", "Previous result")}
              className="h-8 w-8 rounded-full border-[#9baa79] bg-transparent text-[#8fa06b] hover:bg-white/70">
              {isRTL ? <ArrowRight size={16} /> : <ArrowLeft size={16} />}
            </Button>

            <div className="flex items-center gap-2">
              {pages.map((_, index) => (
                <Button
                  key={index}
                  type="button"
                  size="icon-xs"
                  variant="ghost"
                  onClick={() => setCurrentPage(index)}
                  aria-label={`Go to slide ${index + 1}`}
                  aria-pressed={safeCurrentPage === index}
                  className={cn(
                    "rounded-full p-0 transition-all duration-300 hover:bg-transparent",
                    safeCurrentPage === index
                      ? "h-1.5 w-10 bg-[#cfd6bd]"
                      : "h-2.5 w-2.5 bg-[#d8ddcf]",
                  )}
                />
              ))}
            </div>

            <Button
              type="button"
              size="icon-sm"
              variant="outline"
              onClick={isRTL ? goPrev : goNext}
              aria-label={t("resultsNext", "Next result")}
              className="h-8 w-8 rounded-full border-[#9baa79] bg-transparent text-[#8fa06b] hover:bg-white/70">
              {isRTL ? <ArrowLeft size={16} /> : <ArrowRight size={16} />}
            </Button>
          </div>
        </>
      ) : (
        <>
          <div className="mt-8 flex items-end justify-center sm:mt-10">
            <div className="flex items-end gap-3 transition-all duration-700 sm:gap-4 md:gap-6">
              {pages[safeCurrentPage].map((img, index) => (
                <Card
                  key={index}
                  className={cn(
                    "relative overflow-hidden border-0 py-0 shadow-md transition-all duration-500",
                    "w-35 h-55 rounded-[20px] sm:w-42.5 sm:h-65 md:w-52.5 md:h-80",
                    imagesPerPage === 4 && (index === 0 || index === 3)
                      ? "mt-6"
                      : "",
                    "hover:z-20 hover:-translate-y-4 hover:scale-110 sm:hover:scale-125 md:hover:-translate-y-6 md:hover:scale-150",
                  )}>
                  <img
                    src={img}
                    alt=""
                    className="h-full w-full object-cover"
                  />
                </Card>
              ))}
            </div>
          </div>

          <div className="mt-8 flex justify-center gap-2 sm:mt-10 md:mt-15">
            {pages.map((_, index) => (
              <Button
                key={index}
                type="button"
                size="icon-xs"
                variant="ghost"
                onClick={() => setCurrentPage(index)}
                aria-label={`Go to slide ${index + 1}`}
                aria-pressed={safeCurrentPage === index}
                className={cn(
                  "h-3 w-3 rounded-full p-0 transition-all duration-300 hover:bg-transparent",
                  safeCurrentPage === index
                    ? "bg-[#899A6D] scale-125"
                    : "bg-gray-300",
                )}
              />
            ))}
          </div>
        </>
      )}
    </section>
  );
}

export default ResultsLanding;
