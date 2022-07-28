import mongoose from "mongoose";

const messageSchema = mongoose.Schema(
    {
        type: {
            type: String,
            enum: ["Text", "Image", "File"],
            default: "Text",
            required: true,
        },
        message: {
            type: String,
            required: true,
        },
        participants: {
            type: Array,
            required: true,
        },
        sender: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        date: {
            type: Date,
            default: new Date(),
            required: true,
        },
    },
    {
        timesamps: true,
    }
);

const Message = mongoose.model("Message", messageSchema);
export default Message;
