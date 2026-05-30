import React from 'react';
import { Briefcase, Building, Users, Award } from 'lucide-react';

const Statistics = () => {
  const stats = [
    { label: 'Active Jobs', value: '14K+', icon: Briefcase, desc: 'Live opportunities updated daily' },
    { label: 'Verified Employers', value: '8K+', icon: Building, desc: 'Leading global enterprises hiring' },
    { label: 'Candidates Hired', value: '25K+', icon: Users, desc: 'Professionals placed in roles' },
    { label: 'Success Rate', value: '98%', icon: Award, desc: 'Matching accuracy & placement' },
  ];

  return (
    <section className="py-20 bg-gray-50 dark:bg-gray-950 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div
                key={index}
                className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-3xl p-6 text-center shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
              >
                <div className="inline-flex p-4 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 mb-5">
                  <Icon className="w-6 h-6" />
                </div>
                <div className="text-4xl font-extrabold text-gray-900 dark:text-white mb-2 tracking-tight">
                  {stat.value}
                </div>
                <div className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-1">
                  {stat.label}
                </div>
                <div className="text-xs text-gray-400 dark:text-gray-500 leading-normal">
                  {stat.desc}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Statistics;
