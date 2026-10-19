import Product from "../models/Product.js";

export const findProducts = async ({
    query,
    sortOption,
    skip,
    limit
}) => {
    return await Product
        .find(query)
        .sort(sortOption)
        .skip(skip)
        .limit(limit)
        .lean();
};

export const countProducts = async (query) => {
    return await Product.countDocuments(query);
};

export const createProduct = async (data) => {
    return await Product.create(data);
};

export const findProductById = async (id) => {
    return await Product.findById(id);
};

export const saveProduct = async (product) => {
    return await product.save();
};

export const deleteProductById = async (id) => {
    return await Product.findByIdAndDelete(id);
};