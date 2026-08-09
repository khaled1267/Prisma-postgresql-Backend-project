"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteCategory = exports.updateCategory = exports.getCategoryById = exports.getAllCategories = exports.createCategory = void 0;
const prisma_1 = __importDefault(require("../../lib/prisma"));
// Create Category
const createCategory = async (data) => {
    const { name, description } = data;
    const existingCategory = await prisma_1.default.category.findUnique({
        where: {
            name,
        },
    });
    if (existingCategory && !existingCategory.isDeleted) {
        throw new Error("Category already exists");
    }
    const category = await prisma_1.default.category.create({
        data: {
            name,
            description,
        },
    });
    return category;
};
exports.createCategory = createCategory;
// Get All Categories
const getAllCategories = async () => {
    return prisma_1.default.category.findMany({
        where: {
            isDeleted: false,
        },
        orderBy: {
            createdAt: "desc",
        },
    });
};
exports.getAllCategories = getAllCategories;
// Get Category By ID
const getCategoryById = async (id) => {
    const category = await prisma_1.default.category.findFirst({
        where: {
            id,
            isDeleted: false,
        },
    });
    if (!category) {
        throw new Error("Category not found");
    }
    return category;
};
exports.getCategoryById = getCategoryById;
// Update Category
const updateCategory = async (id, data) => {
    const category = await prisma_1.default.category.findFirst({
        where: {
            id,
            isDeleted: false,
        },
    });
    if (!category) {
        throw new Error("Category not found");
    }
    return prisma_1.default.category.update({
        where: {
            id,
        },
        data: {
            name: data.name,
            description: data.description,
        },
    });
};
exports.updateCategory = updateCategory;
// Soft Delete Category
const deleteCategory = async (id) => {
    const category = await prisma_1.default.category.findFirst({
        where: {
            id,
            isDeleted: false,
        },
    });
    if (!category) {
        throw new Error("Category not found");
    }
    return prisma_1.default.category.update({
        where: {
            id,
        },
        data: {
            isDeleted: true,
        },
    });
};
exports.deleteCategory = deleteCategory;
