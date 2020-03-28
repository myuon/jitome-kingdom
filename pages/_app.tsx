import "ress";
import React from "react";
import { Global, css } from "@emotion/core";
import { ThemeProvider } from "emotion-theming";
import { Theme } from "../src/components/Theme";
import { useAuth, AuthProvider } from "../src/hooks/useAuth";
import Head from "next/head";
import { MuiThemeProvider, createMuiTheme } from "@material-ui/core";

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
  }
});

const MyApp: React.FC<{ Component: any; pageProps: any }> = ({
  Component,
  pageProps
}) => {
  const ctx = useAuth();

  return (
    <ThemeProvider theme={theme}>
      <MuiThemeProvider theme={muiTheme}>
        <AuthProvider value={ctx}>
          <Global
            styles={css`
              main {
                max-width: 860px;
                margin: auto;
                padding: 0.75em;
                color: #363636;
              }
            `}
          />
          <Head>
            <title>Jitome Kingdom</title>
            <meta property="og:title" content="ジト目王国" />
            <meta
              property="og:description"
              content="Welcome to Jitome Kingdom!"
            />
            <meta property="og:url" content="https://jitome.ramda.io" />
            <meta
              property="og:image"
              content="https://jitome.ramda.io/image/top_jitome.png"
            />
            <meta name="twitter:card" content="summary" />
            <meta name="twitter:site" content="@myuon_myon" />
            <meta
              name="viewport"
              content="width=device-width, initial-scale=1"
            />
          </Head>
          <Component {...pageProps} />
        </AuthProvider>
      </MuiThemeProvider>
    </ThemeProvider>
  );
};

export default MyApp;
