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
import {
  tryCreateJanken,
  useJanken,
  JankenHand,
  displayJankenHand,
  displayJankenStatus
} from "../src/hooks/useJanken";
import CloseIcon from "@material-ui/icons/Close";
import { RadioButtonGroup } from "../src/components/RadioButtonGroup";

const Janken: React.FC = () => {
  const { authToken } = useAuthCtx();
  const { data: gifts } = useGift(authToken);
  const { data: jankenEvents, forceReload } = useJanken(authToken);

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const handleSnackbarClose = useCallback(() => {
    setSnackbarOpen(false);
  }, []);

  const [selectedHand, setSelectedHand] = useState<string>();
  const handleSubmitJanken = useCallback(async () => {
    if (!selectedHand) return;

    await tryCreateJanken(authToken, {
      hand: selectedHand as JankenHand
    });
    setSnackbarOpen(true);
    forceReload();
  }, [authToken, setSnackbarOpen, selectedHand, forceReload]);

  const jankenAvailable = useMemo(() => {
    return (
      (jankenEvents?.events.filter(event => event.status === "ready").length ??
        -1) === 0
    );
  }, [jankenEvents]);

  const handleChangeSelectedHand = useCallback((hand: string) => {
    setSelectedHand(hand);
  }, []);

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
            <Typography variant="caption">
              注意:
              マッチング中の場合新たにじゃんけんすることは出来ません。一定時間経ってもマッチングできなかった場合は不戦勝となります。
            </Typography>
            <Grid container spacing={2}>
              <Grid item>
                <RadioButtonGroup
                  datalist={[
                    {
                      label: "👊 グー",
                      key: "rock"
                    },
                    {
                      label: "✌ チョキ",
                      key: "scissors"
                    },
                    {
                      label: "✋ パー",
                      key: "paper"
                    }
                  ]}
                  onChange={handleChangeSelectedHand}
                  disabled={!jankenAvailable}
                />
              </Grid>
              <Grid item>
                <Button
                  color="primary"
                  variant="contained"
                  onClick={handleSubmitJanken}
                  disabled={!selectedHand || !jankenAvailable}
                >
                  5 みょんポイント払ってじゃんけん！
                </Button>
              </Grid>
            </Grid>
          </Grid>
          <Grid item>
            <Typography variant="h6">じゃんけん履歴</Typography>
            {jankenEvents?.events.map(event => (
              <div key={event.id}>
                {event.status === "ready" ? (
                  <Typography>マッチング中…</Typography>
                ) : (
                  <>
                    <Typography>
                      {displayJankenHand(event.hand)}を出して
                      {displayJankenStatus(event.status)}でした！
                    </Typography>
                    <Typography>
                      対戦相手: @{event.opponent_user_screen_name} さん
                    </Typography>
                  </>
                )}
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
