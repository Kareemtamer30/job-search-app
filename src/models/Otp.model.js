import { Schema, model } from "mongoose";

const OTPSchema = new Schema({
    email: { type: String, required: true },
    code: { type: String, required: true }, // Hashed OTP
    type: { type: String, enum: ["confirmEmail", "forgetPassword"], required: true },
    expiresIn: { type: Date, required: true }, // OTP expiration time
});

export const OTPModel = model("OTP", OTPSchema);