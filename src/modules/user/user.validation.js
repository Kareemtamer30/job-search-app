import Joi from "joi";

export const updateUserAccountSchema = Joi.object({
    mobileNumber: Joi.string().optional(),
    DOB: Joi.date().optional(),
    firstName: Joi.string().min(2).max(50).optional(),
    lastName: Joi.string().min(2).max(50).optional(),
    gender: Joi.string().valid("male", "female").optional(),
});

export const updatePasswordSchema = Joi.object({
    oldPassword: Joi.string().required().messages({
        "any.required": "Old password is required",
    }),
    newPassword: Joi.string().min(6).required().messages({
        "string.min": "New password must be at least 6 characters long",
        "any.required": "New password is required",
    }),
});

