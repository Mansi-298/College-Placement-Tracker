import React, { useState } from 'react';
import { register, login, createJobApplication, getJobApplications } from './services/api';

function App() {
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'student' });
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [message, setMessage] = useState('');

  const [user, setUser] = useState(null);
  const [jobForm, setJobForm] = useState({ company: '', position: '', status: 'applied' });
  const [jobApps, setJobApps] = useState([]);


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

      // Fetch job applications when user logs in
  React.useEffect(() => {
    if (user) fetchJobApps();
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

      <div>{message}</div>
    </div>
  );
}

export default App;
