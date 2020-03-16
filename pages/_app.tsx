import "ress";
import React from "react";
import { Global, css } from "@emotion/core";
import { ThemeProvider } from "emotion-theming";
import { Theme } from "../src/components/Theme";

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
  return (
    <ThemeProvider theme={theme}>
      <Global
        styles={css`
          main {
            max-width: 1280px;
            margin: auto;
          }
        `}
      />
      <Component {...pageProps} />
    </ThemeProvider>
  );
};

export default MyApp;
