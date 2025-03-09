import { Schema, model } from "mongoose";

// Define the Company schema
export const companySchema = new Schema(
    {
        companyName: { type: String, required: true, unique: true, trim: true },
        description: { type: String, required: true, trim: true },
        industry: { type: String, required: true, trim: true },
        address: { type: String, required: true, trim: true },
        numberOfEmployees: {
            type: String,
            required: true,
            enum: [
                "1-10",
                "11-50",
                "51-200",
                "201-500",
                "501-1000",
                "1000+",
            ],
            default: "1-10",
        },
        companyEmail: { type: String, required: true, unique: true, trim: true, lowercase: true },
        createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
        logo: {
            secure_url: { type: String, default: "" },
            public_id: { type: String, default: "" },
        },
        coverPic: {
            secure_url: { type: String, default: "" },
            public_id: { type: String, default: "" },
        },
        HRs: [{ type: Schema.Types.ObjectId, ref: "User" }], // Array of User references
        bannedAt: { type: Date, default: null },
        deletedAt: { type: Date, default: null },
        legalAttachment: {
            secure_url: { type: String, default: "" },
            public_id: { type: String, default: "" },
        },
        approvedByAdmin: { type: Boolean, default: false },
    },
    {
        timestamps: true, // Adds createdAt and updatedAt fields
    }
);

// Create the Company model
export const CompanyModel = model("Company", companySchema);