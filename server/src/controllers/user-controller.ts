import { Request, Response } from "express";
import prisma from "../../prisma/prisma.js";

export const getUserById = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);

    if (!id) {
      return res
        .status(400)
        .json({ error: "Отсутствует обязательный параметр id" });
    }

    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        username: true,
        avatarUrl: true,
      },
    });

    if (!user) {
      return res.status(404).json({ error: "Пользователь не найден" });
    }

    res.json(user);
  } catch (e) {
    console.error("Get user by id error", e);
    res.status(500).json({ error: "Ошибка на сервере" });
  }
};

export const updateUser = async (req: Request, res: Response) => {
  res.send("updateUser");
};
