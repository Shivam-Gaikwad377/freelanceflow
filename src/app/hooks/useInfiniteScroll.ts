import { useEffect, useState } from "react";

export function useInfiniteScroll(onIntersect: () => void) {
  const [sentinel, setSentinel] = useState<Element | null>(null);
  useEffect(() => {
    if (!sentinel) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) onIntersect(); },
      { rootMargin: "150px" }
    );
    obs.observe(sentinel);
    return () => obs.disconnect();
  }, [sentinel, onIntersect]);
  return setSentinel;
}
