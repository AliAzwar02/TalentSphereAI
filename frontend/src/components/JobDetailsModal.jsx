import React, { useEffect, useState } from "react";
import { getJobById, updateJob, deleteJob, incrementJobViews } from "../lib/api";
import { useSelector } from "react-redux";
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

function JobDetailsModal({ jobId, isOpen, onClose }) {
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState("");
  const [company, setCompany] = useState("");
  const [location, setLocation] = useState("");
  const [status, setStatus] = useState("");
  const user = useSelector((state) => state.auth.user);
  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen) {
      const fetchJob = async () => {
        setLoading(true);
        setError(null);
        try {
          const jobData = await getJobById(jobId, user);
          setJob(jobData);
          setTitle(jobData.title);
          setCompany(jobData.company);
          setLocation(jobData.location);
          setStatus(jobData.status);

          // Increment views if user is an applicant
          if (user?.role === 'applicant') {
            incrementJobViews(jobId);
          }
        } catch (err) {
          setError(err.message);
        } finally {
          setLoading(false);
        }
      };
      fetchJob();
    }
  }, [isOpen, jobId, user]);

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const updatedJob = {
        title,
        company,
        location,
        status,
      };
      await updateJob(user, jobId, updatedJob);
      toast.success('Job updated successfully!');
      setJob(updatedJob);
      setIsEditing(false);
    } catch (err) {
      console.error('Error updating job:', err);
      setError('Failed to edit job. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (e) => {
    e.preventDefault();
    setIsEditing(true);
  };

  const handleSaveJob = () => {
    // Add your logic to save the job for later
    toast.success('Job saved for later!');
  };

  const handleApplyJob = () => {
    // Add your logic to apply for the job
    toast.success('Applied for the job!');
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this job posting?')) {
      return;
    }

    try {
      setLoading(true);
      await deleteJob(user, jobId);
      toast.success('Job deleted successfully!');
      onClose();
      navigate('/recruiter/jobs');
    } catch (err) {
      console.error('Error deleting job:', err);
      toast.error('Failed to delete job. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        {loading ? (
          <div>Loading...</div>
        ) : error ? (
          <div className="text-red-500">{error}</div>
        ) : job ? (
          <>
            <h2 className="text-2xl font-bold mb-4">{isEditing ? "Edit Job" : job.title}</h2>
            <form onSubmit={handleSave} className="space-y-4">
              <div className="form-group">
                <label className="block text-sm font-medium text-gray-700">Title</label>
                <input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="px-2 form-input mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  disabled={!isEditing}
                />
              </div>
              <div className="form-group">
                <label className="block text-sm font-medium text-gray-700">Company</label>
                <input
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  className="px-2 form-input mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  disabled={!isEditing}
                />
              </div>
              <div className="form-group">
                <label className="block text-sm font-medium text-gray-700">Location</label>
                <input
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="px-2 form-input mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  disabled={!isEditing}
                />
              </div>
              <div className="form-group">
                <label className="block text-sm font-medium text-gray-700">Status</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="px-2 form-input mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  disabled={!isEditing}
                >
                  <option value="active">active</option>
                  <option value="closed">closed</option>
                </select>
              </div>
              <div className="flex justify-end space-x-4">
                {user.role === "recruiter" ? (
                  <>
                    {isEditing ? (
                      <button type="submit" className="btn save-btn bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600">Save</button>
                    ) : (
                      <>
                        <button onClick={handleEdit} className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600">Edit</button>
                        <button 
                          onClick={handleDelete} 
                          className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
                        >
                          Delete Job
                        </button>
                      </>
                    )}
                  </>
                ) : (
                  <>
                    <button onClick={handleSaveJob} className="bg-yellow-500 text-white px-4 py-2 rounded-md hover:bg-yellow-600">Save Job</button>
                    <button onClick={handleApplyJob} className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600">Apply</button>
                  </>
                )}
                <button onClick={onClose} className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600">Close</button>
              </div>
            </form>
          </>
        ) : (
          <div>No job details available</div>
        )}
      </div>
    </div>
  );
}

export default JobDetailsModal;