import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { toast } from 'react-hot-toast';
import BackButton from '../../components/BackButton';
import { putJob } from '../../lib/api';

function PostJob() {
  const [jobData, setJobData] = useState({
    title: '',
    company: '',
    location: '',
    type: 'full-time',
    salary: '',
    description: '',
    requirements: '',
    benefits: ''
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const user = useSelector((state) => state.auth.user);

  const handleChange = (e) => {
    setJobData({
      ...jobData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      if (!user) return;
      const response = await putJob(user, jobData);
      toast.success('Job posted successfully!');
      setJobData({
        title: '',
        company: '',
        location: '',
        type: 'full-time',
        salary: '',
        description: '',
        requirements: '',
        benefits: ''
      });
    } catch (err) {
      console.error('Error posting job:', err);
      setError('Failed to post job. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex mb-4">
        <BackButton />
        <h1 className="text-2xl font-bold ml-2">Post a New Job</h1>
      </div>

      {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{error}</div>}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 mb-2">Job Title</label>
              <input
                type="text"
                name="title"
                value={jobData.title}
                onChange={handleChange}
                className="w-full p-2 border rounded-md"
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 mb-2">Company Name</label>
              <input
                type="text"
                name="company"
                value={jobData.company}
                onChange={handleChange}
                className="w-full p-2 border rounded-md"
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 mb-2">Location</label>
              <input
                type="text"
                name="location"
                value={jobData.location}
                onChange={handleChange}
                className="w-full p-2 border rounded-md"
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 mb-2">Job Type</label>
              <select
                name="type"
                value={jobData.type}
                onChange={handleChange}
                className="w-full p-2 border rounded-md"
                required
              >
                <option value="full-time">Full-time</option>
                <option value="part-time">Part-time</option>
                <option value="contract">Contract</option>
                <option value="remote">Remote</option>
              </select>
            </div>

            <div>
              <label className="block text-gray-700 mb-2">Salary Range</label>
              <input
                type="text"
                name="salary"
                value={jobData.salary}
                onChange={handleChange}
                className="w-full p-2 border rounded-md"
                placeholder="e.g., $50,000 - $70,000"
              />
            </div>
          </div>

          <div className="mt-4">
            <label className="block text-gray-700 mb-2">Job Description</label>
            <textarea
              name="description"
              value={jobData.description}
              onChange={handleChange}
              className="w-full p-2 border rounded-md h-32"
              required
            />
          </div>

          <div className="mt-4">
            <label className="block text-gray-700 mb-2">Requirements</label>
            <textarea
              name="requirements"
              value={jobData.requirements}
              onChange={handleChange}
              className="w-full p-2 border rounded-md h-32"
              required
            />
          </div>

          <div className="mt-4">
            <label className="block text-gray-700 mb-2">Benefits</label>
            <textarea
              name="benefits"
              value={jobData.benefits}
              onChange={handleChange}
              className="w-full p-2 border rounded-md h-32"
            />
          </div>
        </div>

        <div className="flex justify-end space-x-4">
          <button
            type="button"
            className="px-6 py-2 border rounded-md hover:bg-gray-100"
          >
            Save Draft
          </button>
          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700"
            disabled={isLoading}
          >
            {isLoading ? 'Posting...' : 'Post Job'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default PostJob;