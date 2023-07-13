import { Card, CardContent, Container, Stack, Typography } from "@mui/material";
import { useSubscribe, useTracker } from "meteor/react-meteor-data";
import React, { FC } from "react";
import { useParams } from "react-router-dom";
import {
  OffersCollection,
  OrdersCollection,
  UsersCollection,
} from "/imports/api/collections";

const Offer: FC = () => {
  let { offerId } = useParams();

  useSubscribe("offers");
  useSubscribe("users");
  useSubscribe("orders");

  const offer = useTracker(() => OffersCollection.findOne({ _id: offerId }));
  const executor = useTracker(() =>
    UsersCollection.findOne({ _id: offer?.userId })
  );

  const order = useTracker(() =>
    OrdersCollection.findOne({ _id: offer?.orderId })
  );

  const customer = useTracker(() =>
    UsersCollection.findOne({ _id: order?.userId })
  );

  return (
    <Container maxWidth="xl">
      <Stack spacing={1}>
        <Card>
          <CardContent>
            <Typography variant="h5">Executor</Typography>
            <Typography variant="body1">{executor?.email}</Typography>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <Typography variant="h5">
              Order that needs to be complete
            </Typography>
            <Typography variant="body1">{order?.service}</Typography>
            <Typography variant="body1">Price: {order?.price}</Typography>
            <Typography variant="body1">Customer: {customer?.email}</Typography>
          </CardContent>
        </Card>
      </Stack>
    </Container>
  );
};

export default Offer;
