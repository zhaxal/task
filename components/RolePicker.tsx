import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  Stack,
  Typography,
} from "@mui/material";
import { Meteor } from "meteor/meteor";
import React, { FC, useState } from "react";
import { useAuth } from "/contexts/auth-context";
import { useSnackbar } from "/contexts/snackbar-context";

const RolePicker: FC = () => {
  const { user, updateUser } = useAuth();
  const [role, setRole] = useState("");

  const { openSnackbar } = useSnackbar();

  const handleChange = (event: SelectChangeEvent) => {
    setRole(event.target.value as string);
  };

  const handleUpdate = () =>
    user
      ? Meteor.callAsync("updateUserRole", user.email, role).then(
          (err: Meteor.Error) => {
            if (err) openSnackbar("error", err.reason as string);
            else {
              openSnackbar("success", "Role is updated");
              updateUser();
            }
          }
        )
      : null;

  return (
    <Stack alignItems="center" spacing={1}>
      <Typography variant="h5">Pick role</Typography>
      <Box sx={{ minWidth: 140 }}>
        <FormControl fullWidth>
          <InputLabel>Age</InputLabel>
          <Select value={role} label="Role" onChange={handleChange}>
            <MenuItem value="executor">Executor</MenuItem>
            <MenuItem value="customer">Customer</MenuItem>
          </Select>
        </FormControl>
      </Box>
      <Button
        fullWidth
        disabled={role === ""}
        variant="outlined"
        onClick={handleUpdate}
      >
        Submit
      </Button>
    </Stack>
  );
};

export default RolePicker;
