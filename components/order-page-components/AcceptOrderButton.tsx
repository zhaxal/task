import { Button } from "@mui/material";
import { Meteor } from "meteor/meteor";
import React, { FC } from "react";
import { useAuth } from "/contexts/auth-context";
import { useSnackbar } from "/contexts/snackbar-context";

interface AcceptOrderButtonProps {
  orderId?: string;
}

const AcceptOrderButton: FC<AcceptOrderButtonProps> = ({ orderId }) => {
  const { user } = useAuth();
  const { openSnackbar } = useSnackbar();

  const handleAccept = () => {
    if (!user) return;
    if (!orderId) return;

    Meteor.callAsync("addOffer", orderId, user._id, user.role)
      .then(() => {
        openSnackbar("success", "Order accepted");
      })
      .catch((err: Meteor.Error) => {
        openSnackbar("error", err.reason as string);
      });
  };

  return (
    <>
      <Button onClick={handleAccept} variant="outlined" color="success">
        Accept
      </Button>
    </>
  );
};

export default AcceptOrderButton;
