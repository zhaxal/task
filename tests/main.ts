
import { getUserWithAuthToken, updateUserRole } from "/functions/user";
import { AuthTokenCollection, UsersCollection } from "/imports/api/collections";
import { expect } from "chai";

describe("updateUserRole", () => {
  it("should update the user role in the database", async () => {
    // Insert a user into the database

    const email = "test@example.com";
    const role = "customer";

    await UsersCollection.insertAsync({
      email,
      role: null,
      createdAt: new Date(),
    });

    await updateUserRole(email, role);

    // Assert that the user role was updated
    const user = await UsersCollection.findOneAsync({ email });

    if (!user) {
      throw new Error("User not found");
    }

    expect(user.role).to.equal(role);

    // Remove the user from the database

    await UsersCollection.removeAsync({ email });
  });

  it("should throw an error if the update fails", async () => {
    const email = "test@example.com";
    const role = "customer";

    // Mock the UsersCollection.updateAsync function to throw an error
    UsersCollection.updateAsync = async () => {
      throw new Error("Update failed");
    };

    try {
      await updateUserRole(email, role);
      // If the function does not throw an error, fail the test
      expect.fail("Expected function to throw an error");
    } catch (error) {
      const err = error as Error;
      // Assert that the error message is correct
      expect(err.message).to.equal("Update failed [updateUserRole.failed]");
    }
  });
});

describe("getUserWithAuthToken", () => {
  it("should return the user associated with the auth token", async () => {
    const token = "test-token";
    const userId = "test-user-id";

    // Create an auth token and user in the database
    await AuthTokenCollection.insertAsync({
      token,
      userId,
      createdAt: new Date(),
    });
    await UsersCollection.insertAsync({
      _id: userId,
      email: "test@example.com",
      createdAt: new Date(),
      role: null,
    });

    const user = await getUserWithAuthToken(token);

    // Assert that the correct user was returned

    if (!user) {
      throw new Error("User not found");
    }

    // remove the user from the database

    await UsersCollection.removeAsync({ _id: userId });

    await AuthTokenCollection.removeAsync({ token });

    expect(user).to.exist;
    expect(user._id).to.equal(userId);
  });

  it("should return null if the auth token is not found", async () => {
    const token = "test-token";

    const user = await getUserWithAuthToken(token);

    // Assert that null was returned
    expect(user).to.be.null;
  });

  it("should throw an error if the user associated with the auth token is not found", async () => {
    const token = "test-token";
    const userId = "test-user-id";

    // Create an auth token without a corresponding user in the database
    await AuthTokenCollection.insertAsync({
      token,
      userId,
      createdAt: new Date(),
    });

    try {
      await getUserWithAuthToken(token);
      // If the function does not throw an error, fail the test
      expect.fail("Expected function to throw an error");
    } catch (error) {
      // Assert that the error message is correct

      const err = error as Error;
      expect(err.message).to.equal(
        "User not found [loginWithAuthToken.userNotFound] [getUserWithAuthToken.failed]"
      );
    }

    // Remove the auth token from the database
    await AuthTokenCollection.removeAsync({ token });
  });

  it("should return null if the auth token is expired", async () => {
    const token = "test-token";
    const userId = "test-user-id";

    // Create an expired auth token and user in the database
    await AuthTokenCollection.insertAsync({
      token,
      userId,
      createdAt: new Date(0),
    });
    await UsersCollection.insertAsync({
      _id: userId,
      email: "test@example.com",
      createdAt: new Date(),
      role: null,
    });

    const user = await getUserWithAuthToken(token);

    // Remove the user from the database

    await UsersCollection.removeAsync({ _id: userId });

    await AuthTokenCollection.removeAsync({ token });

    // Assert that null was returned
    expect(user).to.be.null;
  });

  it("should throw an error if the function fails", async () => {
    const token = "test-token";

    // Mock the AuthTokenCollection.findOneAsync function to throw an error
    AuthTokenCollection.findOneAsync = async () => {
      throw new Error("Find failed");
    };

    try {
      await getUserWithAuthToken(token);
      // If the function does not throw an error, fail the test
      expect.fail("Expected function to throw an error");
    } catch (error) {
      // Assert that the error message is correct
      const err = error as Error;
      expect(err.message).to.equal("Find failed [getUserWithAuthToken.failed]");
    }
  });

  // Add more test cases as needed
});
