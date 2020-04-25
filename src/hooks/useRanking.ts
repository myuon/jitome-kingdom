import { useFetch } from "./useFetch";

export interface RankingUser {
  user_id: string;
  screen_name?: string;
  display_name: string;
  picture_url: string;
  current: number;
  diff: number;
}

export const useRankingTop = (authToken: string) => {
  return useFetch<RankingUser[]>(`${process.env.APP_ENDPOINT}/ranking/top`, {
    authToken,
    noRun: !authToken
  });
};

export const useRankingDiff = (authToken: string) => {
  return useFetch<RankingUser[]>(`${process.env.APP_ENDPOINT}/ranking/diff`, {
    authToken,
    noRun: !authToken
  });
};
