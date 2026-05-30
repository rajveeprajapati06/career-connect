import React from 'react';
import { motion } from 'framer-motion';

const StatsCard = ({ title, value, icon: Icon, color = 'indigo' }) => {
  const colorMap = {
    indigo: 'bg-indigo-50 text-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-400',
    purple: 'bg-purple-50 text-purple-600 dark:bg-purple-950/40 dark:text-purple-400',
    emerald: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400',
    amber: 'bg-amber-50 text-amber-600 dark:bg-amber-950/40 dark:text-amber-400',
    rose: 'bg-rose-50 text-rose-600 dark:bg-rose-950/40 dark:text-rose-400',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-3xl p-6 flex items-center justify-between shadow-sm hover:shadow-md transition-shadow"
    >
      <div className="space-y-1.5">
        <p className="text-sm font-semibold text-gray-400 dark:text-gray-500">
          {title}
        </p>
        <p className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
          {value}
        </p>
      </div>
      <div className={`p-4 rounded-2xl shrink-0 ${colorMap[color] || colorMap.indigo}`}>
        <Icon className="w-6 h-6" />
      </div>
    </motion.div>
  );
};

export default StatsCard;
