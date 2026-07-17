import { useState, useEffect } from "react";
import axios from "axios";
import ApiResponse from "@/types/ApiResponse";

const useFetch = <T>(url: string, params: Record<string, any> = {}) => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const serializedParams = JSON.stringify(params);

  useEffect(() => {
    // 1. Create a new AbortController for this effect run
    const controller = new AbortController();

    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await axios.get<ApiResponse>(url, { 
          params: JSON.parse(serializedParams),
          signal: controller.signal // 2. Pass the signal to axios
        });
        setData(response.data.data as T);
        setError(null);
      } catch (err) {
        // 3. If the error is an abort cancellation, just ignore it.
        // We don't want to show an error state for a cancelled request.
        if (axios.isCancel(err)) {
          
          // Rethrow the error to be caught by the outer catch block
         return;
        }
        setError("Failed to fetch data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    // 4. The Cleanup Function: 
    // React runs this right BEFORE the next useEffect fires, or when the component unmounts.
    return () => {
      controller.abort();
    };
  }, [url, serializedParams]);

  return { data, loading, error };
};

export default useFetch;