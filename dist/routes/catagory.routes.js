"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const category_service_1 = require("../services/catagory/category.service");
const auth_middleware_1 = require("../middleware/auth.middleware");
const client_1 = require("@prisma/client");
const router = (0, express_1.Router)();
// Create Category - Admin only
router.post("/", auth_middleware_1.authenticate, (0, auth_middleware_1.authorize)(client_1.UserRole.ADMIN), async (req, res) => {
    try {
        const { name, description } = req.body;
        if (!name) {
            return res.status(400).json({
                success: false,
                message: "Category name is required",
            });
        }
        const category = await (0, category_service_1.createCategory)({
            name,
            description,
        });
        return res.status(201).json({
            success: true,
            message: "Category created successfully",
            data: category,
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
// Get All Categories - Public
router.get("/", async (req, res) => {
    try {
        const categories = await (0, category_service_1.getAllCategories)();
        return res.status(200).json({
            success: true,
            message: "Categories retrieved successfully",
            data: categories,
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
// Get Category By ID - Public
router.get("/:id", async (req, res) => {
    try {
        const category = await (0, category_service_1.getCategoryById)(req.params.id);
        return res.status(200).json({
            success: true,
            message: "Category retrieved successfully",
            data: category,
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
// Update Category - Admin only
router.put("/:id", auth_middleware_1.authenticate, (0, auth_middleware_1.authorize)(client_1.UserRole.ADMIN), async (req, res) => {
    try {
        const { name, description } = req.body;
        if (!name) {
            return res.status(400).json({
                success: false,
                message: "Category name is required",
            });
        }
        const category = await (0, category_service_1.updateCategory)(req.params.id, {
            name,
            description,
        });
        return res.status(200).json({
            success: true,
            message: "Category updated successfully",
            data: category,
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
// Delete Category - Admin only
router.delete("/:id", auth_middleware_1.authenticate, (0, auth_middleware_1.authorize)(client_1.UserRole.ADMIN), async (req, res) => {
    try {
        await (0, category_service_1.deleteCategory)(req.params.id);
        return res.status(200).json({
            success: true,
            message: "Category deleted successfully",
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
