import { fetcher, useFetch } from "./useFetch";

interface GachaEvent {
  id: string;
  user_id: string;
  gacha_type: string;
  created_at: number;
}

interface DailyGachaRecord {
  latest?: GachaEvent;
  is_available: boolean;
  next_gacha_time: number;
}

interface GachaResult {
  obtained: number;
}

export const tryGacha = async (authToken?: string) => {
  return fetcher<GachaResult>(`${process.env.APP_ENDPOINT}/gacha/daily`, {
    method: "POST",
    authToken,
    noRun: !authToken
  });
};

export const useGacha = (authToken?: string, noRun?: boolean) => {
  const { data, err, loaded, forceReload } = useFetch<DailyGachaRecord>(
    `${process.env.APP_ENDPOINT}/gacha/daily/record`,
    {
      authToken,
      noRun: !authToken || noRun
    }
  );

  return {
    data,
    err,
    loaded,
    forceReload
  };
};
