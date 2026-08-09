"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const review_service_1 = require("../services/review/review.service");
const auth_middleware_1 = require("../middleware/auth.middleware");
const client_1 = require("@prisma/client");
const router = (0, express_1.Router)();
// Create Review - Logged-in user
router.post("/", auth_middleware_1.authenticate, async (req, res) => {
    try {
        const { productId, rating, comment } = req.body;
        if (!productId || rating === undefined) {
            return res.status(400).json({
                success: false,
                message: "Product ID and rating are required",
            });
        }
        const review = await (0, review_service_1.createReview)(req.user.userId, {
            productId,
            rating: Number(rating),
            comment,
        });
        return res.status(201).json({
            success: true,
            message: "Review created successfully",
            data: review,
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
// Get All Reviews - Public
router.get("/", async (req, res) => {
    try {
        const reviews = await (0, review_service_1.getAllReviews)();
        return res.status(200).json({
            success: true,
            message: "Reviews retrieved successfully",
            data: reviews,
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
// Get Review By ID - Public
router.get("/:id", async (req, res) => {
    try {
        const review = await (0, review_service_1.getReviewById)(req.params.id);
        return res.status(200).json({
            success: true,
            message: "Review retrieved successfully",
            data: review,
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
// Update Review - Owner only
router.put("/:id", auth_middleware_1.authenticate, async (req, res) => {
    try {
        const { rating, comment } = req.body;
        const review = await (0, review_service_1.updateReview)(req.params.id, req.user.userId, {
            rating: rating !== undefined ? Number(rating) : undefined,
            comment,
        });
        return res.status(200).json({
            success: true,
            message: "Review updated successfully",
            data: review,
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
// Delete Review - Owner or Admin
router.delete("/:id", auth_middleware_1.authenticate, async (req, res) => {
    try {
        const isAdmin = req.user.role === client_1.UserRole.ADMIN;
        await (0, review_service_1.deleteReview)(req.params.id, req.user.userId, isAdmin);
        return res.status(200).json({
            success: true,
            message: "Review deleted successfully",
            data: null,
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
exports.default = router;
