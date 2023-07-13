import {
  Box,
  Card,
  CardContent,
  Container,
  Grid,
  Typography,
} from "@mui/material";
import { useSubscribe, useTracker } from "meteor/react-meteor-data";
import React from "react";
import { OrdersCollection } from "/imports/api/collections";
import { Order } from "/models/order";
import AddOrderButton from "./AddOrderButton";
import Spinner from "../Spinner";
import OrderCard from "./OrderCard";
import { useAuth } from "/contexts/auth-context";

const Home: React.FC = () => {
  const { user } = useAuth();
  const isLoading = useSubscribe("orders");
  const orders = useTracker(() => OrdersCollection.find({}).fetch());

  return (
    <Container maxWidth="xl">
      <Box py={1}>{user?.role === "customer" && <AddOrderButton />}</Box>

      <Grid container spacing={1}>
        {isLoading() && <Spinner />}
        {orders.length === 0 && !isLoading() && (
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h5">No orders</Typography>
              </CardContent>
            </Card>
          </Grid>
        )}
        {!isLoading() &&
          orders.map((order: Order, i) => (
            <Grid key={`order-${i}`} item md={2} xs={6}>
              <OrderCard order={order} />
            </Grid>
          ))}
      </Grid>
    </Container>
  );
};

export default Home;
