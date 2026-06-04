import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import ResumeModal from '../../components/ResumeModal';
import useApplyJob from '../../hooks/useApplyJob';
import { toast } from 'react-hot-toast';
import BackButton from '../../components/BackButton';
import { getSavedJobs, unsaveJob } from '../../lib/api';

function SavedJobs() {
  const [savedJobs, setSavedJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedJobId, setSelectedJobId] = useState(null);
  const user = useSelector((state) => state.auth.user);
  const { applyJob, showModal, setShowModal } = useApplyJob();

  useEffect(() => {
    const fetchSavedJobs = async () => {
      try {
        if (!user) return;
        setLoading(true);
        const response = await getSavedJobs(user);
        setSavedJobs(Array.isArray(response) ? response : []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSavedJobs();
  }, [user]);

  const handleUnsaveJob = async (jobId) => {
    try {
      if (!user) return;
      const response = await unsaveJob(user, jobId);
      toast.success(response.message || 'Job unsaved successfully!');
      setSavedJobs(savedJobs.filter(job => job._id !== jobId));
    } catch (error) {
      console.error('Error unsaving job:', error);
      toast.error('Failed to unsave job.');
    }
  };

  return (
    <div className="space-y-6">
      <ResumeModal
        show={showModal}
        onClose={() => setShowModal(false)}
        jobId={selectedJobId}
      />
      <div className="flex mb-4">
        <BackButton />
        <h1 className="text-2xl font-bold ml-2">Saved Jobs</h1>
      </div>

      <div className="space-y-4">
        {loading && <div className="flex items-center justify-center">
          <div className='loader'></div>
        </div>}
        {error && <p className="text-red-600">{error}</p>}
        {!loading && !error && savedJobs.length === 0 && <p>No saved jobs found.</p>}
        {!loading &&
          !error &&
          savedJobs.map((job) => (
            <div key={job._id} className="bg-white p-6 rounded-lg shadow">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-xl font-semibold">{job.title}</h3>
                  <p className="text-gray-600">{job.company}</p>
                  <div className="mt-2 space-x-2">
                    <span className="inline-block bg-gray-100 px-2 py-1 rounded text-sm">
                      {job.location}
                    </span>
                    <span className="inline-block bg-gray-100 px-2 py-1 rounded text-sm">
                      {job.type}
                    </span>
                    <span className="inline-block bg-gray-100 px-2 py-1 rounded text-sm">
                      {job.salary}
                    </span>
                  </div>
                </div>
                <div className="space-x-2">
                  <button
                    onClick={() => { setSelectedJobId(job._id); applyJob(job._id); }}
                    className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
                  >
                    Apply Now
                  </button>
                  <button
                    onClick={() => handleUnsaveJob(job._id)}
                    className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
                  >
                    Unsave Job
                  </button>
                </div>
              </div>
              <p className="mt-4 text-gray-700">{job.description}</p>
            </div>
          ))}
      </div>
    </div>
  );
}

export default SavedJobs;
