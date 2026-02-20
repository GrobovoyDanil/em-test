import express from "express";
import dotenv from "dotenv";
import { register } from "./controllers/authController.js";

dotenv.config();

const app = express();

app.use(express.json());

app.post("/api/register", register);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Сервер на порту ${PORT}`);
});
