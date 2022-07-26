import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import { v4 as uuidv4 } from "uuid";
import connectDB from "./config/connectMongoDB.js";
import { notFound, errorHandler } from "./middleware/errorHandlers.js";
import userRoutes from "./routers/userRoutes.js";

import dotenv from "dotenv";

dotenv.config();

connectDB();

const app = express();
app.use(express.json());
app.use(cors());

const server = http.createServer(app);

const io = new Server(server);

global.onlineUsers = new Map();

io.on("connection", (socket) => {
    global.chatSocket = socket;
    socket.on("add-user", (userId) => {
        onlineUsers.set(userId, socket.id);
    });
    socket.on("send-message", (data) => {
        const receiver = onlineUsers.get(data.to);
        if (receiver) {
            socket.to(receiver).emit("receive-message", {
                message: data.message,
                senderSocketId: socket.id,
                messageId: uuidv4(),
                senderName: data.senderName,
                date: data.date,
                chatId: data.from,
            });
        }
    });
});

// ROUTE HANDLERS
app.use("/api/users", userRoutes);

// ERROR HANDLERS
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
});
