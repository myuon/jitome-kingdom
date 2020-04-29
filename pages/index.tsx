import React, { useCallback } from "react";
import { Button, Typography, Grid } from "@material-ui/core";
import { css } from "@emotion/core";
import { useAuthCtx } from "../src/hooks/useAuth";
import { useRouter } from "next/router";
import { Navbar } from "../src/parts/Navbar";
import HistoryIcon from "@material-ui/icons/History";
import { dataChangelog } from "./changelog";

const Index: React.FC = props => {
  const { isAuthenticated, loginWithRedirect } = useAuthCtx();
  const router = useRouter();
  const tryLogin = useCallback(async () => {
    if (isAuthenticated) {
      router.push("/dashboard");
    } else {
      await loginWithRedirect("/dashboard");
    }
  }, [isAuthenticated, loginWithRedirect, router]);

  return (
    <>
      <Navbar />

      <main>
        <img
          src="/image/top_jitome.png"
          css={css`
            max-width: 95%;
            display: block;
            margin: 1.5em auto;
          `}
          decoding="async"
          alt="ジト目ガールかわいいピクチャ"
        />
        <img
          src="/image/logo.png"
          css={css`
            max-width: 85%;
            display: block;
            margin: 1.5em auto;
          `}
          decoding="async"
          width="200px"
          alt="申し訳程度のロゴ"
        />
        <div
          css={css`
            display: flex;
            justify-content: center;
            margin: 2em;
          `}
        >
          <Button
            variant="contained"
            color="primary"
            onClick={tryLogin}
            size="large"
          >
            ログインしてスタート
          </Button>
        </div>
        <div
          css={css`
            header {
              margin-bottom: 0.5em;
            }
          `}
        >
          <header>
            <Grid container direction="row" alignItems="center">
              <Grid
                item
                css={css`
                  margin-right: 0.1em;
                `}
              >
                <HistoryIcon />
              </Grid>
              <Grid item>
                <Typography variant="h3">最新のサービス更新履歴</Typography>
              </Grid>
            </Grid>
          </header>
          {dataChangelog.history.slice(0, 3).map((history, index) => (
            <Typography key={index}>
              {history.date}: {history.content}
            </Typography>
          ))}
        </div>
      </main>
    </>
  );
};

export default Index;
