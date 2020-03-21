import React, { useCallback } from "react";
import { Button } from "@material-ui/core";
import { css } from "@emotion/core";
import { useAuthCtx } from "../src/hooks/useAuth";
import { useRouter } from "next/router";
import { Navbar } from "./parts/Navbar";

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
        <p>index</p>
        <div
          css={css`
            display: flex;
            justify-content: center;
          `}
        >
          <Button variant="contained" color="primary" onClick={tryLogin}>
            ログインしてスタート
          </Button>
        </div>
      </main>

      <footer>ふったー</footer>
    </React.Fragment>
  );
};

export default Index;
