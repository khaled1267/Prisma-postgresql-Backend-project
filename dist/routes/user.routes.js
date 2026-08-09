"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_service_1 = require("../services/user/user.service");
const auth_middleware_1 = require("../middleware/auth.middleware");
const client_1 = require("@prisma/client");
const router = (0, express_1.Router)();
// Get All Users - ADMIN only
router.get("/", auth_middleware_1.authenticate, (0, auth_middleware_1.authorize)(client_1.UserRole.ADMIN), async (req, res) => {
    try {
        const users = await (0, user_service_1.getAllUsers)();
        return res.status(200).json({
            success: true,
            message: "Users retrieved successfully",
            data: users,
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
// Get User By ID - ADMIN only
router.get("/:id", auth_middleware_1.authenticate, (0, auth_middleware_1.authorize)(client_1.UserRole.ADMIN), async (req, res) => {
    try {
        const user = await (0, user_service_1.getUserById)(req.params.id);
        return res.status(200).json({
            success: true,
            message: "User retrieved successfully",
            data: user,
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
// Update User - ADMIN only
router.put("/:id", auth_middleware_1.authenticate, (0, auth_middleware_1.authorize)(client_1.UserRole.ADMIN), async (req, res) => {
    try {
        const { name, email } = req.body;
        if (!name && !email) {
            return res.status(400).json({
                success: false,
                message: "Name or email is required",
            });
        }
        const user = await (0, user_service_1.updateUser)(req.params.id, {
            name,
            email,
        });
        return res.status(200).json({
            success: true,
            message: "User updated successfully",
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
// Delete User - ADMIN only
router.delete("/:id", auth_middleware_1.authenticate, (0, auth_middleware_1.authorize)(client_1.UserRole.ADMIN), async (req, res) => {
    try {
        await (0, user_service_1.deleteUser)(req.params.id);
        return res.status(200).json({
            success: true,
            message: "User deleted successfully",
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
