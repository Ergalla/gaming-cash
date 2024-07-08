import { Request, Response } from "express";
import prisma from "../../prisma/prisma.js";
import path, { dirname } from "path";
import { fileURLToPath } from "url";
import bcryptjs from "bcryptjs";
import { toPng } from "jdenticon";
import fs from "node:fs";
import generateToken from "../../utils/generateToken.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export const register = async (req: Request, res: Response) => {
  try {
    const { email, username, password } = req.body;

    if (!email || !username || !password) {
      return res.status(400).json({ error: "Отсутствуют обязательные поля" });
    }

    const existingUser = await prisma.user.findFirst({
      where: { OR: [{ username }, { email }] },
    });

    if (existingUser && existingUser.username === username) {
      return res
        .status(400)
        .json({ error: "Пользователь с таким именем уже существует" });
    }

    if (existingUser && existingUser.email === email) {
      return res
        .status(400)
        .json({ error: "Пользователь с такой почтой уже существует" });
    }

    const hashedPassword = await bcryptjs.hash(password, 10);

    const png = toPng(`${username}${Date.now()}`, 256);
    const avatarName = `${username}_${Date.now()}.png`;
    const avatarPath = path.join(__dirname, "../../uploads", avatarName);
    fs.writeFileSync(avatarPath, png);

    const user = await prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
        avatarUrl: `/uploads/${avatarName}`,
      },
    });

    if (user) {
      generateToken(user.id, res);

      res.json({
        id: user.id,
        username: user.username,
        email: user.email,
        avatarUrl: user.avatarUrl,
      });
    } else {
      res.status(400).json({
        error: "Ошибка при регистрации, неверные данные пользователя",
      });
    }
  } catch (e) {
    console.error("Register error", e);
    res.status(500).json({ error: "Ошибка на сервере" });
  }
};

export const login = async (req: Request, res: Response) => {
  res.send("login");
};
