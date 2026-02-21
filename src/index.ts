import express from "express";
import dotenv from "dotenv";
import { register, login, refresh } from "./controllers/authController.js";
import { authenticateToken } from "./middlewares/authMiddleware.js";
import {
  getAllUsers,
  getUserById,
  toggleUserStatus,
} from "./controllers/userController.js";

dotenv.config();

const app = express();

app.use(express.json());

app.post("/api/register", register);
app.post("/api/login", login);
app.post("/api/refresh", refresh);

app.get("/api/users", authenticateToken, getAllUsers);
app.get("/api/users/:id", authenticateToken, getUserById);
app.patch("/api/users/:id/toggle", authenticateToken, toggleUserStatus);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Сервер на порту ${PORT}`);
});
