import React, { FC, useEffect } from "react";
import { Button, Stack, Typography } from "@mui/material";
import { Link, useSearchParams } from "react-router-dom";
import { useAuth } from "/contexts/auth-context";
import RolePicker from "../RolePicker";

const Login: React.FC = () => {
  const [searchParams] = useSearchParams();

  const { updateToken, status, user } = useAuth();

  const token = searchParams.get("token");

  useEffect(() => {
    if (!token) return;
    updateToken(token);
  }, [token]);

  const ResultPanel: FC = () => {
    switch (status) {
      case "authenticated":
        return (
          <>
            {user?.role === null ? (
              <RolePicker />
            ) : (
              <Stack spacing={1}>
                <Typography variant="h5">Login successful</Typography>
                <Button to="/" component={Link}>
                  Go to home page
                </Button>
              </Stack>
            )}
          </>
        );
      case "loading":
        return <Typography variant="h5">Loading...</Typography>;
      case "unauthenticated":
        return <Typography variant="h5">Login failed, try again</Typography>;
    }
  };

  return (
    <Stack alignItems="center" justifyContent="center">
      {token ? (
        <ResultPanel />
      ) : (
        <Typography variant="h5">
          This link is invalid or has expired
        </Typography>
      )}
    </Stack>
  );
};

export default Login;
