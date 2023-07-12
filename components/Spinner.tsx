import { CircularProgress, Stack } from "@mui/material";
import React, { FC } from "react";

const Spinner: FC = () => {
  return (
    <Stack justifyContent="center" alignItems="center">
      <CircularProgress />
    </Stack>
  );
};

export default Spinner;
