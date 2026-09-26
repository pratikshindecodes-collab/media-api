import {
    describe,
    test,
    expect,
    beforeAll,
    afterAll
} from "vitest";

import request from "supertest";
import mongoose from "mongoose";

import app from "../app.js";


describe("Authentication API", () => {

    beforeAll(async () => {
        await mongoose.connect(
            process.env.MONGO_TEST_URI
        );
    });


    afterAll(async () => {
        await mongoose.connection.dropDatabase();

        await mongoose.disconnect();
    });


    test(
        "POST /api/v1/auth/register should create a user",
        async () => {

            const response =
                await request(app)
                    .post("/api/v1/auth/register")
                    .send({
                        name: "Test User",
                        email: "testuser@example.com",
                        password: "Password123"
                    });

            expect(response.statusCode)
                .toBe(201);

            expect(response.body.success)
                .toBe(true);

            expect(response.body.message)
                .toBe(
                    "User registered successfully"
                );

            expect(response.body.user)
                .toBeDefined();

            expect(response.body.user.email)
                .toBe("testuser@example.com");
        }
    );


    test(
        "POST /api/v1/auth/register should reject duplicate email",
        async () => {

            const response =
                await request(app)
                    .post("/api/v1/auth/register")
                    .send({
                        name: "Another User",
                        email: "testuser@example.com",
                        password: "Password123"
                    });

            expect(response.statusCode)
                .toBe(409);

            expect(response.body.success)
                .toBe(false);

            expect(response.body.message)
                .toBe(
                    "User already exists"
                );
        }
    );


    test(
        "POST /api/v1/auth/login should return JWT tokens",
        async () => {

            const response =
                await request(app)
                    .post("/api/v1/auth/login")
                    .send({
                        email: "testuser@example.com",
                        password: "Password123"
                    });

            expect(response.statusCode)
                .toBe(200);

            expect(response.body.success)
                .toBe(true);

            expect(response.body.message)
                .toBe("Login successful");

            expect(response.body.accessToken)
                .toBeDefined();

            expect(response.body.refreshToken)
                .toBeDefined();

            expect(typeof response.body.accessToken)
                .toBe("string");

            expect(typeof response.body.refreshToken)
                .toBe("string");

            expect(response.body.user)
                .toBeDefined();

            expect(response.body.user.email)
                .toBe("testuser@example.com");
        }
    );


    test(
        "POST /api/v1/auth/login should reject invalid password",
        async () => {

            const response =
                await request(app)
                    .post("/api/v1/auth/login")
                    .send({
                        email: "testuser@example.com",
                        password: "WrongPassword"
                    });

            expect(response.statusCode)
                .toBe(401);

            expect(response.body.success)
                .toBe(false);

            expect(response.body.message)
                .toBe(
                    "Invalid email or password"
                );
        }
    );


    test(
        "POST /api/v1/auth/login should reject unknown email",
        async () => {

            const response =
                await request(app)
                    .post("/api/v1/auth/login")
                    .send({
                        email: "unknown@example.com",
                        password: "Password123"
                    });

            expect(response.statusCode)
                .toBe(401);

            expect(response.body.success)
                .toBe(false);

            expect(response.body.message)
                .toBe(
                    "Invalid email or password"
                );
        }
    );


    test(
        "GET /api/v1/users/me should return authenticated user",
        async () => {

            const loginResponse =
                await request(app)
                    .post("/api/v1/auth/login")
                    .send({
                        email: "testuser@example.com",
                        password: "Password123"
                    });

            const accessToken =
                loginResponse.body.accessToken;

            const response =
                await request(app)
                    .get("/api/v1/users/me")
                    .set(
                        "Authorization",
                        `Bearer ${accessToken}`
                    );

            expect(response.statusCode)
                .toBe(200);

            expect(response.body.success)
                .toBe(true);

            expect(response.body.user)
                .toBeDefined();

            expect(response.body.user.email)
                .toBe("testuser@example.com");
        }
    );


    test(
        "GET /api/v1/users/me should reject request without token",
        async () => {

            const response =
                await request(app)
                    .get("/api/v1/users/me");

            expect(response.statusCode)
                .toBe(401);

            expect(response.body.success)
                .toBe(false);

            expect(response.body.message)
                .toBe(
                    "Authentication token required"
                );
        }
    );


    test(
        "GET /api/v1/users/me should reject invalid token",
        async () => {

            const response =
                await request(app)
                    .get("/api/v1/users/me")
                    .set(
                        "Authorization",
                        "Bearer invalid-token"
                    );

            expect(response.statusCode)
                .toBe(401);

            expect(response.body.success)
                .toBe(false);

            expect(response.body.message)
                .toBe(
                    "Invalid or expired token"
                );
        }
    );


    test(
        "POST /api/v1/auth/refresh should return new tokens",
        async () => {

            const loginResponse =
                await request(app)
                    .post("/api/v1/auth/login")
                    .send({
                        email: "testuser@example.com",
                        password: "Password123"
                    });

            expect(loginResponse.statusCode)
                .toBe(200);

            const oldRefreshToken =
                loginResponse.body.refreshToken;

            expect(oldRefreshToken)
                .toBeDefined();

            const response =
                await request(app)
                    .post("/api/v1/auth/refresh")
                    .send({
                        refreshToken:
                            oldRefreshToken
                    });

            console.log(
                "REFRESH RESPONSE:",
                response.statusCode
            )

            console.log(
                "REFRESH BODY:",
                response.body
            )

            expect(response.statusCode)
                .toBe(200);

            expect(response.body.success)
                .toBe(true);

            expect(response.body.accessToken)
                .toBeDefined();

            expect(response.body.refreshToken)
                .toBeDefined();

            expect(typeof response.body.accessToken)
                .toBe("string");

            expect(typeof response.body.refreshToken)
                .toBe("string");

            expect(response.body.refreshToken)
                .not
                .toBe(oldRefreshToken);
        }
    );


    test(
        "POST /api/v1/auth/logout should invalidate refresh token",
        async () => {

            const loginResponse =
                await request(app)
                    .post("/api/v1/auth/login")
                    .send({
                        email: "testuser@example.com",
                        password: "Password123"
                    });

            const refreshToken =
                loginResponse.body.refreshToken;

            const logoutResponse =
                await request(app)
                    .post("/api/v1/auth/logout")
                    .send({
                        refreshToken
                    });

            expect(logoutResponse.statusCode)
                .toBe(200);

            expect(logoutResponse.body.success)
                .toBe(true);

            expect(logoutResponse.body.message)
                .toBe("Logout successful");

            const refreshResponse =
                await request(app)
                    .post("/api/v1/auth/refresh")
                    .send({
                        refreshToken
                    });

            expect(refreshResponse.statusCode)
                .toBe(401);
        }
    );

});