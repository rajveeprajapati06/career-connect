import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { updateProfile } from '../services/api';
import { motion } from 'framer-motion';
import { User as UserIcon, Mail, Lock, Eye, EyeOff, Briefcase, ArrowRight, Building } from 'lucide-react';
import { toast } from 'react-hot-toast';

const Register = () => {
  const [role, setRole] = useState('candidate'); // candidate or employer
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [companyName, setCompanyName] = useState(''); // Only for employers
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const { register, user } = useAuth();
  const navigate = useNavigate();

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      navigate(user.role === 'employer' ? '/dashboard/employer' : '/dashboard/candidate');
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !email || !password || !confirmPassword) {
      toast.error('Please enter all required fields');
      return;
    }

    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    if (role === 'employer' && !companyName) {
      toast.error('Company Name is required for Employer registration');
      return;
    }

    setSubmitting(true);
    const result = await register(name, email, password, role);

    if (result && result.success && role === 'employer') {
      try {
        // Automatically sync companyName in user profile for employer
        await updateProfile({ companyName });
      } catch (err) {
        console.error('Failed to sync company name:', err);
      }
    }
    setSubmitting(false);
  };

  return (
    <div className="min-h-[90vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-950 transition-colors duration-300 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-7xl h-full pointer-events-none overflow-hidden">
        <div className="absolute top-[20%] right-[20%] w-[35%] h-[35%] rounded-full bg-indigo-500/5 blur-[120px]"></div>
        <div className="absolute bottom-[20%] left-[20%] w-[35%] h-[35%] rounded-full bg-purple-500/5 blur-[120px]"></div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full space-y-8 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 p-8 md:p-10 rounded-3xl shadow-xl backdrop-blur-xl relative z-10"
      >
        {/* Header */}
        <div className="text-center">
          <div className="inline-flex w-12 h-12 rounded-2xl bg-indigo-600 items-center justify-center text-white shadow-lg shadow-indigo-600/10 mb-4">
            <Briefcase className="w-6 h-6" />
          </div>
          <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
            Create Account
          </h2>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            Sign up to access jobs and manage listings.
          </p>
        </div>

        {/* Role Toggler Buttons */}
        <div className="grid grid-cols-2 gap-2 bg-gray-50 dark:bg-gray-950 p-1.5 rounded-2xl border border-gray-100 dark:border-gray-800">
          <button
            type="button"
            onClick={() => setRole('candidate')}
            className={`py-3 rounded-xl text-sm font-semibold flex items-center justify-center transition-all duration-200 ${
              role === 'candidate'
                ? 'bg-white dark:bg-gray-900 text-indigo-600 dark:text-indigo-400 shadow-sm border border-gray-100 dark:border-gray-800/80'
                : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
          >
            <UserIcon className="w-4 h-4 mr-2" />
            Candidate
          </button>
          <button
            type="button"
            onClick={() => setRole('employer')}
            className={`py-3 rounded-xl text-sm font-semibold flex items-center justify-center transition-all duration-200 ${
              role === 'employer'
                ? 'bg-white dark:bg-gray-900 text-indigo-600 dark:text-indigo-400 shadow-sm border border-gray-100 dark:border-gray-800/80'
                : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
          >
            <Building className="w-4 h-4 mr-2" />
            Employer
          </button>
        </div>

        <form className="mt-6 space-y-5" onSubmit={handleSubmit}>
          <div className="space-y-4">
            {/* Full Name */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                Full Name
              </label>
              <div className="flex items-center bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-xl px-3.5 py-3">
                <UserIcon className="w-5 h-5 text-gray-400 mr-2.5 shrink-0" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="John Doe"
                  className="w-full bg-transparent border-0 outline-none text-sm text-gray-800 dark:text-gray-200 placeholder-gray-400 focus:ring-0"
                  required
                />
              </div>
            </div>

            {/* Company Name (Employer only) */}
            {role === 'employer' && (
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                  Company Name
                </label>
                <div className="flex items-center bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-xl px-3.5 py-3">
                  <Building className="w-5 h-5 text-gray-400 mr-2.5 shrink-0" />
                  <input
                    type="text"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    placeholder="e.g. Acme Corporation"
                    className="w-full bg-transparent border-0 outline-none text-sm text-gray-800 dark:text-gray-200 placeholder-gray-400 focus:ring-0"
                    required
                  />
                </div>
              </div>
            )}

            {/* Email Address */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                Email Address
              </label>
              <div className="flex items-center bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-xl px-3.5 py-3">
                <Mail className="w-5 h-5 text-gray-400 mr-2.5 shrink-0" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full bg-transparent border-0 outline-none text-sm text-gray-800 dark:text-gray-200 placeholder-gray-400 focus:ring-0"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                Password
              </label>
              <div className="flex items-center bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-xl px-3.5 py-3">
                <Lock className="w-5 h-5 text-gray-400 mr-2.5 shrink-0" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Min 6 characters"
                  className="w-full bg-transparent border-0 outline-none text-sm text-gray-800 dark:text-gray-200 placeholder-gray-400 focus:ring-0"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                Confirm Password
              </label>
              <div className="flex items-center bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-xl px-3.5 py-3">
                <Lock className="w-5 h-5 text-gray-400 mr-2.5 shrink-0" />
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Repeat password"
                  className="w-full bg-transparent border-0 outline-none text-sm text-gray-800 dark:text-gray-200 placeholder-gray-400 focus:ring-0"
                  required
                />
              </div>
            </div>
          </div>

          {/* Submit */}
          <div>
            <button
              type="submit"
              disabled={submitting}
              className="w-full flex justify-center items-center py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-bold shadow-lg shadow-indigo-600/10 hover:shadow-indigo-600/25 transition-all duration-200 hover:-translate-y-0.5 disabled:opacity-50"
            >
              {submitting ? 'Registering...' : 'Register'}
              <ArrowRight className="w-4 h-4 ml-2" />
            </button>
          </div>
        </form>

        <div className="text-center pt-2">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Already have an account?{' '}
            <Link
              to="/login"
              className="font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors"
            >
              Sign In
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Register;
