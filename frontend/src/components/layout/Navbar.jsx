import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Briefcase,
  Menu,
  X,
  Sun,
  Moon,
  LogOut,
  User as UserIcon,
  LayoutDashboard,
  Bookmark,
  History,
} from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { darkMode, toggleTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
    setMobileMenuOpen(false);
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Find Jobs', path: '/jobs' },
  ];

  return (
    <nav className="sticky top-0 z-50 w-full glass dark:bg-gray-950/80 dark:border-gray-800/50 backdrop-blur-xl border-b border-gray-200/50 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2 group">
              <div className="w-10 h-10 rounded-xl gradient-bg flex items-center justify-center text-white shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform duration-200">
                <Briefcase className="w-5 h-5" />
              </div>
              <span className="text-xl font-bold font-sans tracking-tight gradient-text">
                CareerConnect
              </span>
            </Link>
          </div>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center space-x-1 lg:space-x-4">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={`px-3 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                  isActive(link.path)
                    ? 'bg-indigo-50 text-indigo-600 dark:bg-indigo-950/50 dark:text-indigo-400'
                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800/60 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                {link.name}
              </Link>
            ))}

            {/* Role-based links */}
            {user && user.role === 'candidate' && (
              <>
                <Link
                  to="/dashboard/candidate"
                  className={`px-3 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                    isActive('/dashboard/candidate')
                      ? 'bg-indigo-50 text-indigo-600 dark:bg-indigo-950/50 dark:text-indigo-400'
                      : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800/60 hover:text-gray-900 dark:hover:text-white'
                  }`}
                >
                  Dashboard
                </Link>
                <Link
                  to="/applications"
                  className={`px-3 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                    isActive('/applications')
                      ? 'bg-indigo-50 text-indigo-600 dark:bg-indigo-950/50 dark:text-indigo-400'
                      : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800/60'
                  }`}
                >
                  My Applied
                </Link>
              </>
            )}

            {user && user.role === 'employer' && (
              <Link
                to="/dashboard/employer"
                className={`px-3 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                  isActive('/dashboard/employer')
                    ? 'bg-indigo-50 text-indigo-600 dark:bg-indigo-950/50 dark:text-indigo-400'
                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800/60'
                }`}
              >
                Employer Portal
              </Link>
            )}
          </div>

          {/* Desktop Right Hand Side Actions */}
          <div className="hidden md:flex items-center space-x-2 lg:space-x-3">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800 focus:outline-none transition-colors duration-200"
              aria-label="Toggle Dark Mode"
            >
              {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>

            {user ? (
              <div className="flex items-center space-x-2 border-l border-gray-200 dark:border-gray-800 pl-3">
                {/* Profile Link */}
                <Link
                  to="/profile"
                  className="flex items-center space-x-2 p-1.5 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800/60 transition-colors"
                >
                  {user.profilePicture || user.companyLogo ? (
                    <img
                      src={user.profilePicture || user.companyLogo}
                      alt={user.name}
                      className="w-8 h-8 rounded-lg object-cover border border-indigo-500/20"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-lg bg-indigo-100 dark:bg-indigo-950/50 flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-bold text-sm">
                      {(user.name || 'User').charAt(0).toUpperCase()}
                    </div>
                  )}
                  <span className="text-sm font-semibold text-gray-700 dark:text-gray-200 max-w-[100px] truncate">
                    {user.name || 'User'}
                  </span>
                </Link>

                {/* Logout Button */}
                <button
                  onClick={handleLogout}
                  className="p-2 rounded-xl text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors duration-200"
                  title="Logout"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-2 border-l border-gray-200 dark:border-gray-800 pl-3">
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-semibold text-gray-700 dark:text-gray-200 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-md shadow-indigo-600/10 hover:shadow-lg transition-all duration-200"
                >
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* Mobile hamburger menu button */}
          <div className="flex items-center md:hidden space-x-2">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden border-t border-gray-200/50 dark:border-gray-800/50 bg-white dark:bg-gray-950"
          >
            <div className="px-2 pt-2 pb-4 space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center px-4 py-2.5 rounded-xl text-base font-medium transition-colors ${
                    isActive(link.path)
                      ? 'bg-indigo-50 text-indigo-600 dark:bg-indigo-950/50 dark:text-indigo-400'
                      : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-900'
                  }`}
                >
                  {link.name}
                </Link>
              ))}

              {user && user.role === 'candidate' && (
                <>
                  <Link
                    to="/dashboard/candidate"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center px-4 py-2.5 rounded-xl text-base font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-900"
                  >
                    <LayoutDashboard className="w-5 h-5 mr-3 text-gray-400" />
                    Dashboard
                  </Link>
                  <Link
                    to="/applications"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center px-4 py-2.5 rounded-xl text-base font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-900"
                  >
                    <History className="w-5 h-5 mr-3 text-gray-400" />
                    Applied Jobs
                  </Link>
                </>
              )}

              {user && user.role === 'employer' && (
                <Link
                  to="/dashboard/employer"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center px-4 py-2.5 rounded-xl text-base font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-900"
                >
                  <LayoutDashboard className="w-5 h-5 mr-3 text-gray-400" />
                  Employer Dashboard
                </Link>
              )}

              {user ? (
                <div className="border-t border-gray-100 dark:border-gray-800/80 mt-4 pt-4 px-4">
                  <Link
                    to="/profile"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center space-x-3 py-2.5"
                  >
                    {user.profilePicture || user.companyLogo ? (
                      <img
                        src={user.profilePicture || user.companyLogo}
                        alt={user.name}
                        className="w-10 h-10 rounded-xl object-cover border border-indigo-500/20"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-xl bg-indigo-100 dark:bg-indigo-950/50 flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-bold">
                        {(user.name || 'User').charAt(0).toUpperCase()}
                      </div>
                    )}
                    <div>
                      <div className="font-semibold text-gray-800 dark:text-gray-200">
                        {user.name || 'User'}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {user.email}
                      </div>
                    </div>
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full mt-3 flex items-center justify-center px-4 py-2.5 rounded-xl text-base font-medium text-red-600 bg-red-50 dark:bg-red-950/20 dark:text-red-400 hover:bg-red-100 transition-colors duration-200"
                  >
                    <LogOut className="w-5 h-5 mr-2" />
                    Logout
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-2 border-t border-gray-100 dark:border-gray-800 mt-4 pt-4 px-4">
                  <Link
                    to="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-center px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-800 text-sm font-semibold text-gray-700 dark:text-gray-200"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-center px-4 py-2.5 rounded-xl bg-indigo-600 text-sm font-semibold text-white shadow-md"
                  >
                    Register
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
