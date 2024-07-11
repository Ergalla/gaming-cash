import express from "express";
import fs from "fs";
import cookieParser from "cookie-parser";
import cors from "cors";
import authRoutes from "./routes/auth-route.js";
import messageRoutes from "./routes/message-route.js";
import userRoutes from "./routes/user-route.js";

import dotenv from "dotenv";
dotenv.config();

const app = express();

app.use(cors());
app.use(cookieParser());
app.use(express.json());

app.set("view engine", "pug");
app.use("/uploads", express.static("uploads"));

if (!fs.existsSync("uploads")) {
  fs.mkdirSync("uploads");
}

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/messages", messageRoutes);

app.listen(5000, () => {
  console.log("Server listening on port 5000");
});
