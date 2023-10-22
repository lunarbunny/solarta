import { useEffect, useState } from "react";

interface FetchState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

const useFetch = <T>(url: string, usesRouter?: boolean): FetchState<T> => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Prevents the fetch from running if the next router is not initialized
    if (usesRouter && url.includes("undefined")) return;

    setLoading(true);
    fetch(url)
      .then((res) => res.json())
      .then((data: T) => {
        setData(data);
        setLoading(false);
      })
      .catch((error: Error) => {
        setError(error.name);
        setLoading(false);
      });
  }, [url, usesRouter]);

  return { data, loading, error };
};

export default useFetch;