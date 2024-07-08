import express from "express";
import {
  sendMessage,
  getMessages,
  getUserConversations,
} from "../controllers/message-controller.js";
import authenticateToken from "../middleware/auth-middleware.js";

const router = express.Router();

router.post("/send/:receiverId", authenticateToken, sendMessage);
router.get("/conversations", authenticateToken, getUserConversations);
router.get("/:userToChatId", authenticateToken, getMessages);

export default router;
