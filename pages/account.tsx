import React, { useState, useCallback, useEffect, useRef } from "react";
import { Navbar } from "../src/parts/Navbar";
import { useAuthCtx } from "../src/hooks/useAuth";
import {
  useUser,
  tryCheckAvailability,
  tryUpdateProfile,
  tryUploadIconFile
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
import PublishIcon from "@material-ui/icons/Publish";
import { green } from "@material-ui/core/colors";
import { FooterNavigation } from "../src/parts/FooterNavigation";

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

const ImagePreviewDialog: React.FC<{
  open: boolean;
  onClose: () => void;
  onSubmit: (data: string) => void;
  file?: File;
}> = props => {
  const [src, setSrc] = useState<string>();
  useEffect(() => {
    const runner = () => {
      if (!props.file) return;

      const reader = new FileReader();
      reader.onload = event => {
        setSrc(event.target?.result as string);
      };
      reader.readAsDataURL(props.file);
    };

    runner();
  }, [props.file]);

  const handleSubmit = useCallback(() => {
    if (src) {
      props.onSubmit(src.split("base64,")[1]);
    }
  }, [src, props.onSubmit]);

  return (
    <Dialog onClose={props.onClose} open={props.open}>
      <DialogTitle>画像のプレビュー</DialogTitle>
      <DialogContent>
        <Grid container spacing={1}>
          <Grid item>
            <DialogContentText>こちらでよろしいですか？</DialogContentText>
          </Grid>
          <Grid item container justify="center">
            <img
              src={src}
              css={css`
                width: 128px;
                height: 128px;
              `}
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button autoFocus onClick={props.onClose} color="primary">
          キャンセル
        </Button>
        <Button autoFocus onClick={handleSubmit} color="primary">
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
      setPictureUrl(user.picture_url);

      if (user.screen_name == null) {
        setInitializedUser(true);
      }
    }
  }, [user, setInitializedUser, loaded]);

  const [userId, setUserId] = useState<string>();
  const [userIdError, setUserIdError] = useState<string>();
  const [displayName, setDisplayName] = useState("");
  const [userIdAvailability, setUserIdAvailability] = useState(false);
  const [pictureUrl, setPictureUrl] = useState<string>();

  const handleCloseInitializedUserDialog = useCallback(() => {
    setInitializedUser(false);
    setUserId(authUser.nickname);
    setDisplayName(authUser.name);
    setPictureUrl(authUser.picture);
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
      picture_url: pictureUrl || ""
    });
    setSnackbarOpen(true);
  }, [authToken, pictureUrl, displayName, userId]);

  const iconFileAnchor = useRef<HTMLInputElement>(null);
  const handleFileDialog = useCallback(() => {
    if (iconFileAnchor && iconFileAnchor.current) {
      iconFileAnchor.current.click();
    }
  }, []);

  const [openImagePreview, setOpenImagePreview] = useState(false);
  const [imageFile, setImageFile] = useState<File>();

  const handleCloseImagePreview = useCallback(() => {
    setOpenImagePreview(false);
  }, []);
  const handleSubmitImage = useCallback(
    async (data: string) => {
      const { data: resp, error } = await tryUploadIconFile(authToken, {
        data
      });
      if (error) {
        window.alert(JSON.stringify(error));
      }
      if (resp) {
        setPictureUrl(resp.url);
      }

      setOpenImagePreview(false);
    },
    [authToken]
  );

  const handleUploadImage = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      if (iconFileAnchor && iconFileAnchor.current) {
        setOpenImagePreview(true);
        setImageFile(iconFileAnchor.current.files?.[0]);
      }
    },
    []
  );

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
              <div
                css={css`
                  position: relative;
                  width: 128px;
                  height: 128px;
                `}
              >
                <div
                  css={css`
                    position: absolute;
                    width: inherit;
                    height: inherit;
                    background-color: rgba(0, 0, 0, 0.3);
                    border-radius: 50%;
                  `}
                />
                <input
                  accept="image/*"
                  type="file"
                  css={css`
                    display: none;
                  `}
                  ref={iconFileAnchor}
                  onChange={handleUploadImage}
                />
                <IconButton
                  component="span"
                  css={css`
                    position: absolute;
                    width: inherit;
                    height: inherit;
                    font-size: 48px;
                    color: white;
                  `}
                  onClick={handleFileDialog}
                >
                  <PublishIcon fontSize="inherit" />
                </IconButton>
                <img
                  src={pictureUrl}
                  css={css`
                    width: inherit;
                    height: inherit;
                    border-radius: 50%;
                  `}
                />
              </div>
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

      <FooterNavigation />

      <UserInitializedDialog
        open={initializedUser ?? false}
        handleClose={handleCloseInitializedUserDialog}
        authUser={authUser}
      />

      <ImagePreviewDialog
        open={openImagePreview}
        onClose={handleCloseImagePreview}
        onSubmit={handleSubmitImage}
        file={imageFile}
      />
    </>
  );
};

export default Account;
