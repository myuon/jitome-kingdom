import { useState, useEffect } from "react";

export const fetcher = async <T>(
  url: string,
  options: {
    method?: string;
    authToken?: string;
    noRun?: boolean;
  }
): Promise<{
  data: T | undefined;
  error: any;
}> => {
  if (options.noRun)
    return {
      data: undefined,
      error: undefined
    };

  try {
    let obj: RequestInit = {};
    if (options.authToken) {
      obj = {
        headers: {
          Authorization: `Bearer ${options.authToken}`
        },
        ...obj
      };
    }
    if (options.method) {
      obj = {
        method: options.method,
        ...obj
      };
    }

    const resp = await fetch(url, obj);

    if (!resp.ok) {
      throw new Error(
        `Unhealthy Response: ${resp.status} ${await resp.text()}`
      );
    }

    return {
      data: await resp.json(),
      error: undefined
    };
  } catch (err) {
    return {
      data: undefined,
      error: err
    };
  }
};

export const useFetch = <T>(
  url: string,
  options: { authToken?: string; noRun?: boolean }
): {
  data: T | undefined;
  loaded: boolean;
  err: Error | undefined;
} => {
  const [data, setData] = useState<T>();
  const [loaded, setLoaded] = useState(false);
  const [err, setErr] = useState();

  useEffect(
    () => {
      const fetchData = async () => {
        const { data, error } = await fetcher<T>(url, options);
        if (data) {
          setData(data);
          setLoaded(true);
        }
        if (error) {
          setErr(error);
        }
      };

      fetchData();
    },
    // eslint-disable-next-line
    [url, options.authToken, options.noRun]
  );

  return {
    data,
    loaded,
    err
  };
};
