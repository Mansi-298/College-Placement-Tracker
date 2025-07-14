import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5000/api',
});

// Auth
export const register = (data) => API.post('/auth/register', data);
export const login = (data) => API.post('/auth/login', data);

// Job Applications
export const createJobApplication = (data) => API.post('/job-applications', data);
export const getJobApplications = (studentId) => API.get(`/job-applications/student/${studentId}`);

// Reminders
export const createReminder = (data) => API.post('/reminders', data);
export const getReminders = (userId) => API.get(`/reminders/user/${userId}`);