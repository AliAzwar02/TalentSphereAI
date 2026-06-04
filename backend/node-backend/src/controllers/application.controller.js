import Application from '../models/Application.js';
import Job from '../models/Job.js';
import asyncHandler from '../middleware/async.js';
import { sendMail } from '../config/nodemailer.js';
import axios from 'axios';
const FASTAPI_URL = process.env.FASTAPI_URL;

export const applyForJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.jobId);

    if (!job || job.status !== 'active') {
      return res.status(404).json({
        success: false,
        message: 'Job not found or is closed',
      });
    }

    const existingApplication = await Application.findOne({
      job: req.params.jobId,
      applicant: req.user._id,
    });

    if (existingApplication) {
      return res.status(400).json({
        success: false,
        message: 'Already applied for this job',
      });
    }

    let resumeUrl = null;
    let filename = null;
    if (req.file && req.file.cloudinaryUrl) {
      resumeUrl = req.file.cloudinaryUrl;
      filename = req.file.originalname || `resume-${req.user._id}.pdf`;
    } else {
      return res.status(400).json({
        success: false,
        message: 'Resume file is required',
      });
    }

    const application = await Application.create({
      job: req.params.jobId,
      applicant: req.user._id,
      resume: resumeUrl,
      coverLetter: req.body.coverLetter,
    });

    try {
      const fastapiResponse = await axios.post(`${FASTAPI_URL}/upload_cv/`, {
        cloudinary_url: resumeUrl,
        filename,
        job_id: req.params.jobId,
        applicant_id: req.user._id.toString()
      });
      console.log('FastAPI CV processing:', fastapiResponse.data);
    } catch (fastapiError) {
      console.error('Failed to process CV in FastAPI:', fastapiError.message);
    }

    return res.status(201).json({
      success: true,
      message: 'Application submitted successfully',
      data: application,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const searchApplicants = async (req, res) => {
  const { query, jobId } = req.body;

  if (!query || !jobId) {
    return res.status(400).json({
      success: false,
      message: 'Query and jobId are required',
    });
  }

  try {
    const fastapiResponse = await axios.post(`${FASTAPI_URL}/search_applicants/`, {
      query,
      job_id: jobId,
    });

    const applicants = fastapiResponse.data.applicants || [];

    if (!applicants.length) {
      return res.status(200).json({
        success: true,
        data: [],
      });
    }

    const applicantIds = applicants.map(applicant => applicant.applicant_id);

    const applications = await Application.find({
      job: jobId,
      applicant: { $in: applicantIds },
    })
      .populate('job')
      .populate('applicant', 'name email')
      .sort('-createdAt');

    const enrichedApplicants = applicants.map(applicant => {
      const application = applications.find(app => app.applicant._id.toString() === applicant.applicant_id);
      return {
        statement: applicant.statement,
        application
      };
    });

    return res.status(200).json(enrichedApplicants);
  } catch (error) {
    const status = error.response ? error.response.status : 500;
    const message = error.response?.data?.detail || error.message || 'Internal server error';
    return res.status(status).json({
      success: false,
      message,
    });
  }
};

export const updateApplicationStatus = async (req, res) => {
  try {
    const application = await Application.findById(req.params.id).populate('job').populate('applicant');

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found',
      });
    }

    if (application.job.recruiter.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this application',
      });
    }

    application.status = req.body.status;
    await application.save();

    if (req.body.status === 'shortlisted') {
      const applicantEmail = application.applicant.email;
      console.log(applicantEmail)
      const subject = 'Congratulations! You have been shortlisted';
      const text = `Dear ${application.applicant.name},\n\nCongratulations! You have been shortlisted for the position of ${application.job.title}. We will contact you soon with further details.\n\nBest regards,\n${application.job.company}`;

      sendMail(applicantEmail, subject, text).catch(err => {
        console.error('Failed to send shortlist email:', err);
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Application status updated successfully',
      data: application,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getApplications = asyncHandler(async (req, res) => {
  try {
    const applications = await Application.find()
      .populate('job')
      .populate('applicant', 'name email')
      .sort('-createdAt');

    return res.status(200).json({
      success: true,
      message: 'Applications retrieved successfully',
      data: applications,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

export const getUserApplications = asyncHandler(async (req, res) => {
  try {
    const applications = await Application.find({ applicant: req.params.userId })
      .populate('job')
      .populate('applicant', 'name email')
      .sort('-createdAt');

    return res.status(200).json(applications);
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

export const getRecruiterApplications = asyncHandler(async (req, res) => {
  try {
    const { jobId } = req.params;

    const applications = await Application.find({ job: jobId })
      .populate('job')
      .populate('applicant', 'name email')
      .sort('-createdAt');

    return res.status(200).json(applications);
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

export const getRecruiterJobs = async(req, res) => {
  try {
    const jobs = await Job.find({ recruiter: req.params.recruiterId });
    res.status(200).json(jobs);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching jobs', error });
  }
};

export const getAllRecruiterApplications = asyncHandler(async (req, res) => {
  try {
    // Get all jobs that belong to this recruiter
    const jobs = await Job.find({ recruiter: req.user._id }).select('_id');
    const jobIds = jobs.map(j => j._id);

    const applications = await Application.find({ job: { $in: jobIds } })
      .populate('job')
      .populate('applicant', 'name email')
      .sort('-createdAt');

    return res.status(200).json(applications);
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});