"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteReview = exports.updateReview = exports.getReviewById = exports.getAllReviews = exports.createReview = void 0;
const prisma_1 = __importDefault(require("../../lib/prisma"));
// Create Review
const createReview = async (userId, data) => {
    const { productId, rating, comment } = data;
    // Check product
    const product = await prisma_1.default.product.findFirst({
        where: {
            id: productId,
            isDeleted: false,
        },
    });
    if (!product) {
        throw new Error("Product not found");
    }
    // Rating validation
    if (rating < 1 || rating > 5) {
        throw new Error("Rating must be between 1 and 5");
    }
    // Prevent duplicate review
    const existingReview = await prisma_1.default.review.findFirst({
        where: {
            userId,
            productId,
            isDeleted: false,
        },
    });
    if (existingReview) {
        throw new Error("You have already reviewed this product");
    }
    return prisma_1.default.review.create({
        data: {
            userId,
            productId,
            rating,
            comment,
        },
        include: {
            product: true,
            user: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                },
            },
        },
    });
};
exports.createReview = createReview;
// Get All Reviews
const getAllReviews = async () => {
    return prisma_1.default.review.findMany({
        where: {
            isDeleted: false,
        },
        include: {
            product: true,
            user: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                },
            },
        },
        orderBy: {
            createdAt: "desc",
        },
    });
};
exports.getAllReviews = getAllReviews;
// Get Review By ID
const getReviewById = async (id) => {
    const review = await prisma_1.default.review.findFirst({
        where: {
            id,
            isDeleted: false,
        },
        include: {
            product: true,
            user: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                },
            },
        },
    });
    if (!review) {
        throw new Error("Review not found");
    }
    return review;
};
exports.getReviewById = getReviewById;
// Update Review
const updateReview = async (id, userId, data) => {
    const review = await prisma_1.default.review.findFirst({
        where: {
            id,
            isDeleted: false,
        },
    });
    if (!review) {
        throw new Error("Review not found");
    }
    // Only review owner can update
    if (review.userId !== userId) {
        throw new Error("You can only update your own review");
    }
    if (data.rating !== undefined) {
        if (data.rating < 1 || data.rating > 5) {
            throw new Error("Rating must be between 1 and 5");
        }
    }
    return prisma_1.default.review.update({
        where: {
            id,
        },
        data: {
            rating: data.rating,
            comment: data.comment,
        },
        include: {
            product: true,
        },
    });
};
exports.updateReview = updateReview;
// Soft Delete Review
const deleteReview = async (id, userId, isAdmin) => {
    const review = await prisma_1.default.review.findFirst({
        where: {
            id,
            isDeleted: false,
        },
    });
    if (!review) {
        throw new Error("Review not found");
    }
    // Only owner or admin can delete
    if (!isAdmin && review.userId !== userId) {
        throw new Error("You can only delete your own review");
    }
    return prisma_1.default.review.update({
        where: {
            id,
        },
        data: {
            isDeleted: true,
        },
    });
};
exports.deleteReview = deleteReview;
