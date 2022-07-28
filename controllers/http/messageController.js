import Message from "../../mongoose-data-models/MessageModel.js";
import expressAsyncHandler from "express-async-handler";

// @desc:   save message
// @route:  POST /api/messages
// @access: Private
export const saveMessage = expressAsyncHandler(async (req, res) => {
    const { type, receivers, date } = req.body;

    const newMessage = await Message.create({
        type,
        sender: req.user._id,
        date,
        participants: [req.user._id.toString(), ...receivers],
    });

    if (newMessage) {
        res.json({ msg: "Message successfully saved to the DB!" });
    } else {
        res.status(400);
        throw new Error("Failed to save the message to the DB!");
    }
});

// @desc:   retrieve messages
// @route:  GET /api/messages
// @access: Private
export const retrieveMessages = expressAsyncHandler(async (req, res) => {
    const { receiver } = req.query;
    const messages = await Message.find({
        participants: { $all: [receiver, req.user._id.toString()] },
    }).populate("sender", "name");

    const constructedMessages = messages.map((message) => {
        return {
            senderName: message.sender.name,
            party:
                req.user._id.toString() === message.sender._id.toString()
                    ? "sender"
                    : "recipient",
            type: message.type,
            date: message.date,
        };
    });
    res.json(constructedMessages);
});
