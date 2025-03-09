import { Schema, model } from "mongoose";

// Define enums for application status
export const applicationStatusTypes = {
    pending: "pending",
    accepted: "accepted",
    viewed: "viewed",
    inConsideration: "in consideration",
    rejected: "rejected",
};

// Define the Application schema
export const applicationSchema = new Schema(
    {
        jobId: { type: Schema.Types.ObjectId, ref: "JobOpportunity", required: true }, // Reference to the job
        userId: { type: Schema.Types.ObjectId, ref: "User", required: true }, // Reference to the user (applier)
        userCV: {
            secure_url: {
                type: String,
                required: true,
                validate: {
                    validator: function (value) {
                        // Check if the URL ends with .pdf or has the correct MIME type
                        return value.endsWith(".pdf") || value.includes("/pdf");
                    },
                    message: "User CV must be a PDF file.",
                },
            },
            public_id: { type: String, required: true }, // Public ID for the CV file
        },
        status: {
            type: String,
            enum: Object.values(applicationStatusTypes),
            default: applicationStatusTypes.pending,
        },
    },
    {
        timestamps: true, // Adds createdAt and updatedAt fields
    }
);

// Create the Application model
export const ApplicationModel = model("Application", applicationSchema);