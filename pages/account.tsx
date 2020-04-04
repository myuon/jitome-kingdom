import React, { useState, useCallback, useEffect } from "react";
import { Navbar } from "../src/parts/Navbar";
import { useAuthCtx } from "../src/hooks/useAuth";
import {
  useUser,
  tryCheckAvailability,
  tryUpdateProfile
} from "../src/hooks/useUser";
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
  InputAdornment,
  Snackbar,
  IconButton
} from "@material-ui/core";
import { css } from "@emotion/core";
import CheckIcon from "@material-ui/icons/Check";
import ErrorIcon from "@material-ui/icons/Error";
import CloseIcon from "@material-ui/icons/Close";
import { green } from "@material-ui/core/colors";

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
    if (loaded && user) {
      setUserId(user.screen_name);
      setDisplayName(user.display_name);

      if (user.screen_name == null) {
        setInitializedUser(true);
      }
    }
  }, [user, setInitializedUser, loaded]);

  const [userId, setUserId] = useState<string>();
  const [userIdError, setUserIdError] = useState<string>();
  const [displayName, setDisplayName] = useState("");
  const [userIdAvailability, setUserIdAvailability] = useState(false);

  const handleCloseInitializedUserDialog = useCallback(() => {
    setInitializedUser(false);
    setUserId(authUser.nickname);
    setDisplayName(authUser.name);
  }, [authUser]);

  const handleChangeUserId = useCallback(async event => {
    const value = event.target.value;
    setUserId(event.target.value);

    if (!/^[a-zA-Z0-9_]{3,}$/.test(value)) {
      setUserIdError(
        "ユーザーIDは3文字以上、英数字またはアンダーバーのみ使えます"
      );
    } else {
      setUserIdError("");
    }
  }, []);

  const handleChangeDisplayName = useCallback(event => {
    setDisplayName(event.target.value);
  }, []);

  useEffect(() => {
    const runner = async () => {
      if (userId === user?.screen_name) {
        setUserIdAvailability(true);
        setUserIdError(undefined);
        return;
      }

      const { data, error } = await tryCheckAvailability(
        authToken,
        userId || "",
        {
          noRun: !userId || Boolean(userIdError)
        }
      );
      if (error) {
        window.alert(`${JSON.stringify(error)}`);
      }

      if (data) {
        setUserIdAvailability(data.availability);
        setUserIdError(
          data.availability ? undefined : "このユーザーIDは使用できません"
        );
      }
    };

    runner();
  }, [userId, authToken, user, userIdError]);

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const handleSnackbarClose = useCallback(() => {
    setSnackbarOpen(false);
  }, []);

  const handleSubmit = useCallback(async () => {
    await tryUpdateProfile(authToken, {
      screen_name: userId || "",
      display_name: displayName,
      picture_url: authUser?.picture
    });
    setSnackbarOpen(true);
  }, [authToken, authUser, displayName, userId]);

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
                onChange={handleChangeDisplayName}
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
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      {userIdAvailability ? (
                        <CheckIcon style={{ color: green[500] }} />
                      ) : (
                        <ErrorIcon color="error" />
                      )}
                    </InputAdornment>
                  )
                }}
              />
            </Grid>
            <Grid item>
              <Button
                color="primary"
                variant="contained"
                disabled={Boolean(userIdError)}
                onClick={handleSubmit}
              >
                送信
              </Button>
              <Snackbar
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "left"
                }}
                open={snackbarOpen}
                onClose={handleSnackbarClose}
                message={"プロフィールを更新しました"}
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
