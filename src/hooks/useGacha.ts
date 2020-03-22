import { fetcher, useFetch } from "./useFetch";

interface GachaRecordPayload {
  id: string;
  user_id: string;
  gacha_type: string;
  created_at: number;
}

type GachaRecord = GachaRecordPayload | null;

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

export const useGacha = (authToken?: string) => {
  const { data, err, loaded } = useFetch<GachaRecord>(
    `${process.env.APP_ENDPOINT}/gacha/daily/latest`,
    {
      authToken,
      noRun: !authToken
    }
  );

  return {
    data,
    err,
    loaded
  };
};
