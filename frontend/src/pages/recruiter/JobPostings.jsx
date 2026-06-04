import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { FiEdit } from 'react-icons/fi';
import BackButton from '../../components/BackButton';
import { getUserJobs } from '../../lib/api';
import JobDetailsModal from '../../components/JobDetailsModal';

function JobPostings() {
  const [jobPostings, setJobPostings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedJobId, setSelectedJobId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const user = useSelector((state) => state.auth.user);

  useEffect(() => {
    const fetchJobs = async () => {
      if (!user) return;
      try {
        const response = await getUserJobs(user);
        setJobPostings(response);
      } catch (error) {
        console.error("Error fetching Jobs:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, [user, isModalOpen]);

  const openModal = (jobId) => {
    setSelectedJobId(jobId);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedJobId(null);
    setIsModalOpen(false);
  };

  return (
    <div className='flex items-center justify-center'>
      <div className="space-y-8 w-8/12">
        <div className="flex mb-4">
          <BackButton />
          <h1 className="text-2xl font-bold ml-2">Job Postings</h1>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="space-y-4">
            {loading ? (
              <div className="flex items-center justify-center">
                <div className='loader'></div>
              </div>
            ) : (
              jobPostings.map(job => (
                <div key={job._id} className="border-b pb-4 flex justify-between items-center">
                  <div>
                    <h4 className="font-medium"><strong>Title:</strong> {job.title}</h4>
                    <p className="text-gray-600"><strong>Company:</strong> {job.company}</p>
                    <p className="text-gray-500 text-sm"><strong>Location:</strong> {job.location}</p>
                    <span className={`inline-block px-2 py-1 rounded text-sm mt-2 ${job.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      Status: {job.status}
                    </span>
                  </div>
                  
                  <button onClick={() => openModal(job._id)} className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700">
                    <FiEdit className="mr-2" /> View Details
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {selectedJobId && (
        <JobDetailsModal jobId={selectedJobId} isOpen={isModalOpen} onClose={closeModal} user={user} />
      )}
    </div>
  );
}

export default JobPostings;