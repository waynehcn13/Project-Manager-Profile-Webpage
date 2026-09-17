import { useEffect, useRef, useState } from "react";

// Tracks whether an element is currently intersecting the viewport, so
// content can "come alive" as it scrolls in and reset as it scrolls past.
export function useInView<T extends HTMLElement>(threshold = 0.3, rootMargin = "0px") {
  const ref = useRef<T | null>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry?.isIntersecting ?? false),
      { threshold, rootMargin },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold, rootMargin]);

  return { ref, inView } as const;
}
