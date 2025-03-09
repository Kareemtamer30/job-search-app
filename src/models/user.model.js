import { Schema, model } from "mongoose";
import bcrypt from "bcrypt";

// Define enums for gender, role, and provider
export const genderTypes = { male: "male", female: "female" };
export const roleTypes = { user: "user", admin: "admin" };
export const providerTypes = { google: "google", system: "system" };
export const OTPTypes = { confirmEmail: "confirmEmail", forgetPassword: "forgetPassword" };

// Define the User schema
export const userSchema = new Schema(
    {
        firstName: { type: String, required: true, trim: true, minLength: 2, maxLength: 50 },
        lastName: { type: String, required: true, trim: true, minLength: 2, maxLength: 50 },
        email: { type: String, required: true, unique: true, trim: true, lowercase: true },
        password: { type: String, required: function () { return this.provider === providerTypes.system; } },
        provider: { type: String, enum: Object.values(providerTypes), default: providerTypes.system },
        gender: { type: String, enum: Object.values(genderTypes), required: true },
        DOB: {
            type: Date,
            required: true,
            validate: {
                validator: function (value) {
                    // Check if DOB is a valid date and the user is at least 18 years old
                    const currentDate = new Date();
                    const minDOB = new Date(currentDate.setFullYear(currentDate.getFullYear() - 18));
                    return value <= minDOB;
                },
                message: "User must be at least 18 years old.",
            },
        },
        mobileNumber: { type: String, trim: true },
        role: { type: String, enum: Object.values(roleTypes), default: roleTypes.user },
        isConfirmed: { type: Boolean, default: false },
        deletedAt: { type: Date, default: null },
        bannedAt: { type: Date, default: null },
        updatedBy: { type: Schema.Types.ObjectId, ref: "User", default: null },
        changeCredentialTime: { type: Date, default: null },
        profilePic: {
            secure_url: { type: String, default: "" },
            public_id: { type: String, default: "" },
        },
        coverPic: {
            secure_url: { type: String, default: "" },
            public_id: { type: String, default: "" },
        },
        OTP: [
            {
                code: { type: String, required: true }, // Hashed OTP code
                type: { type: String, enum: Object.values(OTPTypes), required: true }, // OTP type
                expiresIn: { type: Date, required: true }, // OTP expiration date
            },
        ],
    },
    {
        timestamps: true, // Adds createdAt and updatedAt fields
        toJSON: { virtuals: true }, // Include virtual fields in JSON output
        toObject: { virtuals: true }, // Include virtual fields in object output
    }
);

// Virtual field for username (firstName + lastName)
 userSchema.virtual("username").get(function () {
    return `${this.firstName} ${this.lastName}`;
});

// Hash password before saving
userSchema.pre("save", async function (next) {
    if (this.isModified("password")) {
        this.password = await bcrypt.hash(this.password, 8);
    }
    next();
});

// Hash OTP codes before saving
userSchema.pre("save", async function (next) {
    if (this.isModified("OTP")) {
        for (let otp of this.OTP) {
            if (otp.code) {
                otp.code = await bcrypt.hash(otp.code, 10);
            }
        }
    }
    next();
});

// Create the User model
export const UserModel = model("User", userSchema);