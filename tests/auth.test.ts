import request from "supertest";
import app from "../src/index"
import jwt from "jsonwebtoken";
import config from "../config/default";
import mongoose from "mongoose"; // Ensure proper database teardown

jest.setTimeout(10000); // Increase Jest timeout to 10 seconds

describe("User API", () => {
  let createdUser: any;

  afterAll(async () => {
    // Ensure the database connection is closed after tests
    await mongoose.connection.close();
  });

  it("should register a user successfully", async () => {
    const res = await request(app)
      .post("/api/v1/users/create")
      .send({
        userName: "testuser",
        email: "test@example.com",
        password: "Test@1234",
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.data).toHaveProperty("userName", "testuser");

    createdUser = res.body; // Save the created user for later tests
    expect(createdUser).toBeDefined();
  });

  it("should not allow duplicate emails", async () => {
    const res = await request(app)
      .post("/api/v1/users/create")
      .send({
        userName: "anotheruser",
        email: "test@example.com", // Ensure this matches the previous test
        password: "Another@1234",
      });

    expect(res.statusCode).toBe(400); // Should reject duplicate emails
    expect(res.body).toHaveProperty("error", "User with this email already exists!");
  });

  it("should verify the user account successfully", async () => {
    if (!createdUser || !createdUser.data._id) {
      throw new Error("User creation failed; createdUser is undefined.");
    }

    const verificationToken = jwt.sign(
      { userId: createdUser.data._id },
      config.jwtSecretKey,
      { expiresIn: "1h" }
    );

    const res = await request(app)
      .patch(`/api/v1/users/verify-account/${createdUser.data._id}/${verificationToken}`)
      .send();

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("message", "Account verified successfully");
  });
});
