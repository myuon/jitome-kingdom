import "ress";
import React, { useEffect } from "react";
import { Global, css } from "@emotion/core";
import { ThemeProvider } from "emotion-theming";
import { Theme } from "../src/components/Theme";
import { useAuth, AuthProvider } from "../src/hooks/useAuth";
import Head from "next/head";
import { MuiThemeProvider, createMuiTheme } from "@material-ui/core";
import { useMe, UserProvider } from "../src/hooks/useUser";

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
  const userCtx = useMe(ctx.authToken);

  useEffect(() => {
    const jssStyles = document.querySelector("#jss-server-side");
    if (jssStyles && jssStyles.parentElement) {
      jssStyles.parentElement.removeChild(jssStyles);
    }
  }, []);

  return (
    <>
      <Head>
        <meta name="application-name" content="ジト目王国" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta
          name="apple-mobile-web-app-title"
          content="ジト目王国 - Jitome Kingdom"
        />
        <meta name="description" content="ジト目王国へようこそ" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="msapplication-config" content="/image/browserconfig.xml" />
        <meta name="msapplication-TileColor" content="#2B5797" />
        <meta name="msapplication-tap-highlight" content="no" />
        <meta name="theme-color" content="#009c95" />
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no, user-scalable=no, viewport-fit=cover"
        />

        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/image/icon-180.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/image/favicon-32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/image/favicon-16x16.png"
        />
        <link rel="manifest" href="/manifest.json" />
        <link rel="icon" href="/favicon.ico" />

        <meta property="og:type" content="website" />
        <meta property="og:title" content="ジト目王国" />
        <meta
          property="og:description"
          content="ようこそジト目王国へ！"
          key="og-description"
        />
        <meta property="og:site_name" content="ジト目王国" />
        <meta property="og:url" content="https://jitome.ramda.io" />
        <meta
          property="og:image"
          content="https://jitome.ramda.io/image/top_jitome.png"
          key="og-image"
        />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:url" content="https://jitome.ramda.io" />
        <meta name="twitter:title" content="ジト目王国" />
        <meta
          name="twitter:description"
          content="ようこそジト目王国へ！"
          key="twitter-description"
        />
        <meta
          name="twitter:image"
          content="https://jitome.ramda.io/image/top_jitome.png"
          key="twitter-image"
        />
        <meta name="twitter:creator" content="@myuon_myon" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

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
    </>
  );
};

export default MyApp;
