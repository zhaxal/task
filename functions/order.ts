import { Meteor } from "meteor/meteor";
import { OffersCollection, OrdersCollection } from "/imports/api/collections";
import { Role } from "/models/user";

export const addOrder = async (
  service: string,
  price: number,
  userId: string,
  role: Role
) => {
  try {
    if (role !== "customer") {
      throw new Meteor.Error(
        "addOrder.notCustomer",
        "Only customers can add orders"
      );
    }

    await OrdersCollection.insertAsync({
      service,
      price,
      createdAt: new Date(),
      userId,
    });
  } catch (error) {
    const err = error as Error;
    throw new Meteor.Error("addOrder.failed", err.message);
  }
};

export const deleteOrder = async (
  orderId: string,
  userId: string,
  role: Role
) => {
  try {
    if (role !== "customer") {
      throw new Meteor.Error(
        "deleteOrder.notCustomer",
        "Only customers can delete orders"
      );
    }

    await OrdersCollection.removeAsync({ _id: orderId, userId });
    await OffersCollection.removeAsync({ orderId });
  } catch (error) {
    const err = error as Error;
    throw new Meteor.Error("deleteOrder.failed", err.message);
  }
};

export const completeOrder = async (
  orderId: string,
  executorId: string,
  role: Role
) => {
  try {
    if (role !== "customer") {
      throw new Meteor.Error(
        "deleteOrder.notCustomer",
        "Only customers can delete orders"
      );
    }

    await OrdersCollection.updateAsync(
      { _id: orderId },
      { $set: { completedAt: new Date(), completedBy: executorId } }
    );
    await OffersCollection.removeAsync({ orderId });
  } catch (error) {
    const err = error as Error;
    throw new Meteor.Error("deleteOrder.failed", err.message);
  }
};
