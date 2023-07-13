import {
  Card,
  CardActionArea,
  CardContent,
  Container,
  Stack,
  Typography,
} from "@mui/material";
import { useSubscribe, useTracker } from "meteor/react-meteor-data";
import React, { FC } from "react";
import { Link, useParams } from "react-router-dom";
import {
  OffersCollection,
  OrdersCollection,
  UsersCollection,
} from "/imports/api/collections";
import { useAuth } from "/contexts/auth-context";
import RemoveOrderButton from "./RemoveOrderButton";
import AcceptOrderButton from "./AcceptOrderButton";
import DeclineOrderButton from "./DeclineOrderButton";

const Order: FC = () => {
  let { orderId } = useParams();
  const { user: currentUser } = useAuth();

  useSubscribe("orders");
  useSubscribe("users");
  useSubscribe("offers");
  const order = useTracker(() => OrdersCollection.findOne({ _id: orderId }));
  const user = useTracker(() =>
    UsersCollection.findOne({ _id: order?.userId })
  );
  const offers = useTracker(() =>
    OffersCollection.find({ orderId: order?._id }).fetch()
  );

  const isOwner = currentUser?._id === order?.userId;

  // find if current user has already made an offer

  const hasOffer = offers.some((offer) => offer.userId === currentUser?._id);

  return (
    <Container maxWidth="xl">
      <Stack spacing={1}>
        <Card>
          <CardContent>
            <Typography variant="h5">{order?.service}</Typography>
            <Typography variant="body1">Price: {order?.price}</Typography>
            <Typography variant="body1">Customer: {user?.email}</Typography>
          </CardContent>
        </Card>

        <Stack direction="row" spacing={1}>
          {currentUser?.role === "customer" && isOwner && (
            <RemoveOrderButton orderId={order?._id} />
          )}
          {currentUser?.role === "executor" && !hasOffer && (
            <AcceptOrderButton orderId={order?._id} />
          )}

          {currentUser?.role === "executor" && hasOffer && (
            <DeclineOrderButton orderId={order?._id} />
          )}
        </Stack>

        <Stack>
          {currentUser?.role === "customer" &&
            isOwner &&
            offers.map((offer, i) => (
              <Card key={`offer-${i}`}>
                <CardActionArea component={Link} to={`/offer/${offer._id}`}>
                  <CardContent>
                    <Typography variant="body1">
                      OfferId: {offer._id}
                    </Typography>
                  </CardContent>
                </CardActionArea>
              </Card>
            ))}
        </Stack>
      </Stack>
    </Container>
  );
};

export default Order;
