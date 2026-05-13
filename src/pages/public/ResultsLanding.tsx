import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight, Pause, Play, VolumeX } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import type { LandingCollection } from "@/types/landing.types";
import {
  getString,
  isRecord,
  isUsableImageUrl,
  sectionText,
} from "@/utils/landing";

// High quality vertical video placeholders from a more reliable CDN (Pexels)
const fallbackVideos = [
  "/assets/res4.jpg",
  "/assets/res3.jpg",
  "/assets/res2.jpg",
  "/assets/res1.jpg",
];

const isImageMedia = (url: string) =>
  /\.(avif|gif|jpe?g|png|svg|webp)$/i.test(url.split(/[?#]/)[0]);

const visibleCardOffsets = [-1, 0, 1, 2];
const frontCardPosition = 1;

type ResultsLandingProps = {
  data?: LandingCollection | null;
};

function ResultsLanding({ data }: ResultsLandingProps) {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.dir() === "rtl";

  const apiVideos = useMemo(() => {
    return (
      data?.posts
        ?.filter(isRecord)
        .map(
          (post) =>
            getString(post, "media_url") || getString(post, "video_url"),
        )
        .filter((url): url is string => !!url && isUsableImageUrl(url)) ?? []
    );
  }, [data]);

  const resultVideos = useMemo(() => {
    const base = apiVideos.length ? apiVideos : fallbackVideos;
    let list = [...base];
    while (list.length < 8) {
      list = [...list, ...base];
    }
    return list;
  }, [apiVideos]);

  const title = sectionText(data?.info, "title", t("resultsTitle"), isRTL);
  const description = sectionText(
    data?.info,
    "description",
    t("resultsDesc"),
    isRTL,
  );

  const [currentPage, setCurrentPage] = useState(1);
  const [isMuted, setIsMuted] = useState(true);
  const [isPlaying, setIsPlaying] = useState(true);
  const videoRefs = useRef<Map<number, HTMLVideoElement>>(new Map());

  const totalVideos = resultVideos.length;

  const goPrev = () => {
    setCurrentPage((prev) => (prev <= 0 ? totalVideos - 1 : prev - 1));
    setIsPlaying(true);
  };

  const goNext = () => {
    setCurrentPage((prev) => (prev + 1) % totalVideos);
    setIsPlaying(true);
  };

  // Sync playback state
  useEffect(() => {
    const activeVideo = videoRefs.current.get(currentPage);
    if (activeVideo) {
      if (isPlaying) activeVideo.play().catch(() => {});
      else activeVideo.pause();
    }
  }, [currentPage, isPlaying]);

  if (totalVideos === 0) return null;

  return (
    <section
      dir={isRTL ? "rtl" : "ltr"}
      className="relative w-full overflow-hidden bg-[#F9F9F7] py-16 lg:py-24 font-['IBM_Plex_Sans_Arabic']">
      {/* Decorative Dots Background */}
      <div className="pointer-events-none absolute left-0 top-0 h-full w-full opacity-[0.03]">
        <div className="grid grid-cols-20 gap-4 p-4">
          {Array.from({ length: 400 }).map((_, i) => (
            <div key={i} className="h-1 w-1 rounded-full bg-black" />
          ))}
        </div>
      </div>

      <div className="relative z-10 mx-auto max-w-[1400px] px-4">
        <div className="mx-auto max-w-4xl text-center font-['IBM_Plex_Sans_Arabic']">
          <h2
            className={cn(
              "relative inline-block px-2 font-bold text-[#899A6D]",
              isRTL
                ? "text-2xl md:text-4xl lg:text-5xl"
                : "text-xl md:text-3xl lg:text-4xl",
            )}>
            <span className="relative z-10">{title}</span>
            <span className="absolute bottom-[8px] left-0 w-full h-[6px] bg-[#899A6D]/30 z-0 rounded-full" />
          </h2>
          <p
            className={cn(
              "mx-auto mt-10 max-w-3xl font-medium leading-relaxed text-gray-500",
              isRTL ? "text-base md:text-xl" : "text-sm md:text-lg",
            )}>
            {description}
          </p>
        </div>

        {/* Cinematic Video Slider */}
        <div className="relative mt-24 flex items-center justify-center overflow-visible">
          <div className="flex w-full items-center justify-center gap-4 lg:gap-8">
            {visibleCardOffsets.map((offset, position) => {
              const index = (currentPage + offset + totalVideos) % totalVideos;
              const videoUrl = resultVideos[index];
              const isImage = isImageMedia(videoUrl);
              const isActive = position === frontCardPosition;
              const isSide = offset === -1 || offset === 1;

              return (
                <Card
                  key={offset} // Stable key to prevent re-mounting
                  className={cn(
                    "group relative overflow-hidden border-0 shadow-2xl transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)]",
                    isActive
                      ? "z-30 h-[450px] w-[280px] scale-110 opacity-100 sm:h-[550px] sm:w-[340px] lg:h-[650px] lg:w-[420px]"
                      : isSide
                        ? "z-20 h-[380px] w-[240px] scale-95 opacity-60 sm:h-[450px] sm:w-[280px] lg:h-[550px] lg:w-[350px]"
                        : "z-10 h-[320px] w-[200px] scale-90 opacity-30 sm:h-[380px] sm:w-[240px] lg:h-[480px] lg:w-[300px]",
                    !isActive && !isSide && "hidden xl:flex",
                    !isActive && "hidden md:flex grayscale-[0.3]",
                    "rounded-[40px] bg-black cursor-pointer transition-all duration-500 hover:scale-[0.98] hover:grayscale-0",
                  )}>
                  {isImage ? (
                    <img
                      key={videoUrl}
                      src={videoUrl}
                      alt=""
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                      draggable={false}
                    />
                  ) : (
                    <video
                      key={videoUrl} // Change key only when URL changes
                      ref={(el) => {
                        if (el) videoRefs.current.set(index, el);
                        else videoRefs.current.delete(index);
                      }}
                      src={videoUrl}
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                      muted={isMuted}
                      autoPlay={isActive && isPlaying}
                      loop
                      playsInline
                      onContextMenu={(e) => e.preventDefault()}
                    />
                  )}

                  {isImage && (
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-black/15" />
                  )}

                  {/* Play Icon for inactive cards */}
                  {!isActive && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/10">
                      <div className="flex h-16 w-16 items-center justify-center rounded-full border-2 border-white/40 bg-white/10 text-[#A7B78E] backdrop-blur-sm transition-transform group-hover:scale-110">
                        <Play size={32} fill="currentColor" />
                      </div>
                    </div>
                  )}

                  {/* Active Card Controls Overlay */}
                  {isActive &&
                    (isImage ? (
                      <div className="absolute inset-0 flex flex-col justify-between p-6 md:p-10">
                        <div className="flex justify-end">
                          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-black/20 text-white backdrop-blur-md">
                            <VolumeX size={24} />
                          </div>
                        </div>

                        <div className="flex justify-center">
                          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/90 text-black shadow-xl transition-transform group-hover:scale-110">
                            <Play size={28} fill="currentColor" />
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="absolute inset-0 flex flex-col justify-between p-6 md:p-10">
                        <div className="flex justify-end">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={(e) => {
                              e.stopPropagation();
                              setIsMuted(!isMuted);
                            }}
                            className="h-12 w-12 rounded-full bg-black/20 text-white backdrop-blur-md hover:bg-black/40">
                            <VolumeX
                              size={24}
                              className={cn(!isMuted && "opacity-50")}
                            />
                          </Button>
                        </div>

                        <div className="flex justify-center">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={(e) => {
                              e.stopPropagation();
                              setIsPlaying(!isPlaying);
                            }}
                            className="h-16 w-16 rounded-full bg-white/90 text-black shadow-xl hover:bg-white transition-transform hover:scale-110">
                            {isPlaying ? (
                              <Pause size={28} fill="currentColor" />
                            ) : (
                              <Play size={28} fill="currentColor" />
                            )}
                          </Button>
                        </div>
                      </div>
                    ))}
                </Card>
              );
            })}
          </div>
        </div>

        {/* Bottom Navigation & Progress */}
        <div className="relative z-50 mt-20 flex items-center justify-center gap-6 lg:gap-12">
          <Button
            onClick={(e) => {
              e.preventDefault();
              goPrev();
            }}
            variant="outline"
            size="icon"
            className="h-14 w-14 rounded-full border-[#A7B78E]/30 bg-white text-[#A7B78E] shadow-xl transition-all hover:bg-[#A7B78E] hover:text-white active:scale-95">
            {isRTL ? <ChevronRight size={28} /> : <ChevronLeft size={28} />}
          </Button>

          {/* Progress Bars */}
          <div className="flex items-center gap-4">
            {[0, 1, 2, 3].map((i) => {
              const activeIdx = Math.floor(currentPage / (totalVideos / 4));
              const isCurrent = i === activeIdx;
              return (
                <div
                  key={i}
                  className={cn(
                    "h-2 rounded-full transition-all duration-700",
                    isCurrent
                      ? "w-24 md:w-48 bg-[#A7B78E]"
                      : "w-12 md:w-20 bg-gray-200",
                  )}
                />
              );
            })}
          </div>

          <Button
            onClick={(e) => {
              e.preventDefault();
              goNext();
            }}
            variant="outline"
            size="icon"
            className="h-14 w-14 rounded-full border-[#A7B78E]/30 bg-white text-[#A7B78E] shadow-xl transition-all hover:bg-[#A7B78E] hover:text-white active:scale-95">
            {isRTL ? <ChevronLeft size={28} /> : <ChevronRight size={28} />}
          </Button>
        </div>
      </div>
    </section>
  );
}

export default ResultsLanding;
