import { axiosInstance } from "./axios";

export const loginUser = async (data) => {
  try {
    const res = await axiosInstance.post('/auth/login', {
      email: data.email,
      password: data.password,
    });
    return res.data;
  } catch (err) {
    throw new Error(err.response.data.message);
  }
};

export const registerUser = async (data) => {
  try {
    const res = await axiosInstance.post('/auth/register', {
      name: data.name,
      email: data.email,
      password: data.password,
      role: data.role,
    });
    return res.data;
  } catch (err) {
    throw new Error(err.response.data.message);
  }
};

export const getJobs = async () => {
  try {
    const res = await axiosInstance.get('/jobs/');
    return res.data;
  } catch (err) {
    throw new Error(err.response.data.message);
  }
};

export const getSavedJobs = async (user) => {
  try {
    const res = await axiosInstance.get('/applicants/saved-jobs', {
      headers: {
        Authorization: `Bearer ${user?.token}`,
      },
    });
    return res.data;
  } catch (err) {
    throw new Error(err.response.data.message);
  }
};

export const saveJob = async (user, jobId) => {
  try {
    const res = await axiosInstance.post('/applicants/save-job',
      { jobId },
      {
        headers: {
          Authorization: `Bearer ${user?.token}`,
        },
      });
    return res.data;
  } catch (err) {
    throw new Error(err.response.data.message);
  }
};

export const getUserApplications = async (user) => {
  try {
    const res = await axiosInstance.get(`/applicants/user/${user._id}`,
      {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      }
    );
    return res.data;
  } catch (err) {
    throw new Error(err.response.data.message);
  }
};

export const getResume = async (user) => {
  try {
    const res = await axiosInstance.get('/resume', 
      {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      }
    );
    return res.data;
  } catch (err) {
    throw new Error(err.response.data.message);
  }
};

export const saveResume = async (user, resumeData) => {
  try {
    const res = await axiosInstance.post('/resume',
      resumeData,
      {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      }
    );

    return res.data;
  } catch (err) {
    throw new Error(err.response.data.message);
  }
};

export const unsaveJob = async (user, jobId) => {
  try {
    const res = await axiosInstance.post('/applicants/unsave-job',
      { jobId },
      {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });
    return res.data;
  } catch (err) {
    throw new Error(err.response.data.message);
  }
};

export const getRecruiterApplications = async (user, job) => {
  try {
    const res = await axiosInstance.get(`/recruiters/recruiter/${job}`, 
      {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      }
    );
    return res.data;
  } catch (err) {
    throw new Error(err.response.data.message);
  }
};

export const getUserJobs = async (user) => {
  try {
    const res = await axiosInstance.get(`/jobs/${user._id}/jobs`, 
      {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      }
    );
    return res.data;
  } catch (err) {
    throw new Error(err.response.data.message);
  }
};

export const getProfile = async (user) => {
  try {
    const res = await axiosInstance.get('/profile', 
      {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      }
    );
    return res.data;
  } catch (err) {
    throw new Error(err.response.data.message);
  }
};

export const updateProfile = async (user, formData) => {
  try {
    const res = await axiosInstance.put('/profile',
      formData, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        }
      }
    );
    return res.data;
  } catch (err) {
    throw new Error(err.response.data.message);
  }
};

export const putJob = async (user, jobData) => {
  try {
    const res = await axiosInstance.post('/jobs/', 
      jobData, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      }
    );
    return res.data;
  } catch (err) {
    throw new Error(err.response.data.message);
  }
};

export const applyToJob = async (user, formData, jobId) => {
  try {
    const res = await axiosInstance.post(`/applicants/apply/${jobId}`,
      formData, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      }
    );

    await axiosInstance.post(`/jobs/${jobId}/increment-applications`, {}, {
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    });
    return res.data;
  } catch (err) {
    throw new Error(err.response.data.message);
  }
};

export const updateJob = async (user, jobId, jobData) => {
  try {
    const res = await axiosInstance.put(`/jobs/${jobId}`, jobData, {
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    });
    return res.data;
  } catch (err) {
    throw new Error(err.response.data.message);
  }
};

export const getJobById = async (jobId, user) => {
  try {
    const res = await axiosInstance.get(`/jobs/${jobId}`);
    return res.data;
  } catch (err) {
    throw new Error(err.response.data.message);
  }
};

export const incrementJobViews = async (jobId) => {
  try {
    const res = await axiosInstance.post(`/jobs/${jobId}/increment-views`);
    return res.data;
  } catch (err) {
    // We can silently fail here if views don't increment
    console.error('Failed to increment views:', err);
  }
};

export const updateApplication = async (user, applicationId, status) => {
  try {
    const res = await axiosInstance.put(`/recruiters/applications/${applicationId}/status`, 
      { status }, // Ensure status is sent as an object
      {
        headers: {
          Authorization: `Bearer ${user.token}`,
        }
      }
    );
    return res.data; // Ensure the function returns the response data
  } catch (err) {
    throw new Error(err.response?.data?.message || 'Error updating application status'); // Properly handle and throw the error
  }
};

export const fetchRecruiterJobs = async(user) => {
  try {
    const res = await axiosInstance.get(`/recruiters/recruiter/jobs/${user._id}`, 
      {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      }
    );
    return res.data;
  } catch (err) {
    throw new Error(err.response.data.message);
  }
};

export const searchApplicants = async (user, { query, jobId }) => {
  try {
    const res = await axiosInstance.post(
      '/recruiters/cv/search',
      { query, jobId },
      {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      }
    );
    return res.data;
  } catch (err) {
    throw new Error(err.response?.data?.message || 'Error searching applications');
  }
};

export const deleteJob = async (user, jobId) => {
  const response = await axiosInstance.delete(`/jobs/${jobId}`, {
    headers: {
      Authorization: `Bearer ${user.token}`,
    },
  });
  return response.data;
};

export const getAllRecruiterApplications = async (user) => {
  try {
    const res = await axiosInstance.get('/recruiters/recruiter/all-applications', {
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    });
    return res.data;
  } catch (err) {
    throw new Error(err.response?.data?.message || 'Error fetching all applications');
  }
};
