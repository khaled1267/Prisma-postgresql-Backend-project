"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_service_1 = require("../services/auth.service");
const auth_service_2 = require("../services/auth.service");
const router = (0, express_1.Router)();
// Register
router.post("/register", async (req, res) => {
    try {
        const { name, email, password } = req.body;
        if (!name || !email || !password) {
            return res.status(400).json({
                success: false,
                message: "Name, email and password are required",
            });
        }
        const user = await (0, auth_service_2.registerUser)({
            name,
            email,
            password,
        });
        return res.status(201).json({
            success: true,
            message: "User registered successfully",
            data: user,
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
// Login
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Email and password are required",
            });
        }
        const result = await (0, auth_service_1.loginUser)({
            email,
            password,
        });
        return res.status(200).json({
            success: true,
            message: "Login successful",
            data: result,
        });
    }
    catch (error) {
        const message = error instanceof Error ? error.message : "Something went wrong";
        return res.status(401).json({
            success: false,
            message,
        });
    }
});
exports.default = router;
