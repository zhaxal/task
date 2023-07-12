import { randomBytes } from "crypto";
import {
  AuthTokenCollection,
  UsersCollection,
} from "../imports/api/collections";
import { Email } from "meteor/email";
import { Meteor } from "meteor/meteor";

const sendEmailWithToken = (email: string, token: string) =>
  Email.sendAsync({
    to: email,
    from: Meteor.settings.public.MAIL_FROM,
    subject: "Your login link for Meteor Task app",
    text: `Hello,\n\nClick the link below to login:\n\n${Meteor.absoluteUrl(
      `login/${token}`
    )}`,
  });

export const authenticate = async (email: string) => {
  try {
    const user = await UsersCollection.findOneAsync({ email });

    const token = randomBytes(32).toString("hex");

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

      await sendEmailWithToken(email, token);
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

      await sendEmailWithToken(email, token);
    }
  } catch (error) {
    const err = error as Error;
    console.log(Meteor.absoluteUrl(`login/`));
    throw new Meteor.Error("authenticate.failed", err.message);
  }
};
