import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import BackButton from '../../components/BackButton';
import { getUserApplications } from '../../lib/api';

function YourApplications() {
  const [applications, setApplications] = useState([]);
  const user = useSelector((state) => state.auth.user);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        if (!user) return;

        const response = await getUserApplications(user);
        setApplications(response);
      } catch (error) {
        console.error('Error fetching applications:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, [user]);

  return (
    <div className="space-y-8">
      <div className="flex mb-4">
        <BackButton />
        <h1 className="text-2xl font-bold ml-2">Your Applications</h1>
      </div>
      <div className="bg-white p-6 rounded-lg shadow">
        {loading ? (
          <div className="flex items-center justify-center">
            <div className='loader'></div>
          </div>
        ) : (
          <div className="space-y-4">
            {applications.map((app) => (
              <div key={app._id} className="border-b pb-4">
                <h4 className="font-medium">{app.job.title}</h4>
                <p className="text-gray-600">{app.job.company}</p>
                <span
  className={`inline-block px-2 py-1 rounded text-sm ${
    app.status === 'pending'
      ? 'bg-yellow-100 text-yellow-800'
      : app.status === 'shortlisted'
      ? 'bg-green-100 text-green-800'
      : app.status === 'rejected'
      ? 'bg-red-100 text-red-800'
      : 'bg-gray-100 text-gray-800'
  }`}
>
  {app.status}
</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default YourApplications;
