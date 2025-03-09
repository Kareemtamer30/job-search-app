// validation/authValidation.js
import Joi from "joi";
import joi from "joi";

// Sign Up Validation Schema
export const signUpSchema = Joi.object({
    firstName: Joi.string().min(2).max(50).required().messages({
        "string.min": "First name must be at least 2 characters long",
        "string.max": "First name cannot exceed 50 characters",
        "any.required": "First name is required",
    }),
    lastName: Joi.string().min(2).max(50).required().messages({
        "string.min": "Last name must be at least 2 characters long",
        "string.max": "Last name cannot exceed 50 characters",
        "any.required": "Last name is required",
    }),
    email: Joi.string().email().required().messages({
        "string.email": "Email must be a valid email address",
        "any.required": "Email is required",
    }),
    password: Joi.string().min(6).required().messages({
        "string.min": "Password must be at least 6 characters long",
        "any.required": "Password is required",
    }),
    mobileNumber: Joi.string().required().messages({
        "any.required": "Mobile number is required",
    }),
    gender:Joi.string().min(2).required().messages({
        "any.required": "Gender is required",
    }),
    DOB: Joi.date().min(2).required().messages({
        "any.required": "DOB is required",
    })
});

// Confirm OTP Validation Schema
export const confirmOTPSchema = Joi.object({
    email: Joi.string().email().required().messages({
        "string.email": "Email must be a valid email address",
        "any.required": "Email is required",
    }),
    otp: Joi.string().length(4).pattern(/^[1-9]+$/).required().messages({
        "string.length": "OTP must be exactly 4 digits",
        "string.pattern.base": "OTP must contain only numbers from 1 to 9",
        "any.required": "OTP is required",
    }),
});

export const signInSchema = Joi.object({
    email: Joi.string().email().required().messages({
        "string.email": "Email must be a valid email address",
        "any.required": "Email is required",
    }),
    password: Joi.string().min(6).required().messages({
        "string.min": "Password must be at least 6 characters long",
        "any.required": "Password is required",
    }),
});
export const signUpWithGoogleSchema = Joi.object({
    token: Joi.string().required().messages({
        "any.required": "Google token is required",
    }),
});


export const loginWithGoogleSchema = Joi.object({
    token: Joi.string().required().messages({
        "any.required": "Google token is required",
    }),
});

// Send OTP for Forget Password
export const sendOTPForForgetPasswordSchema = Joi.object({
    email: Joi.string().email().required().messages({
        "string.email": "Email must be a valid email address",
        "any.required": "Email is required",
    }),
});

// Reset Password
export const resetPasswordSchema = Joi.object({
    email: Joi.string().email().required().messages({
        "string.email": "Email must be a valid email address",
        "any.required": "Email is required",
    }),
    otp: Joi.string().length(4).pattern(/^[1-9]+$/).required().messages({
        "string.length": "OTP must be exactly 4 digits",
        "string.pattern.base": "OTP must contain only numbers from 1 to 9",
        "any.required": "OTP is required",
    }),
    newPassword: Joi.string().min(6).required().messages({
        "string.min": "Password must be at least 6 characters long",
        "any.required": "New password is required",
    }),
});

// Refresh Token
export const refreshTokenSchema = Joi.object({
    refreshToken: Joi.string().required().messages({
        "any.required": "Refresh token is required",
    }),
});