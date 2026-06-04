import Resume from '../models/Resume.js';

export const getResume = async (req, res) => {
  try {
    const resume = await Resume.findOne({ user: req.user._id });

    if (!resume) {
      return res.status(404).json({ error: 'Resume not found' });
    }

    res.json(resume);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch resume data' });
  }
};

export const createOrUpdateResume = async (req, res) => {
  try {
    const resumeData = req.body;
    let resume = await Resume.findOne({ user: req.user._id });

    if (resume) {
      resume = await Resume.findOneAndUpdate(
        { user: req.user._id },
        { $set: resumeData },
        { new: true }
      );
    } else {
      resume = new Resume({
        ...resumeData,
        user: req.user._id,
      });
      await resume.save();
    }

    res.status(201).json(resume);
  } catch (error) {
    res.status(500).json({ error: 'Failed to save resume data' });
  }
};
