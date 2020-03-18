import { useFetch } from "./useFetch";

interface User {
  sub: string;
}

export const useUser = (authToken: string | undefined) => {
  const { data } = useFetch<User>(`${process.env.APP_ENDPOINT}/me`, {
    authToken: authToken || "",
    noRun: !authToken
  });
  console.log(data);
};
