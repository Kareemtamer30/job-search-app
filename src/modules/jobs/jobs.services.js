import { JobOpportunityModel } from '../../models/job-opportunity.model.js';
import { UserModel } from '../../models/user.model.js';
import { CompanyModel } from '../../models/company.model.js';
import { ApplicationModel } from '../../models/application.model.js';
import {asyncHandler} from "../../utils/error/error.res.js";


// Add Job
export const addJob = asyncHandler(async (req, res) => {
    const job = new JobOpportunityModel({
        ...req.body,
        addedBy: req.user._id, // Assuming req.user is set by authentication middleware
    });

    try {
        await job.save();
        res.status(201).json(job);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Update Job
export const updateJob = asyncHandler(async (req, res) => {
    try {
        const job = await JobOpportunityModel.findById(req.params.id);
        if (!job) return res.status(404).json({ message: 'Job not found' });

        // Ensure only the owner can update the job
        if (job.addedBy.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'You are not authorized to update this job' });
        }

        Object.assign(job, req.body);
        job.updatedBy = req.user._id;
        await job.save();
        res.json(job);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Delete Job
export const deleteJob = asyncHandler(async (req, res) => {
    try {
        const job = await JobOpportunityModel.findById(req.params.id);
        if (!job) return res.status(404).json({ message: 'Job not found' });

        // Ensure only the HR related to the job company can delete the job
        const company = await CompanyModel.findById(job.companyId);
        if (!company || !company.hrs.includes(req.user._id)) {
            return res.status(403).json({ message: 'You are not authorized to delete this job' });
        }

        await job.remove();
        res.json({ message: 'Job deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get all Jobs or a specific one for a specific company
export const getJobs = asyncHandler(async (req, res) => {
    const { companyId, jobId } = req.params;
    const { skip = 0, limit = 10, sort = '-createdAt', search } = req.query;

    try {
        let query = { companyId };
        if (jobId) query._id = jobId;
        if (search) query.jobTitle = { $regex: search, $options: 'i' };

        const jobs = await JobOpportunityModel.find(query)
            .skip(parseInt(skip))
            .limit(parseInt(limit))
            .sort(sort);

        const totalCount = await JobOpportunityModel.countDocuments(query);
        res.json({ jobs, totalCount });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get all Jobs that match the filters
export const getFilteredJobs = asyncHandler(async (req, res) => {
    const { workingTime, jobLocation, seniorityLevel, jobTitle, technicalSkills } = req.query;
    const { skip = 0, limit = 10, sort = '-createdAt' } = req.query;

    try {
        let query = {};
        if (workingTime) query.workingTime = workingTime;
        if (jobLocation) query.jobLocation = jobLocation;
        if (seniorityLevel) query.seniorityLevel = seniorityLevel;
        if (jobTitle) query.jobTitle = { $regex: jobTitle, $options: 'i' };
        if (technicalSkills) query.technicalSkills = { $in: technicalSkills.split(',') };

        const jobs = await JobOpportunityModel.find(query)
            .skip(parseInt(skip))
            .limit(parseInt(limit))
            .sort(sort);

        const totalCount = await JobOpportunityModel.countDocuments(query);
        res.json({ jobs, totalCount });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get all applications for a specific Job
export const getJobApplications = asyncHandler(async (req, res) => {
    const { jobId } = req.params;
    const { skip = 0, limit = 10, sort = '-createdAt' } = req.query;

    try {
        const job = await JobOpportunityModel.findById(jobId).populate({
            path: 'applications',
            options: { skip: parseInt(skip), limit: parseInt(limit), sort },
            populate: { path: 'userId', select: '-password' }, // Exclude password from user data
        });

        if (!job) return res.status(404).json({ message: 'Job not found' });

        // Ensure only the company owner or HR can view the applications
        const company = await CompanyModel.findById(job.companyId);
        if (!company || !(company.owner.toString() === req.user._id.toString() || company.hrs.includes(req.user._id))) {
            return res.status(403).json({ message: 'You are not authorized to view these applications' });
        }

        res.json(job.applications);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Apply to Job
export const applyToJob = asyncHandler(async (req, res) => {
    try {
        const application = new ApplicationModel({
            ...req.body,
            jobId: req.params.jobId,
        });

        await application.save();
        res.status(201).json(application);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Accept or Reject an Applicant
export const acceptRejectApplicant = asyncHandler(async (req, res) => {
    try {
        const application = await ApplicationModel.findById(req.body.applicationId).populate('userId');
        if (!application) return res.status(404).json({ message: 'Application not found' });

        const job = await JobOpportunityModel.findById(application.jobId);
        if (!job) return res.status(404).json({ message: 'Job not found' });

        // Ensure only the HR can accept/reject the applicant
        const company = await CompanyModel.findById(job.companyId);
        if (!company || !company.hrs.includes(req.user._id)) {
            return res.status(403).json({ message: 'You are not authorized to perform this action' });
        }

        application.status = req.body.status;
        await application.save();

        // Send email to the applicant
        const emailContent = req.body.status === 'accepted' ? 'Congratulations! You have been accepted.' : 'We regret to inform you that your application has been rejected.';
        // Assuming you have a function to send emails
        sendEmail(application.userId.email, 'Application Status', emailContent);

        res.json(application);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});