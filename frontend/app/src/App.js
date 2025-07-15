import React, { useState } from 'react';
import { register, login, createJobApplication, getJobApplications } from './services/api';
import { createReminder, getReminders } from './services/api';

function App() {
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'student' });
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [message, setMessage] = useState('');

  const [user, setUser] = useState(null);
  const [jobForm, setJobForm] = useState({ company: '', position: '', status: 'applied' });
  const [jobApps, setJobApps] = useState([]);

  const [reminderForm, setReminderForm] = useState({ title: '', description: '', dateTime: '', type: 'test' });
  const [reminders, setReminders] = useState([]);

  const [allJobApps, setAllJobApps] = useState([]);
  const [allStudents, setAllStudents] = useState([]);


  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const res = await register(form);
      setMessage(res.data.message);
    } catch (err) {
      setMessage(err.response.data.error);
    }
  };

  // Update handleLogin to save user info
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await login(loginForm);
      setMessage(res.data.message + ' | Welcome, ' + res.data.user.name);
      setUser(res.data.user); // Save user info
    } catch (err) {
      setMessage(err.response.data.error);
    }
  };

    // Handle job application submission
    const handleJobSubmit = async (e) => {
      e.preventDefault();
      try {
        await createJobApplication({ ...jobForm, student: user.id });
        setMessage('Job application submitted!');
        setJobForm({ company: '', position: '', status: 'applied' });
        fetchJobApps();
      } catch (err) {
        setMessage(err.response.data.error);
      }
    };

  
    // Fetch job applications for the logged-in student
    const fetchJobApps = async () => {
      if (!user) return;
      const res = await getJobApplications(user.id);
      setJobApps(res.data);
    };

    // Handle reminder submission
    const handleReminderSubmit = async (e) => {
      e.preventDefault();
      try {
        await createReminder({ ...reminderForm, user: user.id });
        setMessage('Reminder created!');
        setReminderForm({ title: '', description: '', dateTime: '', type: 'test' });
        fetchReminders();
      } catch (err) {
        setMessage(err.response.data.error);
      }
    };

    // Fetch reminders for the logged-in user
    const fetchReminders = async () => {
      if (!user) return;
      const res = await getReminders(user.id);
      setReminders(res.data);
    };

    const fetchAllJobApps = async () => {
      const res = await getAllJobApplications();
      setAllJobApps(res.data);
    };

    const fetchAllStudents = async () => {
      const res = await getAllStudents();
      setAllStudents(res.data);
    };

      // Fetch job applications when user logs in
  React.useEffect(() => {
    if (user) fetchJobApps();
  }, [user]);

  // Fetch reminders when user logs in
  React.useEffect(() => {
    if (user) fetchReminders();
  }, [user]);

  // Fetch TPO data when TPO logs in
  React.useEffect(() => {
    if (user && user.role === 'tpo') {
      fetchAllJobApps();
      fetchAllStudents();
    }
  }, [user]);

  return (
    <div>
      <h2>Register</h2>
      <form onSubmit={handleRegister}>
        <input placeholder="Name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
        <input placeholder="Email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
        <input placeholder="Password" type="password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} />
        <select value={form.role} onChange={e => setForm({ ...form, role: e.target.value })}>
          <option value="student">Student</option>
          <option value="tpo">TPO</option>
        </select>
        <button type="submit">Register</button>
      </form>

      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <input placeholder="Email" value={loginForm.email} onChange={e => setLoginForm({ ...loginForm, email: e.target.value })} />
        <input placeholder="Password" type="password" value={loginForm.password} onChange={e => setLoginForm({ ...loginForm, password: e.target.value })} />
        <button type="submit">Login</button>
      </form>

      {user && user.role === 'student' && (
        <div>
          <h2>Log Job Application</h2>
          <form onSubmit={handleJobSubmit}>
            <input placeholder="Company" value={jobForm.company} onChange={e => setJobForm({ ...jobForm, company: e.target.value })} />
            <input placeholder="Position" value={jobForm.position} onChange={e => setJobForm({ ...jobForm, position: e.target.value })} />
            <select value={jobForm.status} onChange={e => setJobForm({ ...jobForm, status: e.target.value })}>
              <option value="applied">Applied</option>
              <option value="shortlisted">Shortlisted</option>
              <option value="interview">Interview</option>
              <option value="offered">Offered</option>
              <option value="rejected">Rejected</option>
            </select>
            <button type="submit">Add Application</button>
          </form>

          <h3>Your Job Applications</h3>
          <ul>
            {jobApps.map(app => (
              <li key={app._id}>
                {app.company} - {app.position} ({app.status})
              </li>
            ))}
          </ul>
        </div>
      )}

      {user && (
        <div>
          <h2>Add Reminder/Event</h2>
          <form onSubmit={handleReminderSubmit}>
            <input placeholder="Title" value={reminderForm.title} onChange={e => setReminderForm({ ...reminderForm, title: e.target.value })} />
            <input placeholder="Description" value={reminderForm.description} onChange={e => setReminderForm({ ...reminderForm, description: e.target.value })} />
            <input type="datetime-local" value={reminderForm.dateTime} onChange={e => setReminderForm({ ...reminderForm, dateTime: e.target.value })} />
            <select value={reminderForm.type} onChange={e => setReminderForm({ ...reminderForm, type: e.target.value })}>
              <option value="test">Test</option>
              <option value="interview">Interview</option>
              <option value="other">Other</option>
            </select>
            <button type="submit">Add Reminder</button>
          </form>
          <h3>Your Reminders</h3>
          <ul>
            {reminders.map(rem => (
              <li key={rem._id}>
                {rem.title} ({rem.type}) - {new Date(rem.dateTime).toLocaleString()}
              </li>
            ))}
          </ul>
        </div>
      )}

      {user && user.role === 'tpo' && (
        <div>
          <h2>TPO Dashboard</h2>
          <h3>All Students</h3>
          <ul>
            {allStudents.map(stu => (
              <li key={stu._id}>{stu.name} ({stu.email})</li>
            ))}
          </ul>
          <h3>All Job Applications</h3>
          <ul>
            {allJobApps.map(app => (
              <li key={app._id}>
                {app.company} - {app.position} ({app.status}) | Student: {app.student?.name} ({app.student?.email})
              </li>
            ))}
          </ul>
        </div>
      )}

      <div>{message}</div>
    </div>
  );
}

export default App;
