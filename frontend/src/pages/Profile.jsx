import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { toast } from 'react-hot-toast';
import BackButton from '../components/BackButton';
import { getProfile, updateProfile } from '../lib/api';
import ProfileSkeleton from '../skeletons/ProfileSkeleton';

function Profile() {
  const user = useSelector((state) => state.auth.user);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    location: '',
    bio: '',
    company: '',
    position: ''
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        if (!user) return;
        setLoading(true);
        const response = await getProfile(user);
        const profileData = response;
        setFormData({
          name: profileData.name,
          email: profileData.email,
          phone: profileData.profile?.phone || '',
          location: profileData.profile?.location || '',
          bio: profileData.profile?.bio || '',
          company: profileData.profile?.company || '',
          position: profileData.profile?.position || '',
        });
      } catch (error) {
        console.error('Error fetching profile:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await updateProfile(user, formData);
      toast.success('Profile updated successfully!');
    } catch (error) {
      setError(error.response.data.message);
      toast.error(error.response.data.message);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };


  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex mb-4">
        <BackButton />
        <h1 className="text-2xl font-bold ml-2">Profile Settings</h1>
      </div>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6" role="alert">
          <span className="block sm:inline">{error}</span>
        </div>
      )}

      {loading ? (
        <ProfileSkeleton />
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-gray-700 mb-2">Full Name</label>
            <input type="text" name="name" value={formData.name} onChange={handleChange} className="w-full p-2 border rounded-md" />
          </div>

          <div>
            <label className="block text-gray-700 mb-2">Email</label>
            <input type="email" name="email" value={formData.email} onChange={handleChange} className="w-full p-2 border rounded-md" readOnly />
          </div>

          <div>
            <label className="block text-gray-700 mb-2">Phone</label>
            <input type="tel" name="phone" value={formData.phone} onChange={handleChange} className="w-full p-2 border rounded-md" />
          </div>

          <div>
            <label className="block text-gray-700 mb-2">Location</label>
            <input type="text" name="location" value={formData.location} onChange={handleChange} className="w-full p-2 border rounded-md" />
          </div>

          <div>
            <label className="block text-gray-700 mb-2">Bio</label>
            <textarea name="bio" value={formData.bio} onChange={handleChange} className="w-full p-2 border rounded-md h-32" />
          </div>

          {user.role === 'recruiter' && (
            <>
              <div>
                <label className="block text-gray-700 mb-2">Company</label>
                <input type="text" name="company" value={formData.company} onChange={handleChange} className="w-full p-2 border rounded-md" />
              </div>

              <div>
                <label className="block text-gray-700 mb-2">Position</label>
                <input type="text" name="position" value={formData.position} onChange={handleChange} className="w-full p-2 border rounded-md" />
              </div>
            </>
          )}

          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700"
          >
            Save Changes
          </button>
        </form>
      )}
    </div>
  );
}

export default Profile;
