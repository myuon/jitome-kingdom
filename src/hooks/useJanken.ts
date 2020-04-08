import { fetcher, useFetch } from "./useFetch";

export type JankenHand = "rock" | "paper" | "scissors";

export type JankenStatus = "ready" | "won" | "lost";

export interface JankenEvent {
  id: string;
  user_id: string;
  hand: JankenHand;
  created_at: number;
  status: JankenStatus;
}

export const useJanken = (authToken: string) => {
  return useFetch<{ events: JankenEvent[] }>(
    `${process.env.APP_ENDPOINT}/janken`,
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
