import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import BackButton from '../../components/BackButton';
import { getUserJobs } from '../../lib/api';

function JobAnalytics() {
  const user = useSelector((state) => state.auth.user);
  const [analyticsData, setAnalyticsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAnalyticsData = async () => {
      if (user) {
        try {
          const data = await getUserJobs(user);
          setAnalyticsData(data);
        } catch (error) {
          setError(error.message);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchAnalyticsData();
  }, [user]);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  return (
    <div className="space-y-8">
      <div className="flex mb-4">
        <BackButton />
        <h1 className="text-2xl font-bold ml-2">Job Analytics</h1>
      </div>
      {analyticsData.length === 0 && <p>No analytics data found.</p>}
      {analyticsData.map((data) => (
        <div key={data._id} className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-xl font-semibold">{data.title}</h3>
          <p className="text-gray-600">Applications: {data.applications}</p>
          <p className="text-gray-600">Views: {data.views}</p>
        </div>
      ))}
    </div>
  );
}

export default JobAnalytics;