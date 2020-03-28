import React, { useCallback } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Container
} from "@material-ui/core";
import { css } from "@emotion/core";
import { useRouter } from "next/router";
import { useAuthCtx } from "../hooks/useAuth";
import Link from "next/link";
import { MultiColorBar } from "../components/MultiColorBar";

export const Navbar: React.FC = () => {
  const { isAuthenticated, loaded, loginWithRedirect, logout } = useAuthCtx();
  const router = useRouter();
  const tryLogin = useCallback(async () => {
    if (isAuthenticated) {
      router.push("/dashboard");
    } else {
      await loginWithRedirect("/dashboard");
    }
  }, [isAuthenticated, loginWithRedirect, router]);
  const handleLogout = useCallback(() => {
    logout(window.origin);
  }, [logout]);

  return (
    <>
      <AppBar position="static" elevation={0} color="transparent">
        <Container maxWidth="lg" disableGutters={true}>
          <Toolbar>
            <div
              css={css`
                flex-grow: 1;
              `}
            >
              <Link href="/">
                <Typography component="a" variant="h6">
                  Jitome Kingdom
                </Typography>
              </Link>
            </div>
            {!loaded ? (
              <>ローディング…</>
            ) : isAuthenticated ? (
              <Button color="inherit" onClick={handleLogout}>
                ログアウト
              </Button>
            ) : (
              <Button color="inherit" onClick={tryLogin}>
                ログイン
              </Button>
            )}
          </Toolbar>
        </Container>
      </AppBar>
      <MultiColorBar />
    </>
  );
};
