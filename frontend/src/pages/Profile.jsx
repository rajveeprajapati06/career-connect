import React, { useState, useEffect } from 'react';
import { getProfile, updateProfile } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { User as UserIcon, Phone, MapPin, Briefcase, FileText, Globe, Users, Save, Upload } from 'lucide-react';
import { toast } from 'react-hot-toast';

const Profile = () => {
  const { user, setUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Form Fields
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [location, setLocation] = useState('');
  const [bio, setBio] = useState('');

  // Candidate fields
  const [skills, setSkills] = useState('');
  const [experience, setExperience] = useState('');
  const [education, setEducation] = useState('');

  // Employer fields
  const [companyName, setCompanyName] = useState('');
  const [companyWebsite, setCompanyWebsite] = useState('');
  const [companyDescription, setCompanyDescription] = useState('');
  const [companySize, setCompanySize] = useState('');
  const [industry, setIndustry] = useState('');

  // Upload fields
  const [profilePictureFile, setProfilePictureFile] = useState(null);
  const [companyLogoFile, setCompanyLogoFile] = useState(null);
  const [resumeFile, setResumeFile] = useState(null);

  // Preview fields
  const [profilePicturePreview, setProfilePicturePreview] = useState('');
  const [companyLogoPreview, setCompanyLogoPreview] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await getProfile();
        if (res.data.success) {
          const p = res.data.data;
          setName(p.name || '');
          setPhone(p.phone || '');
          setLocation(p.location || '');
          setBio(p.bio || '');

          if (p.role === 'candidate') {
            setSkills(p.skills?.join(', ') || '');
            setExperience(p.experience || '');
            setEducation(p.education || '');
            setProfilePicturePreview(p.profilePicture || '');
          }

          if (p.role === 'employer') {
            setCompanyName(p.companyName || '');
            setCompanyWebsite(p.companyWebsite || '');
            setCompanyDescription(p.companyDescription || '');
            setCompanySize(p.companySize || '');
            setIndustry(p.industry || '');
            setCompanyLogoPreview(p.companyLogo || '');
          }
        }
      } catch (err) {
        toast.error('Failed to load user profile');
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleFileChange = (e, setFile, setPreview) => {
    const file = e.target.files[0];
    if (file) {
      setFile(file);
      if (setPreview) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setPreview(reader.result);
        };
        reader.readAsDataURL(file);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    const formData = new FormData();
    formData.append('name', name);
    formData.append('phone', phone);
    formData.append('location', location);
    formData.append('bio', bio);

    if (user.role === 'candidate') {
      formData.append('skills', skills);
      formData.append('experience', experience);
      formData.append('education', education);
      if (profilePictureFile) formData.append('profilePicture', profilePictureFile);
      if (resumeFile) formData.append('resume', resumeFile);
    }

    if (user.role === 'employer') {
      formData.append('companyName', companyName);
      formData.append('companyWebsite', companyWebsite);
      formData.append('companyDescription', companyDescription);
      formData.append('companySize', companySize);
      formData.append('industry', industry);
      if (companyLogoFile) formData.append('companyLogo', companyLogoFile);
    }

    try {
      const res = await updateProfile(formData);
      if (res.data.success) {
        setUser(res.data.data);
        toast.success('Profile details saved successfully!');
      }
    } catch (err) {
      toast.error('Failed to save profile changes');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12 flex items-center justify-center min-h-[50vh]">
        <div className="w-10 h-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      
      {/* Title */}
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
          My Profile Settings
        </h1>
        <p className="text-gray-500 dark:text-gray-400 font-medium">
          Manage your personal details, uploads, and professional identity.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Header Block */}
        <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-3xl p-6 md:p-8 flex flex-col md:flex-row items-center gap-6 shadow-sm">
          {/* Picture logo Upload preview */}
          {user.role === 'candidate' ? (
            <div className="relative group shrink-0">
              {profilePicturePreview ? (
                <img
                  src={profilePicturePreview}
                  alt={name}
                  className="w-24 h-24 md:w-32 md:h-32 rounded-full object-cover border-2 border-indigo-500/20"
                />
              ) : (
                <div className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 font-bold text-4xl flex items-center justify-center border-2 border-indigo-500/20">
                  {name.charAt(0).toUpperCase()}
                </div>
              )}
              <label className="absolute inset-0 rounded-full bg-black/50 text-white opacity-0 group-hover:opacity-100 flex items-center justify-center cursor-pointer transition-opacity text-xs font-semibold">
                <Upload className="w-5 h-5 mr-1" /> Edit
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileChange(e, setProfilePictureFile, setProfilePicturePreview)}
                  className="hidden"
                />
              </label>
            </div>
          ) : (
            <div className="relative group shrink-0">
              {companyLogoPreview ? (
                <img
                  src={companyLogoPreview}
                  alt={companyName}
                  className="w-24 h-24 md:w-32 md:h-32 rounded-2xl object-cover border-2 border-indigo-500/20"
                />
              ) : (
                <div className="w-24 h-24 md:w-32 md:h-32 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 font-bold text-4xl flex items-center justify-center border-2 border-indigo-500/20">
                  {companyName.charAt(0).toUpperCase() || 'C'}
                </div>
              )}
              <label className="absolute inset-0 rounded-2xl bg-black/50 text-white opacity-0 group-hover:opacity-100 flex items-center justify-center cursor-pointer transition-opacity text-xs font-semibold">
                <Upload className="w-5 h-5 mr-1" /> Edit Logo
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileChange(e, setCompanyLogoFile, setCompanyLogoPreview)}
                  className="hidden"
                />
              </label>
            </div>
          )}

          <div className="text-center md:text-left space-y-1">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{name}</h2>
            <p className="text-sm font-semibold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
              {user.role === 'candidate' ? 'Job Seeker' : 'Employer Representative'}
            </p>
            <p className="text-xs text-gray-400 dark:text-gray-500">{user.email}</p>
          </div>
        </div>

        {/* General details Card */}
        <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-3xl p-6 md:p-8 space-y-6 shadow-sm">
          <h3 className="font-bold text-gray-900 dark:text-white text-lg border-b border-gray-100 dark:border-gray-800/80 pb-4">
            Basic Information
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Name */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                Full Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                required
              />
            </div>

            {/* Phone */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                Phone Number
              </label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>

            {/* Location */}
            <div className="space-y-1.5 md:col-span-2">
              <label className="text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                Location Address
              </label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. San Francisco, CA"
                className="w-full bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>

            {/* Bio */}
            <div className="space-y-1.5 md:col-span-2">
              <label className="text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                Personal Biography
              </label>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                rows="4"
                className="w-full bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none resize-none"
              ></textarea>
            </div>
          </div>
        </div>

        {/* Candidate specifics Card */}
        {user.role === 'candidate' && (
          <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-3xl p-6 md:p-8 space-y-6 shadow-sm">
            <h3 className="font-bold text-gray-900 dark:text-white text-lg border-b border-gray-100 dark:border-gray-800/80 pb-4">
              Professional profile
            </h3>

            <div className="space-y-6">
              {/* Skills */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                  Skills (comma separated)
                </label>
                <input
                  type="text"
                  value={skills}
                  onChange={(e) => setSkills(e.target.value)}
                  placeholder="e.g. React.js, Node.js, JavaScript, MongoDB"
                  className="w-full bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>

              {/* Experience */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                  Professional Experience
                </label>
                <textarea
                  value={experience}
                  onChange={(e) => setExperience(e.target.value)}
                  rows="3"
                  placeholder="Summarize your career timeline..."
                  className="w-full bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none resize-none"
                ></textarea>
              </div>

              {/* Education */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                  Academic Background
                </label>
                <textarea
                  value={education}
                  onChange={(e) => setEducation(e.target.value)}
                  rows="3"
                  placeholder="Degrees, universities, courses..."
                  className="w-full bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none resize-none"
                ></textarea>
              </div>

              {/* Resume File */}
              <div className="space-y-1.5 border-t border-gray-100 dark:border-gray-800 pt-6">
                <label className="text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider block">
                  Profile Resume (PDF/DOCX)
                </label>
                {user.resume && (
                  <p className="text-xs text-gray-500 mb-2">
                    Current resume:{' '}
                    <a
                      href={user.resume}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-indigo-600 dark:text-indigo-400 font-semibold underline"
                    >
                      Download Resume
                    </a>
                  </p>
                )}
                <div className="flex items-center gap-3">
                  <label className="flex items-center justify-center px-4 py-2.5 border border-dashed border-gray-300 dark:border-gray-800 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800/50 cursor-pointer text-xs font-bold text-indigo-600 dark:text-indigo-400 transition-colors">
                    <FileText className="w-4 h-4 mr-2" />
                    Choose New Resume File
                    <input
                      type="file"
                      accept=".pdf,.doc,.docx"
                      onChange={(e) => handleFileChange(e, setResumeFile)}
                      className="hidden"
                    />
                  </label>
                  <span className="text-xs text-gray-400 truncate">
                    {resumeFile ? resumeFile.name : 'No file chosen'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Employer specifics Card */}
        {user.role === 'employer' && (
          <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-3xl p-6 md:p-8 space-y-6 shadow-sm">
            <h3 className="font-bold text-gray-900 dark:text-white text-lg border-b border-gray-100 dark:border-gray-800/80 pb-4">
              Company Information
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Company Name */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                  Company Name
                </label>
                <input
                  type="text"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  className="w-full bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                  required
                />
              </div>

              {/* Website */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                  Website URL
                </label>
                <input
                  type="url"
                  value={companyWebsite}
                  onChange={(e) => setCompanyWebsite(e.target.value)}
                  placeholder="https://example.com"
                  className="w-full bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>

              {/* Industry */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                  Industry / Field
                </label>
                <input
                  type="text"
                  value={industry}
                  onChange={(e) => setIndustry(e.target.value)}
                  placeholder="e.g. Software, Finance"
                  className="w-full bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>

              {/* Company Size */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                  Company Size
                </label>
                <input
                  type="text"
                  value={companySize}
                  onChange={(e) => setCompanySize(e.target.value)}
                  placeholder="e.g. 100-500 employees"
                  className="w-full bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>

              {/* Description */}
              <div className="space-y-1.5 md:col-span-2">
                <label className="text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                  Company Description
                </label>
                <textarea
                  value={companyDescription}
                  onChange={(e) => setCompanyDescription(e.target.value)}
                  rows="4"
                  className="w-full bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none resize-none"
                ></textarea>
              </div>
            </div>
          </div>
        )}

        {/* Submit Action */}
        <button
          type="submit"
          disabled={submitting}
          className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-bold shadow-lg shadow-indigo-600/10 hover:shadow-indigo-600/25 transition-all duration-200 disabled:opacity-50 flex items-center justify-center gap-2"
        >
          <Save className="w-4 h-4" />
          {submitting ? 'Saving changes...' : 'Save Profile Changes'}
        </button>
      </form>
    </div>
  );
};

export default Profile;
