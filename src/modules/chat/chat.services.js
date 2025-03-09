import { ChatModel } from '../../models/chat.model.js';
import {asyncHandler} from "../../utils/error/error.res.js";

// Get chat history with a specific user
export const getChatHistory = asyncHandler(async (req, res) => {
    const { userId } = req.params; // The user ID to fetch chat history with
    const { skip = 0, limit = 50, sort = '-createdAt' } = req.query; // Pagination and sorting

    try {
        // Fetch chat history between the authenticated user and the specified user
        const chatHistory = await ChatModel.find({
            $or: [
                { sender: req.user._id, receiver: userId },
                { sender: userId, receiver: req.user._id },
            ],
        })
            .skip(parseInt(skip))
            .limit(parseInt(limit))
            .sort(sort);

        res.json(chatHistory);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});