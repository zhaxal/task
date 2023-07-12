import { Meteor } from "meteor/meteor";
import { authenticate } from "/functions/auth";
import { check } from "meteor/check";

import { getUserWithAuthToken, updateUserRole } from "/functions/user";
import { Role } from "/models/user";

Meteor.startup(async () => {
  process.env.MAIL_URL = Meteor.settings.public.MAIL_URL;

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
  });
});
