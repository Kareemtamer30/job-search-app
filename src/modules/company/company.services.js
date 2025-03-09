import { CompanyModel } from "../../models/company.model.js";
import {asyncHandler} from "../../utils/error/error.res.js";

export const addCompany = asyncHandler(async (req, res) => {
    const { companyName, companyEmail, industry, address, numberOfEmployees } = req.body;
    const userId = req.user._id; // Authenticated user ID

    try {
        // Check if company email or name already exists
        const existingCompany = await CompanyModel.findOne({
            $or: [{ companyName }, { companyEmail }],
        });
        if (existingCompany) {
            return res.status(400).json({ message: "Company name or email already exists" });
        }

        // Create new company
        const company = new CompanyModel({
            companyName,
            companyEmail,
            industry,
            address,
            numberOfEmployees,
            createdBy: userId,
        });
        await company.save();

        res.status(201).json({ message: "Company added successfully", company });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

export const updateCompany = asyncHandler(async (req, res) => {
    const { companyId } = req.params;
    const updateData = req.body;
    const userId = req.user._id; // Authenticated user ID

    try {
        // Find the company
        const company = await CompanyModel.findById(companyId);
        if (!company) {
            return res.status(404).json({ message: "Company not found" });
        }

        // Check if the user is the company owner
        if (company.createdBy.toString() !== userId.toString()) {
            return res.status(403).json({ message: "Only the company owner can update the data" });
        }

        // Update company data (excluding legalAttachment)
        const updatedCompany = await CompanyModel.findByIdAndUpdate(
            companyId,
            { $set: updateData },
            { new: true }
        );

        res.status(200).json({ message: "Company updated successfully", company: updatedCompany });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

export const softDeleteCompany = asyncHandler(async (req, res) => {
    const { companyId } = req.params;
    const userId = req.user._id; // Authenticated user ID
    const userRole = req.user.role; // Authenticated user role

    try {
        // Find the company
        const company = await CompanyModel.findById(companyId);
        if (!company) {
            return res.status(404).json({ message: "Company not found" });
        }

        // Check if the user is the company owner or an admin
        if (company.createdBy.toString() !== userId.toString() && userRole !== "admin") {
            return res.status(403).json({ message: "Only the company owner or admin can delete the company" });
        }

        // Soft delete the company
        company.deletedAt = new Date();
        await company.save();

        res.status(200).json({ message: "Company soft deleted successfully", company });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

export const getCompanyWithJobs = asyncHandler(async (req, res) => {
    const { companyId } = req.params;

    try {
        const company = await CompanyModel.findById(companyId).populate("jobs");
        if (!company) {
            return res.status(404).json({ message: "Company not found" });
        }

        res.status(200).json({ company });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

export const searchCompanyByName = asyncHandler(async (req, res) => {
    const { name } = req.query;

    try {
        const companies = await CompanyModel.find({
            companyName: { $regex: name, $options: "i" }, // Case-insensitive search
        });

        res.status(200).json({ companies });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

export const uploadCompanyLogo = asyncHandler(async (req, res) => {
    const { companyId } = req.params;
    const logo = req.file.path; // File path from multer

    try {
        const company = await CompanyModel.findByIdAndUpdate(
            companyId,
            { logo },
            { new: true }
        );

        res.status(200).json({ message: "Company logo uploaded successfully", company });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

export const uploadCompanyCoverPic = asyncHandler(async (req, res) => {
    const { companyId } = req.params;
    const coverPic = req.file.path; // File path from multer

    try {
        const company = await CompanyModel.findByIdAndUpdate(
            companyId,
            { coverPic },
            { new: true }
        );

        res.status(200).json({ message: "Company cover picture uploaded successfully", company });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

export const deleteCompanyLogo = asyncHandler(async (req, res) => {
    const { companyId } = req.params;

    try {
        const company = await CompanyModel.findByIdAndUpdate(
            companyId,
            { logo: null },
            { new: true }
        );

        res.status(200).json({ message: "Company logo deleted successfully", company });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

export const deleteCompanyCoverPic =asyncHandler(async (req, res) => {
    const { companyId } = req.params;

    try {
        const company = await CompanyModel.findByIdAndUpdate(
            companyId,
            { coverPic: null },
            { new: true }
        );

        res.status(200).json({ message: "Company cover picture deleted successfully", company });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
});