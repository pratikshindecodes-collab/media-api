import {
    describe,
    it,
    expect,
    beforeAll,
    afterAll
} from "vitest";

import mongoose from "mongoose";

import Product from "../models/Product.js";
import connectDB from "../config/db.js";

import {
    updateTwoProductsTransaction
} from "../services/productTransactionService.js";

describe("Product Transactions", () => {
    let firstProduct;
    let secondProduct;

    beforeAll(async () => {
        await connectDB();

        firstProduct = await Product.create({
            name: "Transaction Product A",
            price: 10000,
            images: []
        });

        secondProduct = await Product.create({
            name: "Transaction Product B",
            price: 20000,
            images: []
        });
    });

    afterAll(async () => {
        if (firstProduct?._id || secondProduct?._id) {
            await Product.deleteMany({
                _id: {
                    $in: [
                        firstProduct?._id,
                        secondProduct?._id
                    ].filter(Boolean)
                }
            });
        }

        await mongoose.connection.close();
    });

    it("should commit all changes when transaction succeeds", async () => {
        await updateTwoProductsTransaction({
            firstProductId: firstProduct._id,
            secondProductId: secondProduct._id,
            firstPrice: 11000,
            secondPrice: 22000
        });

        const updatedFirst =
            await Product.findById(firstProduct._id);

        const updatedSecond =
            await Product.findById(secondProduct._id);

        expect(updatedFirst.price).toBe(11000);
        expect(updatedSecond.price).toBe(22000);
    });

    it("should rollback all changes when transaction fails", async () => {
        await expect(
            updateTwoProductsTransaction({
                firstProductId: firstProduct._id,
                secondProductId:
                    new mongoose.Types.ObjectId(),
                firstPrice: 12000,
                secondPrice: 25000
            })
        ).rejects.toThrow(
            "Second product not found"
        );

        const product =
            await Product.findById(firstProduct._id);

        expect(product.price).toBe(11000);
    });
});