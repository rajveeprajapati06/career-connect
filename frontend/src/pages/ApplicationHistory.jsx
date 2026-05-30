import React, { useState, useEffect } from 'react';
import { getMyApplications } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { ArrowRight, History, Calendar, MapPin, Briefcase } from 'lucide-react';
import { Link } from 'react-router-dom';

const ApplicationHistory = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const res = await getMyApplications();
        if (res.data.success) {
          setApplications(res.data.data);
        }
      } catch (err) {
        console.error('Failed to load application history:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchApplications();
  }, []);

  const statusColors = {
    pending: 'bg-amber-50 text-amber-600 dark:bg-amber-950/40 dark:text-amber-400 border-amber-200 dark:border-amber-900/30',
    reviewed: 'bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400 border-blue-200 dark:border-blue-900/30',
    accepted: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400 border-emerald-200 dark:border-emerald-900/30',
    rejected: 'bg-rose-50 text-rose-600 dark:bg-rose-950/40 dark:text-rose-400 border-rose-200 dark:border-rose-900/30',
  };

  const getFormattedDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      
      {/* Header */}
      <div className="mb-8 space-y-2">
        <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight flex items-center">
          <History className="w-8 h-8 mr-3 text-indigo-500" />
          Application History
        </h1>
        <p className="text-gray-500 dark:text-gray-400 font-medium">
          Track the real-time status of your job submissions.
        </p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center min-h-[30vh]">
          <div className="w-10 h-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
        </div>
      ) : applications.length > 0 ? (
        <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-3xl overflow-hidden shadow-sm divide-y divide-gray-100 dark:divide-gray-800">
          {applications.map((app) => (
            <div
              key={app._id}
              className="p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:bg-gray-50/30 dark:hover:bg-gray-900/30 transition-colors"
            >
              <div className="space-y-2.5">
                <div className="space-y-1">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                    {app.job?.title || 'Unknown Position'}
                  </h3>
                  <p className="text-sm font-semibold text-gray-500 dark:text-gray-400">
                    {app.job?.company || 'Acme Corporation'}
                  </p>
                </div>
                
                {/* Job Metadata details */}
                <div className="flex flex-wrap gap-x-4 gap-y-1.5 text-xs text-gray-400">
                  {app.job?.location && (
                    <div className="flex items-center">
                      <MapPin className="w-3.5 h-3.5 mr-1" />
                      <span>{app.job.location}</span>
                    </div>
                  )}
                  {app.job?.type && (
                    <div className="flex items-center">
                      <Briefcase className="w-3.5 h-3.5 mr-1" />
                      <span>{app.job.type}</span>
                    </div>
                  )}
                  <div className="flex items-center">
                    <Calendar className="w-3.5 h-3.5 mr-1" />
                    <span>Applied on: {getFormattedDate(app.appliedAt)}</span>
                  </div>
                </div>
              </div>

              {/* Status and Action Link */}
              <div className="flex items-center justify-between md:justify-end gap-4 border-t border-gray-50 dark:border-0 pt-4 md:pt-0">
                <span className={`inline-flex px-3 py-1 rounded-lg text-xs font-bold border ${statusColors[app.status]}`}>
                  {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                </span>
                
                {app.job?._id && (
                  <Link
                    to={`/jobs/${app.job._id}`}
                    className="inline-flex items-center text-sm font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 transition-colors"
                  >
                    View Job
                    <ArrowRight className="w-4 h-4 ml-1.5" />
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-3xl p-12 text-center text-gray-500 space-y-4 shadow-sm">
          <p className="text-base font-semibold">You haven't submitted any job applications yet.</p>
          <Link
            to="/jobs"
            className="inline-flex px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-bold shadow-md shadow-indigo-600/10 transition-all"
          >
            Start Searching Jobs
          </Link>
        </div>
      )}
    </div>
  );
};

export default ApplicationHistory;
