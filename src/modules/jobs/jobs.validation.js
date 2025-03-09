import Joi from 'joi';
import {jobLocationTypes, seniorityLevelTypes, workingTimeTypes} from "../../models/job-opportunity.model.js";

// Joi schema for adding a job
export const addJobSchema = Joi.object({
    jobTitle: Joi.string().required().trim(),
    jobLocation: Joi.string().valid(...Object.values(jobLocationTypes)).required(),
    workingTime: Joi.string().valid(...Object.values(workingTimeTypes)).required(),
    seniorityLevel: Joi.string().valid(...Object.values(seniorityLevelTypes)).required(),
    jobDescription: Joi.string().required().trim(),
    technicalSkills: Joi.array().items(Joi.string().trim()),
    softSkills: Joi.array().items(Joi.string().trim()),
    companyId: Joi.string().required(), // Assuming companyId is passed as a string
});

// Joi schema for updating a job
export const updateJobSchema = Joi.object({
    jobTitle: Joi.string().trim(),
    jobLocation: Joi.string().valid(...Object.values(jobLocationTypes)),
    workingTime: Joi.string().valid(...Object.values(workingTimeTypes)),
    seniorityLevel: Joi.string().valid(...Object.values(seniorityLevelTypes)),
    jobDescription: Joi.string().trim(),
    technicalSkills: Joi.array().items(Joi.string().trim()),
    softSkills: Joi.array().items(Joi.string().trim()),
    closed: Joi.boolean(),
});

// Joi schema for applying to a job
export const applyToJobSchema = Joi.object({
    userId: Joi.string().required(), // Assuming userId is passed as a string
    jobId: Joi.string().required(), // Assuming jobId is passed as a string
    resume: Joi.string().required(), // Assuming resume is a URL or file path
    coverLetter: Joi.string().optional(),
});

// Joi schema for accepting/rejecting an applicant
export const acceptRejectApplicantSchema = Joi.object({
    applicationId: Joi.string().required(), // Assuming applicationId is passed as a string
    status: Joi.string().valid('accepted', 'rejected').required(),
});