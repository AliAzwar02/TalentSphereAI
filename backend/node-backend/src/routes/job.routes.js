import express from 'express';
import { protect, authorize } from '../middleware/auth.js';
import {
  createJob,
  getJobs,
  getJobById,
  updateJob,
  getJobsByRecruiter,
  deleteJob
} from '../controllers/job.controller.js';
import Job from '../models/Job.js';

const router = express.Router();

router.get(
  '/', 
  getJobs
);

router.get(
  '/:id', 
  getJobById
);

router.post(
  '/', 
  protect, 
  authorize('recruiter'), 
  createJob
);

router.put(
  '/:id', 
  protect, 
  authorize('recruiter'), 
  updateJob
);

router.get(
  '/:recruiterId/jobs',
  protect,
  authorize('recruiter'),
  getJobsByRecruiter
);

router.delete('/:id', protect, authorize('recruiter'), deleteJob);

router.post('/:id/increment-applications', async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) {
      return res.status(404).send('Job not found');
    }
    await job.incrementApplications();
    res.send('Applications incremented');
  } catch (error) {
    res.status(500).send(error.message);
  }
});

router.post('/:id/increment-views', async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) {
      return res.status(404).send('Job not found');
    }
    await job.incrementViews();
    res.send('Views incremented');
  } catch (error) {
    res.status(500).send(error.message);
  }
});

export default router;