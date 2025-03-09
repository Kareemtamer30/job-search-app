import { Schema, model } from "mongoose";

// Define the Chat schema
export const chatSchema = new Schema(
    {
        senderId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
            validate: {
                validator: async function (value) {
                    // Check if the sender is an HR or company owner
                    const user = await this.model("User").findById(value);
                    return user && (user.role === "hr" || user.role === "companyOwner");
                },
                message: "Sender must be an HR or company owner.",
            },
        },
        receiverId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        messages: [
            {
                message: { type: String, required: true },
                senderId: { type: Schema.Types.ObjectId, ref: "User", required: true },
                timestamp: { type: Date, default: Date.now },
            },
        ],
    },
    {
        timestamps: true, // Adds createdAt and updatedAt fields
    }
);

// Create the Chat model
export const ChatModel = model("Chat", chatSchema);