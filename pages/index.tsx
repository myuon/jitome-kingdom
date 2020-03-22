import React, { useCallback } from "react";
import { Button } from "@material-ui/core";
import { css } from "@emotion/core";
import { useAuthCtx } from "../src/hooks/useAuth";
import { useRouter } from "next/router";
import { Navbar } from "../src/parts/Navbar";

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
    <React.Fragment>
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
      </main>
    </React.Fragment>
  );
};

export default Index;
