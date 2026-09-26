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
import User from "../models/User.js";

import bcrypt from "bcrypt";


describe("Error Handling", () => {

    beforeAll(async () => {

        await mongoose.connect(
            process.env.MONGO_TEST_URI
        );


        const hashedPassword =
            await bcrypt.hash(
                "Password123",
                10
            );


        await User.create({
            name: "Test User",
            email: "testuser@example.com",
            password: hashedPassword,
            role: "user"
        });

    });


    afterAll(async () => {

        await mongoose.connection.dropDatabase();

        await mongoose.disconnect();

    });


    test("should return 404 for unknown route", async () => {

        const response =
            await request(app)
                .get(
                    "/api/v1/does-not-exist"
                );


        expect(response.statusCode)
            .toBe(404);


        expect(response.body.success)
            .toBe(false);


        expect(response.body.message)
            .toBe(
                "Route not found: GET /api/v1/does-not-exist"
            );

    });


    test("should return 401 without authentication token", async () => {

        const response =
            await request(app)
                .get(
                    "/api/v1/users/me"
                );


        expect(response.statusCode)
            .toBe(401);


        expect(response.body.success)
            .toBe(false);


        expect(response.body.message)
            .toBe(
                "Authentication token required"
            );

    });


    test("should return 400 when product name is missing", async () => {

        const loginResponse =
            await request(app)
                .post(
                    "/api/v1/auth/login"
                )
                .send({
                    email: "testuser@example.com",
                    password: "Password123"
                });


        expect(loginResponse.statusCode)
            .toBe(200);


        const accessToken =
            loginResponse.body.accessToken;


        const response =
            await request(app)
                .post(
                    "/api/v1/products"
                )
                .set(
                    "Authorization",
                    `Bearer ${accessToken}`
                )
                .send({
                    price: 50000
                });


        expect(response.statusCode)
            .toBe(400);


        expect(response.body.success)
            .toBe(false);


        expect(response.body.message)
            .toBe(
                "Product name is required"
            );

    });

    test("should return 403 for user accessing admin route", async () => {

        const loginResponse =
            await request(app)
                .post("/api/v1/auth/login")
                .send({
                    email: "testuser@example.com",
                    password: "Password123"
                });

        expect(loginResponse.statusCode)
            .toBe(200);

        const accessToken =
            loginResponse.body.accessToken;

        const response =
            await request(app)
                .get("/api/v1/users/admin")
                .set(
                    "Authorization",
                    `Bearer ${accessToken}`
                );

        expect(response.statusCode)
            .toBe(403);

        expect(response.body.success)
            .toBe(false);

        expect(response.body.message)
            .toBe("Access denied");
            
    });

});