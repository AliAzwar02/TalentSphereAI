import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getJobById, saveJob, getSavedJobs, unsaveJob, incrementJobViews } from "../lib/api";
import { useSelector } from "react-redux";
import { toast } from 'react-hot-toast';
import ResumeModal from "../components/ResumeModal";
import useApplyJob from "../hooks/useApplyJob";

function JobDetailsPage() {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isJobSaved, setIsJobSaved] = useState(false);
  const user = useSelector((state) => state.auth.user);
  const { applyJob, showModal, setShowModal } = useApplyJob();
  const [selectedJobId, setSelectedJobId] = useState();

  useEffect(() => {
    const fetchJob = async () => {
      setLoading(true);
      setError(null);
      try {
        const jobData = await getJobById(jobId, user);
        setJob(jobData);

        if (user) {
          const response = await getSavedJobs(user);
          const savedJobs = Array.isArray(response) ? response : [];
          setIsJobSaved(savedJobs.some(savedJob => savedJob._id === jobId));
          
          // Increment views if the user is an applicant
          if (user.role === 'applicant') {
            incrementJobViews(jobId);
          }
        } else {
          // If no user is logged in, we can still increment view
          incrementJobViews(jobId);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchJob();
  }, [jobId, user]);

  const handleSaveJob = async () => {
    try {
      if (!user) {
        toast.error('You must be logged in to save a job.');
        return;
      }
      const response = await saveJob(user, jobId);
      toast.success(response.message || 'Job saved successfully!');
      setIsJobSaved(true);
    } catch (error) {
      console.error('Error saving job:', error);
      toast.error('Failed to save job.');
    }
  };

  const handleUnsaveJob = async () => {
    try {
      if (!user) {
        toast.error('You must be logged in to unsave a job.');
        return;
      }
      const response = await unsaveJob(user, jobId);
      toast.success(response.message || 'Job unsaved successfully!');
      setIsJobSaved(false);
    } catch (error) {
      console.error('Error unsaving job:', error);
      toast.error('Failed to unsave job.');
    }
  };

  const handleApplyJob = () => {
    if (!user) {
      toast.error('You must be logged in to apply for a job.');
      return;
    }
    setSelectedJobId(jobId);
    setShowModal(true);
  };

  return (
    <div className="container mx-auto p-6">
      <ResumeModal
        show={showModal}
        onClose={() => setShowModal(false)}
        jobId={selectedJobId}
      />
      {loading ? (
        <div>Loading...</div>
      ) : error ? (
        <div className="text-red-500">{error}</div>
      ) : job ? (
        <>
          <h2 className="text-2xl font-bold mb-4">{job.title}</h2>
          <div className="space-y-4">
            <div className="form-group">
              <label className="block text-sm font-medium text-gray-700">Company</label>
              <p>{job.company}</p>
            </div>
            <div className="form-group">
              <label className="block text-sm font-medium text-gray-700">Location</label>
              <p>{job.location}</p>
            </div>
            <div className="form-group">
              <label className="block text-sm font-medium text-gray-700">Status</label>
              <p>{job.status}</p>
            </div>
            <div className="form-group">
              <label className="block text-sm font-medium text-gray-700">Description</label>
              <p>{job.description}</p>
            </div>
            <div className="form-group">
              <label className="block text-sm font-medium text-gray-700">Requirements</label>
              <p>{job.requirements}</p>
            </div>
            {job.skills && job.skills.length > 0 && (
              <div className="form-group">
                <label className="block text-sm font-medium text-gray-700">Required Skills</label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {job.skills.map((skill, index) => (
                    <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-sm">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}
            <div className="flex justify-end space-x-4">
              {isJobSaved ? (
                <button onClick={handleUnsaveJob} className="bg-yellow-500 text-white px-4 py-2 rounded-md hover:bg-yellow-600">Unsave Job</button>
              ) : (
                <button onClick={handleSaveJob} className="bg-yellow-500 text-white px-4 py-2 rounded-md hover:bg-yellow-600">Save Job</button>
              )}
              <button onClick={handleApplyJob} className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600">Apply</button>
              <button onClick={() => navigate('/jobs')} className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600">Back</button>
            </div>
          </div>
        </>
      ) : (
        <div>No job details available</div>
      )}
    </div>
  );
}

export default JobDetailsPage;