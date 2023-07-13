import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from "@mui/material";
import React, { FC } from "react";
import { useDisclosure } from "/hooks/disclosure";
import { Meteor } from "meteor/meteor";
import { useSnackbar } from "/contexts/snackbar-context";
import { useNavigate } from "react-router-dom";
import { useAuth } from "/contexts/auth-context";

interface PickButtonProps {
  executorId?: string;
  orderId?: string;
}

const PickButton: FC<PickButtonProps> = ({ executorId, orderId }) => {
  const { isOpen, close, open } = useDisclosure(false);
  const { openSnackbar } = useSnackbar();
  let navigate = useNavigate();
  const { user } = useAuth();

  const handlePick = () => {
    if (!user) return;

    Meteor.callAsync("completeOrder", orderId, executorId, user.role)
      .then(() => {
        openSnackbar("success", "Order completed");
        navigate("/");
      })
      .catch((err: Meteor.Error) => {
        openSnackbar("error", err.reason as string);
        close();
      });
  };

  return (
    <>
      <Button onClick={open} variant="outlined" color="success">
        Pick
      </Button>

      <Dialog open={isOpen} onClose={close}>
        <DialogTitle>Are you sure ?</DialogTitle>
        <DialogContent>
          <Typography>
            You won't be able to change executor after picking this offer
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={close}>Cancel</Button>
          <Button onClick={handlePick}>Pick</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default PickButton;
