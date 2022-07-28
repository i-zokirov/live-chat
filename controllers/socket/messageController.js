import Message from "../../mongoose-data-models/MessageModel.js";

export const handleMessage = async function (payload, callback) {
    const socket = this;
    const { type, date, message, from, to, senderSocketId, senderName } =
        payload;
    let newMessage;
    try {
        newMessage = await Message.create({
            type,
            message,
            sender: from,
            date,
            participants: [from, to],
        });
        console.log(newMessage);
    } catch (error) {
        return callback({ error: "Database error!" });
    }

    // Acknowledge creation
    callback({ data: newMessage });

    // if receiver is online, emit the new message
    const receiver = onlineUsers.get(to);
    if (receiver) {
        socket.to(receiver).emit("message:created", {
            message: newMessage.message,
            senderSocketId: senderSocketId,
            messageId: newMessage._id.toString(),
            senderName: senderName,
            date: newMessage.date,
            chatId: from,
            type: newMessage.type,
        });
    }
};
