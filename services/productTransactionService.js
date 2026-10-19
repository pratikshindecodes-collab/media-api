import mongoose from "mongoose";

import Product from "../models/Product.js";

export const updateTwoProductsTransaction = async ({
    firstProductId,
    secondProductId,
    firstPrice,
    secondPrice
}) => {
    const session = await mongoose.startSession();

    try {
        session.startTransaction();

        const firstProduct =
            await Product.findById(firstProductId)
                .session(session);

        if (!firstProduct) {
            throw new Error("First product not found");
        }

        const secondProduct =
            await Product.findById(secondProductId)
                .session(session);

        if (!secondProduct) {
            throw new Error("Second product not found");
        }

        firstProduct.price = firstPrice;
        secondProduct.price = secondPrice;

        await firstProduct.save({ session });
        await secondProduct.save({ session });

        await session.commitTransaction();
    } catch (error) {
        await session.abortTransaction();
        throw error;
    } finally {
        await session.endSession();
    }
};