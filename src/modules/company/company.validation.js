import Joi from "joi";

export const addCompanySchema = Joi.object({
    companyName: Joi.string().required().messages({
        "any.required": "Company name is required",
    }),
    companyEmail: Joi.string().email().required().messages({
        "string.email": "Company email must be a valid email address",
        "any.required": "Company email is required",
    }),
    industry: Joi.string().required().messages({
        "any.required": "Industry is required",
    }),
    address: Joi.string().required().messages({
        "any.required": "Address is required",
    }),
    numberOfEmployees: Joi.string().required().messages({
        "any.required": "Number of employees is required",
    }),
})
export const updateCompanySchema = Joi.object({
    companyName: Joi.string().messages({
        "string.base": "Company name must be a string",
    }),
    companyEmail: Joi.string().email().messages({
        "string.email": "Company email must be a valid email address",
    }),
    industry: Joi.string().messages({
        "string.base": "Industry must be a string",
    }),
    address: Joi.string().messages({
        "string.base": "Address must be a string",
    }),
    numberOfEmployees: Joi.string().messages({
        "string.base": "Number of employees must be a string",
    }),
});
