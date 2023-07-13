import { Button } from "@mui/material";
import { Meteor } from "meteor/meteor";
import React, { FC } from "react";
import { useAuth } from "/contexts/auth-context";
import { useSnackbar } from "/contexts/snackbar-context";
import { useNavigate } from "react-router-dom";

interface RemoveOrderButtonProps {
  orderId?: string;
}

const RemoveOrderButton: FC<RemoveOrderButtonProps> = ({ orderId }) => {
  const { user } = useAuth();
  const { openSnackbar } = useSnackbar();
  let navigate = useNavigate();

  const handleRemove = () => {
    if (!user) return;
    if (!orderId) return;

    Meteor.callAsync("deleteOrder", orderId, user._id, user.role)
      .then(() => {
        openSnackbar("success", "Order removed");
        navigate("/");
      })
      .catch((err: Meteor.Error) => {
        openSnackbar("error", err.reason as string);
      });
  };

  return (
    <Button onClick={handleRemove} variant="outlined" color="error">
      Remove
    </Button>
  );
};

export default RemoveOrderButton;
