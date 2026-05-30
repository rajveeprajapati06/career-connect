import React from 'react';
import { useNavigate } from 'react-router-dom';
import SearchBar from '../common/SearchBar';
import { motion } from 'framer-motion';
import { Briefcase, Users, Building, ShieldCheck } from 'lucide-react';

const Hero = () => {
  const navigate = useNavigate();

  const handleSearch = ({ search, location }) => {
    const params = new URLSearchParams();
    if (search) params.append('search', search);
    if (location) params.append('location', location);
    navigate(`/jobs?${params.toString()}`);
  };

  const stats = [
    { label: 'Active Jobs', value: '12,000+', icon: Briefcase, color: 'text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/40' },
    { label: 'Top Companies', value: '8,500+', icon: Building, color: 'text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/40' },
    { label: 'Candidates Hired', value: '25,000+', icon: Users, color: 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/40' },
  ];

  return (
    <div className="relative overflow-hidden bg-gray-50 dark:bg-gray-950 pt-20 pb-24 lg:pt-28 lg:pb-36 transition-colors duration-300">
      {/* Background Decorative Gradients */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-400/10 blur-[120px] dark:bg-indigo-500/5"></div>
        <div className="absolute bottom-[10%] right-[-10%] w-[45%] h-[45%] rounded-full bg-purple-400/10 blur-[120px] dark:bg-purple-500/5"></div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        {/* Banner Tag */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center space-x-2 bg-indigo-50 dark:bg-indigo-950/50 border border-indigo-100 dark:border-indigo-900/50 rounded-full px-4 py-1.5 mb-6 shadow-sm"
        >
          <ShieldCheck className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
          <span className="text-xs font-semibold text-indigo-700 dark:text-indigo-300 tracking-wide uppercase">
            Your Trusted Career Partner
          </span>
        </motion.div>

        {/* Heading */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-4xl sm:text-5xl lg:text-6xl font-extrabold font-sans tracking-tight text-gray-900 dark:text-white leading-[1.1] mb-6"
        >
          Find Your Dream Job <br />
          <span className="gradient-text">Today with CareerConnect</span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-base sm:text-lg md:text-xl text-gray-500 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed mb-10"
        >
          Explore thousands of jobs posted by industry leaders. Complete your profile, upload your resume, and apply to top companies in just one click.
        </motion.p>

        {/* Search Bar Wrapper */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="max-w-4xl mx-auto mb-16"
        >
          <SearchBar onSearch={handleSearch} />
        </motion.div>

        {/* Highlight Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-3xl mx-auto pt-6"
        >
          {stats.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <div
                key={idx}
                className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800/80 rounded-2xl p-5 flex items-center space-x-4 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className={`p-3.5 rounded-xl shrink-0 ${stat.color}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div className="text-left">
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">
                    {stat.value}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    {stat.label}
                  </div>
                </div>
              </div>
            );
          })}
        </motion.div>
      </div>
    </div>
  );
};

export default Hero;
