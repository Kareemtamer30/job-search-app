import { UserModel } from "../../models/user.model.js";
import {asyncHandler} from "../../utils/error/error.res.js";

export const banUser = asyncHandler(async (req, res) => {
    const { userId, banned } = req.body;

    try {
        const user = await UserModel.findByIdAndUpdate(
            userId,
            { bannedAt: banned ? new Date() : null },
            { new: true }
        );

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({ message: banned ? "User banned" : "User unbanned", user });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

export const approveCompany = asyncHandler(async (req, res) => {
    const { companyId } = req.body;

    try {
        const company = await CompanyModel.findByIdAndUpdate(
            companyId,
            { approvedByAdmin: true },
            { new: true }
        );

        if (!company) {
            return res.status(404).json({ message: "Company not found" });
        }

        res.status(200).json({ message: "Company approved", company });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
});