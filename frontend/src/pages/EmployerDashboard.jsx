import React, { useState, useEffect } from 'react';
import { getJobStats, getJobs, createJob, updateJob, deleteJob, getEmployerApplications, updateApplicationStatus } from '../services/api';
import StatsCard from '../components/dashboard/StatsCard';
import JobForm from '../components/dashboard/JobForm';
import ApplicationCard from '../components/dashboard/ApplicationCard';
import { useAuth } from '../context/AuthContext';
import { Briefcase, Users, PlusCircle, CheckCircle, XCircle, LayoutDashboard, Settings, Edit, Trash2 } from 'lucide-react';
import { toast } from 'react-hot-toast';

const EmployerDashboard = () => {
  const { user } = useAuth();
  
  // Navigation Tabs
  const [activeTab, setActiveTab] = useState('overview');

  // Stats State
  const [stats, setStats] = useState({ totalJobs: 0, activeJobs: 0, closedJobs: 0, totalApplicants: 0 });
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  // Edit Job State
  const [editingJob, setEditingJob] = useState(null);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const [statsRes, jobsRes, appsRes] = await Promise.all([
        getJobStats(),
        getJobs({ employer: user._id, limit: 100 }), // Fetch this employer's jobs
        getEmployerApplications(),
      ]);

      if (statsRes.data.success) setStats(statsRes.data.data);
      if (jobsRes.data.success) {
        // Filter jobs created by this employer locally since getJobs is public
        const myJobs = jobsRes.data.data.filter((job) => job.employer?._id === user._id || job.employer === user._id);
        setJobs(myJobs);
      }
      if (appsRes.data.success) setApplications(appsRes.data.data);
    } catch (err) {
      console.error('Failed to load dashboard data:', err);
      toast.error('Failed to reload dashboard details');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [user._id]);

  const handlePostJob = async (jobData) => {
    try {
      const res = await createJob(jobData);
      if (res.data.success) {
        toast.success('Job listing posted successfully!');
        fetchDashboardData();
        setActiveTab('jobs');
      }
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to publish job posting');
    }
  };

  const handleEditJob = async (jobData) => {
    try {
      const res = await updateJob(editingJob._id, jobData);
      if (res.data.success) {
        toast.success('Job posting updated successfully!');
        setEditingJob(null);
        fetchDashboardData();
        setActiveTab('jobs');
      }
    } catch (err) {
      toast.error('Failed to update job posting');
    }
  };

  const handleDeleteJob = async (jobId) => {
    if (!window.confirm('Are you sure you want to delete this job posting? This will delete all applications associated with this job.')) {
      return;
    }

    try {
      const res = await deleteJob(jobId);
      if (res.data.success) {
        toast.success('Job listing deleted successfully');
        fetchDashboardData();
      }
    } catch (err) {
      toast.error('Failed to delete job posting');
    }
  };

  const handleToggleStatus = async (job) => {
    const newStatus = job.status === 'active' ? 'closed' : 'active';
    try {
      const res = await updateJob(job._id, { status: newStatus });
      if (res.data.success) {
        toast.success(`Job marked as ${newStatus}`);
        fetchDashboardData();
      }
    } catch (err) {
      toast.error('Failed to update status');
    }
  };

  const handleApplicationStatusChange = (appId, newStatus) => {
    // Update local applications state
    setApplications((prev) =>
      prev.map((app) => (app._id === appId ? { ...app, status: newStatus } : app))
    );
    // Refresh stats
    getJobStats().then((res) => {
      if (res.data.success) setStats(res.data.data);
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      
      {/* Title */}
      <div className="mb-8 space-y-2">
        <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
          Employer Portal
        </h1>
        <p className="text-gray-500 dark:text-gray-400 font-medium">
          Manage listings, track candidates, and publish positions.
        </p>
      </div>

      {/* Tabs list */}
      <div className="flex border-b border-gray-200 dark:border-gray-800 mb-8 space-x-6 overflow-x-auto pb-1">
        {[
          { id: 'overview', name: 'Overview', icon: LayoutDashboard },
          { id: 'jobs', name: 'Manage Jobs', icon: Briefcase },
          { id: 'post', name: editingJob ? 'Edit Job' : 'Post a Job', icon: PlusCircle },
          { id: 'applications', name: `Applicants (${applications.length})`, icon: Users },
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id);
                if (tab.id !== 'post') setEditingJob(null);
              }}
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
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatsCard title="Total Jobs Posted" value={stats.totalJobs} icon={Briefcase} color="indigo" />
                <StatsCard title="Active Jobs" value={stats.activeJobs} icon={CheckCircle} color="emerald" />
                <StatsCard title="Closed Jobs" value={stats.closedJobs} icon={XCircle} color="rose" />
                <StatsCard title="Total Applicants" value={stats.totalApplicants} icon={Users} color="purple" />
              </div>

              {/* Latest Applications */}
              <div className="space-y-4">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  Recent Applications
                </h2>
                {applications.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {applications.slice(0, 4).map((app) => (
                      <ApplicationCard
                        key={app._id}
                        application={app}
                        onStatusUpdate={handleApplicationStatusChange}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-3xl p-8 text-center text-gray-500">
                    No applications received yet. Your posted jobs will show candidate profiles here.
                  </div>
                )}
              </div>
            </div>
          )}

          {/* MANAGE JOBS TAB */}
          {activeTab === 'jobs' && (
            <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-3xl overflow-hidden shadow-sm">
              {jobs.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-gray-50 dark:bg-gray-950 text-xs font-bold text-gray-500 uppercase tracking-wider border-b border-gray-100 dark:border-gray-800">
                        <th className="px-6 py-4">Job Title</th>
                        <th className="px-6 py-4">Location</th>
                        <th className="px-6 py-4">Status</th>
                        <th className="px-6 py-4">Applicants</th>
                        <th className="px-6 py-4">Posted Date</th>
                        <th className="px-6 py-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 dark:divide-gray-800 text-sm">
                      {jobs.map((job) => (
                        <tr key={job._id} className="hover:bg-gray-50/50 dark:hover:bg-gray-900/50 transition-colors">
                          <td className="px-6 py-4 font-semibold text-gray-900 dark:text-white">
                            {job.title}
                          </td>
                          <td className="px-6 py-4 text-gray-500 dark:text-gray-400">
                            {job.location}
                          </td>
                          <td className="px-6 py-4">
                            <button
                              onClick={() => handleToggleStatus(job)}
                              className={`inline-flex px-2.5 py-1 rounded-lg text-xs font-bold border transition-colors ${
                                job.status === 'active'
                                  ? 'bg-emerald-50 text-emerald-600 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400'
                                  : 'bg-rose-50 text-rose-600 border-rose-200 dark:bg-rose-950/40 dark:text-rose-400'
                              }`}
                            >
                              {job.status === 'active' ? 'Active' : 'Closed'}
                            </button>
                          </td>
                          <td className="px-6 py-4 font-bold text-gray-700 dark:text-gray-300">
                            {job.applicationsCount || 0} applicants
                          </td>
                          <td className="px-6 py-4 text-xs text-gray-400">
                            {new Date(job.createdAt).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 text-right space-x-2 shrink-0">
                            <button
                              onClick={() => {
                                setEditingJob(job);
                                setActiveTab('post');
                              }}
                              className="inline-flex p-2 rounded-lg border border-gray-200 dark:border-gray-800 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-gray-800 transition-colors"
                              title="Edit Job"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteJob(job._id)}
                              className="inline-flex p-2 rounded-lg border border-gray-200 dark:border-gray-800 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors"
                              title="Delete Job"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="p-8 text-center text-gray-500 space-y-3">
                  <p>You haven't posted any job listings yet.</p>
                  <button
                    onClick={() => setActiveTab('post')}
                    className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold"
                  >
                    Post your first Job
                  </button>
                </div>
              )}
            </div>
          )}

          {/* POST / EDIT JOB TAB */}
          {activeTab === 'post' && (
            <JobForm
              onSubmit={editingJob ? handleEditJob : handlePostJob}
              initialJob={editingJob}
              onCancel={
                editingJob
                  ? () => {
                      setEditingJob(null);
                      setActiveTab('jobs');
                    }
                  : null
              }
            />
          )}

          {/* APPLICATIONS TAB */}
          {activeTab === 'applications' && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                All Candidate Applications
              </h2>
              {applications.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {applications.map((app) => (
                    <ApplicationCard
                      key={app._id}
                      application={app}
                      onStatusUpdate={handleApplicationStatusChange}
                    />
                  ))}
                </div>
              ) : (
                <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-3xl p-8 text-center text-gray-500">
                  No applications received yet. Open positions will capture candidates here.
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default EmployerDashboard;
