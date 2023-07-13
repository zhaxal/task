import { Mongo } from "meteor/mongo";
import { User } from "/models/user";
import { AuthToken } from "/models/authToken";
import { Order } from "/models/order";
import { Offer } from "/models/offer";

export const UsersCollection = new Mongo.Collection<User>("users");

export const AuthTokenCollection = new Mongo.Collection<AuthToken>(
  "authTokens"
);

export const OrdersCollection = new Mongo.Collection<Order>("orders");

export const OffersCollection = new Mongo.Collection<Offer>("offers");
