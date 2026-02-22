import { prisma } from "../prisma.js";

// const prisma = new PrismaClient();

export const getAllUsers = async () => {
  return await prisma.user.findMany({
    select: {
      id: true,
      fullName: true,
      email: true,
      role: true,
      isActive: true,
    },
  });
};

export const getUserById = async (id: number) => {
  const user = await prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      fullName: true,
      birthDate: true,
      email: true,
      role: true,
      isActive: true,
    },
  });
  if (!user) {
    throw new Error("USER_NOT_FOUND");
  }
  return user;
};

export const toggleUserStatus = async (id: number) => {
  const user = await prisma.user.findUnique({ where: { id } });
  if (!user) {
    throw new Error("USER_NOT_FOUND");
  }
  return await prisma.user.update({
    where: { id },
    data: { isActive: !user.isActive },
  });
};
