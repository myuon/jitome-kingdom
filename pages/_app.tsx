import "ress";
import React from "react";
import { Global, css } from "@emotion/core";
import { ThemeProvider } from "emotion-theming";
import { Theme } from "../src/components/Theme";
import { useAuth, AuthProvider } from "../src/hooks/useAuth";
import Head from "next/head";
import { MuiThemeProvider, createMuiTheme } from "@material-ui/core";
import { useUser, UserProvider } from "../src/hooks/useUser";

const theme: Theme = {
  palette: {
    primary: {
      base: "#009c95",
      light: "#00f6eb",
      dark: "#004b47"
    }
  }
};

const muiTheme = createMuiTheme({
  palette: {
    primary: {
      main: theme.palette.primary.base,
      light: theme.palette.primary.light,
      dark: theme.palette.primary.dark
    }
  },
  props: {
    MuiTypography: {
      style: {
        lineHeight: 1.8
      }
    }
  }
});

const MyApp: React.FC<{ Component: any; pageProps: any }> = ({
  Component,
  pageProps
}) => {
  const ctx = useAuth();
  const userCtx = useUser(ctx.authToken);

  return (
    <ThemeProvider theme={theme}>
      <MuiThemeProvider theme={muiTheme}>
        <AuthProvider value={ctx}>
          <UserProvider
            value={{
              user: userCtx.user,
              userLoaded: userCtx.loaded,
              userReload: userCtx.forceReload
            }}
          >
            <Global
              styles={css`
                main {
                  max-width: 860px;
                  margin: auto;
                  padding: 0.75em;
                  color: #363636;

                  /* FooterNavigation分 もうちょっとマシな方法ないのか？ */
                  padding-bottom: 75px;
                }
              `}
            />
            <Head>
              <title>Jitome Kingdom</title>
            </Head>
            <Component {...pageProps} />
          </UserProvider>
        </AuthProvider>
      </MuiThemeProvider>
    </ThemeProvider>
  );
};

export default MyApp;
