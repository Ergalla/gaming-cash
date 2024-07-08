import { Request, Response } from "express";
import prisma from "../../prisma/prisma.js";

export const sendMessage = async (req: Request, res: Response) => {
  try {
    const { message } = req.body;
    const receiverId = parseInt(req.params.receiverId);
    const senderId = req.user.id;

    if (!receiverId || !message || !senderId) {
      return res.status(400).json({ error: "Отсутствуют обязательные поля" });
    }

    let conversation = await prisma.conversation.findFirst({
      where: { participantIds: { hasEvery: [senderId, receiverId] } },
    });

    if (!conversation) {
      conversation = await prisma.conversation.create({
        data: {
          participantIds: { set: [senderId, receiverId] },
        },
      });
    }

    const newMessage = await prisma.message.create({
      data: {
        senderId,
        body: message,
        conversationId: conversation.id,
      },
    });

    if (newMessage) {
      await prisma.conversation.update({
        where: { id: conversation.id },
        data: {
          messages: {
            connect: {
              id: newMessage.id,
            },
          },
        },
      });
    }

    res.json({ message: "Сообщение отправлено" });
  } catch (e) {
    console.error("Send message error", e);
    res.status(500).json({ error: "Ошибка на сервере" });
  }
};

export const getMessages = async (req: Request, res: Response) => {
  try {
    const userToChatId = parseInt(req.params.userToChatId);
    const senderId = req.user.id;

    const conversation = await prisma.conversation.findFirst({
      where: { participantIds: { hasEvery: [senderId, userToChatId] } },
      include: {
        messages: {
          orderBy: {
            createdAt: "asc",
          },
        },
      },
    });

    if (!conversation) {
      return res.json([]);
    }

    return res.json(conversation.messages);
  } catch (e) {
    console.error("Get messages error", e);
    res.status(500).json({ error: "Ошибка на сервере" });
  }
};

export const getUserConversations = async (req: Request, res: Response) => {
  try {
    const authUserId = req.user.id;

    const users = await prisma.user.findMany({
      where: {
        id: {
          not: authUserId,
        },
      },
      select: {
        id: true,
        username: true,
        avatarUrl: true,
      },
    });

    return res.json(users);
  } catch (e) {
    console.error("Get conversations error", e);
    res.status(500).json({ error: "Ошибка на сервере" });
  }
};
