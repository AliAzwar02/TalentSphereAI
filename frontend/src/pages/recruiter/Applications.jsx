import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import BackButton from '../../components/BackButton';
import { Link } from 'react-router-dom';
import { fetchRecruiterJobs, getRecruiterApplications, getAllRecruiterApplications, updateApplication, searchApplicants } from '../../lib/api';
import { FaFileAlt, FaInfoCircle } from 'react-icons/fa';

function AllApplications() {
  const [jobs, setJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [applications, setApplications] = useState([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [statusChanged, setStatusChanged] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState(null);
  const [searching, setSearching] = useState(false);
  const user = useSelector((state) => state.auth.user);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        if (!user) return;
        let response;
        if (selectedJob) {
          response = await getRecruiterApplications(user, selectedJob);
        } else {
          // No job selected — load ALL applications across all recruiter jobs
          response = await getAllRecruiterApplications(user);
        }
        setApplications(response);
        setSearchResults(null);
      } catch (error) {
        console.error('Error fetching applications:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, [user, statusChanged, selectedJob]);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        if (!user) return;
        const response = await fetchRecruiterJobs(user);
        setJobs(response);
      } catch (error) {
        console.error('Error fetching jobs:', error);
      }
    };
    fetchJobs();
  }, [user]);

  const handleStatusChange = async (applicationId, newStatus) => {
    try {
      const updatedApplication = await updateApplication(user, applicationId, newStatus);
      if (searchResults) {
        setSearchResults(searchResults.map(item => {
          if (item.application._id === applicationId) {
            return {
              ...item,
              application: { ...item.application, status: updatedApplication.status }
            };
          }
          return item;
        }));
      } else {
        setApplications(applications.map(app => {
          if (app._id === applicationId) {
            return { ...app, status: updatedApplication.status };
          }
          return app;
        }));
      }
      setStatusChanged(!statusChanged);
    } catch (error) {
      console.error('Error updating application status:', error.message);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!selectedJob || !searchQuery.trim()) return;

    setSearching(true);
    try {
      const results = await searchApplicants(user, {
        query: searchQuery,
        jobId: selectedJob
      });
      setSearchResults(results);
    } catch (error) {
      console.error('Error searching applications:', error);
    } finally {
      setSearching(false);
    }
  };

  const clearSearch = () => {
    setSearchQuery('');
    setSearchResults(null);
  };

  const filteredApplications = applications.filter(app => {
    if (filter === 'all') return true;
    return app.status === filter;
  });

  const displayApplications = searchResults || filteredApplications;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center">
          <BackButton />
          <h1 className="text-2xl font-bold ml-2">Job Applications</h1>
        </div>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="p-2 border rounded-md"
        >
          <option value="all">All Applications</option>
          <option value="pending">Pending</option>
          <option value="shortlisted">Shortlisted</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>

      <div className="mb-6">
        <select
          value={selectedJob || ''}
          onChange={(e) => setSelectedJob(e.target.value)}
          className="p-2 border rounded-md w-full"
        >
          <option value="">Select a Job</option>
          {jobs.map((job) => (
            <option key={job._id} value={job._id}>
              {job.title}
            </option>
          ))}
        </select>
      </div>

      {selectedJob && (
        <div className="bg-white p-6 rounded-lg shadow mb-6">
          <h2 className="text-lg font-semibold mb-4">Advanced CV Search</h2>
          <form onSubmit={handleSearch} className="flex gap-4">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search CVs (e.g., 'Python developer with 5 years experience in machine learning')"
              className="flex-1 p-2 border rounded-md"
            />
            <button
              type="submit"
              disabled={!searchQuery.trim() || searching}
              className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 disabled:bg-gray-400"
            >
              {searching ? 'Searching...' : 'Search'}
            </button>
            {searchResults && (
              <button
                type="button"
                onClick={clearSearch}
                className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
              >
                Clear
              </button>
            )}
          </form>
        </div>
      )}

      <div className="bg-white rounded-lg shadow">
        {loading ? (
          <div className="flex items-center justify-center p-6">
            <div className='loader'></div>
          </div>
        ) : (
          <div className="relative">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Applicant
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Position
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Applied Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Resume
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                  {searchResults && (
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Remarks
                    </th>
                  )}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {displayApplications.length > 0 ? (
                  displayApplications.map(item => {
                    const application = searchResults ? item.application : item;
                    return (
                      <tr key={application?._id || Math.random()} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <div className="text-sm font-medium text-gray-900">{application?.applicant?.name || 'Unknown Applicant'}</div>
                          <div className="text-sm text-gray-500">{application?.applicant?.email || 'No email'}</div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500">
                          {application?.job?.title || 'Unknown Job'}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500">
                          {application?.createdAt ? new Date(application.createdAt).toLocaleDateString() : 'N/A'}
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                            ${application?.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : ''}
                            ${application?.status === 'shortlisted' ? 'bg-green-100 text-green-800' : ''}
                            ${application?.status === 'rejected' ? 'bg-red-100 text-red-800' : ''}
                          `}>
                            {application?.status || 'Unknown'}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm font-medium">
                          <Link
                            to={application?.resume || '#'}
                            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-900"
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <FaFileAlt className="text-lg" />
                            <span>View</span>
                          </Link>
                        </td>
                        <td className="px-6 py-4 text-sm font-medium text-center">
                          <div className="inline-flex items-center space-x-2">
                            <button
                              onClick={() => application && handleStatusChange(application._id, 'shortlisted')}
                              className={`px-3 py-1 rounded-md ${application?.status === 'shortlisted'
                                ? 'bg-green-100 text-green-800'
                                : 'text-green-600 hover:bg-green-50'
                                }`}
                            >
                              Shortlist
                            </button>
                            <button
                              onClick={() => application && handleStatusChange(application._id, 'rejected')}
                              className={`px-3 py-1 rounded-md ${application?.status === 'rejected'
                                ? 'bg-red-100 text-red-800'
                                : 'text-red-600 hover:bg-red-50'
                                }`}
                            >
                              Reject
                            </button>
                          </div>
                        </td>
                        {searchResults && (
                          <td className="px-6 py-4 text-sm text-gray-500">
                            <div className="relative inline-block group">
                              <button
                                className="text-blue-500 hover:text-blue-700 focus:outline-none"
                                title="View Remarks"
                              >
                                <FaInfoCircle className="text-lg" />
                              </button>
                              <div className="hidden group-hover:block absolute z-50 w-72 p-4 mt-2 bg-gray-900 text-white rounded-lg shadow-lg -left-1/2 transform -translate-x-1/4">
                                <div className="absolute -top-2 left-1/2 transform -translate-x-1/2">
                                  <div className="w-3 h-3 rotate-45 bg-gray-900"></div>
                                </div>
                                <p className="text-sm leading-relaxed">{item.statement || 'No remarks available.'}</p>
                              </div>
                            </div>
                          </td>
                        )}
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={searchResults ? 7 : 6} className="px-6 py-4 text-center text-gray-500">
                      No applications found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default AllApplications;