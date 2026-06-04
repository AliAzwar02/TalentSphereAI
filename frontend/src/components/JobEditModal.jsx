import React, { useState } from "react";
import { updateJob } from "../lib/api";
import { useSelector } from "react-redux";

function JobEditModal({ job, isOpen, onClose }) {
  const [title, setTitle] = useState(job.title);
  const [company, setCompany] = useState(job.company);
  const [location, setLocation] = useState(job.location);
  const [status, setStatus] = useState(job.status);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const user = useSelector((state) => state.auth.user);

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
      console.log(user, job._id, updatedJob)
      await updateJob(user, job._id, updatedJob);
      toast.success('Job updated successfully!');
      onClose();
    } catch (err) {
      console.error('Error updating job:', err);
      setError('Failed to edit job. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4">Edit Job</h2>
        <form onSubmit={handleSave} className="space-y-4">
          <div className="form-group">
            <label className="block text-sm font-medium text-gray-700">Title</label>
            <input value={title} onChange={(e) => setTitle(e.target.value)} className="px-2 form-input mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
          </div>
          <div className="form-group">
            <label className="block text-sm font-medium text-gray-700">Company</label>
            <input value={company} onChange={(e) => setCompany(e.target.value)} className="px-2 form-input mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
          </div>
          <div className="form-group">
            <label className="block text-sm font-medium text-gray-700">Location</label>
            <input value={location} onChange={(e) => setLocation(e.target.value)} className="px-2 form-input mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
          </div>
          <div className="form-group">
            <label className="block text-sm font-medium text-gray-700">Status</label>
            <select value={status} onChange={(e) => setStatus(e.target.value)} className="px-2 form-input mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm">
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>
          <div className="flex justify-end space-x-4">
            <button type="submit" className="btn save-btn bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600">Save</button>
            <button type="button" onClick={onClose} className="btn cancel-btn bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default JobEditModal;