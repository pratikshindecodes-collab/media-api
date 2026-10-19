import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },

        price: {
            type: Number,
            required: true
        },

        images: [
            {
                url: {
                    type: String,
                    required: true
                },

                publicId: {
                    type: String,
                    required: true
                }
            }
        ]
    },
    {
        timestamps: true
    }
);

productSchema.index({
    price: 1
});

productSchema.index({
    createdAt: -1
});

const Product = mongoose.model("Product", productSchema);

export default Product;