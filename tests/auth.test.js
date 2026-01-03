import request from "supertest";
import { app } from "../index.js";

describe("User registration", () => {
  it("should register a new user", async () => {
    const response = await request(app).post("/register").send({
      fullName: "Test User",
      email: "test@example.com",
      password: "password123",
    });
    expect(response.statusCode).toBe(201);
    expect(response.body.data).toHaveProperty("accessToken");
  });
});
