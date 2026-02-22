import { type Request, type Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";
import { type AuthRequest } from "../middlewares/authMiddleware.js";
import * as UserService from "../services/userService.js";

export const getAllUsers = async (req: AuthRequest, res: Response) => {
  if (req.user?.role !== "ADMIN") {
    return res.status(403).json({ message: "Доступ запрещен" });
  }

  try {
    const users = await UserService.getAllUsers();
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Ошибка получения пользователей" });
  }
};

export const getUserById = async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  if (req.user?.role !== "ADMIN" && req.user?.userId !== Number(id)) {
    return res.status(403).json({ message: "Доступ запрещен" });
  }

  try {
    const user = await UserService.getUserById(Number(id));
    if (!user) {
      return res.status(404).json({ message: "Пользователь не найден" });
    }
    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Ошибка получения пользователя" });
  }
};

export const toggleUserStatus = async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  if (req.user?.role !== "ADMIN" && req.user?.userId !== Number(id)) {
    return res.status(403).json({ message: "Доступ запрещен" });
  }

  try {
    const user = await UserService.toggleUserStatus(Number(id));
    res.json({
      message: `Пользователь ${user.isActive ? "разблокирован" : "заблокирован"}`,
    });
  } catch (error) {
    console.error(error);
  }
};

// const prisma = new PrismaClient();

// export const getAllUsers = async (req: AuthRequest, res: Response) => {
//   try {
//     const currentUserRole = req.user?.role;

//     if (currentUserRole !== "ADMIN") {
//       return res.status(403).json({ message: "Доступ запрещен" });
//     }
//     const users = await prisma.user.findMany({
//       select: {
//         id: true,
//         fullName: true,
//         birthDate: true,
//         email: true,
//         role: true,
//         isActive: true,
//         createdAt: true,
//       },
//     });
//     res.json(users);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Ошибка получения пользователей" });
//   }
// };

// export const getUserById = async (req: AuthRequest, res: Response) => {
//   try {
//     const { id } = req.params;
//     const currentUserId = req.user?.userId;
//     const currentUserRole = req.user?.role;

//     if (currentUserRole !== "ADMIN" && currentUserId !== Number(id)) {
//       return res.status(403).json({ message: "Доступ запрещен" });
//     }
//     const user = await prisma.user.findUnique({
//       where: { id: Number(id) },
//       select: {
//         id: true,
//         fullName: true,
//         birthDate: true,
//         email: true,
//         role: true,
//         isActive: true,
//         createdAt: true,
//       },
//     });
//     if (!user) {
//       return res.status(404).json({ message: "Пользователь не найден" });
//     }
//     res.json(user);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Ошибка получения пользователя" });
//   }
// };

// export const toggleUserStatus = async (req: AuthRequest, res: Response) => {
//   try {
//     const { id } = req.params;
//     const currentUserId = req.user?.userId;
//     const currentUserRole = req.user?.role;

//     if (currentUserRole !== "ADMIN" && currentUserId !== Number(id)) {
//       return res.status(403).json({ message: "Доступ запрещен" });
//     }
//     const user = await prisma.user.findUnique({ where: { id: Number(id) } });
//     if (!user) {
//       return res.status(404).json({ message: "Пользователь не найден" });
//     }
//     await prisma.user.update({
//       where: { id: Number(id) },
//       data: { isActive: !user.isActive },
//     });
//     res.json({
//       message: `Пользователь ${user.isActive ? "заблокирован" : "разблокирован"}`,
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Ошибка изменения статуса пользователя" });
//   }
// };
