import prisma from "../../lib/prisma";
import { ProductStatus } from "@prisma/client";

interface CreateProductInput {
  title: string;
  description?: string;
  price: number;
  stock: number;
  image?: string;
  categoryId: string;
}

// Create Product
export const createProduct = async (data: CreateProductInput) => {
  const { title, description, price, stock, image, categoryId } = data;

  const category = await prisma.category.findFirst({
    where: {
      id: categoryId,
      isDeleted: false,
    },
  });

  if (!category) {
    throw new Error("Category not found");
  }

  const product = await prisma.product.create({
    data: {
      title,
      description,
      price,
      stock,
      image,
      categoryId,
      status:
        stock > 0 ? ProductStatus.ACTIVE : ProductStatus.OUT_OF_STOCK,
    },
    include: {
      category: true,
    },
  });

  return product;
};

// Get All Products
export const getAllProducts = async () => {
  return prisma.product.findMany({
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

// Get Product By ID
export const getProductById = async (id: string) => {
  const product = await prisma.product.findFirst({
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

// Update Product
export const updateProduct = async (
  id: string,
  data: Partial<CreateProductInput>
) => {
  const product = await prisma.product.findFirst({
    where: {
      id,
      isDeleted: false,
    },
  });

  if (!product) {
    throw new Error("Product not found");
  }

  if (data.categoryId) {
    const category = await prisma.category.findFirst({
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
    status = ProductStatus.OUT_OF_STOCK;
  } else if (product.status === ProductStatus.OUT_OF_STOCK) {
    status = ProductStatus.ACTIVE;
  }

  return prisma.product.update({
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

// Soft Delete Product
export const deleteProduct = async (id: string) => {
  const product = await prisma.product.findFirst({
    where: {
      id,
      isDeleted: false,
    },
  });

  if (!product) {
    throw new Error("Product not found");
  }

  return prisma.product.update({
    where: {
      id,
    },
    data: {
      isDeleted: true,
    },
  });
};