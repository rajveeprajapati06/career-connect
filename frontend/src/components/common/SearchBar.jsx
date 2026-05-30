import React, { useState } from 'react';
import { Search, MapPin } from 'lucide-react';

const SearchBar = ({ onSearch, initialSearch = '', initialLocation = '' }) => {
  const [search, setSearch] = useState(initialSearch);
  const [location, setLocation] = useState(initialLocation);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSearch) {
      onSearch({ search, location });
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full bg-white dark:bg-gray-900 shadow-xl border border-gray-100 dark:border-gray-800 rounded-2xl md:rounded-3xl p-2 md:p-3 flex flex-col md:flex-row items-center gap-2 md:gap-4 backdrop-blur-xl transition-all duration-300"
    >
      {/* Search Query Input */}
      <div className="flex items-center w-full px-3 py-2 border-b border-gray-100 dark:border-gray-800 md:border-b-0 md:border-r md:border-gray-200 dark:md:border-gray-800">
        <Search className="w-5 h-5 text-indigo-500 mr-3 shrink-0" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Job title, keywords, or skills..."
          className="w-full bg-transparent border-0 outline-none text-sm text-gray-800 dark:text-gray-200 placeholder-gray-400 focus:ring-0"
        />
      </div>

      {/* Location Input */}
      <div className="flex items-center w-full px-3 py-2 md:border-r-0">
        <MapPin className="w-5 h-5 text-indigo-500 mr-3 shrink-0" />
        <input
          type="text"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder="City, state, or 'Remote'..."
          className="w-full bg-transparent border-0 outline-none text-sm text-gray-800 dark:text-gray-200 placeholder-gray-400 focus:ring-0"
        />
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        className="w-full md:w-auto px-8 py-3.5 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 md:rounded-2xl rounded-xl shadow-lg shadow-indigo-600/20 hover:shadow-indigo-600/35 transition-all duration-200 hover:-translate-y-0.5 shrink-0"
      >
        Search Jobs
      </button>
    </form>
  );
};

export default SearchBar;
