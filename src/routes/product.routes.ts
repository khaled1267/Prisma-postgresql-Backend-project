import { Router, Request, Response } from "express";
import {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
} from "../services/product/product.service";
import {
  authenticate,
  authorize,
} from "../middleware/auth.middleware";
import { UserRole } from "@prisma/client";

const router = Router();

// Create Product - ADMIN only
router.post(
  "/",
  authenticate,
  authorize(UserRole.ADMIN),
  async (req: Request, res: Response) => {
    try {
      const {
        title,
        description,
        price,
        stock,
        image,
        categoryId,
      } = req.body;

      if (!title || price === undefined || stock === undefined || !categoryId) {
        return res.status(400).json({
          success: false,
          message: "Title, price, stock and categoryId are required",
        });
      }

      const product = await createProduct({
        title,
        description,
        price: Number(price),
        stock: Number(stock),
        image,
        categoryId,
      });

      return res.status(201).json({
        success: true,
        message: "Product created successfully",
        data: product,
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

// Get All Products - Public
router.get("/", async (req: Request, res: Response) => {
  try {
    const products = await getAllProducts();

    return res.status(200).json({
      success: true,
      message: "Products retrieved successfully",
      data: products,
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

// Get Product By ID - Public
router.get("/:id", async (req: Request, res: Response) => {
  try {
    const product = await getProductById(req.params.id as string);

    return res.status(200).json({
      success: true,
      message: "Product retrieved successfully",
      data: product,
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

// Update Product - ADMIN only
router.put(
  "/:id",
  authenticate,
  authorize(UserRole.ADMIN),
  async (req: Request, res: Response) => {
    try {
      const {
        title,
        description,
        price,
        stock,
        image,
        categoryId,
      } = req.body;

      const product = await updateProduct(req.params.id as string, {
        title,
        description,
        price:
          price !== undefined
            ? Number(price)
            : undefined,
        stock:
          stock !== undefined
            ? Number(stock)
            : undefined,
        image,
        categoryId,
      });

      return res.status(200).json({
        success: true,
        message: "Product updated successfully",
        data: product,
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

// Soft Delete Product - ADMIN only
router.delete(
  "/:id",
  authenticate,
  authorize(UserRole.ADMIN),
  async (req: Request, res: Response) => {
    try {
      await deleteProduct(req.params.id as string);

      return res.status(200).json({
        success: true,
        message: "Product deleted successfully",
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