// Login page — asks for a name and presents two role buttons: Student and Admin.
// No real password needed; this is fake auth for demo purposes.

import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { User, Shield, Calendar } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const [name, setName] = useState('');
  const [nameError, setNameError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // After login, redirect to the page the user was trying to visit, or home.
  const from = location.state?.from || '/';

  function handleLogin(role) {
    if (!name.trim() || name.trim().length < 2) {
      setNameError('Please enter your name (at least 2 characters).');
      return;
    }
    setNameError('');
    login(name.trim(), role);
    navigate(from, { replace: true });
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8">

        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-100 rounded-2xl mb-4">
            <Calendar className="w-8 h-8 text-indigo-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Welcome to CampusEvent</h1>
          <p className="text-gray-500 text-sm mt-1">Sign in to browse and register for events</p>
        </div>

        {/* Name input */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Your Name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              if (nameError) setNameError('');
            }}
            placeholder="Enter your full name"
            className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 text-sm ${
              nameError ? 'border-red-400' : 'border-gray-300'
            }`}
          />
          {nameError && <p className="text-red-500 text-xs mt-1">{nameError}</p>}
        </div>

        {/* Role buttons */}
        <div className="flex flex-col gap-3">
          <button
            onClick={() => handleLogin('student')}
            className="flex items-center justify-center gap-3 w-full px-4 py-3.5 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 transition-colors"
          >
            <User className="w-5 h-5" />
            Login as Student
          </button>
          <button
            onClick={() => handleLogin('admin')}
            className="flex items-center justify-center gap-3 w-full px-4 py-3.5 bg-gray-800 text-white rounded-xl font-medium hover:bg-gray-900 transition-colors"
          >
            <Shield className="w-5 h-5" />
            Login as Admin
          </button>
        </div>

        <p className="text-center text-xs text-gray-400 mt-6">
          No password required · Demo application
        </p>
      </div>
    </div>
  );
}
