import axios from 'axios';

// Create api instance
const api = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Sync request interceptor for tokens
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for session expiry handling (401)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Clear token and reload or let context handle it
      localStorage.removeItem('token');
      // If we are not on login page, we can redirect
      if (!window.location.pathname.includes('/login') && !window.location.pathname.includes('/register') && window.location.pathname !== '/') {
        window.location.href = '/login?expired=true';
      }
    }
    return Promise.reject(error);
  }
);

// API Endpoints Mapping

// Auth Service
export const loginUser = (credentials) => api.post('/auth/login', credentials);
export const registerUser = (userData) => api.post('/auth/register', userData);
export const getMe = () => api.get('/auth/me');
export const logoutUser = () => api.post('/auth/logout');

// Jobs Service
export const getJobs = (params = {}) => api.get('/jobs', { params });
export const getJob = (id) => api.get(`/jobs/${id}`);
export const getFeaturedJobs = () => api.get('/jobs/featured');
export const createJob = (jobData) => api.post('/jobs', jobData);
export const updateJob = (id, jobData) => api.put(`/jobs/${id}`, jobData);
export const deleteJob = (id) => api.delete(`/jobs/${id}`);
export const getJobStats = () => api.get('/jobs/stats');

// Applications Service
export const applyForJob = (formData) => {
  // Uses multipart/form-data for resume files
  return api.post('/applications', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};
export const getMyApplications = () => api.get('/applications/my');
export const getEmployerApplications = () => api.get('/applications/employer');
export const getJobApplications = (jobId) => api.get(`/applications/job/${jobId}`);
export const updateApplicationStatus = (id, status) => api.put(`/applications/${id}/status`, { status });

// Users Service
export const getProfile = () => api.get('/users/profile');
export const updateProfile = (formData) => {
  // Can be JSON or Multipart depending on files
  const isMultipart = formData instanceof FormData;
  return api.put('/users/profile', formData, {
    headers: {
      'Content-Type': isMultipart ? 'multipart/form-data' : 'application/json',
    },
  });
};
export const saveJob = (jobId) => api.post(`/users/save-job/${jobId}`);
export const unsaveJob = (jobId) => api.delete(`/users/save-job/${jobId}`);
export const getSavedJobs = () => api.get('/users/saved-jobs');

export default api;
