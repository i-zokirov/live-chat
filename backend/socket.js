import {
    handleMessage,
    fetchVideoChatData,
    loadMessagesHandler,
} from "./controllers/socket/messageController.js";
import {
    addDMHandler,
    getDMsHandler,
} from "./controllers/socket/userController.js";

global.onlineUsers = new Map();
const socketConnectionManager = function (socket, io) {
    socket.on("add-user", (userId) => {
        console.log(userId);
        onlineUsers.set(userId, socket.id);
    });
    socket.on("message:create", handleMessage);
    socket.on("messages:read", loadMessagesHandler);
    socket.on("fetch-videochatData", fetchVideoChatData);
    socket.on("join-room", ({ videochatId: roomId, user }) => {
        socket.join(roomId);
        socket.to(roomId).emit("user-connected", user);

        socket.on("disconnect", () => {
            console.log("User disconnected");
            socket.to(roomId).emit("user-disconnected", user);
        });
    });

    socket.on("DMs:create", addDMHandler);
    socket.on("DMs:read", getDMsHandler);
};

export default socketConnectionManager;
