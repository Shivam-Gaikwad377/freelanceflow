import { useEffect, useRef, useState } from "react";

export function useInfiniteScroll(onIntersect: () => void) {
  const [sentinel, setSentinel] = useState<Element | null>(null);
  const onIntersectRef = useRef(onIntersect);
  onIntersectRef.current = onIntersect; // always latest, no re-subscribe needed

  useEffect(() => {
    if (!sentinel) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) onIntersectRef.current(); },
      { rootMargin: "150px" }
    );
    obs.observe(sentinel);
    return () => obs.disconnect();
  }, [sentinel]); // only re-subscribes when the DOM node actually changes

  return setSentinel;
}
