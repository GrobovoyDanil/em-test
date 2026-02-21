import { z } from "zod";

export const registerSchema = z.object({
  fullName: z
    .string()
    .min(2, { message: "Имя должно быть не менее 2 символов" }),
  email: z.string().email({ message: "Неверный формат email" }),
  password: z
    .string()
    .min(6, { message: "Пароль должен быть не менее 6 символов" }),
  birthDate: z
    .string()
    .datetime({ precision: 0 })
    .or(z.string().regex(/^\d{4}-\d{2}-\d{2}$/)),
  role: z.enum(["USER", "ADMIN"]).optional(),
});

export const loginSchema = z.object({
  email: z.string().email({ message: "Неверный формат email" }),
  password: z.string().min(1, { message: "Ведите пароль" }),
});
