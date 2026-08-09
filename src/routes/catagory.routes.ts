import { Router, Request, Response } from "express";
import {
  createCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
} from "../services/catagory/category.service";
import {
  authenticate,
  authorize,
} from "../middleware/auth.middleware";
import { UserRole } from "@prisma/client";

const router = Router();

// Create Category - Admin only
router.post(
  "/",
  authenticate,
  authorize(UserRole.ADMIN),
  async (req: Request, res: Response) => {
    try {
      const { name, description } = req.body;

      if (!name) {
        return res.status(400).json({
          success: false,
          message: "Category name is required",
        });
      }

      const category = await createCategory({
        name,
        description,
      });

      return res.status(201).json({
        success: true,
        message: "Category created successfully",
        data: category,
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

// Get All Categories - Public
router.get("/", async (req: Request, res: Response) => {
  try {
    const categories = await getAllCategories();

    return res.status(200).json({
      success: true,
      message: "Categories retrieved successfully",
      data: categories,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Something went wrong";

    return res.status(500).json({
      success: false,
      message,
    });
  }
});

// Get Category By ID - Public
router.get("/:id", async (req: Request, res: Response) => {
  try {
    const category = await getCategoryById(req.params.id);

    return res.status(200).json({
      success: true,
      message: "Category retrieved successfully",
      data: category,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Something went wrong";

    return res.status(404).json({
      success: false,
      message,
    });
  }
});

// Update Category - Admin only
router.put(
  "/:id",
  authenticate,
  authorize(UserRole.ADMIN),
  async (req: Request, res: Response) => {
    try {
      const { name, description } = req.body;

      if (!name) {
        return res.status(400).json({
          success: false,
          message: "Category name is required",
        });
      }

      const category = await updateCategory(req.params.id, {
        name,
        description,
      });

      return res.status(200).json({
        success: true,
        message: "Category updated successfully",
        data: category,
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

// Delete Category - Admin only
router.delete(
  "/:id",
  authenticate,
  authorize(UserRole.ADMIN),
  async (req: Request, res: Response) => {
    try {
      await deleteCategory(req.params.id);

      return res.status(200).json({
        success: true,
        message: "Category deleted successfully",
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