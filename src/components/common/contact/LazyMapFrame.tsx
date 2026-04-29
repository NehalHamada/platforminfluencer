import { useEffect, useRef, useState } from "react";

function LazyMapFrame({ title }: { title: string }) {
  const [isVisible, setIsVisible] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const node = containerRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: "200px" },
    );

    observer.observe(node);

    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={containerRef}
      className="h-56 w-full min-w-0 max-w-full overflow-hidden sm:h-72 lg:h-88">
      {isVisible ? (
        <iframe
          title={title}
          src="https://maps.google.com/maps?q=riyadh&t=&z=13&ie=UTF8&iwloc=&output=embed"
          className="block h-full w-full max-w-full border-0"
          referrerPolicy="no-referrer-when-downgrade"
        />
      ) : (
        <div className="h-full w-full max-w-full animate-pulse bg-[#ece9df]" />
      )}
    </div>
  );
}

export default LazyMapFrame;
