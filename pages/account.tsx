import React, { useState, useCallback, useEffect } from "react";
import { Navbar } from "../src/parts/Navbar";
import { useAuthCtx } from "../src/hooks/useAuth";
import { useUser } from "../src/hooks/useUser";
import {
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  TextField,
  Grid,
  InputAdornment
} from "@material-ui/core";
import { css } from "@emotion/core";

const UserInitializedDialog: React.FC<{
  open: boolean;
  handleClose: () => void;
  authUser: {
    name?: string;
    screen_name?: string;
    picture?: string;
  };
}> = props => {
  return (
    <Dialog onClose={props.handleClose} open={props.open}>
      <DialogTitle>プロフィールの設定</DialogTitle>
      <DialogContent>
        <DialogContentText>プロフィールを設定しましょう</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button autoFocus onClick={props.handleClose} color="primary">
          OK
        </Button>
      </DialogActions>
    </Dialog>
  );
};

const Account = () => {
  const { authToken, user: authUser } = useAuthCtx();
  const { user, loaded } = useUser(authToken);
  const [initializedUser, setInitializedUser] = useState(false);

  useEffect(() => {
    if (loaded && user && user.screen_name == null) {
      setInitializedUser(true);
      setUserId(user.screen_name);
      setDisplayName(user.display_name);
    }
  }, [user, setInitializedUser, loaded]);

  const [userId, setUserId] = useState();
  const [userIdError, setUserIdError] = useState<string>();
  const [displayName, setDisplayName] = useState("");

  const handleCloseInitializedUserDialog = useCallback(() => {
    setInitializedUser(false);
    setUserId(authUser.nickname);
    setDisplayName(authUser.name);
  }, [authUser]);

  const handleChangeUserId = useCallback(event => {
    const value = event.target.value;
    setUserId(event.target.value);

    if (!/^[a-zA-Z0-9_]+$/.test(value)) {
      setUserIdError("ユーザーIDは英数字またはアンダーバーのみ使えます");
    } else {
      setUserIdError("");
    }
  }, []);

  return (
    <>
      <Navbar />

      <main>
        <Typography variant="h6">アカウント設定</Typography>

        {loaded && user ? (
          <Grid container direction="column" spacing={2}>
            <Grid item>
              <Typography>アイコン</Typography>
            </Grid>
            <Grid container item justify="center">
              <img
                src={authUser.picture}
                css={css`
                  width: 128px;
                  height: 128px;
                  border-radius: 50%;
                `}
              />
            </Grid>
            <Grid item>
              <TextField
                name="display_name"
                label="表示名"
                margin="normal"
                placeholder="表示名を入力"
                fullWidth
                value={displayName}
                InputLabelProps={{
                  shrink: true
                }}
              />
              <TextField
                name="screen_name"
                label="ユーザーID"
                margin="normal"
                placeholder="英数字とアンダーバーのみ"
                fullWidth
                value={userId ?? ""}
                onChange={handleChangeUserId}
                error={!!userIdError}
                helperText={userIdError}
                InputLabelProps={{
                  shrink: true
                }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">@</InputAdornment>
                  )
                }}
              />
            </Grid>
            <Grid item>
              <Button color="primary" variant="contained">
                送信
              </Button>
            </Grid>
          </Grid>
        ) : (
          <Typography>loading...</Typography>
        )}
      </main>

      <UserInitializedDialog
        open={initializedUser ?? false}
        handleClose={handleCloseInitializedUserDialog}
        authUser={authUser}
      />
    </>
  );
};

export default Account;
