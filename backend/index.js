import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import connectDB from "./config/connectMongoDB.js";
import { notFound, errorHandler } from "./middleware/errorHandlers.js";
import userRoutes from "./routers/userRoutes.js";
import messageRoutes from "./routers/messageRoutes.js";

import dotenv from "dotenv";
import {
    handleMessage,
    fetchVideoChatData,
} from "./controllers/socket/messageController.js";

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
        console.log(userId);
        onlineUsers.set(userId, socket.id);
    });
    socket.on("message:create", handleMessage);
    socket.on("fetch-videochatData", fetchVideoChatData);
    socket.on("join-room", ({ videochatId: roomId, user }) => {
        socket.join(roomId);
        socket.to(roomId).emit("user-connected", user);

        socket.on("disconnect", () => {
            console.log("User disconnected");
            socket.to(roomId).emit("user-disconnected", user);
        });
    });
});

// ROUTE HANDLERS
app.use("/api/users", userRoutes);
app.use("/api/messages", messageRoutes);

// ERROR HANDLERS
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
});
