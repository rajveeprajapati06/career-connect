import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Briefcase, Calendar, Bookmark, BookmarkCheck } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { saveJob, unsaveJob } from '../../services/api';
import { toast } from 'react-hot-toast';

const JobCard = ({ job, onBookmarkToggle, isBookmarked = false }) => {
  const { user, setUser } = useAuth();

  const handleSaveToggle = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      toast.error('Please login to save this job listing');
      return;
    }

    if (user.role !== 'candidate') {
      toast.error('Only candidates can save job listings');
      return;
    }

    try {
      if (isBookmarked) {
        const res = await unsaveJob(job._id);
        if (res.data.success) {
          toast.success('Job removed from bookmarks');
          // Update user context
          setUser({ ...user, savedJobs: res.data.savedJobs });
          if (onBookmarkToggle) onBookmarkToggle(job._id, false);
        }
      } else {
        const res = await saveJob(job._id);
        if (res.data.success) {
          toast.success('Job saved to bookmarks!');
          setUser({ ...user, savedJobs: res.data.savedJobs });
          if (onBookmarkToggle) onBookmarkToggle(job._id, true);
        }
      }
    } catch (err) {
      toast.error('Failed to update bookmark status');
    }
  };

  const formattedSalary = () => {
    if (job.salaryMin && job.salaryMax) {
      return `₹${job.salaryMin.toLocaleString('en-IN')} - ₹${job.salaryMax.toLocaleString('en-IN')}`;
    } else if (job.salaryMin) {
      return `From ₹${job.salaryMin.toLocaleString('en-IN')}`;
    } else if (job.salaryMax) {
      return `Up to ₹${job.salaryMax.toLocaleString('en-IN')}`;
    }
    return 'Salary Negotiable';
  };

  const getDaysAgo = (dateString) => {
    const date = new Date(dateString);
    const today = new Date();
    const diffTime = Math.abs(today - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays <= 1) return 'Today';
    if (diffDays === 2) return '1 day ago';
    return `${diffDays - 1} days ago`;
  };

  return (
    <Link
      to={`/jobs/${job._id}`}
      className="block bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800/80 rounded-2xl p-6 hover:shadow-xl hover:border-indigo-500/20 dark:hover:border-indigo-500/10 hover:-translate-y-1 transition-all duration-300 shadow-sm"
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center space-x-4">
          {/* Logo */}
          {job.companyLogo || (job.employer && job.employer.companyLogo) ? (
            <img
              src={job.companyLogo || job.employer.companyLogo}
              alt={job.company || 'Company Logo'}
              className="w-12 h-12 rounded-xl object-cover border border-gray-100 dark:border-gray-800"
            />
          ) : (
            <div className="w-12 h-12 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-bold text-lg shrink-0">
              {(job.company || 'Company').charAt(0).toUpperCase()}
            </div>
          )}
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white group-hover:text-indigo-600 text-lg line-clamp-1">
              {job.title}
            </h3>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
              {job.company || 'Unknown Company'}
            </p>
          </div>
        </div>

        {/* Bookmark Action */}
        {(!user || user.role === 'candidate') && (
          <button
            onClick={handleSaveToggle}
            className={`p-2 rounded-xl border transition-colors ${
              isBookmarked
                ? 'bg-indigo-50 border-indigo-100 text-indigo-600 dark:bg-indigo-950/40 dark:border-indigo-900/40 dark:text-indigo-400'
                : 'bg-gray-50 border-gray-100 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 dark:bg-gray-800/50 dark:border-gray-800 dark:hover:bg-gray-800'
            }`}
          >
            {isBookmarked ? (
              <BookmarkCheck className="w-5 h-5 fill-current" />
            ) : (
              <Bookmark className="w-5 h-5" />
            )}
          </button>
        )}
      </div>

      {/* Badges */}
      <div className="flex flex-wrap gap-2 mt-5">
        <span className="inline-flex items-center px-3 py-1 rounded-lg text-xs font-semibold bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400">
          <Briefcase className="w-3.5 h-3.5 mr-1" />
          {job.type}
        </span>
        <span className="inline-flex items-center px-3 py-1 rounded-lg text-xs font-semibold bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400">
          {job.category}
        </span>
        <span className="inline-flex items-center px-3 py-1 rounded-lg text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400">
          {formattedSalary()}
        </span>
      </div>

      <hr className="border-gray-100 dark:border-gray-800/60 my-5" />

      {/* Footer Info */}
      <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
        <div className="flex items-center space-x-1">
          <MapPin className="w-3.5 h-3.5 text-gray-400" />
          <span>{job.location}</span>
        </div>
        <div className="flex items-center space-x-1">
          <Calendar className="w-3.5 h-3.5 text-gray-400" />
          <span>{getDaysAgo(job.createdAt)}</span>
        </div>
      </div>
    </Link>
  );
};

export default JobCard;
