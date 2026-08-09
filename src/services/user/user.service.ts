import prisma from "../../lib/prisma";

interface UpdateUserInput {
  name?: string;
  email?: string;
}

// Get All Users
export const getAllUsers = async () => {
  return prisma.user.findMany({
    where: {
      isDeleted: false,
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      isDeleted: true,
      createdAt: true,
      updatedAt: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};

// Get User By ID
export const getUserById = async (id: string) => {
  const user = await prisma.user.findFirst({
    where: {
      id,
      isDeleted: false,
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      isDeleted: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  if (!user) {
    throw new Error("User not found");
  }

  return user;
};

// Update User
export const updateUser = async (
  id: string,
  data: UpdateUserInput
) => {
  const user = await prisma.user.findFirst({
    where: {
      id,
      isDeleted: false,
    },
  });

  if (!user) {
    throw new Error("User not found");
  }

  if (data.email) {
    const existingUser = await prisma.user.findFirst({
      where: {
        email: data.email,
        id: {
          not: id,
        },
        isDeleted: false,
      },
    });

    if (existingUser) {
      throw new Error("Email already exists");
    }
  }

  return prisma.user.update({
    where: {
      id,
    },
    data,
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      isDeleted: true,
      createdAt: true,
      updatedAt: true,
    },
  });
};

// Soft Delete User
export const deleteUser = async (id: string) => {
  const user = await prisma.user.findFirst({
    where: {
      id,
      isDeleted: false,
    },
  });

  if (!user) {
    throw new Error("User not found");
  }

  return prisma.user.update({
    where: {
      id,
    },
    data: {
      isDeleted: true,
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      isDeleted: true,
    },
  });
};