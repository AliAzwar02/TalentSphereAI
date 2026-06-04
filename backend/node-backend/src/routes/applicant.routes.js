import express from 'express';
import { protect, authorize } from '../middleware/auth.js';
import { handleFileUpload } from '../middleware/upload.js';
import { applyForJob, getUserApplications, searchApplicants } from '../controllers/application.controller.js';
import { saveJob, getSavedJobs, unsaveJob } from '../controllers/savedjobs.controller.js';

const router = express.Router();

router.post(
  '/apply/:jobId',
  protect,
  authorize('applicant'),
  handleFileUpload,
  applyForJob
);

router.post(
  '/cv/search',
  searchApplicants
);

router.post(
  '/save-job',
  protect,
  authorize('applicant'),
  saveJob
);

router.get(
  '/saved-jobs',
  protect,
  authorize('applicant'),
  getSavedJobs
);

router.post(
  '/unsave-job',
  protect,
  authorize('applicant'),
  unsaveJob
);

router.get(
  '/user/:userId',
  protect,
  authorize('applicant'),
  getUserApplications
);

export default router;