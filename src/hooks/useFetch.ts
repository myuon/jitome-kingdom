import { useState, useEffect } from "react";

export const useFetch = <T>(
  url: string,
  options: { authToken?: string; noRun?: boolean }
): {
  data: T | undefined;
  loaded: boolean;
  err: Error | undefined;
} => {
  const [data, setData] = useState();
  const [loaded, setLoaded] = useState(false);
  const [err, setErr] = useState();

  useEffect(() => {
    const fetcher = async () => {
      if (options.noRun) return;

      try {
        const resp = await fetch(
          url,
          options.authToken
            ? {
                headers: {
                  Authorization: `Bearer ${options.authToken}`
                }
              }
            : {}
        );

        if (!resp.ok) {
          throw new Error(
            `Unhealthy Response: ${resp.status} ${await resp.text()}`
          );
        }

        setData(await resp.json());
        setLoaded(true);
      } catch (err) {
        setErr(err);
      }
    };

    fetcher();
  }, [options.noRun, options.authToken, url]);

  return {
    data,
    loaded,
    err
  };
};
