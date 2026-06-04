import { useState } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { toast } from 'react-hot-toast';
import { applyToJob } from '../lib/api';

function useApplyJob() {
  const user = useSelector((state) => state.auth.user);
  const [showModal, setShowModal] = useState(false);
  const [selectedJobId, setSelectedJobId] = useState(null);

  const applyJob = async (jobId, file) => {
    setSelectedJobId(jobId);
    setShowModal(true);

    if (!file) {
      toast.error('Please select a file to upload');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('coverLetter', '');

    try {
      if (!user) return; 
      const response = await applyToJob(user, formData, jobId);
      toast.success('Job applied successfully!');
      setShowModal(false);
    } catch (error) {
      console.error('Error applying for job:', error);
      toast.error(error.message);
    }
  };

  return { applyJob, showModal, setShowModal };
}

export default useApplyJob;