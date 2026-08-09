"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const product_service_1 = require("../services/product/product.service");
const auth_middleware_1 = require("../middleware/auth.middleware");
const client_1 = require("@prisma/client");
const router = (0, express_1.Router)();
// Create Product - ADMIN only
router.post("/", auth_middleware_1.authenticate, (0, auth_middleware_1.authorize)(client_1.UserRole.ADMIN), async (req, res) => {
    try {
        const { title, description, price, stock, image, categoryId, } = req.body;
        if (!title || price === undefined || stock === undefined || !categoryId) {
            return res.status(400).json({
                success: false,
                message: "Title, price, stock and categoryId are required",
            });
        }
        const product = await (0, product_service_1.createProduct)({
            title,
            description,
            price: Number(price),
            stock: Number(stock),
            image,
            categoryId,
        });
        return res.status(201).json({
            success: true,
            message: "Product created successfully",
            data: product,
        });
    }
    catch (error) {
        const message = error instanceof Error ? error.message : "Something went wrong";
        return res.status(400).json({
            success: false,
            message,
        });
    }
});
// Get All Products - Public
router.get("/", async (req, res) => {
    try {
        const products = await (0, product_service_1.getAllProducts)();
        return res.status(200).json({
            success: true,
            message: "Products retrieved successfully",
            data: products,
        });
    }
    catch (error) {
        const message = error instanceof Error ? error.message : "Something went wrong";
        return res.status(500).json({
            success: false,
            message,
        });
    }
});
// Get Product By ID - Public
router.get("/:id", async (req, res) => {
    try {
        const product = await (0, product_service_1.getProductById)(req.params.id);
        return res.status(200).json({
            success: true,
            message: "Product retrieved successfully",
            data: product,
        });
    }
    catch (error) {
        const message = error instanceof Error ? error.message : "Something went wrong";
        return res.status(404).json({
            success: false,
            message,
        });
    }
});
// Update Product - ADMIN only
router.put("/:id", auth_middleware_1.authenticate, (0, auth_middleware_1.authorize)(client_1.UserRole.ADMIN), async (req, res) => {
    try {
        const { title, description, price, stock, image, categoryId, } = req.body;
        const product = await (0, product_service_1.updateProduct)(req.params.id, {
            title,
            description,
            price: price !== undefined
                ? Number(price)
                : undefined,
            stock: stock !== undefined
                ? Number(stock)
                : undefined,
            image,
            categoryId,
        });
        return res.status(200).json({
            success: true,
            message: "Product updated successfully",
            data: product,
        });
    }
    catch (error) {
        const message = error instanceof Error ? error.message : "Something went wrong";
        return res.status(404).json({
            success: false,
            message,
        });
    }
});
// Soft Delete Product - ADMIN only
router.delete("/:id", auth_middleware_1.authenticate, (0, auth_middleware_1.authorize)(client_1.UserRole.ADMIN), async (req, res) => {
    try {
        await (0, product_service_1.deleteProduct)(req.params.id);
        return res.status(200).json({
            success: true,
            message: "Product deleted successfully",
            data: null,
        });
    }
    catch (error) {
        const message = error instanceof Error ? error.message : "Something went wrong";
        return res.status(404).json({
            success: false,
            message,
        });
    }
});
exports.default = router;
