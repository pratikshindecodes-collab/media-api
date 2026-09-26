import {
    describe,
    test,
    expect,
    beforeAll,
    beforeEach,
    afterAll
} from "vitest";

import request from "supertest";
import mongoose from "mongoose";
import bcrypt from "bcrypt";

import app from "../app.js";
import Product from "../models/Product.js";
import User from "../models/User.js";


describe("Product API", () => {

    // --------------------------------
    // DATABASE SETUP
    // --------------------------------

    beforeAll(async () => {

        await mongoose.connect(
            process.env.MONGO_TEST_URI
        );

        await User.deleteMany({});
        await Product.deleteMany({});


        const hashedPassword =
            await bcrypt.hash(
                "Password123",
                10
            );


        // Normal user
        await User.create({
            name: "Test User",
            email: "testuser@example.com",
            password: hashedPassword,
            role: "user"
        });


        // Admin user
        await User.create({
            name: "Test Admin",
            email: "admin@example.com",
            password: hashedPassword,
            role: "admin"
        });

    });


    // --------------------------------
    // RESET PRODUCTS BEFORE EACH TEST
    // --------------------------------

    beforeEach(async () => {

        await Product.deleteMany({});


        await Product.create([
            {
                name: "Laptop",
                price: 50000
            },
            {
                name: "Gaming Mouse",
                price: 2000
            },
            {
                name: "Keyboard",
                price: 3000
            }
        ]);

    });


    // --------------------------------
    // DATABASE CLEANUP
    // --------------------------------

    afterAll(async () => {

        await mongoose.connection.dropDatabase();

        await mongoose.disconnect();

    });


    // =================================
    // GET PRODUCTS
    // =================================

    test(
        "GET /api/v1/products should return products",
        async () => {

            const response =
                await request(app)
                    .get("/api/v1/products");


            expect(response.statusCode)
                .toBe(200);


            expect(response.body.success)
                .toBe(true);


            expect(response.body.message)
                .toBe(
                    "Product fetched successfully"
                );


            expect(
                Array.isArray(
                    response.body.data
                )
            ).toBe(true);


            expect(
                response.body.data.length
            ).toBe(3);


            expect(
                response.body.pagination
            ).toBeDefined();


            expect(
                response.body.pagination.totalProducts
            ).toBe(3);

        }
    );


    // =================================
    // SEARCH
    // =================================

    test(
        "GET /api/v1/products should search products",
        async () => {

            const response =
                await request(app)
                    .get(
                        "/api/v1/products?search=laptop"
                    );


            expect(response.statusCode)
                .toBe(200);


            expect(
                response.body.data.length
            ).toBe(1);


            expect(
                response.body.data[0].name
            ).toBe("Laptop");

        }
    );


    // =================================
    // PRICE FILTER
    // =================================

    test(
        "GET /api/v1/products should filter by price",
        async () => {

            const response =
                await request(app)
                    .get(
                        "/api/v1/products?minPrice=2500&maxPrice=60000"
                    );


            expect(response.statusCode)
                .toBe(200);


            expect(
                response.body.data.length
            ).toBe(2);

        }
    );


    // =================================
    // SORTING
    // =================================

    test(
        "GET /api/v1/products should sort by price ascending",
        async () => {

            const response =
                await request(app)
                    .get(
                        "/api/v1/products?sort=price_asc"
                    );


            expect(response.statusCode)
                .toBe(200);


            expect(
                response.body.data[0].name
            ).toBe("Gaming Mouse");


            expect(
                response.body.data[0].price
            ).toBe(2000);

        }
    );


    // =================================
    // PAGINATION
    // =================================

    test(
        "GET /api/v1/products should paginate products",
        async () => {

            const response =
                await request(app)
                    .get(
                        "/api/v1/products?page=1&limit=2"
                    );


            expect(response.statusCode)
                .toBe(200);


            expect(
                response.body.data.length
            ).toBe(2);


            expect(
                response.body.pagination.currentPage
            ).toBe(1);


            expect(
                response.body.pagination.limit
            ).toBe(2);


            expect(
                response.body.pagination.totalProducts
            ).toBe(3);


            expect(
                response.body.pagination.totalPages
            ).toBe(2);

        }
    );


    // =================================
    // CREATE PRODUCT
    // =================================

    test(
        "POST /api/v1/products should create a product",
        async () => {

            // Login
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


            // Create product
            const response =
                await request(app)
                    .post("/api/v1/products")
                    .set(
                        "Authorization",
                        `Bearer ${accessToken}`
                    )
                    .send({
                        name: "Monitor",
                        price: 15000
                    });


            expect(response.statusCode)
                .toBe(201);


            expect(response.body.success)
                .toBe(true);


            expect(response.body.message)
                .toBe(
                    "Product created successfully"
                );


            expect(response.body.data)
                .toBeDefined();


            expect(
                response.body.data.name
            ).toBe("Monitor");


            expect(
                response.body.data.price
            ).toBe(15000);


            expect(
                Array.isArray(
                    response.body.data.images
                )
            ).toBe(true);

        }
    );


    // =================================
    // CREATE - MISSING NAME
    // =================================

    test(
        "POST /api/v1/products should reject missing name",
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
                    .post("/api/v1/products")
                    .set(
                        "Authorization",
                        `Bearer ${accessToken}`
                    )
                    .send({
                        price: 15000
                    });


            expect(response.statusCode)
                .toBe(400);


            expect(response.body.success)
                .toBe(false);


            expect(response.body.message)
                .toBe(
                    "Product name is required"
                );

        }
    );


    // =================================
    // CREATE - INVALID PRICE
    // =================================

    test(
        "POST /api/v1/products should reject invalid price",
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
                    .post("/api/v1/products")
                    .set(
                        "Authorization",
                        `Bearer ${accessToken}`
                    )
                    .send({
                        name: "Monitor",
                        price: "invalid"
                    });


            expect(response.statusCode)
                .toBe(400);


            expect(response.body.success)
                .toBe(false);


            expect(response.body.message)
                .toBe(
                    "Product price must be a number"
                );

        }
    );


    // =================================
    // CREATE - NO AUTHENTICATION
    // =================================

    test(
        "POST /api/v1/products should reject unauthenticated request",
        async () => {

            const response =
                await request(app)
                    .post("/api/v1/products")
                    .send({
                        name: "Monitor",
                        price: 15000
                    });


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

    // ====================================
    // UPDATE PRODUCT TEST
    // ====================================

    test(
        "PUT /api/v1/products/:id should update a product",
        async () => {

            const product =
                await Product.findOne({
                    name: "Laptop"
                });

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
                    .put(
                        `/api/v1/products/${product._id}`
                    )
                    .set(
                        "Authorization",
                        `Bearer ${accessToken}`
                    )
                    .send({
                        name: "Updated Laptop",
                        price: 60000
                    });

            expect(response.statusCode)
                .toBe(200);

            expect(response.body.success)
                .toBe(true);

            expect(response.body.message)
                .toBe(
                    "Product updated successfully"
                );

            expect(
                response.body.data.name
            ).toBe("Updated Laptop");

            expect(
                response.body.data.price
            ).toBe(60000);            
        }
    );

    // =====================================
    // Non Existing product 
    // =====================================

    test(
        "PUT /api/v1/products/:id should return 404 for non-existing product",
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

            const fakeId =
                new mongoose.Types.ObjectId();

            const response =
                await request(app)
                    .put(
                        `/api/v1/products/${fakeId}`
                    )
                    .set(
                        "Authorization",
                        `Bearer ${accessToken}`
                    )
                    .send({
                        name: "Update Product",
                        price: 10000
                    });

            expect(response.statusCode)
                .toBe(404);

            expect(response.body.success)
                .toBe(false);

            expect(response.body.message)
                .toBe("Product not found")
        }
    );

    // ======================================
    // DELETE PRODUCT AS ADMIN
    // ======================================

    test(
    "DELETE /api/v1/products/:id should delete product for admin",
    async () => {

        const product =
            await Product.findOne({
                name: "Laptop"
            });

        const loginResponse =
            await request(app)
                .post("/api/v1/auth/login")
                .send({
                    email: "admin@example.com",
                    password: "Password123"
                });

        expect(loginResponse.statusCode)
            .toBe(200);

        const accessToken =
            loginResponse.body.accessToken;

        const response =
            await request(app)
                .delete(
                    `/api/v1/products/${product._id}`
                )
                .set(
                    "Authorization",
                    `Bearer ${accessToken}`
                );

        expect(response.statusCode)
            .toBe(200);

        expect(response.body.success)
            .toBe(true);

        expect(response.body.message)
            .toBe(
                "Product and all images deleted successfully"
            );

        const deletedProduct =
            await Product.findById(product._id);

        expect(deletedProduct)
            .toBeNull();
    }
);


    // ===================================
    // Normal User can't Delete
    // ===================================

    test(
        "DELETE /api/v1/products/:id should reject normal user",
        async () => {
            
            const product =
                await Product.findOne({
                    name: "Laptop"
                });

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
                    .delete(
                        `/api/v1/products/${product._id}`
                    )
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

            const existingProduct =
                await Product.findById(product._id);

            expect(existingProduct)
                .not
                .toBeNull();        
        }
    );



});