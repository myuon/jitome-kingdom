import React, { useCallback } from "react";
import { Button, Typography, Grid } from "@material-ui/core";
import { css } from "@emotion/core";
import { useAuthCtx } from "../src/hooks/useAuth";
import { useRouter } from "next/router";
import { Navbar } from "../src/parts/Navbar";
import HistoryIcon from "@material-ui/icons/History";

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

            p {
              font-size: smaller;
            }
          `}
        >
          <header>
            <Grid container direction="row" alignItems="center">
              <Grid
                item
                css={css`
                  margin-right: 0.5em;
                `}
              >
                <HistoryIcon />
              </Grid>
              <Grid item>
                <Typography variant="h6">サービス更新履歴</Typography>
              </Grid>
            </Grid>
          </header>
          <Typography>2020-03-29: 画面を可愛くしました。</Typography>
          <Typography>
            2020-03-26:
            緊急メンテナンスを行いました。ロールバックを行ったため、同日の18時以降のガチャ記録が消失しています。ご不便をおかけして申し訳ありません。こちらについては後日お詫びのプレゼントを送る予定です。
          </Typography>
          <Typography>2020-03-23: サービスをリリースしました。</Typography>
        </div>
      </main>
    </>
  );
};

export default Index;
