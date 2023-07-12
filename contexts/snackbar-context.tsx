import { Snackbar, Alert, AlertColor } from "@mui/material";
import { createContext, ReactNode, useContext, useState } from "react";
import { useDisclosure } from "/hooks/disclosure";
import React from "react";

interface SnackbarProviderProps {
  children: ReactNode;
}

interface SnackbarContextProps {
  openSnackbar(status: AlertColor, message: string): void;
}

const SnackbarContext = createContext<SnackbarContextProps>(
  {} as SnackbarContextProps
);

export const useSnackbar = () => {
  return useContext(SnackbarContext);
};

export const SnackbarProvider = ({ children }: SnackbarProviderProps) => {
  const [message, setMessage] = useState<string>("");
  const [status, setStatus] = useState<AlertColor>("error");
  const { isOpen, open, close } = useDisclosure(false);

  const openSnackbar = (status: AlertColor, message: string) => {
    setStatus(status);
    setMessage(message);
    open();
  };

  const value = {
    openSnackbar,
  };

  return (
    <SnackbarContext.Provider value={value}>
      {children}
      <Snackbar open={isOpen} autoHideDuration={6000} onClose={close}>
        <Alert onClose={close} severity={status} sx={{ width: "100%" }}>
          {message}
        </Alert>
      </Snackbar>
    </SnackbarContext.Provider>
  );
};
