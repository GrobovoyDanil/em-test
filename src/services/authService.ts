import { type Request, type Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";
import { registerSchema, loginSchema } from "../schemas/authSchema.js";
import { prisma } from "../prisma.js";

// const prisma = new PrismaClient();

export const generateTokens = (user: { id: number; role: string }) => {
  const accessToken = jwt.sign(
    { userId: user.id, role: user.role },
    process.env.JWT_ACCESS_SECRET!,
    { expiresIn: "15m" },
  );

  const refreshToken = jwt.sign(
    { userId: user.id, role: user.role },
    process.env.JWT_REFRESH_SECRET!,
    { expiresIn: "7d" },
  );

  return { accessToken, refreshToken };
};

export const registerUser = async (data: any) => {
  const { fullName, birthDate, email, password, role } = data;

  // check user already exists
  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) {
    throw new Error("USER_ALREADY_EXISTS");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  return await prisma.user.create({
    data: {
      fullName,
      birthDate: new Date(birthDate),
      email,
      password: hashedPassword,
      role: role || "USER",
    },
    select: {
      id: true,
      fullName: true,
      email: true,
      role: true,
      isActive: true,
    },
  });
};

export const validateUserCredentials = async (
  email: string,
  password: string,
) => {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || !(await bcrypt.compare(password, user.password))) {
    throw new Error("INVALID_CREDENTIALS");
  }
  return user;
};

export const updateRefreshToken = async (
  userId: number,
  refreshToken: string,
) => {
  await prisma.user.update({
    where: { id: userId },
    data: { refreshToken },
  });
};
