import { UserModel } from "../../models/user.model.js";
import { OTPModel } from "../../models/Otp.model.js";
import { generateOTP, hashOTP } from "../../utils/OTP/OtpGenerator.js";
import { sendOTPEmail } from "../../utils/email/email-services.js";
import { asyncHandler } from "../../utils/error/error.res.js";
import { generateTokens } from "../../utils/token/generatetoken.js";
import { OAuth2Client } from "google-auth-library";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// Sign Up
export const signUp = asyncHandler(async (req, res, next) => {
    const { firstName, lastName, email, password, mobileNumber,gender,DOB } = req.body;

    // Check if email already exists
    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
        return next(new Error("Email already exist",{cause:400}));
    }

    // Generate and hash OTP
    const otp = generateOTP(); // Generate a 4-digit OTP
    const hashedOTP = await hashOTP(otp);

    // Save OTP to database
    await OTPModel.create({
        email,
        code: hashedOTP,
        type: "confirmEmail",
        expiresIn: new Date(Date.now() + 10 * 60 * 1000), // 10 minutes
    });

    // Send OTP to user's email
    await sendOTPEmail(email, otp);

    // Save user to database
    const user = new UserModel({ firstName, lastName, email, password, mobileNumber,gender,DOB });
    await user.save();

    res.status(201).json({ message: "User registered successfully. Please confirm your email." });
});

// Confirm OTP
export const confirmOTP = asyncHandler(async (req, res, next) => {
    const { email, otp } = req.body;

    // Find the OTP record
    const otpRecord = await OTPModel.findOne({ email, type: "confirmEmail" });
    if (!otpRecord) {
       return next(new Error("Invalid OTP",{cause:400}))
    }

    // Check if OTP has expired
    if (otpRecord.expiresIn < new Date()) {
        return next (new Error("OTP expired",{cause:400}));
    }

    // Verify OTP
    const isOTPValid = await bcrypt.compare(otp, otpRecord.code);
    if (!isOTPValid) {
       // invalid otp , 400
        return next(new Error("invalid OTP",{cause:400}));
    }

    // Confirm user's email
    await UserModel.findOneAndUpdate({ email }, { isConfirmed: true });

    // Delete the OTP record
    await OTPModel.deleteOne({ _id: otpRecord._id });

    res.status(200).json({ message: "Email confirmed successfully" });
});


// sign in
export const signIn = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    try {
        // Find the user by email
        const user = await UserModel.findOne({ email, provider: "system" });
        if (!user) {
            return res.status(400).json({ message: "Invalid email or password" });
        }

        // Verify password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({ message: "Invalid email or password" });
        }

        // Generate tokens
        const { accessToken, refreshToken } = generateTokens(user._id);

        // Save refresh token to the user
        user.refreshToken = refreshToken;
        await user.save();

        res.status(200).json({ accessToken, refreshToken });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

// sign up with google

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export const signUpWithGoogle = asyncHandler(async (req, res) => {
    const { token } = req.body;

    try {
        // Verify Google token
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: process.env.GOOGLE_CLIENT_ID,
        });
        const payload = ticket.getPayload();

        // Check if user already exists
        let user = await UserModel.findOne({ email: payload.email });
        if (user) {
            return res.status(400).json({ message: "User already exists" });
        }

        // Create new user
        user = new UserModel({
            email: payload.email,
            firstName: payload.firstName,
            lastName: payload.lastName,
            provider: "google",
        });
        await user.save();

        // Generate tokens
        const { accessToken, refreshToken } = generateTokens(user._id);

        res.status(201).json({ accessToken, refreshToken });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
});


// login with google
export const loginWithGoogle = asyncHandler(async (req, res) => {
    const { token } = req.body;

    try {
        // Verify Google token
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: process.env.GOOGLE_CLIENT_ID,
        });
        const payload = ticket.getPayload();

        // Find the user
        const user = await UserModel.findOne({ email: payload.email, provider: "google" });
        if (!user) {
            return res.status(400).json({ message: "User not found" });
        }

        // Generate tokens
        const { accessToken, refreshToken } = generateTokens(user._id);

        // Save refresh token to the user
        user.refreshToken = refreshToken;
        await user.save();

        res.status(200).json({ accessToken, refreshToken });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
});


// send forget password otp's

export const sendOTPForForgetPassword = asyncHandler(async (req, res) => {
    const { email } = req.body;

    try {
        // Find the user
        const user = await UserModel.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Generate and hash OTP
        const otp = generateOTP();
        const hashedOTP = await hashOTP(otp);

        // Save OTP to database
        await OTPModel.create({
            email,
            code: hashedOTP,
            type: "forgetPassword",
            expiresIn: new Date(Date.now() + 10 * 60 * 1000), // 10 minutes
        });

        // Send OTP to user's email
        await sendEmail({
            to: [email],
            subject: "OTP for Password Reset",
            text: `Your OTP is: ${otp}. It will expire in 10 minutes.`,
        });

        res.status(200).json({ message: "OTP sent successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

// reset password
export const resetPassword = asyncHandler(async (req, res) => {
    const { email, otp, newPassword } = req.body;

    try {
        // Find the OTP record
        const otpRecord = await OTPModel.findOne({ email, type: "forgetPassword" });
        if (!otpRecord) {
            return res.status(400).json({ message: "Invalid OTP" });
        }

        // Check if OTP has expired
        if (otpRecord.expiresIn < new Date()) {
            return res.status(400).json({ message: "OTP has expired" });
        }

        // Verify OTP
        const isOTPValid = await bcrypt.compare(otp, otpRecord.code);
        if (!isOTPValid) {
            return res.status(400).json({ message: "Invalid OTP" });
        }

        // Find the user
        const user = await UserModel.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Hash the new password
        user.password = await bcrypt.hash(newPassword, 10);
        user.changeCredentialTime = new Date(); // Update change credential time
        await user.save();

        // Delete the OTP record
        await OTPModel.deleteOne({ _id: otpRecord._id });

        res.status(200).json({ message: "Password reset successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

// refresh token
export const refreshToken = asyncHandler(async (req, res) => {
    const { refreshToken } = req.body;

    try {
        // Verify the refresh token
        const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);

        // Find the user
        const user = await UserModel.findById(decoded.userId);
        if (!user || user.refreshToken !== refreshToken) {
            return res.status(401).json({ message: "Invalid refresh token" });
        }

        // Check if credentials have changed
        if (user.changeCredentialTime > new Date(decoded.iat * 1000)) {
            return res.status(401).json({ message: "Credentials have changed. Please log in again." });
        }

        // Generate a new access token
        const accessToken = jwt.sign({ userId: user._id }, process.env.ACCESS_TOKEN_SECRET, {
            expiresIn: "1h",
        });

        res.status(200).json({ accessToken });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
});











