import React, { useCallback, useState } from "react";
import { Navbar } from "../src/parts/Navbar";
import { useAuthCtx } from "../src/hooks/useAuth";
import { useGift, tryOpenGift } from "../src/hooks/useGift";
import { FooterNavigation } from "../src/parts/FooterNavigation";
import {
  Typography,
  Grid,
  Button,
  Divider,
  Dialog,
  DialogTitle,
  DialogContentText,
  DialogContent,
  DialogActions
} from "@material-ui/core";
import { css } from "@emotion/core";
import { useUserCtx } from "../src/hooks/useUser";

const AcceptedDialog: React.FC<{
  message: string;
  open: boolean;
  onClose: () => void;
}> = ({ message, open, onClose }) => {
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
        <DialogContentText>{message}</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button autoFocus onClick={handleClose} color="primary">
          閉じる
        </Button>
      </DialogActions>
    </Dialog>
  );
};

const Gift = () => {
  const { authToken } = useAuthCtx();
  const { userReload } = useUserCtx();
  const { data: gifts, forceReload } = useGift(authToken);

  const [message, setMessage] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const handleCloseDialog = useCallback(() => {
    setOpenDialog(false);
  }, []);

  const handleClick = useCallback(
    async (giftId: string) => {
      const { error } = await tryOpenGift(authToken, {
        giftId
      });
      forceReload();

      if (error) {
        throw new Error(JSON.stringify(error));
      }

      setMessage("みょんポイントを受け取りました");
      setOpenDialog(true);
      userReload();
    },
    [authToken, forceReload, userReload]
  );

  return (
    <>
      <Navbar giftBadge={gifts?.length} />

      <main>
        {gifts && gifts.length > 0 ? (
          gifts.map(gift => (
            <React.Fragment key={gift.id}>
              <div
                css={css`
                  margin: 0.5em 0.25em;
                `}
              >
                <Grid container alignItems="center">
                  <Grid
                    item
                    css={css`
                      flex-grow: 1;
                    `}
                    xs={12}
                    sm="auto"
                  >
                    <Typography
                      css={css`
                        font-weight: bold;
                      `}
                    >
                      みょんポイント: {gift.gift_type.point}
                    </Typography>
                    <Typography>{gift.description}</Typography>
                    <Typography variant="caption">
                      {new Date(gift.created_at * 1000).toLocaleString()}
                    </Typography>
                  </Grid>
                  <Grid item>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => handleClick(gift.id)}
                    >
                      受け取る
                    </Button>
                  </Grid>
                </Grid>
              </div>

              <Divider />
            </React.Fragment>
          ))
        ) : (
          <div
            css={css`
              display: flex;
              justify-content: center;
              margin: 0.5em 0;
            `}
          >
            <Typography>全てのプレゼントを受け取りました！</Typography>
          </div>
        )}
      </main>

      <FooterNavigation giftBadge={gifts?.length} />

      <AcceptedDialog
        open={openDialog}
        onClose={handleCloseDialog}
        message={message}
      />
    </>
  );
};

export default Gift;
