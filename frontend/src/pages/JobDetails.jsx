import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getJob, applyForJob, saveJob, unsaveJob } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { MapPin, Briefcase, Calendar, IndianRupee, Bookmark, BookmarkCheck, Globe, Users, ChevronRight, FileText, ArrowLeft, Send } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { motion } from 'framer-motion';

const JobDetails = () => {
  const { id } = useParams();
  const { user, setUser } = useAuth();
  const navigate = useNavigate();

  // State
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);

  // Apply Form State
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [coverLetter, setCoverLetter] = useState('');
  const [resumeFile, setResumeFile] = useState(null);
  const [applying, setApplying] = useState(false);

  useEffect(() => {
    const fetchJobDetails = async () => {
      try {
        const res = await getJob(id);
        if (res.data.success) {
          setJob(res.data.data);
          
          // Pre-populate apply form
          if (user) {
            setFullName(user.name || '');
            setEmail(user.email || '');
            setPhone(user.phone || '');
          }
        }
      } catch (err) {
        toast.error('Failed to load job details');
        navigate('/jobs');
      } finally {
        setLoading(false);
      }
    };
    fetchJobDetails();
  }, [id, user, navigate]);

  useEffect(() => {
    if (user && user.savedJobs && job) {
      setIsBookmarked(user.savedJobs.includes(job._id));
    }
  }, [user, job]);

  const handleBookmarkToggle = async () => {
    if (!user) {
      toast.error('Please login to save this job');
      return;
    }
    if (user.role !== 'candidate') {
      toast.error('Only candidates can save jobs');
      return;
    }

    try {
      if (isBookmarked) {
        const res = await unsaveJob(job._id);
        if (res.data.success) {
          setIsBookmarked(false);
          setUser({ ...user, savedJobs: res.data.savedJobs });
          toast.success('Job removed from saved jobs');
        }
      } else {
        const res = await saveJob(job._id);
        if (res.data.success) {
          setIsBookmarked(true);
          setUser({ ...user, savedJobs: res.data.savedJobs });
          toast.success('Job saved to bookmarks!');
        }
      }
    } catch (err) {
      toast.error('Failed to update saved status');
    }
  };

  const handleFileChange = (e) => {
    setResumeFile(e.target.files[0]);
  };

  const handleApplySubmit = async (e) => {
    e.preventDefault();

    if (!fullName || !email || !coverLetter) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (!resumeFile && (!user || !user.resume)) {
      toast.error('Please upload a resume file');
      return;
    }

    const formData = new FormData();
    formData.append('jobId', job._id);
    formData.append('fullName', fullName);
    formData.append('email', email);
    formData.append('phone', phone);
    formData.append('coverLetter', coverLetter);
    if (resumeFile) {
      formData.append('resume', resumeFile);
    }

    setApplying(true);
    try {
      const res = await applyForJob(formData);
      if (res.data.success) {
        toast.success('Application submitted successfully!');
        setIsApplyModalOpen(false);
        // Clear file input
        setResumeFile(null);
        setCoverLetter('');
      }
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to submit application');
    } finally {
      setApplying(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12 flex items-center justify-center min-h-[50vh]">
        <div className="w-10 h-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  // Guard: if job failed to load and navigate didn't fire yet
  if (!job) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12 text-center">
        <p className="text-gray-500 dark:text-gray-400">Job not found.</p>
        <Link to="/jobs" className="mt-4 inline-block text-indigo-600 font-semibold hover:underline">← Back to Jobs</Link>
      </div>
    );
  }

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

  const getFormattedDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 transition-all">
      {/* Back button */}
      <Link
        to="/jobs"
        className="inline-flex items-center text-sm font-semibold text-gray-500 hover:text-indigo-600 mb-8 transition-colors"
      >
        <ArrowLeft className="w-4 h-4 mr-1.5" /> Back to job listings
      </Link>

      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* Main Details Section: 2/3 width */}
        <main className="w-full lg:w-2/3 space-y-8">
          {/* Header Card */}
          <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-3xl p-6 md:p-8 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center space-x-5">
              {job.companyLogo || (job.employer && job.employer.companyLogo) ? (
                <img
                  src={job.companyLogo || job.employer.companyLogo}
                  alt={job.company}
                  className="w-16 h-16 rounded-2xl object-cover border border-gray-100 dark:border-gray-800"
                />
              ) : (
                <div className="w-16 h-16 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-bold text-2xl shrink-0">
                  {job.company.charAt(0).toUpperCase()}
                </div>
              )}
              <div>
                <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white leading-tight">
                  {job.title}
                </h1>
                <p className="text-gray-500 dark:text-gray-400 font-medium mt-1">
                  {job.company}
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              {(!user || user.role === 'candidate') && (
                <>
                  <button
                    onClick={() => {
                      if (!user) {
                        toast.error('Please login to apply');
                        navigate('/login');
                        return;
                      }
                      setIsApplyModalOpen(true);
                    }}
                    className="flex-grow md:flex-grow-0 px-6 py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-bold shadow-md shadow-indigo-600/10 hover:shadow-lg transition-all"
                  >
                    Apply Now
                  </button>
                  <button
                    onClick={handleBookmarkToggle}
                    className={`p-3.5 rounded-xl border transition-colors ${
                      isBookmarked
                        ? 'bg-indigo-50 border-indigo-100 text-indigo-600 dark:bg-indigo-950/40 dark:border-indigo-900/40 dark:text-indigo-400'
                        : 'border-gray-200 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 dark:border-gray-800 dark:hover:bg-gray-800'
                    }`}
                  >
                    {isBookmarked ? (
                      <BookmarkCheck className="w-5 h-5 fill-current" />
                    ) : (
                      <Bookmark className="w-5 h-5" />
                    )}
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Job Overview Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-3xl p-6 shadow-sm">
            <div className="space-y-1">
              <span className="text-xs text-gray-400 font-medium">Location</span>
              <div className="flex items-center text-sm font-bold text-gray-800 dark:text-gray-200">
                <MapPin className="w-4 h-4 text-indigo-500 mr-1.5 shrink-0" />
                {job.location}
              </div>
            </div>
            <div className="space-y-1">
              <span className="text-xs text-gray-400 font-medium">Job Type</span>
              <div className="flex items-center text-sm font-bold text-gray-800 dark:text-gray-200">
                <Briefcase className="w-4 h-4 text-indigo-500 mr-1.5 shrink-0" />
                {job.type}
              </div>
            </div>
            <div className="space-y-1">
              <span className="text-xs text-gray-400 font-medium">Salary Range</span>
              <div className="flex items-center text-sm font-bold text-gray-800 dark:text-gray-200">
                <IndianRupee className="w-4 h-4 text-indigo-500 mr-1 shrink-0" />
                {formattedSalary()}
              </div>
            </div>
            <div className="space-y-1">
              <span className="text-xs text-gray-400 font-medium">Posted On</span>
              <div className="flex items-center text-sm font-bold text-gray-800 dark:text-gray-200">
                <Calendar className="w-4 h-4 text-indigo-500 mr-1.5 shrink-0" />
                {getFormattedDate(job.createdAt)}
              </div>
            </div>
          </div>

          {/* Detailed Content */}
          <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-3xl p-6 md:p-8 shadow-sm space-y-6">
            {/* Description */}
            <div className="space-y-3">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                Job Description
              </h2>
              <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-400 whitespace-pre-wrap">
                {job.description}
              </p>
            </div>

            {/* Responsibilities */}
            {job.responsibilities?.length > 0 && (
              <div className="space-y-3 border-t border-gray-100 dark:border-gray-800 pt-6">
                <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                  Key Responsibilities
                </h2>
                <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                  {job.responsibilities.map((r, i) => (
                    <li key={i} className="flex items-start">
                      <ChevronRight className="w-4 h-4 text-indigo-500 mr-2 shrink-0 mt-0.5" />
                      <span>{r}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Requirements */}
            {job.requirements?.length > 0 && (
              <div className="space-y-3 border-t border-gray-100 dark:border-gray-800 pt-6">
                <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                  Requirements & Qualifications
                </h2>
                <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                  {job.requirements.map((reqItem, i) => (
                    <li key={i} className="flex items-start">
                      <ChevronRight className="w-4 h-4 text-indigo-500 mr-2 shrink-0 mt-0.5" />
                      <span>{reqItem}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Skills */}
            {job.skills?.length > 0 && (
              <div className="space-y-3 border-t border-gray-100 dark:border-gray-800 pt-6">
                <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                  Skills Required
                </h2>
                <div className="flex flex-wrap gap-2">
                  {job.skills.map((skill, i) => (
                    <span
                      key={i}
                      className="px-3 py-1 text-xs font-semibold bg-gray-50 dark:bg-gray-850 dark:text-gray-300 border border-gray-200 dark:border-gray-800 rounded-lg"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Benefits */}
            {job.benefits?.length > 0 && (
              <div className="space-y-3 border-t border-gray-100 dark:border-gray-800 pt-6">
                <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                  Benefits & Perks
                </h2>
                <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                  {job.benefits.map((b, i) => (
                    <li key={i} className="flex items-start">
                      <ChevronRight className="w-4 h-4 text-indigo-500 mr-2 shrink-0 mt-0.5" />
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </main>

        {/* Sidebar Info Section: 1/3 width */}
        <aside className="w-full lg:w-1/3 space-y-6">
          {/* Company Details Card */}
          <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-3xl p-6 shadow-sm space-y-5">
            <h3 className="font-bold text-gray-900 dark:text-white pb-3 border-b border-gray-100 dark:border-gray-800/80">
              About Employer
            </h3>
            
            <div className="flex items-center space-x-3.5">
              {job.companyLogo || (job.employer && job.employer.companyLogo) ? (
                <img
                  src={job.companyLogo || job.employer.companyLogo}
                  alt={job.company}
                  className="w-12 h-12 rounded-xl object-cover border border-gray-100 dark:border-gray-800"
                />
              ) : (
                <div className="w-12 h-12 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-bold text-lg shrink-0">
                  {job.company.charAt(0).toUpperCase()}
                </div>
              )}
              <div>
                <h4 className="font-bold text-gray-900 dark:text-white">{job.company}</h4>
                <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 uppercase tracking-wide">
                  {job.employer?.industry || 'Information Tech'}
                </span>
              </div>
            </div>

            {/* Paragraph Bio */}
            {job.employer?.companyDescription && (
              <p className="text-xs leading-relaxed text-gray-500 dark:text-gray-400">
                {job.employer.companyDescription}
              </p>
            )}

            <div className="space-y-3.5 pt-2 text-sm text-gray-600 dark:text-gray-400">
              {job.employer?.companyWebsite && (
                <div className="flex items-center">
                  <Globe className="w-4.5 h-4.5 text-gray-400 mr-2.5 shrink-0" />
                  <a
                    href={job.employer.companyWebsite}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-indigo-500 truncate"
                  >
                    {job.employer.companyWebsite.replace(/https?:\/\//, '')}
                  </a>
                </div>
              )}
              {job.employer?.companySize && (
                <div className="flex items-center">
                  <Users className="w-4.5 h-4.5 text-gray-400 mr-2.5 shrink-0" />
                  <span>Company Size: {job.employer.companySize} employees</span>
                </div>
              )}
              {job.applicationDeadline && (
                <div className="flex items-center text-xs font-bold text-rose-500 bg-rose-50 dark:bg-rose-950/20 px-3 py-2 rounded-xl border border-rose-100 dark:border-rose-900/30">
                  Deadline: {getFormattedDate(job.applicationDeadline)}
                </div>
              )}
            </div>
          </div>
        </aside>
      </div>

      {/* Apply Form Overlay Modal */}
      {isApplyModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-3xl p-6 md:p-8 w-full max-w-lg shadow-2xl relative space-y-6"
          >
            {/* Header */}
            <div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                Submit Application
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Applying for <strong className="text-indigo-600 dark:text-indigo-400">{job.title}</strong> at {job.company}
              </p>
            </div>

            <form onSubmit={handleApplySubmit} className="space-y-4.5">
              {/* Full Name */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                  Full Name
                </label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-xl px-3.5 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                  required
                />
              </div>

              {/* Email */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-xl px-3.5 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                  required
                />
              </div>

              {/* Phone */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                  Phone Number
                </label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-xl px-3.5 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>

              {/* Cover Letter */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                  Cover Letter
                </label>
                <textarea
                  value={coverLetter}
                  onChange={(e) => setCoverLetter(e.target.value)}
                  rows="4"
                  placeholder="Explain why you are a great fit for this position..."
                  className="w-full bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-xl px-3.5 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500 outline-none resize-none"
                  required
                ></textarea>
              </div>

              {/* Resume File Upload */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider block">
                  Upload Resume File (PDF/DOCX)
                </label>
                
                {user?.resume && !resumeFile && (
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                    Using current resume on profile:{' '}
                    <a
                      href={user.resume}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-indigo-600 dark:text-indigo-400 underline font-semibold"
                    >
                      View Current Resume
                    </a>
                  </p>
                )}

                <div className="flex items-center gap-3">
                  <label className="flex items-center justify-center px-4 py-2.5 border border-dashed border-gray-300 dark:border-gray-800 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800/50 cursor-pointer text-xs font-bold text-indigo-600 dark:text-indigo-400 transition-colors">
                    <FileText className="w-4 h-4 mr-2" />
                    Choose File
                    <input
                      type="file"
                      accept=".pdf,.doc,.docx"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                  </label>
                  <span className="text-xs text-gray-400 truncate">
                    {resumeFile ? resumeFile.name : 'No file selected'}
                  </span>
                </div>
              </div>

              {/* Submit / Cancel Actions */}
              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  disabled={applying}
                  className="flex-grow py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-bold shadow-md shadow-indigo-600/10 hover:shadow-lg transition-all disabled:opacity-50 flex items-center justify-center gap-1.5"
                >
                  {applying ? 'Submitting...' : 'Submit Application'}
                  <Send className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => setIsApplyModalOpen(false)}
                  className="px-5 py-3 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-xl text-sm font-semibold transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default JobDetails;
