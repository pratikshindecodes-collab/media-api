import {
    describe,
    test,
    expect
} from "vitest";

import request from "supertest";

import app from "../app.js";

describe("GET /", () => {

    test("should return API running message", async () => {

        const response = 
            await request(app)
                .get("/");

        expect(response.statusCode)
            .toBe(200);

        expect(response.body.success)
            .toBe(true);

        expect(response.body.message)
            .toBe("Media API is running");
    });
});


