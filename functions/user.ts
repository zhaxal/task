import { Meteor } from "meteor/meteor";
import { AuthTokenCollection, UsersCollection } from "/imports/api/collections";
import { Role } from "/models/user";

export const updateUserRole = async (email: string, role: Role) => {
  try {
    await UsersCollection.updateAsync({ email }, { $set: { role } });
  } catch (error) {
    const err = error as Error;
    throw new Meteor.Error("updateUserRole.failed", err.message);
  }
};

export const getUserWithAuthToken = async (token: string) => {
  try {
    const authToken = await AuthTokenCollection.findOneAsync({ token });

    if (!authToken) {
      return null;
    }

    const user = await UsersCollection.findOneAsync({ _id: authToken.userId });

    if (!user) {
      throw new Meteor.Error(
        "loginWithAuthToken.userNotFound",
        "User not found"
      );
    }

    if (
      authToken.createdAt.getTime() + 60 * 60 * 1000 * 24 <
      new Date().getTime()
    ) {
      return null;
    }

    return user;
  } catch (error) {
    const err = error as Error;
    throw new Meteor.Error("getUserWithAuthToken.failed", err.message);
  }
};
