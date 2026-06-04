import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiBriefcase, FiFileText, FiUser, FiBookmark } from 'react-icons/fi';
import { useSelector } from 'react-redux';
import { getUserApplications, getJobs } from '../../lib/api';

function ApplicantDashboard() {
  const [applications, setApplications] = useState([]);
  const [recentJobs, setRecentJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const user = useSelector((state) => state.auth.user);
  const fullName = user?.name || '';
  const firstName = fullName ? fullName.split(' ')[0] : 'Applicant';

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!user) return;

        // Fetch user's applications
        const applicationsResponse = await getUserApplications(user);
        setApplications(applicationsResponse.slice(0, 2)); // Get only 2 most recent applications

        // Fetch recent jobs
        const jobsResponse = await getJobs();
        setRecentJobs(jobsResponse.slice(0, 2)); // Get only 2 most recent jobs
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  return (
    <div className="space-y-8 max-w-screen-lg mx-auto p-4">
      <div className="text-center">
        <h2 className="text-3xl font-medium text-gray-800">Welcome, {firstName}!</h2>
        <p className="text-lg text-gray-500 mt-2">Find jobs, track applications, and manage your profile.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold mb-4 text-gray-800">Recent Applications</h3>
          <div className="space-y-4">
            {loading ? (
              <div className="flex items-center justify-center">
                <div className='loader'></div>
              </div>
            ) : applications.length > 0 ? (
              applications.map(app => (
                <div key={app._id} className="border-b pb-3">
                  <h4 className="text-lg font-medium text-gray-700">{app.job?.title || 'Unknown Job'}</h4>
                  <p className="text-sm text-gray-600">{app.job?.company || 'Unknown Company'}</p>
                  <span className={`inline-block px-2 py-1 mt-2 text-xs font-semibold rounded-full
                    ${app.status === 'pending' ? 'bg-yellow-200 text-yellow-800' : ''}
                    ${app.status === 'shortlisted' ? 'bg-green-200 text-green-800' : ''}
                    ${app.status === 'rejected' ? 'bg-red-200 text-red-800' : ''}
                  `}>
                    {app.status}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-4">No applications yet</p>
            )}
          </div>
          <Link to="/applicant/applications" className="text-blue-600 hover:text-blue-800 mt-4 text-sm font-medium">
            View all applications
          </Link>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold mb-4 text-gray-800">Recent Job Listings</h3>
          <div className="space-y-4">
            {loading ? (
              <div className="flex items-center justify-center">
                <div className='loader'></div>
              </div>
            ) : recentJobs.length > 0 ? (
              recentJobs.map(job => (
                <div key={job._id} className="border-b pb-3">
                  <h4 className="text-lg font-medium text-gray-700">{job.title}</h4>
                  <p className="text-sm text-gray-600">{job.company}</p>
                  <p className="text-sm text-gray-500">{job.location}</p>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-4">No recent jobs found</p>
            )}
          </div>
          <Link to="/jobs" className="text-blue-600 hover:text-blue-800 mt-4 text-sm font-medium">
            View all jobs
          </Link>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md mt-6">
        <h3 className="text-xl font-semibold mb-4 text-gray-800">Quick Actions</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <Link
            to="/jobs"
            className="p-5 flex flex-col items-center justify-center bg-blue-100 rounded-xl hover:bg-blue-200 transition-all duration-300 shadow-md hover:shadow-lg"
          >
            <FiBriefcase size={24} className="text-blue-600 mb-2" />
            <span className="text-xs font-medium text-blue-700">Find Jobs</span>
          </Link>
          <Link
            to="/applicant/applications"
            className="p-5 flex flex-col items-center justify-center bg-green-100 rounded-xl hover:bg-green-200 transition-all duration-300 shadow-md hover:shadow-lg"
          >
            <FiFileText size={24} className="text-green-600 mb-2" />
            <span className="text-xs font-medium text-green-700">My Applications</span>
          </Link>
          <Link
            to="/profile"
            className="p-5 flex flex-col items-center justify-center bg-purple-100 rounded-xl hover:bg-purple-200 transition-all duration-300 shadow-md hover:shadow-lg"
          >
            <FiUser size={24} className="text-purple-600 mb-2" />
            <span className="text-xs font-medium text-purple-700">Profile</span>
          </Link>
          <Link
            to="/applicant/saved-jobs"
            className="p-5 flex flex-col items-center justify-center bg-yellow-100 rounded-xl hover:bg-yellow-200 transition-all duration-300 shadow-md hover:shadow-lg"
          >
            <FiBookmark size={24} className="text-yellow-600 mb-2" />
            <span className="text-xs font-medium text-yellow-700">Saved Jobs</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default ApplicantDashboard;
