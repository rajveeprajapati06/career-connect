import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import JobFilters from '../components/jobs/JobFilters';
import JobCard from '../components/jobs/JobCard';
import Pagination from '../components/jobs/Pagination';
import LoadingSkeleton from '../components/common/LoadingSkeleton';
import { getJobs } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { ArrowUpDown, Briefcase, Filter } from 'lucide-react';

const Jobs = () => {
  const { user } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();

  // State
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalJobsCount, setTotalJobsCount] = useState(0);
  const [sort, setSort] = useState('-createdAt');
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  // Parse filters from URL params
  const getFiltersFromParams = () => {
    return {
      search: searchParams.get('search') || '',
      location: searchParams.get('location') || '',
      category: searchParams.get('category') || '',
      type: searchParams.get('type') || '',
      salaryMin: searchParams.get('salaryMin') || '',
    };
  };

  const [filters, setFilters] = useState(getFiltersFromParams());
  const [error, setError] = useState(null);

  // Trigger fetch when filters, page, or sort changes
  useEffect(() => {
    const fetchJobs = async () => {
      setLoading(true);
      setError(null);
      try {
        const queryParams = {
          page: currentPage,
          limit: 6,
          sort,
          ...filters,
        };

        // Remove empty values
        Object.keys(queryParams).forEach((key) => {
          if (queryParams[key] === '' || queryParams[key] === undefined) {
            delete queryParams[key];
          }
        });

        const res = await getJobs(queryParams);
        if (res.data.success) {
          setJobs(res.data.data);
          setTotalPages(res.data.pagination.pages);
          setTotalJobsCount(res.data.pagination.total);
        }
      } catch (err) {
        console.error('Error fetching jobs:', err);
        setError('Failed to load jobs. Please check your connection and try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, [filters, currentPage, sort]);

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    setCurrentPage(1); // Reset page to 1 on filter changes

    // Update URL Search Params
    const updatedParams = {};
    Object.keys(newFilters).forEach((key) => {
      if (newFilters[key]) {
        updatedParams[key] = newFilters[key];
      }
    });
    setSearchParams(updatedParams);
    setMobileFiltersOpen(false);
  };

  // ✅ FIX: handleClear was referenced in JSX but never defined — caused ReferenceError → blank page
  const handleClear = () => {
    const emptyFilters = {
      search: '',
      location: '',
      category: '',
      type: '',
      salaryMin: '',
    };
    setFilters(emptyFilters);
    setSearchParams({});
    setCurrentPage(1);
  };

  const isJobBookmarked = (jobId) => {
    if (!user || !user.savedJobs) return false;
    return user.savedJobs.includes(jobId);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* Left Side Filters: Desktop */}
        <aside className="hidden lg:block w-1/4 shrink-0">
          <JobFilters onFilterChange={handleFilterChange} initialFilters={filters} />
        </aside>

        {/* Mobile Filters Drawer Modal */}
        {mobileFiltersOpen && (
          <div className="fixed inset-0 z-50 lg:hidden bg-black/50 backdrop-blur-sm flex justify-end">
            <div className="w-[300px] h-full bg-white dark:bg-gray-900 p-6 overflow-y-auto shadow-2xl relative">
              <button
                onClick={() => setMobileFiltersOpen(false)}
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-950 font-bold"
              >
                Close
              </button>
              <div className="pt-8">
                <JobFilters onFilterChange={handleFilterChange} initialFilters={filters} />
              </div>
            </div>
          </div>
        )}

        {/* Right Side Listings */}
        <main className="flex-grow w-full lg:w-3/4 space-y-6">
          {/* Top Bar Actions */}
          <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800/80 rounded-2xl px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm">
            <div className="text-sm font-semibold text-gray-500 dark:text-gray-400">
              Showing <span className="text-gray-900 dark:text-white font-bold">{totalJobsCount}</span> jobs available
            </div>
            
            <div className="flex items-center gap-2 self-end sm:self-auto">
              {/* Mobile Filter Button */}
              <button
                onClick={() => setMobileFiltersOpen(true)}
                className="lg:hidden flex items-center px-4 py-2 text-xs font-bold border border-gray-200 dark:border-gray-800 rounded-xl hover:bg-gray-100"
              >
                <Filter className="w-4 h-4 mr-1.5" /> Filters
              </button>

              {/* Sort selector */}
              <div className="flex items-center space-x-2">
                <ArrowUpDown className="w-4 h-4 text-gray-400" />
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value)}
                  className="bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-xl px-3 py-2 text-xs font-bold text-gray-700 dark:text-gray-300 focus:outline-none"
                >
                  <option value="-createdAt">Newest First</option>
                  <option value="createdAt">Oldest First</option>
                  <option value="title">Alphabetical (A-Z)</option>
                  <option value="-salaryMax">Highest Salary</option>
                </select>
              </div>
            </div>
          </div>

          {/* Listings List */}
          {error ? (
            <div className="text-center py-20 bg-white dark:bg-gray-900 border border-red-100 dark:border-red-900/30 rounded-3xl space-y-4 shadow-sm">
              <p className="text-red-500 dark:text-red-400 font-semibold">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="px-6 py-2.5 bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950/40 dark:text-indigo-400 text-indigo-600 rounded-xl text-xs font-bold transition-colors"
              >
                Retry
              </button>
            </div>
          ) : loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="animate-pulse bg-white dark:bg-gray-900 h-48 rounded-2xl border border-gray-100 dark:border-gray-800"></div>
              ))}
            </div>
          ) : jobs.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {jobs.map((job) => (
                  <JobCard
                    key={job._id}
                    job={job}
                    isBookmarked={isJobBookmarked(job._id)}
                  />
                ))}
              </div>
              
              {/* Pagination */}
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={(page) => setCurrentPage(page)}
              />
            </>
          ) : (
            <div className="text-center py-20 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-3xl space-y-4 shadow-sm">
              <Briefcase className="w-16 h-16 text-indigo-500/20 mx-auto" />
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                No jobs matched your filters
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 max-w-sm mx-auto">
                Try widening your search terms, categories, or resetting the location inputs to discover more opportunities.
              </p>
              <button
                onClick={handleClear}
                className="px-6 py-2.5 bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950/40 dark:text-indigo-400 text-indigo-600 rounded-xl text-xs font-bold transition-colors"
              >
                Clear Search filters
              </button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Jobs;
