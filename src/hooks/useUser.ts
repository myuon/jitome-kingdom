import { useFetch, fetcher } from "./useFetch";
import { createContext, useContext } from "react";

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
    picture_url: string;
  }
) => {
  return fetcher(`${process.env.APP_ENDPOINT}/me`, {
    authToken: authToken || "",
    noRun: !authToken,
    body: JSON.stringify(argument),
    method: "PUT"
  });
};

export const tryCheckAvailability = (
  authToken: string | undefined,
  screen_name: string,
  options?: {
    noRun?: boolean;
  }
) => {
  return fetcher<{ availability: boolean }>(
    `${process.env.APP_ENDPOINT}/users/${screen_name}/available`,
    {
      authToken: authToken || "",
      noRun: !authToken || options?.noRun
    }
  );
};

export const tryUploadIconFile = (
  authToken: string | undefined,
  argument: {
    data: string;
  }
) => {
  return fetcher<{ url: string }>(`${process.env.APP_ENDPOINT}/me/icon`, {
    authToken: authToken || "",
    noRun: !authToken,
    body: JSON.stringify(argument),
    method: "POST"
  });
};

type UserContext = {
  user: User | undefined;
  userLoaded: boolean;
  userReload: () => void;
};

export const UserContext = createContext<UserContext | undefined>(undefined);

export const UserProvider = UserContext.Provider;

export const useUserCtx = (): UserContext => {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error("UserProvider not found");

  return ctx;
};
