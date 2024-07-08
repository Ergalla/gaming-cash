import express from "express";
import { sendMessage } from "../controllers/message-controller.js";
import authenticateToken from "../middleware/auth-middleware.js";

const router = express.Router();

router.post("/send/:receiverId", authenticateToken, sendMessage);

export default router;
