import { type Request, type Response } from "express";
import jwt from "jsonwebtoken";
import { registerSchema, loginSchema } from "../schemas/authSchema.js";
import * as AuthService from "../services/authService.js";

export const register = async (req: Request, res: Response) => {
  //valid
  const validation = registerSchema.safeParse(req.body);
  if (!validation.success) {
    return res.status(400).json({ errors: validation.error.format() });
  }
  try {
    const newUser = await AuthService.registerUser(validation.data);
    res.status(201).json(newUser);
  } catch (error: any) {
    if (error.message === "USER_ALREADY_EXISTS") {
      return res
        .status(400)
        .json({ message: "Пользователь с таким email уже существует" });
      res.status(500).json({ message: "Ошибка ркгистрации пользователя" });
    }
  }
};

export const login = async (req: Request, res: Response) => {
  //valid
  const validation = loginSchema.safeParse(req.body);
  if (!validation.success) {
    return res.status(400).json({ errors: validation.error.format() });
  }

  try {
    const { email, password } = validation.data;
    const user = await AuthService.validateUserCredentials(email, password);

    if (!user) {
      return res.status(400).json({ message: "Неверный email или пароль" });
    } else if (!user.isActive) {
      return res.status(403).json({ message: "Ваш аккаунт заблокирован" });
    }

    const tokens = AuthService.generateTokens(user);
    await AuthService.updateRefreshToken(user.id, tokens.refreshToken);

    res.json({
      ...tokens,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Ошибка сервера" });
  }
};

export const refresh = async (req: Request, res: Response) => {
  const { refreshToken } = req.body;
  if (!refreshToken) {
    return res.status(401).json({ message: "Отсутствует refresh token" });
  }

  try {
    const payload = jwt.verify(
      refreshToken,
      process.env.JWT_REFRESH_SECRET!,
    ) as any;
    const tokens = AuthService.generateTokens({
      id: payload.userId,
      role: payload.role,
    });
    await AuthService.updateRefreshToken(payload.userId, tokens.refreshToken);
    res.json(tokens);
  } catch (error) {
    console.error(error);
    res.status(401).json({ message: "Неверный refresh token" });
  }
};
// const prisma = new PrismaClient();

// export const register = async (req: Request, res: Response) => {
//   //valid
//   const validation = registerSchema.safeParse(req.body);
//   if (!validation.success) {
//     return res
//       .status(400)
//       .json({ message: "Ошибка валидации", errors: validation.error.format() });
//   }
//   try {
//     const { fullName, birthDate, email, password, role } = validation.data;

//     // check user already exists
//     const existingUser = await prisma.user.findUnique({ where: { email } });

//     if (existingUser) {
//       return res
//         .status(400)
//         .json({ message: "Пользователь с таким email уже существует" });
//     }

//     // hash pass
//     const hashedPassword = await bcrypt.hash(password, 10);

//     // create user
//     const newUser = await prisma.user.create({
//       data: {
//         fullName,
//         birthDate: new Date(birthDate),
//         email,
//         password: hashedPassword,
//         role: role || "USER",
//       },
//     });

//     const { password: _, ...userWithoutPassword } = newUser;

//     res.status(201).json(userWithoutPassword);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Ошибка ркгистрации пользователя" });
//   }
// };

// const generateTokens = (user: { id: number; role: any }) => {
//   const accessToken = jwt.sign(
//     { userId: user.id, role: user.role },
//     process.env.JWT_ACCESS_SECRET!,
//     { expiresIn: "15m" },
//   );

//   const refreshToken = jwt.sign(
//     { userId: user.id, role: user.role },
//     process.env.JWT_REFRESH_SECRET!,
//     { expiresIn: "7d" },
//   );

//   return { accessToken, refreshToken };
// };

// export const login = async (req: Request, res: Response) => {
//   //valid
//   const validation = loginSchema.safeParse(req.body);
//   if (!validation.success) {
//     return res
//       .status(400)
//       .json({ message: "Ошибка валидации", errors: validation.error.format() });
//   }

//   try {
//     const { email, password } = validation.data;
//     const user = await prisma.user.findUnique({ where: { email } });

//     if (!user || !(await bcrypt.compare(password, user.password))) {
//       return res.status(400).json({ message: "Неверный email или пароль" });
//     } else if (!user.isActive) {
//       return res.status(403).json({ message: "Ваш аккаунт заблокирован" });
//     }

//     const tokens = generateTokens(user);

//     await prisma.user.update({
//       where: { id: user.id },
//       data: { refreshToken: tokens.refreshToken },
//     });

//     res.json({
//       ...tokens,
//       user: {
//         id: user.id,
//         fullName: user.fullName,
//         email: user.email,
//         role: user.role,
//       },
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Ошибка сервера" });
//   }
// };

// export const refresh = async (req: Request, res: Response) => {
//   const { refreshToken } = req.body;
//   if (!refreshToken) {
//     return res.status(401).json({ message: "Отсутствует refresh token" });
//   }

//   try {
//     const payload = jwt.verify(
//       refreshToken,
//       process.env.JWT_REFRESH_SECRET!,
//     ) as { userId: number; role: string };

//     const user = await prisma.user.findUnique({
//       where: { id: payload.userId },
//     });

//     if (!user || user.refreshToken !== refreshToken) {
//       return res.status(401).json({ message: "Неверный refresh token" });
//     }

//     const tokens = generateTokens(user);
//     await prisma.user.update({
//       where: { id: user.id },
//       data: { refreshToken: tokens.refreshToken },
//     });
//     res.json(tokens);
//   } catch (error) {
//     console.error(error);
//     res.status(401).json({ message: "Неверный refresh token" });
//   }
// };
