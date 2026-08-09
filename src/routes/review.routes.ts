import { Router, Response } from "express";
import {
  createReview,
  getAllReviews,
  getReviewById,
  updateReview,
  deleteReview,
} from "../services/review/review.service";
import {
  authenticate,
  AuthenticatedRequest,
} from "../middleware/auth.middleware";
import { UserRole } from "@prisma/client";

const router = Router();

// Create Review - Logged-in user
router.post(
  "/",
  authenticate,
  async (req: AuthenticatedRequest, res: Response) => {
    try {
      const { productId, rating, comment } = req.body;

      if (!productId || rating === undefined) {
        return res.status(400).json({
          success: false,
          message: "Product ID and rating are required",
        });
      }

      const review = await createReview(req.user!.userId, {
        productId,
        rating: Number(rating),
        comment,
      });

      return res.status(201).json({
        success: true,
        message: "Review created successfully",
        data: review,
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

// Get All Reviews - Public
router.get("/", async (req, res) => {
  try {
    const reviews = await getAllReviews();

    return res.status(200).json({
      success: true,
      message: "Reviews retrieved successfully",
      data: reviews,
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

// Get Review By ID - Public
router.get("/:id", async (req, res) => {
  try {
    const review = await getReviewById(req.params.id);

    return res.status(200).json({
      success: true,
      message: "Review retrieved successfully",
      data: review,
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

// Update Review - Owner only
router.put(
  "/:id",
  authenticate,
  async (req: AuthenticatedRequest, res: Response) => {
    try {
      const { rating, comment } = req.body;

      const review = await updateReview(
        req.params.id as string,
        req.user!.userId,
        {
          rating:
            rating !== undefined ? Number(rating) : undefined,
          comment,
        }
      );

      return res.status(200).json({
        success: true,
        message: "Review updated successfully",
        data: review,
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

// Delete Review - Owner or Admin
router.delete(
  "/:id",
  authenticate,
  async (req: AuthenticatedRequest, res: Response) => {
    try {
      const isAdmin = req.user!.role === UserRole.ADMIN;

      await deleteReview(
        req.params.id as string,
        req.user!.userId,
        isAdmin
      );

      return res.status(200).json({
        success: true,
        message: "Review deleted successfully",
        data: null,
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

export default router;