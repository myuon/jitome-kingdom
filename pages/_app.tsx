import "ress";
import React from "react";
import { Global, css } from "@emotion/core";
import { ThemeProvider } from "emotion-theming";
import { Theme } from "../src/components/Theme";
import { useAuth, AuthProvider } from "../src/hooks/useAuth";

const theme: Theme = {
  palette: {
    primary: {
      base: "#e61865",
      light: "#fedae0",
      dark: "#b91150"
    }
  }
};

const MyApp: React.FC<{ Component: any; pageProps: any }> = ({
  Component,
  pageProps
}) => {
  const ctx = useAuth();

  return (
    <ThemeProvider theme={theme}>
      <AuthProvider value={ctx}>
        <Global
          styles={css`
            main {
              max-width: 1024px;
              margin: auto;
              padding: 0.75em;
            }
          `}
        />
        <Component {...pageProps} />
      </AuthProvider>
    </ThemeProvider>
  );
};

export default MyApp;
