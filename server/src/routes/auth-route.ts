import express from "express";
import {
  login,
  logout,
  register,
  getMe,
} from "../controllers/auth-controller.js";
import { body } from "express-validator";
import authenticateToken from "../middleware/auth-middleware.js";

const router = express.Router();

router.get("/me", authenticateToken, getMe);
router.post(
  "/register",
  body("email").trim().isEmail().withMessage("Неверная почта"),
  body("username")
    .trim()
    .isLength({ min: 3, max: 16 })
    .withMessage("Логин не может быть меньше 3 и больше 16 символов"),
  body("password")
    .trim()
    .isLength({ min: 6 })
    .withMessage("Пароль не может быть меньше 6 символов"),
  register,
);
router.post(
  "/login",
  body("usernameOrEmail")
    .trim()
    .isLength({ min: 3 })
    .withMessage("Логин не может быть меньше 3 символов"),
  body("password")
    .trim()
    .isLength({ min: 6 })
    .withMessage("Пароль не может быть меньше 6 символов"),
  login,
);
router.post("/logout", logout);

export default router;
