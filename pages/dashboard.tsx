import React, { useCallback, useState } from "react";
import { useAuthCtx } from "../src/hooks/useAuth";
import { useUser } from "../src/hooks/useUser";
import { Navbar } from "./parts/Navbar";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions
} from "@material-ui/core";
import { tryGacha } from "../src/hooks/useGacha";

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
  const { user, loaded } = useUser(authToken);
  const [resultDialogOpen, setResultDialogOpen] = useState(false);
  const [obtained, setObtained] = useState(0);

  const handleCloseResultDialog = useCallback(() => {
    setResultDialogOpen(false);
  }, []);

  const handleTryGacha = useCallback(async () => {
    const { data, error } = await tryGacha(authToken);
    if (data) {
      setObtained(data.obtained);
      setResultDialogOpen(true);
    }

    if (error) {
      console.error(JSON.stringify(error));
      window.alert(JSON.stringify(error));
    }
  }, [authToken]);

  return (
    <>
      <Navbar />

      <main>
        <h1>Dashboard</h1>

        {loaded ? (
          <div>
            <p>名前: {user?.display_name}</p>
            <p>みょんポイント: {user?.point}</p>

            <Button color="primary" variant="outlined" onClick={handleTryGacha}>
              みょんポイントガチャを引く！
            </Button>
          </div>
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
