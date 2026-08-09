"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginUser = exports.registerUser = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const prisma_1 = __importDefault(require("../lib/prisma"));
const registerUser = async (data) => {
    const { name, email, password } = data;
    const existingUser = await prisma_1.default.user.findUnique({
        where: {
            email,
        },
    });
    if (existingUser) {
        throw new Error("User with this email already exists");
    }
    const hashedPassword = await bcrypt_1.default.hash(password, 10);
    const user = await prisma_1.default.user.create({
        data: {
            name,
            email,
            password: hashedPassword,
        },
        select: {
            id: true,
            name: true,
            email: true,
            role: true,
            createdAt: true,
        },
    });
    return user;
};
exports.registerUser = registerUser;
const loginUser = async (data) => {
    const { email, password } = data;
    const user = await prisma_1.default.user.findUnique({
        where: {
            email,
        },
    });
    if (!user || user.isDeleted) {
        throw new Error("Invalid email or password");
    }
    const isPasswordValid = await bcrypt_1.default.compare(password, user.password);
    if (!isPasswordValid) {
        throw new Error("Invalid email or password");
    }
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
        throw new Error("JWT_SECRET is not configured");
    }
    const token = jsonwebtoken_1.default.sign({
        userId: user.id,
        email: user.email,
        role: user.role,
    }, jwtSecret, {
        expiresIn: "7d",
    });
    return {
        user: {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
        },
        token,
    };
};
exports.loginUser = loginUser;
