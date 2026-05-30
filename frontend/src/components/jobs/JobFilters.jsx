import React, { useState } from 'react';
import { Search, MapPin, IndianRupee, Filter, RefreshCw } from 'lucide-react';

const JobFilters = ({ onFilterChange, initialFilters = {} }) => {
  const [search, setSearch] = useState(initialFilters.search || '');
  const [location, setLocation] = useState(initialFilters.location || '');
  const [category, setCategory] = useState(initialFilters.category || '');
  const [type, setType] = useState(initialFilters.type || '');
  const [salaryMin, setSalaryMin] = useState(initialFilters.salaryMin || '');

  const categories = [
    'Technology',
    'Marketing',
    'Design',
    'Finance',
    'Engineering',
    'Sales',
    'Healthcare',
    'Education',
    'Other',
  ];

  const jobTypes = ['Full-Time', 'Part-Time', 'Internship', 'Remote', 'Contract'];

  const handleApply = (e) => {
    e.preventDefault();
    onFilterChange({
      search,
      location,
      category,
      type,
      salaryMin,
    });
  };

  const handleClear = () => {
    setSearch('');
    setLocation('');
    setCategory('');
    setType('');
    setSalaryMin('');
    onFilterChange({
      search: '',
      location: '',
      category: '',
      type: '',
      salaryMin: '',
    });
  };

  return (
    <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-3xl p-6 shadow-sm space-y-6">
      {/* Title */}
      <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-800/80 pb-4">
        <h3 className="font-bold text-gray-900 dark:text-white flex items-center">
          <Filter className="w-5 h-5 mr-2 text-indigo-500" />
          Filter Jobs
        </h3>
        <button
          onClick={handleClear}
          className="text-xs font-semibold text-gray-500 hover:text-indigo-600 dark:text-gray-400 dark:hover:text-indigo-400 flex items-center transition-colors"
        >
          <RefreshCw className="w-3.5 h-3.5 mr-1" />
          Reset All
        </button>
      </div>

      <form onSubmit={handleApply} className="space-y-5">
        {/* Search Query */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
            Keywords
          </label>
          <div className="flex items-center bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-xl px-3 py-2.5">
            <Search className="w-4 h-4 text-gray-400 mr-2 shrink-0" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Title, skills, company..."
              className="w-full bg-transparent border-0 outline-none text-sm text-gray-800 dark:text-gray-200 placeholder-gray-400"
            />
          </div>
        </div>

        {/* Location Input */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
            Location
          </label>
          <div className="flex items-center bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-xl px-3 py-2.5">
            <MapPin className="w-4 h-4 text-gray-400 mr-2 shrink-0" />
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g. Bengaluru, Mumbai, Remote..."
              className="w-full bg-transparent border-0 outline-none text-sm text-gray-800 dark:text-gray-200 placeholder-gray-400"
            />
          </div>
        </div>

        {/* Category Dropdown */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
            Category
          </label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-xl px-3 py-2.5 text-sm text-gray-700 dark:text-gray-300 focus:outline-none"
          >
            <option value="">All Categories</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        {/* Job Type Dropdown */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
            Job Type
          </label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="w-full bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-xl px-3 py-2.5 text-sm text-gray-700 dark:text-gray-300 focus:outline-none"
          >
            <option value="">All Types</option>
            {jobTypes.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>

        {/* Min Salary Input */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
            Minimum Annual Salary (₹)
          </label>
          <div className="flex items-center bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-xl px-3 py-2.5">
            <IndianRupee className="w-4 h-4 text-gray-400 mr-1.5 shrink-0" />
            <input
              type="number"
              value={salaryMin}
              onChange={(e) => setSalaryMin(e.target.value)}
              placeholder="e.g. 600000"
              className="w-full bg-transparent border-0 outline-none text-sm text-gray-800 dark:text-gray-200 placeholder-gray-400"
            />
          </div>
        </div>

        {/* Apply Button */}
        <button
          type="submit"
          className="w-full mt-2 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-semibold shadow-md shadow-indigo-600/10 hover:shadow-lg transition-all duration-200"
        >
          Apply Filters
        </button>
      </form>
    </div>
  );
};

export default JobFilters;
