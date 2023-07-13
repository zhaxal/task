import {
  Card,
  CardActionArea,
  CardContent,
  Stack,
  Typography,
} from "@mui/material";
import React, { FC } from "react";
import { Order } from "/models/order";
import { Link } from "react-router-dom";
interface OrderCardProps {
  order: Order;
}

const OrderCard: FC<OrderCardProps> = ({ order }) => {
  return (
    <Card sx={{ height: "100%" }}>
      <CardActionArea
        sx={{ height: "100%" }}
        component={Link}
        to={`/order/${order._id}`}
      >
        <CardContent sx={{ height: "100%" }}>
          <Stack spacing={1}>
            <Typography>{order.service}</Typography>
            <Typography>Price: {order.price}</Typography>
          </Stack>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

export default OrderCard;
