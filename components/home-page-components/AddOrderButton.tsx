import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";
import React, { FC } from "react";
import { useDisclosure } from "/hooks/disclosure";
import { useFormik } from "formik";
import { number, object, string } from "yup";
import { useAuth } from "/contexts/auth-context";
import { Meteor } from "meteor/meteor";
import { useSnackbar } from "/contexts/snackbar-context";

const AddOrderButton: FC = () => {
  const { isOpen, open, close } = useDisclosure(false);
  const { openSnackbar } = useSnackbar();
  const { user } = useAuth();

  const formik = useFormik({
    initialValues: {
      service: "",
      price: 0,
    },
    validationSchema: object({
      service: string().required("Service is required"),
      price: number()
        .typeError("Price must be a number")
        .moreThan(0, "Price cannot be negative number")
        .required("Price is required"),
    }),
    onSubmit: (values) => {
      if (!user) return;
      Meteor.callAsync(
        "addOrder",
        values.service,
        values.price,
        user._id,
        user.role
      )
        .then(() => {
          openSnackbar("success", "Order placed");
          formik.resetForm();
          formik.setSubmitting(false);
          close();
        })
        .catch((err: Meteor.Error) => {
          openSnackbar("error", err.reason as string);
        });
    },
    validateOnBlur: false,
    validateOnChange: false,
  });

  return (
    <>
      <Button onClick={open} variant="contained" color="primary">
        Add Order
      </Button>

      <Dialog open={isOpen} onClose={close}>
        <DialogTitle>Order form</DialogTitle>
        <DialogContent>
          <form onSubmit={formik.handleSubmit}>
            <TextField
              disabled={formik.isSubmitting}
              fullWidth
              label="Service"
              required
              margin="normal"
              {...formik.getFieldProps("service")}
              error={formik.touched.service && Boolean(formik.errors.service)}
              helperText={formik.touched.service && formik.errors.service}
            />

            <TextField
              disabled={formik.isSubmitting}
              fullWidth
              label="Price"
              type="number"
              required
              margin="normal"
              {...formik.getFieldProps("price")}
              error={formik.touched.price && Boolean(formik.errors.price)}
              helperText={formik.touched.price && formik.errors.price}
            />
          </form>
        </DialogContent>
        <DialogActions>
          <Button disabled={formik.isSubmitting} onClick={close}>
            Cancel
          </Button>
          <Button disabled={formik.isSubmitting} onClick={formik.submitForm}>
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default AddOrderButton;
