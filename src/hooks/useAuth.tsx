import { useState, useEffect, useCallback } from "react";
import createAuth0Client from "@auth0/auth0-spa-js";
import config from "../../auth_config.json";
import Auth0Client from "@auth0/auth0-spa-js/dist/typings/Auth0Client";
import Router from "next/router";

const TokenStorageApi = {
  getToken: () => localStorage.getItem("auth_token"),
  setToken: (token: string) => localStorage.setItem("auth_token", token),
  clearToken: () => localStorage.removeItem("auth_token"),
  verifyToken: (token: string): boolean => {
    const parts = token.split(".");
    if (parts.length !== 3) return false;

    return (
      parseInt(JSON.parse(atob(parts[1])).exp, 10) * 1000 > new Date().getTime()
    );
  }
};

const UserStorageApi = {
  getUser: () => JSON.parse(localStorage.getItem("auth_user")!),
  setUser: (user: any) =>
    localStorage.setItem("auth_user", JSON.stringify(user))
};

export const useAuth = () => {
  const [auth0Client, setAuth0Client] = useState<Auth0Client>();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<any>();
  const [forceUpdate, setForceUpdate] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetcher = async () => {
      const token = TokenStorageApi.getToken();
      if (token && TokenStorageApi.verifyToken(token)) {
        setIsAuthenticated(true);
        setUser(UserStorageApi.getUser());
        return;
      }

      const client = await createAuth0Client({
        domain: config.domain,
        client_id: config.clientId
      });
      setAuth0Client(client);

      if (
        window.location.search.includes("code=") &&
        window.location.search.includes("state=")
      ) {
        const { appState } = await client.handleRedirectCallback();
        Router.push(appState?.targetUrl ?? window.location.pathname);
      }

      setIsAuthenticated(await client.isAuthenticated());
      setUser(await client.getUser());

      TokenStorageApi.setToken(await client.getTokenSilently());
      UserStorageApi.setUser(await client.getUser());
    };

    fetcher();

    setForceUpdate(false);
    setLoading(false);
  }, [forceUpdate]);

  const loginWithRedirect = useCallback(async () => {
    if (!auth0Client) return;
    if (typeof window === "undefined") return;

    await auth0Client.loginWithRedirect({
      redirect_uri: window.location.origin
    });
    setForceUpdate(true);
  }, [auth0Client]);

  return {
    isAuthenticated,
    user,
    loading,
    loginWithRedirect
  };
};
