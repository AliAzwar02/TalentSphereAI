import User from '../models/User.js';
import Job from '../models/Job.js';

export const saveJob = async (req, res) => {
  const { jobId } = req.body;

  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const job = await Job.findById(jobId);
    if (!job) return res.status(404).json({ message: 'Job not found' });

    if (user.savedJobs.includes(jobId)) {
      return res.status(400).json({ message: 'Job already saved' });
    }

    user.savedJobs.push(jobId);
    await user.save();

    res.status(200).json({ message: 'Job saved successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

export const getSavedJobs = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate('savedJobs', 'title company location');
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (!user.savedJobs || user.savedJobs.length === 0) {
      return res.status(200).json({ message: 'No saved jobs found', savedJobs: [] });
    }

    res.status(200).json(user.savedJobs);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

export const unsaveJob = async (req, res) => {
  const { jobId } = req.body;

  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const jobIndex = user.savedJobs.indexOf(jobId);
    if (jobIndex === -1) {
      return res.status(400).json({ message: 'Job not saved' });
    }

    user.savedJobs.splice(jobIndex, 1);
    await user.save();

    res.status(200).json({ message: 'Job unsaved successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};
