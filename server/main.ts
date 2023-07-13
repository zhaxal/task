import { Meteor } from "meteor/meteor";
import { authenticate } from "/functions/auth";
import { check } from "meteor/check";

import { getUserWithAuthToken, updateUserRole } from "/functions/user";
import { Role } from "/models/user";
import { addOrder, deleteOrder } from "/functions/order";
import {
  OffersCollection,
  OrdersCollection,
  UsersCollection,
} from "/imports/api/collections";
import { addOffer, deleteOffer } from "/functions/offer";

Meteor.startup(async () => {
  process.env.MAIL_URL = Meteor.settings.public.MAIL_URL;

  Meteor.publish("orders", () => {
    return OrdersCollection.find();
  });

  Meteor.publish("offers", () => {
    return OffersCollection.find();
  });

  Meteor.publish("users", () => {
    return UsersCollection.find();
  });

  Meteor.methods({
    getUserWithAuthToken(token) {
      check(token, String);
      return getUserWithAuthToken(token);
    },
    authenticate(email) {
      check(email, String);
      return authenticate(email);
    },
    updateUserRole(email, role) {
      check(email, String);
      check(role, String);
      return updateUserRole(email, role as Role);
    },
    addOrder(service, price, userId, role) {
      check(service, String);
      check(price, Number);
      check(userId, String);
      check(role, String);
      return addOrder(service, price, userId, role as Role);
    },
    addOffer(orderId, userId, role) {
      check(orderId, String);
      check(userId, String);
      check(role, String);
      return addOffer(orderId, userId, role as Role);
    },

    deleteOrder(orderId, userId, role) {
      check(orderId, String);
      check(userId, String);
      check(role, String);
      return deleteOrder(orderId, userId, role as Role);
    },
    deleteOffer(orderId, userId, role) {
      check(orderId, String);
      check(userId, String);
      check(role, String);
      return deleteOffer(orderId, userId, role as Role);
    },
  });
});
