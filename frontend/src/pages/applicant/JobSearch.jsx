import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import BackButton from '../../components/BackButton';
import { getJobs, getSavedJobs, saveJob, unsaveJob } from '../../lib/api';

function JobSearch() {
  const [searchParams, setSearchParams] = useState({
    keyword: '',
    location: '',
    jobType: 'all',
    skills: ''
  });
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const user = useSelector((state) => state.auth.user);
  const [savedJobs, setSavedJobs] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoading(true);
        const response = await getJobs();
        setJobs(Array.isArray(response) ? response : []);
        setFilteredJobs(Array.isArray(response) ? response : []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    const fetchSavedJobs = async () => {
      try {
        if (!user) return;
        const response = await getSavedJobs(user);
        setSavedJobs(Array.isArray(response) ? response : []);
      } catch (error) {
        console.error('Error fetching saved jobs:', error);
        setSavedJobs([]);
      }
    };

    fetchJobs();
    fetchSavedJobs();
  }, [user]);

  const handleSearch = (e) => {
    e.preventDefault();
    const filtered = jobs.filter((job) => {
      const matchesKeyword =
        job.title.toLowerCase().includes(searchParams.keyword.toLowerCase()) ||
        job.company.toLowerCase().includes(searchParams.keyword.toLowerCase());
      const matchesLocation =
        job.location.toLowerCase().includes(searchParams.location.toLowerCase());
      const matchesJobType =
        searchParams.jobType === 'all' || job.type === searchParams.jobType;
      const matchesSkills =
        searchParams.skills === '' ||
        (job.skills && job.skills.some(skill =>
          skill.toLowerCase().includes(searchParams.skills.toLowerCase())
        ));
      return matchesKeyword && matchesLocation && matchesJobType && matchesSkills;
    });
    setFilteredJobs(filtered);
  };

  const handleToggleSaveJob = async (jobId) => {
    const currentSavedJobs = Array.isArray(savedJobs) ? savedJobs : [];
    const isJobSaved = currentSavedJobs.some(job => job._id === jobId);

    if (isJobSaved) {
      await handleUnsaveJob(jobId);
    } else {
      await handleSaveJob(jobId);
    }
  };

  const handleSaveJob = async (jobId) => {
    try {
      if (!user) {
        toast.error('You must be logged in to save a job.');
        return;
      }
      const response = await saveJob(user, jobId);
      toast.success(response.message || 'Job saved successfully!');
      setSavedJobs([...savedJobs, { _id: jobId }]);
    } catch (error) {
      console.error('Error saving job:', error);
      toast.error('Failed to save job.');
    }
  };

  const handleUnsaveJob = async (jobId) => {
    try {
      if (!user) {
        toast.error('You must be logged in to unsave a job.');
        return;
      }
      const response = await unsaveJob(user, jobId);
      toast.success(response.message || 'Job unsaved successfully!');
      setSavedJobs(savedJobs.filter(job => job._id !== jobId));
    } catch (error) {
      console.error('Error unsaving job:', error);
      toast.error('Failed to unsave job.');
    }
  };

  const handleClearFilters = () => {
    setSearchParams({
      keyword: '',
      location: '',
      jobType: 'all',
      skills: ''
    });
    setFilteredJobs(jobs);
  };

  const handleViewDetails = (jobId) => {
    navigate(`/jobs/${jobId}`);
  };

  return (
    <div className="space-y-6">
      <div className="flex mb-4">
        <BackButton />
        <h1 className="text-2xl font-bold ml-2">Search Jobs</h1>
      </div>
      <form onSubmit={handleSearch} className="bg-white p-6 rounded-lg shadow">
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-700 mb-2">Keywords</label>
            <input
              type="text"
              value={searchParams.keyword}
              onChange={(e) => setSearchParams({ ...searchParams, keyword: e.target.value })}
              className="w-full p-2 border rounded-md"
              placeholder="Job title, skills, or company"
            />
          </div>
          <div>
            <label className="block text-gray-700 mb-2">Location</label>
            <input
              type="text"
              value={searchParams.location}
              onChange={(e) => setSearchParams({ ...searchParams, location: e.target.value })}
              className="w-full p-2 border rounded-md"
              placeholder="City, state, or remote"
            />
          </div>
          <div>
            <label className="block text-gray-700 mb-2">Job Type</label>
            <select
              value={searchParams.jobType}
              onChange={(e) => setSearchParams({ ...searchParams, jobType: e.target.value })}
              className="w-full p-2 border rounded-md"
            >
              <option value="all">All Types</option>
              <option value="full-time">Full-time</option>
              <option value="part-time">Part-time</option>
              <option value="contract">Contract</option>
              <option value="remote">Remote</option>
            </select>
          </div>
          <div>
            <label className="block text-gray-700 mb-2">Required Skills</label>
            <input
              type="text"
              value={searchParams.skills}
              onChange={(e) => setSearchParams({ ...searchParams, skills: e.target.value })}
              className="w-full p-2 border rounded-md"
              placeholder="e.g., Python, React, AWS"
            />
          </div>
        </div>
        <div className="mt-4 flex gap-4">
          <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700">
            Search Jobs
          </button>
          <button
            type="button"
            onClick={handleClearFilters}
            className="bg-gray-600 text-white px-6 py-2 rounded-md hover:bg-gray-700"
          >
            Clear Filters
          </button>
        </div>
      </form>
      <div className="space-y-4">
        {loading ? (
          <div className="flex items-center justify-center">
            <div className='loader'></div>
          </div>
        ) : (
          <>
            {error && <p className="text-red-600">{error}</p>}
            {!loading && !error && filteredJobs.length === 0 && <p>No jobs found.</p>}
            {!loading &&
              !error &&
              filteredJobs.map((job) => {
                const isJobSaved = Array.isArray(savedJobs) && savedJobs.some(savedJob => savedJob._id === job._id);
                return (
                  <div key={job._id} className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow duration-200">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className="text-xl font-semibold text-gray-900">{job.title}</h3>
                          {job.isRemote && (
                            <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                              Remote
                            </span>
                          )}
                        </div>
                        <p className="text-gray-600 mt-1">{job.company}</p>

                        <div className="mt-3 flex flex-wrap gap-2">
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            {job.location}
                          </span>
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800">
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                            {job.type}
                          </span>
                          {job.salary && (
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              {job.salary}
                            </span>
                          )}
                        </div>

                        {job.skills && job.skills.length > 0 && (
                          <div className="mt-3">
                            <h4 className="text-sm font-medium text-gray-700 mb-2">Required Skills:</h4>
                            <div className="flex flex-wrap gap-2">
                              {job.skills.map((skill, index) => (
                                <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-sm">
                                  {skill}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                        <p className="mt-4 text-gray-700 line-clamp-2">{job.description}</p>

                        <div className="mt-4 flex items-center text-sm text-gray-500">
                          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          Posted {job.createdAt ? new Date(job.createdAt).toLocaleDateString() : 'Recently'}
                        </div>
                      </div>

                      <div className="flex flex-col gap-2 ml-4">
                        <button
                          onClick={() => handleViewDetails(job._id)}
                          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors duration-200 flex items-center"
                        >
                          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                          View Details
                        </button>
                        <button
                          onClick={() => handleToggleSaveJob(job._id)}
                          className={`px-4 py-2 rounded-md transition-colors duration-200 flex items-center ${isJobSaved
                              ? "bg-red-500 text-white hover:bg-red-600"
                              : "bg-yellow-500 text-white hover:bg-yellow-600"
                            }`}
                        >
                          {isJobSaved ? (
                            <>
                              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                              Unsave
                            </>
                          ) : (
                            <>
                              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                              </svg>
                              Save
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
          </>
        )}
      </div>
    </div>
  );
}

export default JobSearch;