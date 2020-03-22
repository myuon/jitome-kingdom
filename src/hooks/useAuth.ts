import {
  useState,
  useEffect,
  useCallback,
  createContext,
  useContext
} from "react";
import createAuth0Client from "@auth0/auth0-spa-js";
import Auth0Client from "@auth0/auth0-spa-js/dist/typings/Auth0Client";
import Router, { useRouter } from "next/router";

const config = {
  domain: "myuon.auth0.com",
  clientId: "i2Fui9oEiFAN4zlVDeZIR2HYXBDPB0x7"
};

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
  const [loaded, setLoaded] = useState(false);
  const [authToken, setAuthToken] = useState<string>("");
  const router = useRouter();

  useEffect(() => {
    const fetcher = async () => {
      const client = await createAuth0Client({
        domain: config.domain,
        client_id: config.clientId
      });
      setAuth0Client(client);

      const token = TokenStorageApi.getToken();
      if (token && TokenStorageApi.verifyToken(token)) {
        setIsAuthenticated(true);
        setUser(UserStorageApi.getUser());
        setAuthToken(token);
        return;
      }

      if (
        window.location.search.includes("code=") &&
        window.location.search.includes("state=")
      ) {
        const { appState } = await client.handleRedirectCallback();
        Router.push(appState?.targetUrl ?? window.location.pathname);
      }

      setIsAuthenticated(await client.isAuthenticated());
      setUser(await client.getUser());

      const currentToken = await client.getTokenSilently();
      setAuthToken(currentToken);
      TokenStorageApi.setToken(currentToken);
      UserStorageApi.setUser(await client.getUser());
    };

    fetcher();

    setForceUpdate(false);
    setLoaded(true);
  }, [forceUpdate]);

  const loginWithRedirect = useCallback(
    async (redirectUri?: string) => {
      if (!auth0Client) return;
      if (typeof window === "undefined") return;

      await auth0Client.loginWithRedirect({
        redirect_uri:
          `${window.location.origin}${redirectUri}` ?? window.location.origin
      });
      setForceUpdate(true);
    },
    [auth0Client]
  );

  const logout = useCallback(
    async (redirectUri?: string) => {
      console.log(auth0Client);
      if (!auth0Client) return;
      TokenStorageApi.clearToken();
      auth0Client.logout();

      if (redirectUri) {
        router.push(redirectUri);
      }
    },
    [auth0Client, router]
  );

  return {
    isAuthenticated,
    user,
    loaded,
    authToken,
    loginWithRedirect,
    logout
  };
};

type AuthContext = {
  isAuthenticated: boolean;
  user: any;
  loaded: boolean;
  authToken: string;
  loginWithRedirect: (redirectUri?: string) => Promise<void>;
  logout: (redirectUri?: string) => Promise<void>;
};

export const AuthContext = createContext<AuthContext | undefined>(undefined);

export const AuthProvider = AuthContext.Provider;

export const useAuthCtx = (): AuthContext => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("AuthProvider not found");

  return ctx;
};
