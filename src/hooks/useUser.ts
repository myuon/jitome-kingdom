import { useFetch, fetcher } from "./useFetch";

interface User {
  id: string;
  screen_name?: string;
  display_name: string;
  point: number;
  created_at: number;
  picture_url: string;
  roles?: string[];
}

export const isAdmin = (user: User): boolean => {
  return (
    user.roles !== undefined && user.roles.filter(r => r === "admin").length > 0
  );
};

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

export const tryUpdateProfile = (
  authToken: string | undefined,
  argument: {
    screen_name: string;
    display_name: string;
  }
) => {
  return fetcher(`${process.env.APP_ENDPOINT}/me/profile`, {
    authToken: authToken || "",
    noRun: !authToken,
    body: JSON.stringify(argument)
  });
};
