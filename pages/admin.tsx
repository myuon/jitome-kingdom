import React, { useState, useCallback } from "react";
import { useAuthCtx } from "../src/hooks/useAuth";
import { useUser, isAdmin } from "../src/hooks/useUser";
import {
  Button,
  Typography,
  Dialog,
  DialogTitle,
  TextField,
  DialogContent,
  DialogActions
} from "@material-ui/core";
import { Navbar } from "../src/parts/Navbar";
import { tryDistributionGift } from "../src/hooks/useGift";

const DistributePointDialog: React.FC<{
  open: boolean;
  handleCloseDialog: () => void;
  handleSubmit: ({ point: number, description: string }) => void;
}> = props => {
  const [point, setPoint] = useState<number>();
  const [description, setDescription] = useState<string>();
  const handleChangePoint = useCallback(event => {
    setPoint(parseInt(event.currentTarget.value as string, 10));
  }, []);
  const handleChangeDescription = useCallback(event => {
    setDescription(event.currentTarget.value);
  }, []);

  const handleSubmit = useCallback(
    () => {
      if (!point || !description) return;

      props.handleSubmit({
        point,
        description
      });
    },
    // eslint-disable-next-line
    [point, description, props.handleSubmit]
  );

  return (
    <Dialog open={props.open} onClose={props.handleCloseDialog}>
      <DialogTitle>DistributePoint API</DialogTitle>
      <DialogContent>
        <TextField
          label="ポイント"
          defaultValue={point}
          onChange={handleChangePoint}
        />
        <TextField
          label="説明"
          defaultValue={description}
          onChange={handleChangeDescription}
        />
      </DialogContent>
      <DialogActions>
        <Button color="primary" onClick={handleSubmit}>
          送信
        </Button>
      </DialogActions>
    </Dialog>
  );
};

const Admin: React.FC = props => {
  const { authToken } = useAuthCtx();
  const { user, loaded } = useUser(authToken);
  const [openDialog, setOpenDialog] = useState(false);

  const handleOpenDialog = useCallback(() => {
    setOpenDialog(true);
  }, [setOpenDialog]);
  const handleCloseDialog = useCallback(() => {
    setOpenDialog(false);
  }, [setOpenDialog]);

  const handleSubmit = useCallback(
    argument => {
      tryDistributionGift(authToken, argument);
      setOpenDialog(false);
    },
    [authToken]
  );

  return (
    <>
      <Navbar />

      <main>
        <Typography variant="subtitle1">API</Typography>

        {loaded ? (
          user && isAdmin(user) ? (
            <Button
              variant="contained"
              color="primary"
              onClick={handleOpenDialog}
            >
              ポイント配布
            </Button>
          ) : (
            <>admin only</>
          )
        ) : (
          <>loading...</>
        )}
      </main>

      <DistributePointDialog
        open={openDialog}
        handleCloseDialog={handleCloseDialog}
        handleSubmit={handleSubmit}
      />
    </>
  );
};

export default Admin;
