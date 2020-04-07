import { fetcher } from "./useFetch";

export type JankenHand = "rock" | "paper" | "scissors";

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
