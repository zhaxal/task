import { Mongo } from "meteor/mongo";
import { User } from "/models/user";
import { AuthToken } from "/models/authToken";

export const UsersCollection = new Mongo.Collection<User>("users");

export const AuthTokenCollection = new Mongo.Collection<AuthToken>(
  "authTokens"
);
