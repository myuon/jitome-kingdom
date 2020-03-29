import React, { useCallback, useState } from "react";
import { useAuthCtx } from "../src/hooks/useAuth";
import { useUser } from "../src/hooks/useUser";
import { Navbar } from "../src/parts/Navbar";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Grid,
  Typography,
  BottomNavigation,
  BottomNavigationAction,
  Paper,
  Hidden,
  Badge
} from "@material-ui/core";
import { tryGacha, useGacha } from "../src/hooks/useGacha";
import { css } from "@emotion/core";
import { NumberBoard } from "../src/components/NumberBoard";
import RestoreIcon from "@material-ui/icons/Restore";
import PersonIcon from "@material-ui/icons/Person";
import CardGiftcardIcon from "@material-ui/icons/CardGiftcard";
import { useGift } from "../src/hooks/useGift";

const ResultDialog: React.FC<{
  obtained: number;
  open: boolean;
  onClose: () => void;
}> = ({ obtained, open, onClose }) => {
  const handleClose = useCallback(() => {
    onClose();
  }, [onClose]);

  return (
    <Dialog
      onClose={handleClose}
      open={open}
      aria-labelledby="simple-dialog-title"
    >
      <DialogTitle id="simple-dialog-title">ガチャ結果</DialogTitle>
      <DialogContent>
        <DialogContentText>{obtained} みょんポイントを獲得！</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button autoFocus onClick={handleClose} color="primary">
          閉じる
        </Button>
      </DialogActions>
    </Dialog>
  );
};

const Dashboard: React.FC = () => {
  const { authToken } = useAuthCtx();
  const { user, loaded, forceReload: forceReloadUser } = useUser(authToken);
  const [resultDialogOpen, setResultDialogOpen] = useState(false);
  const [obtained, setObtained] = useState(0);
  const {
    data: gacha,
    err: gachaError,
    loaded: gachaLoaded,
    forceReload: forceReloadGacha
  } = useGacha(authToken, !loaded);

  const handleCloseResultDialog = useCallback(() => {
    setResultDialogOpen(false);
  }, []);

  const handleTryGacha = useCallback(async () => {
    const { data, error } = await tryGacha(authToken);
    if (data) {
      setObtained(data.obtained);
      forceReloadUser();
      forceReloadGacha();
      setResultDialogOpen(true);
    }

    if (error) {
      console.error(error);
      window.alert(`エラーが発生しました: ${error}`);
    }
  }, [authToken, forceReloadUser, forceReloadGacha]);

  const { data: gifts } = useGift(authToken);

  return (
    <>
      <Navbar giftBadge={gifts?.length} />

      <main>
        {loaded && user ? (
          <div
            css={css`
              display: flex;
              flex-direction: column;

              & > div:not(:first-of-type) {
                margin-top: 1em;
              }
            `}
          >
            <Grid container direction="column" spacing={1}>
              <Grid item>
                <div
                  css={css`
                    margin: 1em;
                  `}
                >
                  <NumberBoard
                    label="現在のみょんポイント"
                    number={user?.point}
                  />
                </div>
                {gacha?.latest && (
                  <p>
                    最後にガチャを引いた日:
                    {new Date(gacha.latest.created_at * 1000).toLocaleString()}
                  </p>
                )}
              </Grid>

              <Grid item>
                {gachaLoaded && gacha ? (
                  <Button
                    color="primary"
                    variant="contained"
                    onClick={handleTryGacha}
                    disabled={!gacha.is_available}
                    size="large"
                  >
                    {gacha.is_available
                      ? "みょんポイントガチャを引く！"
                      : "本日のガチャは終了しました"}
                  </Button>
                ) : (
                  <>loading...</>
                )}
              </Grid>
              <Grid item>
                <small>現在のみょんポイントガチャは毎日0時更新です</small>
              </Grid>
              {gachaError && (
                <Grid item>
                  <Typography color="error">
                    {JSON.stringify(gachaError)}
                  </Typography>
                </Grid>
              )}
            </Grid>

            <Grid container direction="column" spacing={1}>
              <Grid item>
                <p>みょんポイントをみんなとシェアしましょう！</p>
              </Grid>
              <Grid item>
                <Button
                  href={`https://twitter.com/share?text=現在${user?.point}みょんポイントを保持しています！&url=${window.origin}`}
                  color="inherit"
                  variant="outlined"
                  css={css`
                    color: rgb(29, 161, 242);
                  `}
                >
                  ツイート
                </Button>
              </Grid>
            </Grid>
          </div>
        ) : (
          <>loading...</>
        )}
      </main>

      <footer
        css={css`
          width: 100%;
          position: fixed;
          bottom: 0;
        `}
      >
        <Hidden smUp>
          <Paper elevation={3}>
            <BottomNavigation showLabels value={1}>
              <BottomNavigationAction
                label="プレゼント"
                icon={
                  <Badge badgeContent={gifts?.length ?? 0} color="primary">
                    <CardGiftcardIcon />
                  </Badge>
                }
              />
              <BottomNavigationAction
                label="マイページ"
                icon={<PersonIcon />}
              />
              <BottomNavigationAction label="更新履歴" icon={<RestoreIcon />} />
            </BottomNavigation>
          </Paper>
        </Hidden>
      </footer>

      <ResultDialog
        obtained={obtained}
        open={resultDialogOpen}
        onClose={handleCloseResultDialog}
      />
    </>
  );
};

export default Dashboard;
