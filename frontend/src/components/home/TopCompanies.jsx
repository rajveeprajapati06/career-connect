import React from 'react';
import { Link } from 'react-router-dom';
import { Building, MapPin, ExternalLink } from 'lucide-react';

const TopCompanies = () => {
  const companies = [
    { name: 'TechGlobal', industry: 'Software Engineering', location: 'San Francisco, CA', jobs: '24 open jobs', logo: 'TG', color: 'bg-blue-500' },
    { name: 'ApexFinance', industry: 'Investment Banking', location: 'New York, NY', jobs: '15 open jobs', logo: 'AF', color: 'bg-indigo-500' },
    { name: 'PixelDesign', industry: 'Creative Studio', location: 'Remote / London', jobs: '8 open jobs', logo: 'PD', color: 'bg-purple-500' },
    { name: 'MedLabs', industry: 'Biotechnology', location: 'Boston, MA', jobs: '11 open jobs', logo: 'ML', color: 'bg-emerald-500' },
    { name: 'StellarSales', industry: 'SaaS Marketing', location: 'Chicago, IL', jobs: '18 open jobs', logo: 'SS', color: 'bg-amber-500' },
    { name: 'EduLearn', industry: 'Online Education', location: 'Austin, TX', jobs: '6 open jobs', logo: 'EL', color: 'bg-rose-500' },
  ];

  return (
    <section className="py-20 bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white">
            Top Companies Hiring
          </h2>
          <p className="text-gray-500 dark:text-gray-400">
            Work with some of the most innovative companies in the world. Explore open opportunities and apply today.
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {companies.map((company, index) => (
            <div
              key={index}
              className="bg-gray-50 dark:bg-gray-950 border border-gray-100 dark:border-gray-800/80 rounded-2xl p-6 flex items-start space-x-4 hover:bg-white dark:hover:bg-gray-900 hover:shadow-xl hover:border-indigo-500/20 dark:hover:border-indigo-500/10 transition-all duration-300"
            >
              {/* Logo block */}
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-lg shrink-0 shadow-sm ${company.color}`}>
                {company.logo}
              </div>
              
              {/* Content */}
              <div className="space-y-1 w-full">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-gray-900 dark:text-white line-clamp-1">
                    {company.name}
                  </h3>
                  <Building className="w-4 h-4 text-gray-400" />
                </div>
                <p className="text-xs font-semibold text-indigo-600 dark:text-indigo-400">
                  {company.industry}
                </p>
                <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                  <MapPin className="w-3.5 h-3.5 mr-1" />
                  <span>{company.location}</span>
                </div>
                <div className="pt-2 flex items-center justify-between">
                  <span className="text-xs font-bold text-gray-800 dark:text-gray-200">
                    {company.jobs}
                  </span>
                  <Link
                    to={`/jobs?search=${company.name}`}
                    className="inline-flex items-center text-xs font-semibold text-gray-500 hover:text-indigo-600 dark:text-gray-400 dark:hover:text-indigo-400 transition-colors"
                  >
                    View Positions
                    <ExternalLink className="w-3 h-3 ml-1" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TopCompanies;
