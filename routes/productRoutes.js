import express from "express";

import upload from "../middleware/uploadMiddleware.js";
import authMiddleware from "../middleware/authMiddleware.js";
import roleMiddleware from "../middleware/roleMiddleware.js";
import productValidation from "../middleware/productValidation.js";
import queryValidation from "../middleware/queryValidation.js";
import asyncHandler from "../utils/asyncHandler.js";


import {
    createProduct,
    getProducts,
    updateProduct,
    deleteProduct
} from "../controllers/productController.js";

const router = express.Router();

// Public
router.get(
    "/",
    queryValidation,
    asyncHandler(getProducts)
)

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