import Product from "../models/Product.js";
import fs from "fs/promises";
import path from "path";

import {
    getProductsService,
    createProductService,
    updateProductService,
    deleteProductService
} from "../services/productService.js";

export const createProduct = async (req, res) => {
    const product = 
        await createProductService({
            name: req.body.name,
            price: req.body.price,
            files: req.files
        });
    
    res.status(201).json({
        success: true,
        message: "Product created successfully",
        data: product
    });
};


export const getProducts = async (req, res) => {
    const result =
        await getProductsService(req.query);

        res.json({
            success: true,
            message: "Product fetched successfully",
            data: result.products,
            pagination: result.pagination
        })
};

export const updateProduct = async (req, res) => {
    const { id } = req.params;
    const { name, price } = req.body;

    const product =
        await updateProductService({
            id,
            name,
            price,
            files: req.files
        });

    if (!product) {
        return res.status(404).json({
            success: false,
            message: "Product not found"
        });
    }

    res.json({
        success: true,
        message: "Product updated successfully",
        data: product
    });
};

export const deleteProduct = async (req, res) => {
    const { id } = req.params;

    const product =
        await deleteProductService(id);

    if (!product) {
        return res.status(404).json({
            success: false,
            message: "Product not found"
        });
    }

    res.json({
        success: true,
        message: "Product and all images deleted successfully"
    });
};



