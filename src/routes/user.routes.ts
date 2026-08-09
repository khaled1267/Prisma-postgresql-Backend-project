import { Router, Request, Response } from "express";
import {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
} from "../services/user/user.service";
import {
  authenticate,
  authorize,
} from "../middleware/auth.middleware";
import { UserRole } from "@prisma/client";

const router = Router();

// Get All Users - ADMIN only
router.get(
  "/",
  authenticate,
  authorize(UserRole.ADMIN),
  async (req: Request, res: Response) => {
    try {
      const users = await getAllUsers();

      return res.status(200).json({
        success: true,
        message: "Users retrieved successfully",
        data: users,
      });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Something went wrong";

      return res.status(500).json({
        success: false,
        message,
      });
    }
  }
);

// Get User By ID - ADMIN only
router.get(
  "/:id",
  authenticate,
  authorize(UserRole.ADMIN),
  async (req: Request, res: Response) => {
    try {
      const user = await getUserById(req.params.id as string);

      return res.status(200).json({
        success: true,
        message: "User retrieved successfully",
        data: user,
      });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Something went wrong";

      return res.status(404).json({
        success: false,
        message,
      });
    }
  }
);

// Update User - ADMIN only
router.put(
  "/:id",
  authenticate,
  authorize(UserRole.ADMIN),
  async (req: Request, res: Response) => {
    try {
      const { name, email } = req.body;

      if (!name && !email) {
        return res.status(400).json({
          success: false,
          message: "Name or email is required",
        });
      }

      const user = await updateUser(req.params.id as string, {
        name,
        email,
      });

      return res.status(200).json({
        success: true,
        message: "User updated successfully",
        data: user,
      });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Something went wrong";

      return res.status(400).json({
        success: false,
        message,
      });
    }
  }
);

// Delete User - ADMIN only
router.delete(
  "/:id",
  authenticate,
  authorize(UserRole.ADMIN),
  async (req: Request, res: Response) => {
    try {
      await deleteUser(req.params.id as string);

      return res.status(200).json({
        success: true,
        message: "User deleted successfully",
        data: null,
      });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Something went wrong";

      return res.status(404).json({
        success: false,
        message,
      });
    }
  }
);

export default router;