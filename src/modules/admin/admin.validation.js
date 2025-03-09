import Joi from "joi";

export const banUserSchema = Joi.object({
    userId: Joi.string().required().messages({
        "any.required": "User ID is required",
    }),
    banned: Joi.boolean().required().messages({
        "any.required": "Banned status is required",
    }),
});

export const approveCompanySchema = Joi.object({
    companyId: Joi.string().required().messages({
        "any.required": "Company ID is required",
    }),
});