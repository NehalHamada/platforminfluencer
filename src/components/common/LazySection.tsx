import { useEffect, useRef, useState, type ReactNode } from "react";
import { Skeleton } from "@/components/ui/skeleton";

type LazySectionProps = {
  children: ReactNode;
  /** Distance from viewport before the section starts loading */
  rootMargin?: string;
  /** Minimum height for the placeholder */
  minHeight?: string;
  /** Unique id for the section */
  id?: string;
};

/**
 * Wraps a section and only renders its children when it enters (or is near)
 * the viewport, using IntersectionObserver. This avoids rendering heavy
 * components and loading images that the user hasn't scrolled to yet.
 */
function LazySection({
  children,
  rootMargin = "200px",
  minHeight = "200px",
  id,
}: LazySectionProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin },
    );

    observer.observe(el);

    return () => observer.disconnect();
  }, [rootMargin]);

  if (isVisible) {
    return <>{children}</>;
  }

  return (
    <div ref={ref} id={id} style={{ minHeight }}>
      <div className="flex w-full flex-col items-center gap-4 px-4 py-12">
        <Skeleton className="h-8 w-2/3 rounded-full" />
        <Skeleton className="h-4 w-1/2 rounded-full" />
        <Skeleton className="h-32 w-full max-w-4xl rounded-2xl" />
      </div>
    </div>
  );
}

export default LazySection;
