import React, { useState } from 'react';
import { Mail, Phone, Calendar, FileText, CheckCircle, XCircle } from 'lucide-react';
import { updateApplicationStatus } from '../../services/api';
import { toast } from 'react-hot-toast';

const ApplicationCard = ({ application, onStatusUpdate }) => {
  const [status, setStatus] = useState(application.status);
  const [updating, setUpdating] = useState(false);

  const handleAction = async (newStatus) => {
    setUpdating(true);
    try {
      const res = await updateApplicationStatus(application._id, newStatus);
      if (res.data.success) {
        setStatus(newStatus);
        toast.success(`Application marked as ${newStatus}`);
        if (onStatusUpdate) onStatusUpdate(application._id, newStatus);
      }
    } catch (err) {
      toast.error('Failed to update status');
    } finally {
      setUpdating(false);
    }
  };

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
    <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-3xl p-6 shadow-sm hover:shadow-md transition-shadow space-y-5">
      {/* Upper header */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 border-b border-gray-100 dark:border-gray-800/80 pb-4">
        <div>
          <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider block mb-1">
            {application.job?.title || 'Unknown Position'}
          </span>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">
            {application.fullName}
          </h3>
        </div>
        <span className={`inline-flex px-3 py-1 rounded-lg text-xs font-bold border ${statusColors[status]}`}>
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </span>
      </div>

      {/* Info Block */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm text-gray-500 dark:text-gray-400">
        <div className="flex items-center">
          <Mail className="w-4 h-4 mr-2.5 text-gray-400 shrink-0" />
          <a href={`mailto:${application.email}`} className="hover:text-indigo-500 truncate">
            {application.email}
          </a>
        </div>
        <div className="flex items-center">
          <Phone className="w-4 h-4 mr-2.5 text-gray-400 shrink-0" />
          <span>{application.phone || 'No phone provided'}</span>
        </div>
        <div className="flex items-center">
          <Calendar className="w-4 h-4 mr-2.5 text-gray-400 shrink-0" />
          <span>Applied: {getFormattedDate(application.appliedAt)}</span>
        </div>
      </div>

      {/* Cover Letter Section */}
      <div className="space-y-1.5 bg-gray-50 dark:bg-gray-950 p-4.5 rounded-2xl border border-gray-100 dark:border-gray-800/80">
        <h4 className="text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
          Cover Letter Snippet
        </h4>
        <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed whitespace-pre-line line-clamp-3 hover:line-clamp-none transition-all duration-300 cursor-pointer">
          {application.coverLetter}
        </p>
      </div>

      {/* Footer Block */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
        {/* Resume Download Anchor */}
        <a
          href={application.resume}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center text-sm font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors"
        >
          <FileText className="w-4.5 h-4.5 mr-2" />
          View Uploaded Resume
        </a>

        {/* Action Buttons for Employer (Only visible if pending or reviewed) */}
        {onStatusUpdate && (status === 'pending' || status === 'reviewed') && (
          <div className="flex gap-2">
            <button
              onClick={() => handleAction('accepted')}
              disabled={updating}
              className="inline-flex items-center px-4 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-md shadow-emerald-600/10 hover:shadow-lg transition-all duration-200 disabled:opacity-50"
            >
              <CheckCircle className="w-4 h-4 mr-1.5" /> Accept Candidate
            </button>
            <button
              onClick={() => handleAction('rejected')}
              disabled={updating}
              className="inline-flex items-center px-4 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-xl shadow-md shadow-rose-600/10 hover:shadow-lg transition-all duration-200 disabled:opacity-50"
            >
              <XCircle className="w-4 h-4 mr-1.5" /> Reject Application
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ApplicationCard;
