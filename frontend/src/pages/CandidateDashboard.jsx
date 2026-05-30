import React, { useState, useEffect } from 'react';
import { getMyApplications, getSavedJobs } from '../services/api';
import StatsCard from '../components/dashboard/StatsCard';
import JobCard from '../components/jobs/JobCard';
import { Briefcase, Bookmark, History, Calendar, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';

const CandidateDashboard = () => {
  const [applications, setApplications] = useState([]);
  const [savedJobs, setSavedJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const [appsRes, savedRes] = await Promise.all([
        getMyApplications(),
        getSavedJobs(),
      ]);

      if (appsRes.data.success) setApplications(appsRes.data.data);
      if (savedRes.data.success) setSavedJobs(savedRes.data.data);
    } catch (err) {
      console.error('Failed to load candidate dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleBookmarkToggleLocal = (jobId, isSaved) => {
    if (!isSaved) {
      // Remove from state immediately if unsaved
      setSavedJobs((prev) => prev.filter((job) => job._id !== jobId));
    }
  };

  const statusColors = {
    pending: 'bg-amber-50 text-amber-600 dark:bg-amber-950/40 dark:text-amber-400 border-amber-200 dark:border-amber-900/30',
    reviewed: 'bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400 border-blue-200 dark:border-blue-900/30',
    accepted: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400 border-emerald-200 dark:border-emerald-900/30',
    rejected: 'bg-rose-50 text-rose-600 dark:bg-rose-950/40 dark:text-rose-400 border-rose-200 dark:border-rose-900/30',
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      {/* Title */}
      <div className="mb-8 space-y-2">
        <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
          Candidate Workspace
        </h1>
        <p className="text-gray-500 dark:text-gray-400 font-medium">
          Track application updates, review saved jobs, and edit your profile.
        </p>
      </div>

      {/* Navigation tabs */}
      <div className="flex border-b border-gray-200 dark:border-gray-800 mb-8 space-x-6 overflow-x-auto pb-1">
        {[
          { id: 'overview', name: 'Overview', icon: Briefcase },
          { id: 'applications', name: `Applied Jobs (${applications.length})`, icon: History },
          { id: 'saved', name: `Bookmarked (${savedJobs.length})`, icon: Bookmark },
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center pb-4 text-sm font-bold border-b-2 transition-all shrink-0 ${
                activeTab === tab.id
                  ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
            >
              <Icon className="w-4 h-4 mr-2" />
              {tab.name}
            </button>
          );
        })}
      </div>

      {loading ? (
        <div className="flex items-center justify-center min-h-[30vh]">
          <div className="w-10 h-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="space-y-8">
          {/* OVERVIEW TAB */}
          {activeTab === 'overview' && (
            <div className="space-y-8">
              {/* Stats Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <StatsCard title="Jobs Applied" value={applications.length} icon={History} color="indigo" />
                <StatsCard title="Saved Listings" value={savedJobs.length} icon={Bookmark} color="purple" />
                <StatsCard
                  title="Accepted Offers"
                  value={applications.filter((a) => a.status === 'accepted').length}
                  icon={Briefcase}
                  color="emerald"
                />
              </div>

              {/* Recent Applications Preview */}
              <div className="space-y-4">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  Recent Application Statuses
                </h2>
                {applications.length > 0 ? (
                  <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-3xl overflow-hidden shadow-sm">
                    <div className="divide-y divide-gray-100 dark:divide-gray-800">
                      {applications.slice(0, 4).map((app) => (
                        <div
                          key={app._id}
                          className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-gray-50/30 dark:hover:bg-gray-900/50 transition-colors"
                        >
                          <div className="space-y-1">
                            <h3 className="font-bold text-gray-900 dark:text-white">
                              {app.job?.title || 'Unknown Position'}
                            </h3>
                            <p className="text-sm font-semibold text-gray-500 dark:text-gray-400">
                              {app.job?.company || 'Acme Corp'}
                            </p>
                          </div>
                          
                          <div className="flex items-center gap-4.5">
                            <span className={`inline-flex px-3 py-1 rounded-lg text-xs font-bold border ${statusColors[app.status]}`}>
                              {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                            </span>
                            <Link
                              to={`/jobs/${app.job?._id}`}
                              className="text-gray-400 hover:text-indigo-500 transition-colors"
                            >
                              <ExternalLink className="w-4.5 h-4.5" />
                            </Link>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-3xl p-8 text-center text-gray-500">
                    You haven't applied for any jobs yet.{' '}
                    <Link to="/jobs" className="text-indigo-600 dark:text-indigo-400 font-semibold underline ml-1">
                      Browse jobs now
                    </Link>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* APPLICATIONS HISTORY TAB */}
          {activeTab === 'applications' && (
            <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-3xl overflow-hidden shadow-sm">
              {applications.length > 0 ? (
                <div className="divide-y divide-gray-100 dark:divide-gray-800">
                  {applications.map((app) => (
                    <div
                      key={app._id}
                      className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-gray-50/30 dark:hover:bg-gray-900/50 transition-colors"
                    >
                      <div className="space-y-1">
                        <h3 className="font-bold text-gray-900 dark:text-white">{app.job?.title || 'Unknown Position'}</h3>
                        <p className="text-sm font-semibold text-gray-500 dark:text-gray-400">{app.job?.company}</p>
                        <div className="flex items-center text-xs text-gray-400 mt-2">
                          <Calendar className="w-3.5 h-3.5 mr-1" />
                          <span>Applied on: {new Date(app.appliedAt).toLocaleDateString()}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-4.5">
                        <span className={`inline-flex px-3 py-1 rounded-lg text-xs font-bold border ${statusColors[app.status]}`}>
                          {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                        </span>
                        <Link
                          to={`/jobs/${app.job?._id}`}
                          className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 text-xs font-bold flex items-center"
                        >
                          View Job Details
                          <ExternalLink className="w-3.5 h-3.5 ml-1" />
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center text-gray-500">
                  You haven't submitted any applications yet.
                </div>
              )}
            </div>
          )}

          {/* SAVED JOBS TAB */}
          {activeTab === 'saved' && (
            <div>
              {savedJobs.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {savedJobs.map((job) => (
                    <JobCard
                      key={job._id}
                      job={job}
                      isBookmarked={true}
                      onBookmarkToggle={handleBookmarkToggleLocal}
                    />
                  ))}
                </div>
              ) : (
                <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-3xl p-8 text-center text-gray-500">
                  No saved jobs found. Save interesting postings to keep track of them here.
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CandidateDashboard;
