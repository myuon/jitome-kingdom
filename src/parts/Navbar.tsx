import React, { useCallback } from "react";
import { AppBar, Toolbar, Typography, Button, Hidden } from "@material-ui/core";
import { css } from "@emotion/core";
import { useRouter } from "next/router";
import { useAuthCtx } from "../hooks/useAuth";
import Link from "next/link";
import { MultiColorBar } from "../components/MultiColorBar";
import CardGiftcardIcon from "@material-ui/icons/CardGiftcard";
import RestoreIcon from "@material-ui/icons/Restore";
import PersonIcon from "@material-ui/icons/Person";

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
      <div
        css={css`
          max-width: 860px;
          margin: 0 auto;
        `}
      >
        <AppBar position="static" elevation={0} color="transparent">
          <Toolbar
            css={css`
              padding: 0.75em;
            `}
            disableGutters={true}
          >
            <div
              css={css`
                flex-grow: 1;
              `}
            >
              <Link href={isAuthenticated ? "/dashboard" : "/"}>
                <a
                  href="javascript:void(0);"
                  css={css`
                    color: inherit;
                    text-decoration: none;
                  `}
                >
                  <Typography variant="h6">Jitome Kingdom</Typography>
                </a>
              </Link>
            </div>
            {isAuthenticated && (
              <Hidden xsDown>
                <Button color="inherit">
                  <CardGiftcardIcon />
                  プレゼント
                </Button>

                <Button color="inherit">
                  <RestoreIcon />
                  更新履歴
                </Button>
              </Hidden>
            )}
            {!loaded ? (
              <>ローディング…</>
            ) : isAuthenticated ? (
              <Button color="inherit" onClick={handleLogout}>
                <PersonIcon />
                ログアウト
              </Button>
            ) : (
              <Button color="inherit" onClick={tryLogin}>
                <PersonIcon />
                ログイン
              </Button>
            )}
          </Toolbar>
        </AppBar>
      </div>
      <MultiColorBar />
    </>
  );
};
