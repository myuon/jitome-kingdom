import { useFetch } from "./useFetch";

interface User {
  id: string;
  screen_name?: string;
  display_name: string;
  point: number;
  created_at: number;
  picture_url: string;
}

export const useUser = (authToken: string | undefined) => {
  const { data, loaded, forceReload } = useFetch<User>(
    `${process.env.APP_ENDPOINT}/me`,
    {
      authToken: authToken || "",
      noRun: !authToken
    }
  );

  return {
    user: data,
    forceReload,
    loaded
  };
};
