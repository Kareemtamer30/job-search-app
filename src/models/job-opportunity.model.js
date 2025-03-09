import { Schema, model } from "mongoose";

// Define enums for jobLocation, workingTime, and seniorityLevel
export const jobLocationTypes = { onsite: "onsite", remotely: "remotely", hybrid: "hybrid" };
export const workingTimeTypes = { partTime: "part-time", fullTime: "full-time" };
export const seniorityLevelTypes = {
    fresh: "fresh",
    junior: "junior",
    midLevel: "mid-level",
    senior: "senior",
    teamLead: "team-lead",
    cto: "cto",
};

// Define the JobOpportunity schema
export const jobOpportunitySchema = new Schema(
    {
        jobTitle: { type: String, required: true, trim: true },
        jobLocation: { type: String, enum: Object.values(jobLocationTypes), required: true },
        workingTime: { type: String, enum: Object.values(workingTimeTypes), required: true },
        seniorityLevel: { type: String, enum: Object.values(seniorityLevelTypes), required: true },
        jobDescription: { type: String, required: true, trim: true },
        technicalSkills: [{ type: String, trim: true }], // Array of technical skills
        softSkills: [{ type: String, trim: true }], // Array of soft skills
        addedBy: { type: Schema.Types.ObjectId, ref: "User", required: true }, // HR who added the job
        updatedBy: { type: Schema.Types.ObjectId, ref: "User", default: null }, // HR who last updated the job
        closed: { type: Boolean, default: false }, // Whether the job is closed
        companyId: { type: Schema.Types.ObjectId, ref: "Company", required: true }, // Reference to the company
    },
    {
        timestamps: true, // Adds createdAt and updatedAt fields
    }
);

// Create the JobOpportunity model
export const JobOpportunityModel = model("JobOpportunity", jobOpportunitySchema);