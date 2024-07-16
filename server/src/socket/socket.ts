import { Server } from "socket.io";
import http from "http";
import express from "express";

const app = express();

const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: ["http://localhost:5173"], methods: ["GET", "POST"] },
});

export const getReceiverSocketId = (receiverId: number) =>
  userSocketMap[receiverId];

const userSocketMap: { [key: number]: number } = {};

io.on("connection", (socket) => {
  console.log("New client connected", socket.id);

  const userId = parseInt(socket.handshake.query.userId as string);

  if (userId) userSocketMap[userId] = parseInt(socket.id);

  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  socket.on("disconnect", () => {
    console.log("Client disconnected", socket.id);
    delete userSocketMap[userId];
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});

export { app, io, server };
