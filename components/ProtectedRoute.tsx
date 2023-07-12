import React, { ReactNode } from "react";
import { useAuth } from "/contexts/auth-context";
import { Stack, Typography } from "@mui/material";
import Spinner from "./Spinner";
import RolePicker from "./RolePicker";

interface ProtectedRouteProps {
  children: ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { status, user } = useAuth();

  switch (status) {
    case "loading":
      return (
        <Stack justifyContent="center" alignItems="center">
          <Spinner />
        </Stack>
      );
    case "authenticated":
      return (
        <>
          {user?.role === null ? (
            <Stack alignItems="center" justifyContent="center">
              <RolePicker />
            </Stack>
          ) : (
            children
          )}
        </>
      );

    case "unauthenticated":
      return (
        <Stack justifyContent="center" alignItems="center">
          <Typography>You need to login to see this page</Typography>
        </Stack>
      );
  }
};

export default ProtectedRoute;
