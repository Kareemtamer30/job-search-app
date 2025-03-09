import {Router} from "express";
const router = Router();
import * as jobsService from "./jobs.services.js";
import {authenticate} from "../../middlewares/authentication.js";
import {authorize} from "../../middlewares/authorization.js";
import {validation} from "../../middlewares/validation.js";
import {acceptRejectApplicantSchema, addJobSchema, applyToJobSchema, updateJobSchema} from "./jobs.validation.js";

// Add Job
router.post(
    '/jobs',
    authenticate,
    authorize(['hr', 'owner']),
    validation(addJobSchema),
    jobsService.addJob
);

// Update Job
router.put(
    '/jobs/:id',
    authenticate,
    authorize(['owner']),
    validation(updateJobSchema),
    jobsService.updateJob
);

// Delete Job
router.delete(
    '/jobs/:id',
    authenticate,
    authorize(['hr']),
    jobsService.deleteJob
);

// Get all Jobs or a specific one for a specific company
router.get('/companies/:companyId/jobs', jobsService.getJobs);
router.get('/companies/:companyId/jobs/:jobId', jobsService.getJobs);

// Get all Jobs that match the filters
router.get('/jobs/filter', jobsService.getFilteredJobs);

// Get all applications for a specific Job
router.get(
    '/jobs/:jobId/applications',
    authenticate,
    authorize(['hr', 'owner']),
    jobsService.getJobApplications
);

// Apply to Job
router.post(
    '/jobs/:jobId/apply',
    authenticate,
    authorize(['user']),
    validation(applyToJobSchema),
    jobsService.applyToJob
);

// Accept or Reject an Applicant
router.post(
    '/applications/accept-reject',
    authenticate,
    authorize(['hr']),
    validation(acceptRejectApplicantSchema),
    jobsService. acceptRejectApplicant
);




export default router;