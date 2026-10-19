import uploadToCloudinary from "../utils/cloudinaryUpload.js";
import notificationQueue from "../jobs/queues/notificationQueue.js";

import {
    getCache,
    setCache
} from "../utils/cache.js";

import {
    getProductListCacheKey,
    invalidateProductListCache
} from "../utils/productCacheKey.js";

import {
    findProducts,
    countProducts,
    createProduct,
    findProductById,
    saveProduct,
    deleteProductById
} from "../repositories/productRepository.js";

import cloudinary from "../config/cloudinary.js";

// GET PRODUCTS
export const getProductsService = async (queryParams) => {

    const {
        search,
        minPrice,
        maxPrice,
        sort,
        page = 1,
        limit = 10
    } = queryParams;

    // Generate cache key
    const cacheKey =
        await getProductListCacheKey(queryParams);

    // Check Redis cache
    const cachedResult =
        await getCache(cacheKey);

    if (cachedResult) {

        console.log(
            "Product cache HIT:",
            cacheKey
        );

        return cachedResult;
    }

    console.log(
        "Product cache MISS:",
        cacheKey
    );

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
            query.price.$gte =
                Number(minPrice);
        }

        if (maxPrice !== undefined) {
            query.price.$lte =
                Number(maxPrice);
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

    // Count products
    const totalProducts =
        await countProducts(query);

    // Get products
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

    const result = {
        products,
        pagination: {
            currentPage: pageNumber,
            limit: limitNumber,
            totalProducts,
            totalPages
        }
    };

    // Store result in Redis
    await setCache(
        cacheKey,
        result,
        60
    );

    return result;
};


// CREATE PRODUCT
export const createProductService = async ({
    name,
    price,
    files
}) => {

    const images = [];

    if (files && files.length > 0) {

        for (const file of files) {

            const result =
                await uploadToCloudinary(
                    file.buffer,
                    "media-api/products"
                );

            images.push({
                url: result.secure_url,
                publicId: result.public_id
            });
        }
    }

    // Create product in MongoDB
    const product =
        await createProduct({
            name,
            price,
            images
        });

    // Invalidate cache AFTER successful DB operation
    await invalidateProductListCache();

    await notificationQueue.add(
        "product-created",
        {
            productId: product._id.toString(),
            productName: product.name
        },
        {
            attempts: 3,

            backoff: {
                type: "exponential",
                delay: 1000
            }
        }
    );

    try {
        await notificationQueue.add(
            "product-created",
            {
                productId: product._id.toString(),
                productName: product.name
            },
            {
                jobId: `product-created-${product._id}`
            }
        );

        console.log("Product notification job queued");
    } catch (error) {
        console.error(
            "Could not enqueue product notification:",
            error.message
        )
    };

    return product;
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

    let oldImages = [];

    if (files && files.length > 0) {

        oldImages =
            product.images || [];

        const newImages = [];

        for (const file of files) {

            const result =
                await uploadToCloudinary(
                    file.buffer,
                    "media-api/products"
                );

            newImages.push({
                url: result.secure_url,
                publicId: result.public_id
            });
        }

        product.images = newImages;
    }

    // Save updated product
    await saveProduct(product);

    // Invalidate cache AFTER successful DB update
    await invalidateProductListCache();

    // Delete old Cloudinary images
    for (const oldImage of oldImages) {

        try {

            await cloudinary.uploader.destroy(
                oldImage.publicId,
                {
                    resource_type: "image"
                }
            );

        } catch (error) {

            console.log(
                "Old Cloudinary image could not be deleted:",
                error.message
            );
        }
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

    // Delete product from MongoDB
    await deleteProductById(id);

    // Invalidate cache AFTER successful DB deletion
    await invalidateProductListCache();

    // Delete images from Cloudinary
    for (const image of images) {

        try {

            await cloudinary.uploader.destroy(
                image.publicId,
                {
                    resource_type: "image"
                }
            );

        } catch (error) {

            console.log(
                "Cloudinary image could not be deleted:",
                error.message
            );
        }
    }

    return product;
};