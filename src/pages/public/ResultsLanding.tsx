import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
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

const AUTO_PLAY_INTERVAL = 5000;

const visibleCardOffsets = [-1, 0, 1];
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
  const [progressKey, setProgressKey] = useState(0);
  const videoRefs = useRef<Map<number, HTMLVideoElement>>(new Map());

  const totalVideos = resultVideos.length;

  const goPrev = () => {
    setCurrentPage((prev) => (prev <= 0 ? totalVideos - 1 : prev - 1));
    setIsPlaying(true);
    setProgressKey((k) => k + 1);
  };

  const goNext = () => {
    setCurrentPage((prev) => (prev + 1) % totalVideos);
    setIsPlaying(true);
    setProgressKey((k) => k + 1);
  };

  // Auto-advance — resets whenever progressKey changes (manual or auto)
  useEffect(() => {
    const timer = setTimeout(() => {
      setCurrentPage((prev) => (prev + 1) % totalVideos);
      setIsPlaying(true);
      setProgressKey((k) => k + 1);
    }, AUTO_PLAY_INTERVAL);
    return () => clearTimeout(timer);
  }, [progressKey, totalVideos]);

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

      <div className="relative z-10 mx-auto max-w-350 px-4">
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="mx-auto max-w-4xl text-center font-['IBM_Plex_Sans_Arabic']">
          <h2 className="relative inline-block px-2 font-bold text-[#899A6D] text-xl md:text-3xl lg:text-4xl">
            <span className="relative z-10">{title}</span>
            <span className="absolute bottom-2 left-0 w-full h-1.5 bg-[#899A6D]/30 z-0 rounded-full" />
          </h2>
          <p className="mx-auto mt-10 max-w-3xl font-medium leading-relaxed text-gray-500 text-sm md:text-lg">
            {description}
          </p>
        </motion.div>

        {/* Cinematic Video Slider */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.8, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          dir="ltr"
          className="relative mt-16 sm:mt-24 flex items-center justify-center overflow-visible">
          <div className="flex w-full items-center justify-center gap-6 sm:gap-4 lg:gap-8">
            {visibleCardOffsets.map((offset, position) => {
              const index = (currentPage + offset + totalVideos) % totalVideos;
              const videoUrl = resultVideos[index];
              const isImage = isImageMedia(videoUrl);
              const isActive = position === frontCardPosition;

              return (
                <Card
                  key={offset} // Stable key to prevent re-mounting
                  className={cn(
                    "group relative overflow-hidden border-0 shadow-2xl transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)]",
                    isActive
                      ? "z-30 h-85 w-65 opacity-100 sm:scale-110 sm:h-137.5 sm:w-85 lg:h-162.5 lg:w-105"
                      : "z-20 h-70 w-55 opacity-50 sm:scale-90 sm:h-112.5 sm:w-70 lg:h-137.5 lg:w-87.5",
                    !isActive && "flex grayscale-[0.4]",
                    "rounded-[24px] sm:rounded-[40px] bg-black cursor-pointer transition-all duration-500 hover:scale-[0.98] hover:grayscale-0",
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
                    <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-black/35 via-transparent to-black/15" />
                  )}

                  {/* Play Icon for inactive cards */}
                  {!isActive && (
                    <div className="absolute inset-0 hidden sm:flex items-center justify-center bg-black/10">
                      <div className="flex h-16 w-16 items-center justify-center rounded-full border-2 border-white/40 bg-white/10 text-[#A7B78E] backdrop-blur-sm transition-transform group-hover:scale-110">
                        <Play size={32} fill="currentColor" />
                      </div>
                    </div>
                  )}

                  {/* Active Card Controls Overlay */}
                  {isActive &&
                    (isImage ? (
                      <div
                        dir="ltr"
                        className="absolute inset-0 flex flex-col justify-between p-6 md:p-10">
                        <div className="hidden sm:flex justify-end">
                          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-black/20 text-white backdrop-blur-md">
                            <VolumeX size={24} />
                          </div>
                        </div>

                        <div className="flex justify-center">
                          <div className="flex h-10 w-10 sm:h-16 sm:w-16 items-center justify-center rounded-full bg-white/90 text-black shadow-xl transition-transform group-hover:scale-110">
                            <Play
                              className="h-5 w-5 sm:h-7 sm:w-7"
                              fill="currentColor"
                            />
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div
                        dir="ltr"
                        className="absolute inset-0 flex flex-col justify-between p-6 md:p-10">
                        <div className="hidden sm:flex justify-end">
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
                            className="h-10 w-10 sm:h-16 sm:w-16 rounded-full bg-white/90 text-black shadow-xl hover:bg-white transition-transform hover:scale-110">
                            {isPlaying ? (
                              <Pause
                                className="h-5 w-5 sm:h-7 sm:w-7"
                                fill="currentColor"
                              />
                            ) : (
                              <Play
                                className="h-5 w-5 sm:h-7 sm:w-7"
                                fill="currentColor"
                              />
                            )}
                          </Button>
                        </div>
                      </div>
                    ))}
                </Card>
              );
            })}
          </div>
        </motion.div>

        {/* Bottom Navigation & Progress */}
        <div
          dir="ltr"
          className="relative z-50 mt-12 sm:mt-20 flex items-center justify-center gap-4 sm:gap-6 lg:gap-12">
          <Button
            onClick={(e) => {
              e.preventDefault();
              goPrev();
            }}
            variant="outline"
            size="icon"
            className="h-8 w-8 sm:h-14 sm:w-14 rounded-full border border-[#899A6D] sm:border-[#A7B78E]/30 bg-transparent sm:bg-white text-[#899A6D] sm:text-[#A7B78E] shadow-none sm:shadow-xl transition-all hover:bg-[#899A6D] sm:hover:bg-[#A7B78E] hover:text-white active:scale-95">
            <ChevronLeft className="h-4 w-4 sm:h-7 sm:w-7" />
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
                    "rounded-full overflow-hidden transition-all duration-700",
                    isCurrent
                      ? "h-2 sm:h-2 w-8 sm:w-24 md:w-48 bg-gray-200 border-0"
                      : "h-2 sm:h-2 w-2 sm:w-12 md:w-20 border border-[#899A6D] bg-transparent sm:border-0 sm:bg-gray-200",
                  )}>
                  {isCurrent && (
                    <motion.div
                      key={progressKey}
                      className="h-full rounded-full bg-[#A7B78E]"
                      initial={{ width: "0%" }}
                      animate={{ width: "100%" }}
                      transition={{
                        duration: AUTO_PLAY_INTERVAL / 1000,
                        ease: "linear",
                      }}
                    />
                  )}
                </div>
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
            className="h-8 w-8 sm:h-14 sm:w-14 rounded-full border border-[#899A6D] sm:border-[#A7B78E]/30 bg-transparent sm:bg-white text-[#899A6D] sm:text-[#A7B78E] shadow-none sm:shadow-xl transition-all hover:bg-[#899A6D] sm:hover:bg-[#A7B78E] hover:text-white active:scale-95">
            <ChevronRight className="h-4 w-4 sm:h-7 sm:w-7" />
          </Button>
        </div>
      </div>
    </section>
  );
}

export default ResultsLanding;
