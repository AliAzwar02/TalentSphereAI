import Job from '../models/Job.js';
import axios from 'axios';

export const createJob = async (req, res) => {
  try {
    const { title, company, description, requirements, location, type, salary, benefits } = req.body;
    
    let extractedSkills = [];
    try {
      const combinedText = `${description} ${requirements}`;
      const fastApiResponse = await axios.post(`${process.env.FASTAPI_URL}/extract-skills/`, {
        text: combinedText
      });
      
      extractedSkills = fastApiResponse.data.skills || [];
      console.log('Extracted skills:', extractedSkills);
    } catch (error) {
      console.error('Error extracting skills:', error.message);
      if (error.response) {
        console.error('FastAPI response status:', error.response.status);
        console.error('FastAPI response data:', error.response.data);
      } else if (error.request) {
        console.error('No response received from FastAPI. Request details:', error.request);
      } else {
        console.error('Error setting up request:', error.message);
      }
    }

    const job = new Job({
      title,
      company,
      description,
      requirements,
      location,
      type,
      salary,
      benefits,
      skills: extractedSkills,
      recruiter: req.user._id
    });

    await job.save();
    res.status(201).json(job);
  } catch (error) {
    console.error('Error creating job:', error);
    res.status(500).json({ 
      message: 'Error creating job', 
      error: error.message,
      details: error.response?.data || 'No additional details available'
    });
  }
};

export const getJobs = async (req, res) => {
  try {
    const jobs = await Job.find({ status: 'active' })
      .populate('recruiter', 'name company')
      .sort('-createdAt');

    return res.status(200).json(jobs);
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getJobById = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id).populate('recruiter', 'name company');

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found',
      });
    }

    return res.status(200).json(job);
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const updateJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found',
      });
    }

    if (job.recruiter.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this job',
      });
    }

    const updatedJob = await Job.findByIdAndUpdate(req.params.id, req.body, { new: true });

    return res.status(200).json(updateJob);
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getJobsByRecruiter = async (req, res) => {
  try {
    const { recruiterId } = req.params;
    const jobs = await Job.find({ recruiter: recruiterId })
      .populate('recruiter', 'name company')
      .sort('-createdAt');

    return res.status(200).json(jobs);
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const deleteJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found',
      });
    }

    if (job.recruiter.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this job',
      });
    }

    await Job.findByIdAndDelete(req.params.id);

    return res.status(200).json({
      success: true,
      message: 'Job deleted successfully',
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};