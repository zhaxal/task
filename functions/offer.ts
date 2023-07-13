import { Meteor } from "meteor/meteor";
import { OffersCollection } from "/imports/api/collections";
import { Role } from "/models/user";

export const addOffer = async (orderId: string, userId: string, role: Role) => {
  try {
    if (role !== "executor") {
      throw new Meteor.Error(
        "addOrder.notExecutor",
        "Only executors can add offers"
      );
    }

    await OffersCollection.upsertAsync(
      { userId, orderId },
      {
        orderId,
        createdAt: new Date(),
        userId,
      }
    );
  } catch (error) {
    const err = error as Error;
    throw new Meteor.Error("addOrder.failed", err.message);
  }
};

export const deleteOffer = async (
  orderId: string,
  userId: string,
  role: Role
) => {
  try {
    if (role !== "executor") {
      throw new Meteor.Error(
        "deleteOrder.notExecutor",
        "Only executors can delete offers"
      );
    }

    await OffersCollection.removeAsync({ orderId, userId });
  } catch (error) {
    const err = error as Error;
    throw new Meteor.Error("deleteOrder.failed", err.message);
  }
};
