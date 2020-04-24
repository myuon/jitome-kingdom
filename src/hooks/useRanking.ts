import { useFetch } from "./useFetch";

interface RankingTopUser {
  user_id: string;
  screen_name?: string;
  display_name: string;
  point: number;
  picture_url: string;
  diff?: number;
}

export const useRankingTop = (authToken: string) => {
  return useFetch<RankingTopUser[]>(`${process.env.APP_ENDPOINT}/ranking/top`, {
    authToken,
    noRun: !authToken
  });
};

export const useRankingDiff = (authToken: string) => {
  return useFetch<RankingTopUser[]>(
    `${process.env.APP_ENDPOINT}/ranking/diff`,
    {
      authToken,
      noRun: !authToken
    }
  );
};
