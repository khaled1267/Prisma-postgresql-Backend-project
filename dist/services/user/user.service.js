"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUser = exports.updateUser = exports.getUserById = exports.getAllUsers = void 0;
const prisma_1 = __importDefault(require("../../lib/prisma"));
// Get All Users
const getAllUsers = async () => {
    return prisma_1.default.user.findMany({
        where: {
            isDeleted: false,
        },
        select: {
            id: true,
            name: true,
            email: true,
            role: true,
            isDeleted: true,
            createdAt: true,
            updatedAt: true,
        },
        orderBy: {
            createdAt: "desc",
        },
    });
};
exports.getAllUsers = getAllUsers;
// Get User By ID
const getUserById = async (id) => {
    const user = await prisma_1.default.user.findFirst({
        where: {
            id,
            isDeleted: false,
        },
        select: {
            id: true,
            name: true,
            email: true,
            role: true,
            isDeleted: true,
            createdAt: true,
            updatedAt: true,
        },
    });
    if (!user) {
        throw new Error("User not found");
    }
    return user;
};
exports.getUserById = getUserById;
// Update User
const updateUser = async (id, data) => {
    const user = await prisma_1.default.user.findFirst({
        where: {
            id,
            isDeleted: false,
        },
    });
    if (!user) {
        throw new Error("User not found");
    }
    if (data.email) {
        const existingUser = await prisma_1.default.user.findFirst({
            where: {
                email: data.email,
                id: {
                    not: id,
                },
                isDeleted: false,
            },
        });
        if (existingUser) {
            throw new Error("Email already exists");
        }
    }
    return prisma_1.default.user.update({
        where: {
            id,
        },
        data,
        select: {
            id: true,
            name: true,
            email: true,
            role: true,
            isDeleted: true,
            createdAt: true,
            updatedAt: true,
        },
    });
};
exports.updateUser = updateUser;
// Soft Delete User
const deleteUser = async (id) => {
    const user = await prisma_1.default.user.findFirst({
        where: {
            id,
            isDeleted: false,
        },
    });
    if (!user) {
        throw new Error("User not found");
    }
    return prisma_1.default.user.update({
        where: {
            id,
        },
        data: {
            isDeleted: true,
        },
        select: {
            id: true,
            name: true,
            email: true,
            role: true,
            isDeleted: true,
        },
    });
};
exports.deleteUser = deleteUser;
