import React, { useCallback, useState } from "react";
import { useAuthCtx } from "../src/hooks/useAuth";
import { useUserCtx } from "../src/hooks/useUser";
import { Navbar } from "../src/parts/Navbar";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Grid,
  Typography
} from "@material-ui/core";
import { tryGacha, useGacha } from "../src/hooks/useGacha";
import { css } from "@emotion/core";
import { NumberBoard } from "../src/components/NumberBoard";
import { useGift } from "../src/hooks/useGift";
import { FooterNavigation } from "../src/parts/FooterNavigation";
import RestoreIcon from "@material-ui/icons/Restore";
import { useRouter } from "next/router";
import Alert from "@material-ui/lab/Alert";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSortAmountDown } from "@fortawesome/free-solid-svg-icons";

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
  const router = useRouter();
  const { authToken } = useAuthCtx();
  const {
    user,
    userLoaded: loaded,
    userReload: forceReloadUser
  } = useUserCtx();
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

  const handleGotoChangelog = useCallback(() => {
    router.push(`/changelog`);
  }, [router]);

  const handleGotoAccount = useCallback(() => {
    router.push("/account");
  }, [router]);

  const handleGotoRanking = useCallback(() => {
    router.push("/ranking");
  }, [router]);

  return (
    <>
      <Navbar giftBadge={gifts?.length} />
      {loaded && !user?.screen_name && (
        <Alert
          severity="info"
          action={
            <Button color="inherit" size="small" onClick={handleGotoAccount}>
              設定
            </Button>
          }
        >
          ユーザーIDを設定して、ユーザーページをSNSで共有しましょう
        </Alert>
      )}

      <main>
        <div
          css={css`
            display: flex;
            justify-content: flex-end;
          `}
        >
          <Button
            startIcon={<FontAwesomeIcon icon={faSortAmountDown} />}
            onClick={handleGotoRanking}
          >
            ランキング
          </Button>
          <Button startIcon={<RestoreIcon />} onClick={handleGotoChangelog}>
            更新履歴
          </Button>
        </div>
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
                  href={`https://twitter.com/share?text=現在${
                    user?.point
                  }みょんポイントを保持しています！&url=${
                    user.screen_name
                      ? `${window.origin}/user/${
                          user.screen_name
                        }?timestamp=${Math.floor(new Date().getTime() / 1000)}`
                      : window.origin
                  }`}
                  variant="contained"
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

      <FooterNavigation giftBadge={gifts?.length} />

      <ResultDialog
        obtained={obtained}
        open={resultDialogOpen}
        onClose={handleCloseResultDialog}
      />
    </>
  );
};

export default Dashboard;
