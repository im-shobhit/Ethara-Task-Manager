// frontend/src/App.jsx
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useState } from 'react';
import Auth from './Auth';
import Dashboard from './Dashboard'; // <-- Ensure this is here

function App() {
  const [token, setToken] = useState(localStorage.getItem('token'));

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    setToken(null);
  };

  return (
    <BrowserRouter>
      {/* 1. Added a soft, modern gradient background to the whole app */}
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-200">
        
        {/* 2. Upgraded Navbar: Taller Banner & Larger Title */}
        <nav className="relative bg-gradient-to-r from-indigo-900 to-slate-900 px-8 shadow-xl flex justify-end items-center border-b-4 border-indigo-500 h-24">
          
          {/* The Absolute Centered, Larger Title */}
          <h1 className="absolute left-1/2 -translate-x-1/2 text-4xl lg:text-5xl font-extrabold tracking-wider flex items-center gap-3 text-white drop-shadow-md">
            <span className="text-indigo-400">⚡</span> Ethara.AI
          </h1>

          {/* The Logout Button (Slightly larger to match the new scale) */}
          {token && (
            <button 
              onClick={handleLogout} 
              className="bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white border-2 border-red-500 px-6 py-2 rounded-lg text-sm font-bold transition-all duration-300 z-10 hover:shadow-lg hover:shadow-red-500/20"
            >
              Logout
            </button>
          )}
        </nav>

        <div className="w-[95%] max-w-[1600px] mx-auto p-4 mt-10">
          <Routes>
            <Route path="/" element={token ? <Navigate to="/dashboard" /> : <Auth setToken={setToken} />} />
            <Route path="/dashboard" element={token ? <Dashboard /> : <Navigate to="/" />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;