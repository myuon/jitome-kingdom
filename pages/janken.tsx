import React, { useCallback, useMemo, useState } from "react";
import { useAuthCtx } from "../src/hooks/useAuth";
import { useGift } from "../src/hooks/useGift";
import { Navbar } from "../src/parts/Navbar";
import { FooterNavigation } from "../src/parts/FooterNavigation";
import {
  Typography,
  Button,
  Grid,
  Snackbar,
  IconButton
} from "@material-ui/core";
import { tryCreateJanken, useJanken, JankenHand } from "../src/hooks/useJanken";
import CloseIcon from "@material-ui/icons/Close";

const Janken: React.FC = () => {
  const { authToken } = useAuthCtx();
  const { data: gifts } = useGift(authToken);

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const handleSnackbarClose = useCallback(() => {
    setSnackbarOpen(false);
  }, []);

  const handleSubmitJanken = useCallback(
    async (hand: JankenHand) => {
      await tryCreateJanken(authToken, {
        hand
      });

      handleSnackbarClose();
    },
    [authToken, handleSnackbarClose]
  );

  const handleRock = useCallback(() => {
    handleSubmitJanken("rock");
  }, [handleSubmitJanken]);
  const handleScissors = useCallback(async () => {
    handleSubmitJanken("scissors");
  }, [handleSubmitJanken]);
  const handlePaper = useCallback(async () => {
    handleSubmitJanken("paper");
  }, [handleSubmitJanken]);

  const { data: jankenEvents } = useJanken(authToken);
  const jankenAvailable = useMemo(() => {
    return (
      (jankenEvents?.events.filter(event => event.status === "ready").length ??
        -1) === 0
    );
  }, [jankenEvents]);

  return (
    <>
      <Navbar giftBadge={gifts?.length} />

      <main>
        <Grid container spacing={2}>
          <Grid item>
            <Typography variant="h6">みょんポイントじゃんけん</Typography>
            <Typography>
              みょんポイントじゃんけんとは、みょんポイントを賭けて行うじゃんけんです。じゃんけんの手を決めて送信すると、マッチングが行われ、勝てば相手のポイントがもらえ負ければポイントは没収となります。
            </Typography>
          </Grid>
          <Grid item>
            <Typography variant="h6">じゃんけんで遊ぶ！</Typography>
            <Grid container spacing={1}>
              <Grid item>
                <Button
                  variant="outlined"
                  color="primary"
                  onClick={handleRock}
                  disabled={!jankenAvailable}
                >
                  👊 グー
                </Button>
              </Grid>
              <Grid item>
                <Button
                  variant="outlined"
                  color="primary"
                  onClick={handleScissors}
                  disabled={!jankenAvailable}
                >
                  ✌ チョキ
                </Button>
              </Grid>
              <Grid item>
                <Button
                  variant="outlined"
                  color="primary"
                  onClick={handlePaper}
                  disabled={!jankenAvailable}
                >
                  ✋ パー
                </Button>
              </Grid>
            </Grid>
          </Grid>
          <Grid item>
            <Typography variant="h6">じゃんけん履歴</Typography>
            {jankenEvents?.events.map(event => (
              <div key={event.id}>
                <Typography>
                  出した手:{" "}
                  {event.hand === "rock"
                    ? "グー"
                    : event.hand === "paper"
                    ? "パー"
                    : event.hand === "scissors"
                    ? "チョキ"
                    : undefined}
                </Typography>
                <Typography>
                  結果:{" "}
                  {event.status === "ready"
                    ? "マッチング中…"
                    : event.status === "won"
                    ? "あなたの勝ち"
                    : event.status === "lost"
                    ? "あなたの負け"
                    : undefined}
                </Typography>
                <Typography variant="caption">
                  {new Date(event.created_at * 1000).toLocaleString()}
                </Typography>
              </div>
            ))}
          </Grid>
        </Grid>
      </main>

      <FooterNavigation giftBadge={gifts?.length} />

      <Snackbar
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left"
        }}
        open={snackbarOpen}
        onClose={handleSnackbarClose}
        message={"じゃんけんを送信しました"}
        action={
          <IconButton
            size="small"
            color="inherit"
            onClick={handleSnackbarClose}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        }
      />
    </>
  );
};

export default Janken;
