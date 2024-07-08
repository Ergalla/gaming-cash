import { Request, Response } from "express";

export const login = async (req: Request, res: Response) => {
  res.send("login");
};

export const register = async (req: Request, res: Response) => {
  res.send("register");
};
