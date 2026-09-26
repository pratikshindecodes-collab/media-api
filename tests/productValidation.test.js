import { describe, test, expect, vi } from "vitest";

import productValidation from "../middleware/productValidation.js";

describe("Product Validation Middleware", () => {

    test("should allow valid product", () => {
        const req = {
            body: {
                name: "Laptop",
                price: 50000
            }
        };

        const res = {};

        const next = vi.fn();

        productValidation(req, res, next);

        expect(next).toHaveBeenCalled();
    });


    test("should reject product without name", () => {
        const req = {
            body: {
                price: 50000
            }
        };

        const res = {
            status: vi.fn().mockReturnThis(),
            json: vi.fn()
        };

        const next = vi.fn();

        productValidation(req, res, next);

        expect(res.status).toHaveBeenCalledWith(400);

        expect(res.json).toHaveBeenCalledWith({
            success: false,
            message: "Product name is required"
        });

        expect(next).not.toHaveBeenCalled();
    });


    test("should reject product with empty name", () => {
        const req = {
            body: {
                name: "",
                price: 50000
            }
        };

        const res = {
            status: vi.fn().mockReturnThis(),
            json: vi.fn()
        };

        const next = vi.fn();

        productValidation(req, res, next);

        expect(res.status).toHaveBeenCalledWith(400);

        expect(res.json).toHaveBeenCalledWith({
            success: false,
            message: "Product name is required"
        });

        expect(next).not.toHaveBeenCalled();
    });


    test("should reject product with spaces-only name", () => {
        const req = {
            body: {
                name: "     ",
                price: 50000
            }
        };

        const res = {
            status: vi.fn().mockReturnThis(),
            json: vi.fn()
        };

        const next = vi.fn();

        productValidation(req, res, next);

        expect(res.status).toHaveBeenCalledWith(400);

        expect(res.json).toHaveBeenCalledWith({
            success: false,
            message: "Product name is required"
        });

        expect(next).not.toHaveBeenCalled();
    });


    test("should reject product without price", () => {
        const req = {
            body: {
                name: "Laptop"
            }
        };

        const res = {
            status: vi.fn().mockReturnThis(),
            json: vi.fn()
        };

        const next = vi.fn();

        productValidation(req, res, next);

        expect(res.status).toHaveBeenCalledWith(400);

        expect(res.json).toHaveBeenCalledWith({
            success: false,
            message: "Product price is required"
        });

        expect(next).not.toHaveBeenCalled();
    });


    test("should reject non-numeric price", () => {
        const req = {
            body: {
                name: "Laptop",
                price: "abc"
            }
        };

        const res = {
            status: vi.fn().mockReturnThis(),
            json: vi.fn()
        };

        const next = vi.fn();

        productValidation(req, res, next);

        expect(res.status).toHaveBeenCalledWith(400);

        expect(res.json).toHaveBeenCalledWith({
            success: false,
            message: "Product price must be a number"
        });

        expect(next).not.toHaveBeenCalled();
    });


    test("should reject negative price", () => {
        const req = {
            body: {
                name: "Laptop",
                price: -100
            }
        };

        const res = {
            status: vi.fn().mockReturnThis(),
            json: vi.fn()
        };

        const next = vi.fn();

        productValidation(req, res, next);

        expect(res.status).toHaveBeenCalledWith(400);

        expect(res.json).toHaveBeenCalledWith({
            success: false,
            message: "Product price must be greater than 0"
        });

        expect(next).not.toHaveBeenCalled();
    });


    test("should reject zero price", () => {
        const req = {
            body: {
                name: "Laptop",
                price: 0
            }
        };

        const res = {
            status: vi.fn().mockReturnThis(),
            json: vi.fn()
        };

        const next = vi.fn();

        productValidation(req, res, next);

        expect(res.status).toHaveBeenCalledWith(400);

        expect(res.json).toHaveBeenCalledWith({
            success: false,
            message: "Product price must be greater than 0"
        });

        expect(next).not.toHaveBeenCalled();
    });


    test("should allow positive decimal price", () => {
        const req = {
            body: {
                name: "Laptop",
                price: 49999.99
            }
        };

        const res = {};

        const next = vi.fn();

        productValidation(req, res, next);

        expect(next).toHaveBeenCalled();
    });

});