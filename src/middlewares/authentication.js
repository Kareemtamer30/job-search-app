// middleware/authMiddleware.js
import jwt from "jsonwebtoken";
import { UserModel } from "../models/user.model.js";

export const authenticate = async (req, res, next) => {
    try {
        // Get the token from the Authorization header
        const token = req.headers.authorization?.split(" ")[1];
        if (!token) {
          return next(new Error("No token provided",{cause:401}));
        }

        // Verify the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Find the user and attach to the request object
        const user = await UserModel.findById(decoded.userId);
        if (!user) {
            return next(new Error("user not found",{cause:404}))
        }

        req.user = user; // Attach the user to the request object
        next();
    } catch (error) {
        error.cause = 401; // Unauthorized
        next(error);
    }
};