import { UserModel } from "../../models/user.model.js";
import { encrypt } from "../../utils/encryption/encryption-decryption.js";
import { decrypt } from "../../utils/encryption/encryption-decryption.js";
import {asyncHandler} from "../../utils/error/error.res.js";
import bcrypt from "bcrypt";


// update user account
export const updateUserAccount = asyncHandler(async (req, res) => {
    const { mobileNumber, DOB, firstName, lastName, gender } = req.body;
    const userId = req.user._id; // Authenticated user ID

    try {
        const updateData = { DOB, firstName, lastName, gender };

        // Encrypt mobileNumber if provided
        if (mobileNumber) {
            updateData.mobileNumber = encrypt(mobileNumber);
        }

        // Update user
        const updatedUser = await UserModel.findByIdAndUpdate(
            userId,
            updateData,
            { new: true }
        );

        res.status(200).json({ message: "User updated successfully", user: updatedUser });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
});


// log user data in
export const getLoggedInUserData = asyncHandler(async (req, res) => {
    const userId = req.user._id; // Authenticated user ID

    try {
        const user = await UserModel.findById(userId).select("-password -refreshToken");

        // Decrypt mobileNumber
        user.mobileNumber = decrypt(user.mobileNumber);

        res.status(200).json({ user });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
});


// get data from a profile
export const getProfileData = asyncHandler(async (req, res) => {
    const { userId } = req.params;

    try {
        const user = await UserModel.findById(userId).select("userName mobileNumber profilePic coverPic");

        // Decrypt mobileNumber
        user.mobileNumber = decrypt(user.mobileNumber);

        res.status(200).json({ user });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
});


// update password
export const updatePassword = asyncHandler(async (req, res) => {
    const { oldPassword, newPassword } = req.body;
    const userId = req.user._id; // Authenticated user ID

    try {
        const user = await UserModel.findById(userId);

        // Verify old password
        const isPasswordValid = await bcrypt.compare(oldPassword, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({ message: "Invalid old password" });
        }

        // Hash new password
        user.password = await bcrypt.hash(newPassword, 8);
        await user.save();

        res.status(200).json({ message: "Password updated successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
});


// upload profile pic
export const uploadProfilePic = asyncHandler(async (req, res) => {
    const userId = req.user._id; // Authenticated user ID
    const profilePic = req.file.path; // Path to the uploaded file

    try {
        const user = await UserModel.findByIdAndUpdate(
            userId,
            { profilePic },
            { new: true }
        );

        res.status(200).json({ message: "Profile picture uploaded successfully", user });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
});


// upload cover pic
export const uploadCoverPic = asyncHandler(async (req, res) => {
    const userId = req.user._id; // Authenticated user ID
    const coverPic = req.file.path; // Path to the uploaded file

    try {
        const user = await UserModel.findByIdAndUpdate(
            userId,
            { coverPic },
            { new: true }
        );

        res.status(200).json({ message: "Cover picture uploaded successfully", user });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
});


// delete profile pic
export const deleteProfilePic = asyncHandler(async (req, res) => {
    const userId = req.user._id; // Authenticated user ID

    try {
        const user = await UserModel.findByIdAndUpdate(
            userId,
            { profilePic: null },
            { new: true }
        );

        res.status(200).json({ message: "Profile picture deleted successfully", user });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

//delete cover pic
export const deleteCoverPic = asyncHandler(async (req, res) => {
    const userId = req.user._id; // Authenticated user ID

    try {
        const user = await UserModel.findByIdAndUpdate(
            userId,
            { coverPic: null },
            { new: true }
        );

        res.status(200).json({ message: "Cover picture deleted successfully", user });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
});


// soft delete
export const softDeleteAccount = asyncHandler(async (req, res) => {
    const userId = req.user._id; // Authenticated user ID

    try {
        await UserModel.findByIdAndUpdate(userId, { isDeleted: true });
        res.status(200).json({ message: "Account deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
});




