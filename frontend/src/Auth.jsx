// frontend/src/Auth.jsx
import { useState } from 'react';
import api from './api';

export default function Auth({ setToken }) {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('member'); // Default to member for signups
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      if (isLogin) {
        // Log in
        const formData = new URLSearchParams();
        formData.append('username', username);
        formData.append('password', password);

        const response = await api.post('/login', formData);
        localStorage.setItem('token', response.data.access_token);
        localStorage.setItem('role', response.data.role);
        setToken(response.data.access_token);
      } else {
        // Sign up
        await api.post('/signup', { username, password, role });
        setSuccess('Account created successfully! Please log in.');
        setIsLogin(true); // Switch back to login view
        setPassword(''); // Clear password for safety
      }
    } catch (err) {
      setError(err.response?.data?.detail || 'An error occurred. Is your backend running?');
    }
  };

  return (
    <div className="flex justify-center items-center mt-16">
      <div className="bg-white p-8 rounded-lg shadow-lg w-96 border border-gray-100">
        <h2 className="text-2xl font-bold mb-6 text-center text-slate-800">
          {isLogin ? 'Welcome Back' : 'Create Account'}
        </h2>
        
        {error && <div className="bg-red-100 text-red-600 p-3 rounded mb-4 text-sm font-medium">{error}</div>}
        {success && <div className="bg-green-100 text-green-600 p-3 rounded mb-4 text-sm font-medium">{success}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
            <input
              type="text"
              required
              className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-slate-500 outline-none"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              type="password"
              required
              className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-slate-500 outline-none"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {!isLogin && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
              <select
                className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-slate-500 outline-none"
                value={role}
                onChange={(e) => setRole(e.target.value)}
              >
                <option value="member">Team Member</option>
                <option value="admin">Project Admin</option>
              </select>
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-slate-900 text-white font-bold py-2 px-4 rounded hover:bg-slate-800 transition"
          >
            {isLogin ? 'Log In' : 'Sign Up'}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-600">
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <button
            onClick={() => { setIsLogin(!isLogin); setError(''); setSuccess(''); }}
            className="text-blue-600 font-semibold hover:underline"
          >
            {isLogin ? 'Sign up here' : 'Log in here'}
          </button>
        </div>
      </div>
    </div>
  );
}