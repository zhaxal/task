import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { CssBaseline, ThemeProvider, createTheme } from "@mui/material";
import Home from "/components/home-page-components/Home";
import Login from "/components/login-page-components/Login";
import { SnackbarProvider } from "/contexts/snackbar-context";
import { AuthProvider } from "/contexts/auth-context";
import Navbar from "/components/Navbar";
import ProtectedRoute from "/components/ProtectedRoute";
import Order from "/components/order-page-components/Order";
import Offer from "/components/offer-page-components/Offer";

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <>
        <Navbar />
        <ProtectedRoute>
          <Home />
        </ProtectedRoute>
      </>
    ),
  },
  {
    path: "/offer/:offerId",
    element: (
      <>
        <Navbar />
        <ProtectedRoute>
          <Offer />
        </ProtectedRoute>
      </>
    ),
  },
  {
    path: "/order/:orderId",
    element: (
      <>
        <Navbar />
        <ProtectedRoute>
          <Order />
        </ProtectedRoute>
      </>
    ),
  },
  {
    path: "/login",
    element: (
      <>
        <Navbar />
        <Login />
      </>
    ),
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
            <RouterProvider router={router} />
          </AuthProvider>
        </SnackbarProvider>
      </ThemeProvider>
    </>
  );
};
