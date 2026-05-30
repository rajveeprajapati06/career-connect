import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Frown } from 'lucide-react';

const NotFound = () => {
  return (
    <div className="min-h-[75vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-950 transition-colors duration-300">
      <div className="max-w-md w-full text-center space-y-6">
        
        {/* Floating Animation Icon */}
        <motion.div
          animate={{ y: [0, -12, 0] }}
          transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
          className="inline-flex w-20 h-20 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 items-center justify-center rounded-3xl shadow-sm mb-4"
        >
          <Frown className="w-10 h-10" />
        </motion.div>

        {/* 404 text details */}
        <div className="space-y-2">
          <h1 className="text-6xl font-extrabold tracking-tight gradient-text">
            404
          </h1>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Page Not Found
          </h2>
          <p className="text-gray-500 dark:text-gray-400 max-w-sm mx-auto text-sm leading-relaxed">
            The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
          </p>
        </div>

        {/* Go Home Action */}
        <div className="pt-4">
          <Link
            to="/"
            className="inline-flex items-center justify-center px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-bold shadow-lg shadow-indigo-600/10 hover:shadow-indigo-600/25 hover:-translate-y-0.5 transition-all duration-200"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Return to Homepage
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
