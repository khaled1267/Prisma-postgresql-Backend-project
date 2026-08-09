import prisma from "../../lib/prisma";

interface CreateReviewInput {
  productId: string;
  rating: number;
  comment?: string;
}

// Create Review
export const createReview = async (
  userId: string,
  data: CreateReviewInput
) => {
  const { productId, rating, comment } = data;

  // Check product
  const product = await prisma.product.findFirst({
    where: {
      id: productId,
      isDeleted: false,
    },
  });

  if (!product) {
    throw new Error("Product not found");
  }

  // Rating validation
  if (rating < 1 || rating > 5) {
    throw new Error("Rating must be between 1 and 5");
  }

  // Prevent duplicate review
  const existingReview = await prisma.review.findFirst({
    where: {
      userId,
      productId,
      isDeleted: false,
    },
  });

  if (existingReview) {
    throw new Error("You have already reviewed this product");
  }

  return prisma.review.create({
    data: {
      userId,
      productId,
      rating,
      comment,
    },
    include: {
      product: true,
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  });
};

// Get All Reviews
export const getAllReviews = async () => {
  return prisma.review.findMany({
    where: {
      isDeleted: false,
    },
    include: {
      product: true,
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};

// Get Review By ID
export const getReviewById = async (id: string) => {
  const review = await prisma.review.findFirst({
    where: {
      id,
      isDeleted: false,
    },
    include: {
      product: true,
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  });

  if (!review) {
    throw new Error("Review not found");
  }

  return review;
};

// Update Review
export const updateReview = async (
  id: string,
  userId: string,
  data: {
    rating?: number;
    comment?: string;
  }
) => {
  const review = await prisma.review.findFirst({
    where: {
      id,
      isDeleted: false,
    },
  });

  if (!review) {
    throw new Error("Review not found");
  }

  // Only review owner can update
  if (review.userId !== userId) {
    throw new Error("You can only update your own review");
  }

  if (data.rating !== undefined) {
    if (data.rating < 1 || data.rating > 5) {
      throw new Error("Rating must be between 1 and 5");
    }
  }

  return prisma.review.update({
    where: {
      id,
    },
    data: {
      rating: data.rating,
      comment: data.comment,
    },
    include: {
      product: true,
    },
  });
};

// Soft Delete Review
export const deleteReview = async (
  id: string,
  userId: string,
  isAdmin: boolean
) => {
  const review = await prisma.review.findFirst({
    where: {
      id,
      isDeleted: false,
    },
  });

  if (!review) {
    throw new Error("Review not found");
  }

  // Only owner or admin can delete
  if (!isAdmin && review.userId !== userId) {
    throw new Error("You can only delete your own review");
  }

  return prisma.review.update({
    where: {
      id,
    },
    data: {
      isDeleted: true,
    },
  });
};