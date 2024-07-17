import { Request, Response } from "express";
import prisma from "../../prisma/prisma.js";
import { getReceiverSocketId, io } from "../socket/socket.js";

export const sendMessage = async (req: Request, res: Response) => {
  try {
    const { message } = req.body;
    const receiverId = parseInt(req.params.receiverId);
    const senderId = req.user.id;

    if (!receiverId || !message || !senderId) {
      return res.status(400).json({ error: "Отсутствуют обязательные поля" });
    }

    if (senderId === receiverId) {
      return res
        .status(400)
        .json({ error: "Нельзя отправлять сообщения самому себе" });
    }

    let conversation = await prisma.conversation.findFirst({
      where: { participantIds: { hasEvery: [senderId, receiverId] } },
    });

    if (!conversation) {
      conversation = await prisma.conversation.create({
        data: {
          participantIds: { set: [senderId, receiverId] },
          participants: { connect: [{ id: senderId }, { id: receiverId }] },
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
          updatedAt: newMessage.createdAt,
          messages: {
            connect: {
              id: newMessage.id,
            },
          },
        },
      });
    }

    const receiverSocketId = getReceiverSocketId(receiverId);

    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", newMessage);
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

    const conversations = await prisma.conversation.findMany({
      where: {
        participantIds: { has: authUserId },
      },
      select: {
        messages: {
          orderBy: {
            createdAt: "desc",
          },
          take: 1,
          select: {
            body: true,
            createdAt: true,
          },
        },
        participants: {
          where: { id: { not: authUserId } },
          select: {
            id: true,
            username: true,
            avatarUrl: true,
          },
        },
      },
      orderBy: {
        updatedAt: "desc",
      },
    });

    return res.json(conversations);
  } catch (e) {
    console.error("Get conversations error", e);
    res.status(500).json({ error: "Ошибка на сервере" });
  }
};
