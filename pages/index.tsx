import React from "react";
import { Typography, Toolbar, Button, AppBar } from "@material-ui/core";
import { css } from "@emotion/core";
import { useAuth } from "../src/hooks/useAuth";

const Index: React.FC = props => {
  const { isAuthenticated, loading, loginWithRedirect } = useAuth();

  return (
    <React.Fragment>
      <AppBar position="static" elevation={0}>
        <Toolbar>
          <div
            css={css`
              flex-grow: 1;
            `}
          >
            <Typography variant="h6">ジト目王国</Typography>
          </div>
          {loading ? (
            <>ローディング…</>
          ) : isAuthenticated ? (
            <>ログイン済みです</>
          ) : (
            <Button color="inherit">ログイン</Button>
          )}
        </Toolbar>
      </AppBar>

      <main>
        <p>index</p>
        <div
          css={css`
            display: flex;
            justify-content: center;
          `}
        >
          <Button
            variant="contained"
            color="primary"
            onClick={loginWithRedirect}
          >
            ログインしてスタート
          </Button>
        </div>
      </main>

      <footer>ふったー</footer>
    </React.Fragment>
  );
};

export default Index;
