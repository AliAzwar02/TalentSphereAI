import React, { useState, useEffect, useRef } from 'react';
import { toast } from 'react-hot-toast';
import { useSelector } from 'react-redux';
import { applyToJob } from '../lib/api';

const ResumeModal = ({ show, onClose, jobId }) => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);
  const user = useSelector((state) => state.auth.user);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUploadClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleApplyClick = async () => {
    if (!file) {
      toast.error('Please select a file to upload');
      return;
    }
    if (!jobId) {
      toast.error('Job ID not found');
      return;
    }
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append('file', file);
      formData.append('coverLetter', '');
      await applyToJob(user, formData, jobId);
      toast.success('Job applied successfully!');
      onClose();
    } catch (error) {
      console.error('Error applying for job:', error);
      toast.error(error.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!show) {
      setFile(null);
    }
  }, [show]);

  if (!show) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-lg font-bold mb-4">Apply for Job</h2>
        <p className="mb-4">Please upload your resume to apply for this job.</p>
        <div className="space-x-4">
          <button
            onClick={handleUploadClick}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          >
            Upload Resume
          </button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            style={{ display: 'none' }}
          />
          <button
            onClick={handleApplyClick}
            className={`px-4 py-2 rounded-md ${file ? 'bg-green-600 text-white hover:bg-green-700' : 'bg-gray-400 text-gray-700 cursor-not-allowed'}`}
            disabled={!file}
          >
            Apply
          </button>
          <button
            onClick={onClose}
            className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700"
          >
            Cancel
          </button>
        </div>
        {file && <p className="mt-4">Selected file: {file.name}</p>}
      </div>
    </div>
  );
};

export default ResumeModal;