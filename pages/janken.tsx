import React, { useCallback, useMemo } from "react";
import { useAuthCtx } from "../src/hooks/useAuth";
import { useGift } from "../src/hooks/useGift";
import { Navbar } from "../src/parts/Navbar";
import { FooterNavigation } from "../src/parts/FooterNavigation";
import { Typography, Button, Grid } from "@material-ui/core";
import { tryCreateJanken, useJanken } from "../src/hooks/useJanken";

const Janken: React.FC = () => {
  const { authToken } = useAuthCtx();
  const { data: gifts } = useGift(authToken);
  const handleRock = useCallback(async () => {
    await tryCreateJanken(authToken, {
      hand: "rock"
    });
  }, [authToken]);
  const handleScissors = useCallback(async () => {
    await tryCreateJanken(authToken, {
      hand: "scissors"
    });
  }, [authToken]);
  const handlePaper = useCallback(async () => {
    await tryCreateJanken(authToken, {
      hand: "paper"
    });
  }, [authToken]);

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
                  👊グー
                </Button>
              </Grid>
              <Grid item>
                <Button
                  variant="outlined"
                  color="primary"
                  onClick={handleScissors}
                  disabled={!jankenAvailable}
                >
                  ✌チョキ
                </Button>
              </Grid>
              <Grid item>
                <Button
                  variant="outlined"
                  color="primary"
                  onClick={handlePaper}
                  disabled={!jankenAvailable}
                >
                  ✋パー
                </Button>
              </Grid>
            </Grid>
          </Grid>
          <Grid item>
            <Typography variant="h6">じゃんけん履歴</Typography>
            {jankenEvents?.events.map(event => (
              <div key={event.id}>
                <Typography>出した手: {event.hand}</Typography>
                <Typography>結果: {event.status}</Typography>
                <Typography variant="caption">
                  {new Date(event.created_at * 1000).toLocaleString()}
                </Typography>
              </div>
            ))}
          </Grid>
        </Grid>
      </main>

      <FooterNavigation giftBadge={gifts?.length} />
    </>
  );
};

export default Janken;
