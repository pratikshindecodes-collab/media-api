import express from "express";

import upload from "../middleware/uploadMiddleware.js";
import authMiddleware from "../middleware/authMiddleware.js";
import roleMiddleware from "../middleware/roleMiddleware.js";
import productValidation from "../middleware/productValidation.js";
import productUpdateValidation from "../middleware/productUpdateValidation.js";
import queryValidation from "../middleware/queryValidation.js";
import asyncHandler from "../utils/asyncHandler.js";


import {
    createProduct,
    getProducts,
    updateProduct,
    deleteProduct
} from "../controllers/productController.js";

const router = express.Router();


/**
 * @openapi
 * /api/v1/products:
 *   get:
 *     summary: Get all products
 *     description: Retrieve products with optional filtering and pagination.
 *     tags:
 *       - Products
 *     parameters:
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search products by name or category.
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: Filter products by category.
 *       - in: query
 *         name: minPrice
 *         schema:
 *           type: number
 *         description: Minimum product price.
 *       - in: query
 *         name: maxPrice
 *         schema:
 *           type: number
 *         description: Maximum product price.
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number.
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of products per page.
 *     responses:
 *       '200':
 *         description: Products retrieved successfully.
 *       '401':
 *         description: Authentication required.
 *       '500':
 *         description: Internal server error.
 */


// Public
router.get(
    "/",
    queryValidation,
    asyncHandler(getProducts)
)


/**
 * @openapi
 * /api/v1/products:
 *   post:
 *     summary: Create a product
 *     description: Create a new product in the database.
 *     tags:
 *       - Products
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - price
 *               - category
 *             properties:
 *               name:
 *                 type: string
 *                 example: Wireless Mouse
 *               price:
 *                 type: number
 *                 example: 799
 *               category:
 *                 type: string
 *                 example: electronics
 *               inStock:
 *                 type: boolean
 *                 example: true
 *               rating:
 *                 type: number
 *                 example: 4.5
 *               images:
 *                 type: array
 *                 maxItems: 5
 *                 items: 
 *                   type: string
 *                   format: binary
 *     responses:
 *       '201':
 *         description: Product created successfully.
 *       '400':
 *         description: Invalid product data.
 *       '401':
 *         description: Authentication required.
 *       '500':
 *         description: Internal server error.
 */


router.post(
    "/",
    authMiddleware,
    upload.array("images", 5),
    productValidation,
    asyncHandler(createProduct)
);


router.put(
    "/:id",
    authMiddleware,
    upload.array("images", 5),
    productUpdateValidation,
    asyncHandler(updateProduct)
);

// Admin only
router.delete(
    "/:id",
    authMiddleware,
    roleMiddleware("admin"),
    asyncHandler(deleteProduct)
);


export default router;