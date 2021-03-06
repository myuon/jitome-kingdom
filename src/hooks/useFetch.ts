import { useState, useEffect, useCallback } from "react";

export const fetcher = async <T>(
  url: string,
  options: {
    body?: string;
    method?: string;
    authToken?: string;
    noRun?: boolean;
  }
): Promise<{
  data: T | undefined;
  error: any;
}> => {
  if (options.noRun) {
    return {
      data: undefined,
      error: undefined
    };
  }

  try {
    let obj: RequestInit = {};
    if (options.authToken) {
      obj = {
        ...obj,
        headers: {
          Authorization: `Bearer ${options.authToken}`
        }
      };
    }
    if (options.method) {
      obj = {
        ...obj,
        method: options.method
      };
    }
    if (options.body) {
      obj = {
        ...obj,
        body: options.body
      };
    }

    const resp = await fetch(url, obj);

    if (!resp.ok) {
      throw new Error(`${resp.status}: ${await resp.text()}`);
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
  forceReload: () => void;
} => {
  const [data, setData] = useState<T>();
  const [loaded, setLoaded] = useState(false);
  const [err, setErr] = useState();

  const forceReload = useCallback(async () => {
    const { data, error } = await fetcher<T>(url, options);
    if (data !== undefined) {
      setData(data);
      setLoaded(true);
    }
    if (error) {
      setErr(error);
    }
  }, [options, url]);

  // 初回とnoRunが変化したときだけ発火させる
  // かなりアドホックな挙動なのでどこかで罠になる可能性あり…
  useEffect(
    () => {
      forceReload();
    },
    // eslint-disable-next-line
    [options.noRun]
  );

  return {
    data,
    loaded,
    err,
    forceReload
  };
};
