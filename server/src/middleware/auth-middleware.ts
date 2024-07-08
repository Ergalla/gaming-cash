import jwt, { JwtPayload } from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import prisma from "../../prisma/prisma.js";

interface DecodedToken extends JwtPayload {
  userId: number;
}

declare global {
  namespace Express {
    interface Request {
      user: {
        id: number;
      };
    }
  }
}

const authenticateToken = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const token = req.cookies.jwt;

    if (!token) return res.status(401).json({ error: "Нет доступа" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as DecodedToken;

    if (!decoded) return res.status(401).json({ error: "Нет доступа" });

    const existingUser = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: { id: true, username: true, email: true, avatarUrl: true },
    });
    if (!existingUser)
      return res.status(404).json({ error: "Пользователь не найден" });

    req.user = existingUser;

    next();
  } catch (e) {
    console.error("Auth error middleware", e);
    res.status(401).json({ error: "Нет доступа" });
  }
};

export default authenticateToken;
