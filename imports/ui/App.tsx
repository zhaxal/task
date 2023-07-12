import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { CssBaseline, ThemeProvider, createTheme } from "@mui/material";
import Home from "/components/home-page-components/Home";
import Login from "/components/login-page-components/Login";
import { SnackbarProvider } from "/contexts/snackbar-context";
import { AuthProvider } from "/contexts/auth-context";
import Navbar from "/components/Navbar";
import ProtectedRoute from "/components/ProtectedRoute";

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <Home />
      </ProtectedRoute>
    ),
  },
  {
    path: "/login",
    element: <Login />,
  },
]);

const theme = createTheme({
  palette: {
    mode: "dark",

    primary: {
      main: "#1976d2",
    },
  },
});

export const App = () => {
  return (
    <>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <SnackbarProvider>
          <AuthProvider>
            <Navbar />
            <RouterProvider router={router} />
          </AuthProvider>
        </SnackbarProvider>
      </ThemeProvider>
    </>
  );
};
