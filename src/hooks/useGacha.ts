import { fetcher } from "./useFetch";

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
