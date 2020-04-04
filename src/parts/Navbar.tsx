import React, { useCallback, useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Hidden,
  Badge,
  Menu,
  MenuItem
} from "@material-ui/core";
import { css } from "@emotion/core";
import { useRouter } from "next/router";
import { useAuthCtx } from "../hooks/useAuth";
import Link from "next/link";
import { MultiColorBar } from "../components/MultiColorBar";
import CardGiftcardIcon from "@material-ui/icons/CardGiftcard";
import RestoreIcon from "@material-ui/icons/Restore";
import PersonIcon from "@material-ui/icons/Person";

export const Navbar: React.FC<{ giftBadge?: number }> = props => {
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

  const handleGotoChangelog = useCallback(() => {
    router.push("/changelog");
  }, [router]);
  const handleGotoGift = useCallback(() => {
    router.push("/gift");
  }, [router]);

  const [anchorEl, setAnchorEl] = useState(null);
  const handleClick = useCallback(
    event => {
      setAnchorEl(event.currentTarget);
    },
    [setAnchorEl]
  );
  const handleClose = useCallback(() => {
    setAnchorEl(null);
  }, [setAnchorEl]);

  const handleGotoAccount = useCallback(() => {
    router.push("/account");
  }, [router]);

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
                  <Badge
                    badgeContent={props.giftBadge ?? 0}
                    color="primary"
                    onClick={handleGotoGift}
                  >
                    <CardGiftcardIcon />
                    プレゼント
                  </Badge>
                </Button>

                <Button color="inherit" onClick={handleGotoChangelog}>
                  <RestoreIcon />
                  更新履歴
                </Button>
              </Hidden>
            )}
            {!loaded ? (
              <>ローディング…</>
            ) : isAuthenticated ? (
              <>
                <Button color="inherit" onClick={handleClick}>
                  <PersonIcon />
                  アカウント
                </Button>
                <Menu
                  keepMounted
                  open={Boolean(anchorEl)}
                  anchorEl={anchorEl}
                  onClose={handleClose}
                >
                  <MenuItem onClick={handleGotoAccount}>
                    アカウント設定
                  </MenuItem>
                  <MenuItem onClick={handleLogout}>ログアウト</MenuItem>
                </Menu>
              </>
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
