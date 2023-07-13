import {
  Box,
  AppBar,
  Toolbar,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Menu,
  MenuItem,
} from "@mui/material";
import React, { FC } from "react";
import { useDisclosure, useDisclosureMenu } from "/hooks/disclosure";
import { useFormik } from "formik";
import { object, string } from "yup";
import { useAuth } from "/contexts/auth-context";
import { Meteor } from "meteor/meteor";
import { useSnackbar } from "/contexts/snackbar-context";
import { Link, useNavigate } from "react-router-dom";

const LoginButton: FC = () => {
  const { isOpen, open, close } = useDisclosure(false);
  const { authenticate } = useAuth();
  const { openSnackbar } = useSnackbar();

  const formik = useFormik({
    initialValues: {
      email: "",
    },
    validationSchema: object({
      email: string()
        .email("Email must be valid")
        .required("Email is required"),
    }),
    onSubmit: (values) => {
      authenticate(values.email)
        .then(() => {
          openSnackbar("success", "Email sent");
          formik.resetForm();
          formik.setSubmitting(false);
          close();
        })
        .catch((err: Meteor.Error) => {
          openSnackbar("error", err.reason as string);
          formik.resetForm();
          formik.setSubmitting(false);
          close();
        });
    },
    validateOnChange: false,
    validateOnBlur: false,
  });

  return (
    <>
      <Button onClick={open} color="inherit">
        Login
      </Button>

      <Dialog
        fullWidth
        open={isOpen}
        onClose={() => {
          close();
          formik.resetForm();
        }}
      >
        <DialogTitle>Enter your email to login</DialogTitle>

        <DialogContent>
          <form onSubmit={formik.handleSubmit}>
            <TextField
              required
              disabled={formik.isSubmitting}
              label="Email"
              fullWidth
              margin="normal"
              {...formik.getFieldProps("email")}
              error={formik.touched.email && Boolean(formik.errors.email)}
              helperText={formik.touched.email && formik.errors.email}
            />
          </form>
        </DialogContent>

        <DialogActions>
          <Button disabled={formik.isSubmitting} onClick={close}>
            Cancel
          </Button>
          <Button disabled={formik.isSubmitting} onClick={formik.submitForm}>
            Login
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

const MenuButton: FC = () => {
  let navigate = useNavigate();
  const { user, logout } = useAuth();
  const { anchorEl, open, close } = useDisclosureMenu();

  const handleLogout = () => {
    logout();
    close();
    navigate("/");
  };

  return (
    <>
      <Button onClick={open} color="inherit">
        {user?.email}
      </Button>

      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={close}>
        <MenuItem onClick={handleLogout}>Logout</MenuItem>
      </Menu>
    </>
  );
};

const Navbar: FC = () => {
  const { status, user } = useAuth();

  return (
    <Box sx={{ flexGrow: 1, mb: "1rem" }}>
      <AppBar position="static">
        <Toolbar>
          <Typography
            component={Link}
            to="/"
            color="inherit"
            unselectable="on"
            variant="h6"
            sx={{ flexGrow: 1, textDecoration: "none" }}
          >
            Task app
          </Typography>
          {status === "authenticated" && <MenuButton />}

          {status === "unauthenticated" && <LoginButton />}
        </Toolbar>
      </AppBar>
    </Box>
  );
};

export default Navbar;
