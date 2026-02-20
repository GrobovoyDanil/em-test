import { type Request, type Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const register = async (req: Request, res: Response) => {
  try {
    const { fullName, birthDate, email, password, role } = req.body;

    // check user already exists
    const existingUser = await prisma.user.findUnique({ where: { email } });

    if (existingUser) {
      return res
        .status(400)
        .json({ message: "Пользователь с таким email уже существует" });
    }

    // hash pass
    const hashedPassword = await bcrypt.hash(password, 10);

    // create user
    const newUser = await prisma.user.create({
      data: {
        fullName,
        birthDate: new Date(birthDate),
        email,
        password: hashedPassword,
        role: role || "USER",
      },
    });

    const { password: _, ...userWithoutPassword } = newUser;

    res.status(201).json(userWithoutPassword);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Ошибка ркгистрации пользователя" });
  }
};
