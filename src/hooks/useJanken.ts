import { fetcher, useFetch } from "./useFetch";

export type JankenHand = "rock" | "paper" | "scissors";

export const displayJankenHand = (hand: JankenHand) => {
  return hand === "rock"
    ? "グー"
    : hand === "paper"
    ? "パー"
    : hand === "scissors"
    ? "チョキ"
    : undefined;
};

export type JankenStatus = "ready" | "won" | "lost" | "timeout";

export const displayJankenStatus = (status: JankenStatus) => {
  return status === "ready"
    ? "マッチング中…"
    : status === "won"
    ? "あなたの勝ち"
    : status === "lost"
    ? "あなたの負け"
    : status === "timeout"
    ? "不戦勝"
    : undefined;
};

export interface JankenEvent {
  id: string;
  user_id: string;
  hand: JankenHand;
  created_at: number;
  status: JankenStatus;
  opponent_user_id?: string;
  opponent_user_screen_name?: string;
}

export const useJanken = (authToken: string) => {
  return useFetch<{ events: JankenEvent[] }>(
    `${process.env.APP_ENDPOINT}/janken?limit=5`,
    {
      authToken,
      noRun: !authToken
    }
  );
};

export const tryCreateJanken = async (
  authToken: string,
  argument: { hand: JankenHand }
) => {
  const { error } = await fetcher(`${process.env.APP_ENDPOINT}/janken`, {
    method: "POST",
    body: JSON.stringify(argument),
    authToken,
    noRun: !authToken
  });
  if (error) {
    console.log(error);
    window.alert(error);
  }
};
