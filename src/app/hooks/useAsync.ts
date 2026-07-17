// hooks/useAsync.ts — one generic hook, reused for all three
import { useEffect, useState } from "react";

export function useAsync<T>(
  fetcher: (signal: AbortSignal) => Promise<T>,
  deps: unknown[] = []
) {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();
    setIsLoading(true);
    setError(null);

    fetcher(controller.signal)
      .then((result) => {
        if (!controller.signal.aborted) setData(result);
      })
      .catch((err) => {
        if (err.name !== "AbortError" && !controller.signal.aborted) setError(err);
      })
      .finally(() => {
        if (!controller.signal.aborted) setIsLoading(false);
      });

    return () => controller.abort();
  }, deps);

  return { data, error, isLoading };
}