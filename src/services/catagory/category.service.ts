import prisma from "../../lib/prisma";

interface CreateCategoryInput {
  name: string;
  description?: string;
}

// Create Category
export const createCategory = async (data: CreateCategoryInput) => {
  const { name, description } = data;

  const existingCategory = await prisma.category.findUnique({
    where: {
      name,
    },
  });

  if (existingCategory && !existingCategory.isDeleted) {
    throw new Error("Category already exists");
  }

  const category = await prisma.category.create({
    data: {
      name,
      description,
    },
  });

  return category;
};

// Get All Categories
export const getAllCategories = async () => {
  return prisma.category.findMany({
    where: {
      isDeleted: false,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};

// Get Category By ID
export const getCategoryById = async (id: string) => {
  const category = await prisma.category.findFirst({
    where: {
      id,
      isDeleted: false,
    },
  });

  if (!category) {
    throw new Error("Category not found");
  }

  return category;
};

// Update Category
export const updateCategory = async (
  id: string,
  data: CreateCategoryInput
) => {
  const category = await prisma.category.findFirst({
    where: {
      id,
      isDeleted: false,
    },
  });

  if (!category) {
    throw new Error("Category not found");
  }

  return prisma.category.update({
    where: {
      id,
    },
    data: {
      name: data.name,
      description: data.description,
    },
  });
};

// Soft Delete Category
export const deleteCategory = async (id: string) => {
  const category = await prisma.category.findFirst({
    where: {
      id,
      isDeleted: false,
    },
  });

  if (!category) {
    throw new Error("Category not found");
  }

  return prisma.category.update({
    where: {
      id,
    },
    data: {
      isDeleted: true,
    },
  });
};