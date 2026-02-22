import { type Request, type Response, type NextFunction } from "express";
import jwt from "jsonwebtoken";
import { prisma } from "../prisma.js";
import { is } from "zod/locales";

// for type safety
export interface AuthRequest extends Request {
  user?: { userId: number; role: string };
}

export const authenticateToken = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Отсутствует токен" });
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_ACCESS_SECRET!) as {
      userId: number;
      role: string;
    };

    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
      select: { isActive: true },
    });
    if (!user || !user.isActive) {
      return res.status(403).json({ message: "Пользователь заблокирован" });
    }

    req.user = payload;
    next();
  } catch (error) {
    console.error(error);
    res.status(403).json({ message: "Неверный токен" });
  }
};
