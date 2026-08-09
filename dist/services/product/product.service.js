"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteProduct = exports.updateProduct = exports.getProductById = exports.getAllProducts = exports.createProduct = void 0;
const prisma_1 = __importDefault(require("../../lib/prisma"));
const client_1 = require("@prisma/client");
// Create Product
const createProduct = async (data) => {
    const { title, description, price, stock, image, categoryId } = data;
    const category = await prisma_1.default.category.findFirst({
        where: {
            id: categoryId,
            isDeleted: false,
        },
    });
    if (!category) {
        throw new Error("Category not found");
    }
    const product = await prisma_1.default.product.create({
        data: {
            title,
            description,
            price,
            stock,
            image,
            categoryId,
            status: stock > 0 ? client_1.ProductStatus.ACTIVE : client_1.ProductStatus.OUT_OF_STOCK,
        },
        include: {
            category: true,
        },
    });
    return product;
};
exports.createProduct = createProduct;
// Get All Products
const getAllProducts = async () => {
    return prisma_1.default.product.findMany({
        where: {
            isDeleted: false,
        },
        include: {
            category: true,
        },
        orderBy: {
            createdAt: "desc",
        },
    });
};
exports.getAllProducts = getAllProducts;
// Get Product By ID
const getProductById = async (id) => {
    const product = await prisma_1.default.product.findFirst({
        where: {
            id,
            isDeleted: false,
        },
        include: {
            category: true,
        },
    });
    if (!product) {
        throw new Error("Product not found");
    }
    return product;
};
exports.getProductById = getProductById;
// Update Product
const updateProduct = async (id, data) => {
    const product = await prisma_1.default.product.findFirst({
        where: {
            id,
            isDeleted: false,
        },
    });
    if (!product) {
        throw new Error("Product not found");
    }
    if (data.categoryId) {
        const category = await prisma_1.default.category.findFirst({
            where: {
                id: data.categoryId,
                isDeleted: false,
            },
        });
        if (!category) {
            throw new Error("Category not found");
        }
    }
    const newStock = data.stock ?? product.stock;
    let status = product.status;
    if (newStock === 0) {
        status = client_1.ProductStatus.OUT_OF_STOCK;
    }
    else if (product.status === client_1.ProductStatus.OUT_OF_STOCK) {
        status = client_1.ProductStatus.ACTIVE;
    }
    return prisma_1.default.product.update({
        where: {
            id,
        },
        data: {
            ...data,
            status,
        },
        include: {
            category: true,
        },
    });
};
exports.updateProduct = updateProduct;
// Soft Delete Product
const deleteProduct = async (id) => {
    const product = await prisma_1.default.product.findFirst({
        where: {
            id,
            isDeleted: false,
        },
    });
    if (!product) {
        throw new Error("Product not found");
    }
    return prisma_1.default.product.update({
        where: {
            id,
        },
        data: {
            isDeleted: true,
        },
    });
};
exports.deleteProduct = deleteProduct;
