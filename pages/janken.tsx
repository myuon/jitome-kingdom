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
import { useUserCtx } from "../src/hooks/useUser";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHandRock,
  faHandPeace,
  faHandPaper
} from "@fortawesome/free-solid-svg-icons";

const retryRunner = (handler: () => void, maxRetryCount: number) => {
  let waitTime = 1000;
  let counter = maxRetryCount;
  const fn = () => {
    counter--;
    waitTime *= 2;

    if (counter < 0) {
      return;
    }

    handler();
    setTimeout(fn, waitTime);
  };

  setTimeout(fn, waitTime);
};

const Janken: React.FC = () => {
  const { authToken } = useAuthCtx();
  const { userReload } = useUserCtx();
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
    userReload();

    retryRunner(() => {
      forceReload();
    }, 30);
  }, [authToken, setSnackbarOpen, selectedHand, forceReload, userReload]);

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
        <Grid container spacing={4} direction="column">
          <Grid container item spacing={1}>
            <Grid item>
              <Typography variant="h3">みょんポイントじゃんけん</Typography>
            </Grid>
            <Grid item>
              <Typography>
                みょんポイントじゃんけんとは、みょんポイントを賭けて行うじゃんけんです。じゃんけんの手を決めて送信すると、マッチングが行われ、勝てば相手のポイントがもらえ負ければポイントは没収となります。
              </Typography>
            </Grid>
          </Grid>
          <Grid container item spacing={1} direction="column">
            <Grid item>
              <Typography variant="h3">じゃんけんで遊ぶ！</Typography>
            </Grid>
            <Grid item>
              <Typography variant="caption">
                注意: マッチング中の場合新たにじゃんけんすることは出来ません。
              </Typography>
            </Grid>
            <Grid item>
              <RadioButtonGroup
                datalist={[
                  {
                    label: "グー",
                    startIcon: <FontAwesomeIcon icon={faHandRock} />,
                    key: "rock"
                  },
                  {
                    label: "チョキ",
                    startIcon: <FontAwesomeIcon icon={faHandPeace} />,
                    key: "scissors"
                  },
                  {
                    label: "パー",
                    startIcon: <FontAwesomeIcon icon={faHandPaper} />,
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
          <Grid container item spacing={1}>
            <Grid item>
              <Typography variant="h3">直近のじゃんけん履歴</Typography>
            </Grid>
            <Grid container item spacing={2} direction="column">
              {jankenEvents?.events.map(event => (
                <Grid item key={event.id}>
                  {event.status === "ready" ? (
                    <Typography>マッチング中…</Typography>
                  ) : (
                    <>
                      <Typography>
                        {displayJankenHand(event.hand)}を出して
                        {displayJankenStatus(event.status)}でした！
                      </Typography>
                      <Typography>
                        対戦相手:{" "}
                        {event.opponent_user_screen_name
                          ? `@${event.opponent_user_screen_name}`
                          : "名無し"}{" "}
                        さん
                      </Typography>
                    </>
                  )}
                  <Typography variant="caption">
                    {new Date(event.created_at * 1000).toLocaleString()}
                  </Typography>
                </Grid>
              ))}
            </Grid>
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
