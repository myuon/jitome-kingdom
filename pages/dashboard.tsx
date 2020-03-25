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
  Grid
} from "@material-ui/core";
import { tryGacha, useGacha } from "../src/hooks/useGacha";
import { css } from "@emotion/core";

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

  return (
    <>
      <Navbar />

      <main>
        {loaded && user ? (
          <Grid container direction="column" spacing={2}>
            <Grid item>
              <p>みょんポイント: {user?.point}</p>
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
                <p>{gachaError}</p>
              </Grid>
            )}
            <Grid item>
              <Grid container spacing={1} direction="column">
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
            </Grid>
          </Grid>
        ) : (
          <p>loading...</p>
        )}
      </main>

      <ResultDialog
        obtained={obtained}
        open={resultDialogOpen}
        onClose={handleCloseResultDialog}
      />
    </>
  );
};

export default Dashboard;
