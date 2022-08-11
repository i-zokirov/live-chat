import Message from "../../mongoose-data-models/messageModel.js";
import User from "../../mongoose-data-models/userModel.js";

export const handleMessage = async function (payload, callback) {
    const socket = this;
    const {
        type,
        date,
        message,
        from,
        to,
        senderSocketId,
        senderName,
        callType,
    } = payload;
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
        console.info(error);
        return callback({ error: "Database error!" });
    }

    if (type === "Call") {
        newMessage.message = `${senderName} invited for ${callType} call. Join using this link: - http://localhost:3000/videochat/${newMessage._id}`;
        await newMessage.save();
    }

    // Acknowledge creation
    callback({ data: newMessage });

    // if receiver is online, emit the new message
    const receiver = onlineUsers.get(to);
    if (receiver) {
        socket.to(receiver).emit("message:created", {
            message:
                newMessage.type === "Call"
                    ? `${senderName} invited for ${callType} call. Join using this link: - http://localhost:3000/videochat/${newMessage._id}`
                    : newMessage.message,
            senderSocketId: senderSocketId,
            messageId: newMessage._id.toString(),
            senderName: senderName,
            date: newMessage.date,
            chatId: from,
            type: newMessage.type,
        });
    }
};

export const fetchVideoChatData = async function (videochatId, callback) {
    const socket = this;
    try {
        const message = await Message.findById(videochatId).populate(
            "sender",
            "name email avatar"
        );

        const participants = [];

        for (let id of message.participants) {
            const user = await User.findById(id).select("name email avatar");
            participants.push(user);
        }

        callback({ videochat: message, participants });
    } catch (error) {
        console.log(error);
        return callback({ error: "Database error!" });
    }
};

export const loadMessagesHandler = async function (props, callback) {
    try {
        const { chatId, userId } = props;

        const messages = await Message.find({
            participants: { $all: [chatId, userId] },
        }).populate("sender", "name");

        const constructedMessages = messages.map((message) => {
            return {
                senderName: message.sender.name,
                message: message.message,
                party:
                    userId === message.sender._id.toString()
                        ? "sender"
                        : "recipient",
                type: message.type,
                date: message.date,
            };
        });

        callback({ constructedMessages });
    } catch (error) {
        console.log(`ERROR ON RETRIEVING MESSAGES`);
        console.log(error);
        callback({ error: "Messages couldn`t be retrieved" });
    }
};
