import fs from "fs/promises";
import path from "path";

import {
    findProducts,
    countProducts,
    createProduct,
    findProductById,
    saveProduct,
    deleteProductById
} from "../repositories/productRepository.js";


// GET PRODUCTS
export const getProductsService = async ({
    search,
    minPrice,
    maxPrice,
    sort,
    page = 1,
    limit = 10
}) => {
    let query = {};

    // Search
    if (search) {
        query.name = {
            $regex: search,
            $options: "i"
        };
    }

    // Price Filter
    if (
        minPrice !== undefined ||
        maxPrice !== undefined
    ) {
        query.price = {};

        if (minPrice !== undefined) {
            query.price.$gte = Number(minPrice);
        }

        if (maxPrice !== undefined) {
            query.price.$lte = Number(maxPrice);
        }
    }

    // Sort
    let sortOption = {};

    if (sort === "price_asc") {
        sortOption.price = 1;
    } else if (sort === "price_desc") {
        sortOption.price = -1;
    } else if (sort === "newest") {
        sortOption.createdAt = -1;
    } else if (sort === "oldest") {
        sortOption.createdAt = 1;
    }

    // Pagination
    const pageNumber = Number(page);
    const limitNumber = Number(limit);

    const skip =
        (pageNumber - 1) * limitNumber;

    const totalProducts =
        await countProducts(query);

    const products =
        await findProducts({
            query,
            sortOption,
            skip,
            limit: limitNumber
        });

    const totalPages =
        Math.ceil(
            totalProducts / limitNumber
        );

    return {
        products,
        pagination: {
            currentPage: pageNumber,
            limit: limitNumber,
            totalProducts,
            totalPages
        }
    };
};


// CREATE PRODUCT
export const createProductService = async ({
    name,
    price,
    files
}) => {
    const images = files
        ? files.map(
            file => `/uploads/${file.filename}`
        )
        : [];

    return await createProduct({
        name,
        price,
        images
    });
};


// UPDATE PRODUCT
export const updateProductService = async ({
    id,
    name,
    price,
    files
}) => {
    const product =
        await findProductById(id);

    if (!product) {
        return null;
    }

    if (name !== undefined) {
        product.name = name;
    }

    if (price !== undefined) {
        product.price = price;
    }

    if (files && files.length > 0) {
        const oldImages =
            product.images || [];

        product.images = files.map(
            file => `/uploads/${file.filename}`
        );

        await saveProduct(product);

        for (const oldImage of oldImages) {
            const oldImagePath = path.join(
                process.cwd(),
                oldImage
            );

            try {
                await fs.unlink(oldImagePath);
            } catch (error) {
                console.log(
                    "Old image could not be deleted:",
                    error.message
                );
            }
        }
    } else {
        await saveProduct(product);
    }

    return product;
};


// DELETE PRODUCT
export const deleteProductService = async (id) => {
    const product =
        await findProductById(id);

    if (!product) {
        return null;
    }

    const images =
        product.images || [];

    await deleteProductById(id);

    for (const image of images) {
        const imagePath = path.join(
            process.cwd(),
            image
        );

        try {
            await fs.unlink(imagePath);
        } catch (error) {
            console.log(
                "Image could not be deleted:",
                error.message
            );
        }
    }

    return product;
};