import { Request, Response } from "express";
import prisma from "../../prisma/prisma.js";
import path, { dirname } from "path";
import { fileURLToPath } from "url";
import { ValidationError, validationResult } from "express-validator";
import bcryptjs from "bcryptjs";
import { toPng } from "jdenticon";
import fs from "node:fs";
import generateToken from "../../utils/generateToken.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export const register = async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res
        .status(400)
        .json({ error: (errors.array() as ValidationError[])[0].msg });
    }

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
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res
        .status(400)
        .json({ error: (errors.array() as ValidationError[])[0].msg });
    }

    const { usernameOrEmail, password } = req.body;
    if (!usernameOrEmail || !password) {
      return res.status(400).json({ error: "Отсутствуют обязательные поля" });
    }

    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ username: usernameOrEmail }, { email: usernameOrEmail }],
      },
    });
    if (!existingUser) {
      return res.status(400).json({ error: "Неверный логин или пароль" });
    }

    const isPasswordCorrect = await bcryptjs.compare(
      password,
      existingUser.password,
    );
    if (!isPasswordCorrect) {
      return res.status(400).json({ error: "Неверный логин или пароль" });
    }

    generateToken(existingUser.id, res);
    res.json({
      id: existingUser.id,
      username: existingUser.username,
      email: existingUser.email,
      avatarUrl: existingUser.avatarUrl,
    });
  } catch (e) {
    console.error("Login error", e);
    res.status(500).json({ error: "Ошибка на сервере" });
  }
};

export const logout = async (req: Request, res: Response) => {
  try {
    res.clearCookie("jwt");
    res.json({ message: "Вы успешно вышли из системы" });
  } catch (e) {
    console.error("Logout error", e);
    res.status(500).json({ error: "Ошибка на сервере" });
  }
};

export const getMe = async (req: Request, res: Response) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
    });

    if (!user) {
      return res.status(404).json({ error: "Пользователь не найден" });
    }

    res.json({
      id: user.id,
      username: user.username,
      email: user.email,
      avatarUrl: user.avatarUrl,
    });
  } catch (e) {
    console.error("GetMe error", e);
    res.status(500).json({ error: "Ошибка на сервере" });
  }
};
