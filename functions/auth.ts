import { randomBytes } from "crypto";
import {
  AuthTokenCollection,
  UsersCollection,
} from "../imports/api/collections";
import { Email } from "meteor/email";
import { Meteor } from "meteor/meteor";

const sendEmailWithToken = (email: string, token: string, url: string) =>
  Email.sendAsync({
    to: email,
    from: Meteor.settings.public.FROM_MAIL,
    subject: "Your login link for Meteor Task app",
    text: `Hello,\n\nClick the link below to login:\n\n${url}login?token=${token}`,
  });

export const authenticate = async (email: string) => {
  try {
    const user = await UsersCollection.findOneAsync({ email });

    const token = randomBytes(32).toString("hex");

    const url = Meteor.settings.public.URL as string;

    if (!user) {
      const userId = await UsersCollection.insertAsync({
        email,
        createdAt: new Date(),
        role: null,
      });

      await AuthTokenCollection.insertAsync({
        userId,
        createdAt: new Date(),
        token,
      });

      await sendEmailWithToken(email, token, url);
    } else {
      if (!user._id) {
        throw new Meteor.Error(
          "requestAuthToken.userIdNotFound",
          "User id not found"
        );
      }

      await AuthTokenCollection.upsertAsync(
        {
          userId: user._id,
        },
        {
          userId: user._id,
          createdAt: new Date(),
          token,
        }
      );

      await sendEmailWithToken(email, token, url);
    }
  } catch (error) {
    const err = error as Error;

    throw new Meteor.Error("authenticate.failed", err.message);
  }
};
