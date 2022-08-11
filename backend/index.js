import express from "express";
import http from "http";
import { Server } from "socket.io";
import path from "path";
import cors from "cors";
import connectDB from "./config/connectMongoDB.js";
import { notFound, errorHandler } from "./middleware/errorHandlers.js";
import userRoutes from "./routers/userRoutes.js";
import messageRoutes from "./routers/messageRoutes.js";
import socketConnectionManager from "./socket.js";

import dotenv from "dotenv";
dotenv.config();

connectDB();

// EXPRESS APP
const app = express();

// EXPRESS APP MIDDLEWARE
app.use(express.json());
app.use(cors());

// HTTP SERVER
const server = http.createServer(app);

// SOCKET SERVER
const io = new Server(server);
io.on("connection", function (socket) {
    socketConnectionManager(socket, io);
});

// ROUTE HANDLERS
app.use("/api/users", userRoutes);
app.use("/api/messages", messageRoutes);

if (process.env.NODE_ENV === "production") {
    const __dirname = path.resolve();
    app.use(express.static(path.join(__dirname, "/frontend/build")));
    app.get("*", (req, res) => {
        res.sendFile(
            path.resolve(__dirname, "frontend", "build", "index.html")
        );
    });
} else {
    app.get("/", (req, res) => {
        res.send("API is running!");
    });
}
// ERROR HANDLERS
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
});
