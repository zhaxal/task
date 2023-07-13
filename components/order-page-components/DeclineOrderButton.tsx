import React, { FC } from "react";
import { useSnackbar } from "/contexts/snackbar-context";
import { useAuth } from "/contexts/auth-context";
import { Meteor } from "meteor/meteor";
import { Button } from "@mui/material";

interface DeclineOrderButtonProps {
  orderId?: string;
}

const DeclineOrderButton: FC<DeclineOrderButtonProps> = ({ orderId }) => {
  const { user } = useAuth();
  const { openSnackbar } = useSnackbar();

  const handleDecline = () => {
    if (!user) return;
    if (!orderId) return;

    Meteor.callAsync("deleteOffer", orderId, user._id, user.role)
      .then(() => {
        openSnackbar("success", "Offer removed");
      })
      .catch((err: Meteor.Error) => {
        openSnackbar("error", err.reason as string);
      });
  };

  return (
    <Button onClick={handleDecline} variant="outlined" color="error">
      Decline Order
    </Button>
  );
};

export default DeclineOrderButton;
