import React, { useState, useEffect } from 'react';
import { Plus, Trash2, ArrowLeft } from 'lucide-react';
import { toast } from 'react-hot-toast';

const JobForm = ({ onSubmit, initialJob = null, onCancel }) => {
  const isEditing = !!initialJob;

  const [title, setTitle] = useState('');
  const [location, setLocation] = useState('');
  const [salaryMin, setSalaryMin] = useState('');
  const [salaryMax, setSalaryMax] = useState('');
  const [type, setType] = useState('Full-Time');
  const [category, setCategory] = useState('Technology');
  const [description, setDescription] = useState('');
  
  // Lists
  const [responsibilities, setResponsibilities] = useState(['']);
  const [requirements, setRequirements] = useState(['']);
  const [skills, setSkills] = useState(['']);
  const [benefits, setBenefits] = useState(['']);
  const [applicationDeadline, setApplicationDeadline] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (initialJob) {
      setTitle(initialJob.title || '');
      setLocation(initialJob.location || '');
      setSalaryMin(initialJob.salaryMin || '');
      setSalaryMax(initialJob.salaryMax || '');
      setType(initialJob.type || 'Full-Time');
      setCategory(initialJob.category || 'Technology');
      setDescription(initialJob.description || '');
      setResponsibilities(initialJob.responsibilities?.length ? initialJob.responsibilities : ['']);
      setRequirements(initialJob.requirements?.length ? initialJob.requirements : ['']);
      setSkills(initialJob.skills?.length ? initialJob.skills : ['']);
      setBenefits(initialJob.benefits?.length ? initialJob.benefits : ['']);
      if (initialJob.applicationDeadline) {
        setApplicationDeadline(new Date(initialJob.applicationDeadline).toISOString().split('T')[0]);
      }
    }
  }, [initialJob]);

  // Dynamic list manipulation handlers
  const handleListChange = (index, value, list, setList) => {
    const updated = [...list];
    updated[index] = value;
    setList(updated);
  };

  const handleAddField = (list, setList) => {
    setList([...list, '']);
  };

  const handleRemoveField = (index, list, setList) => {
    if (list.length === 1) {
      setList(['']);
      return;
    }
    const updated = list.filter((_, i) => i !== index);
    setList(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title || !location || !type || !category || !description) {
      toast.error('Please fill in all core required fields');
      return;
    }

    // Filter out empty rows
    const cleanedResponsibilities = responsibilities.filter((r) => r.trim() !== '');
    const cleanedRequirements = requirements.filter((r) => r.trim() !== '');
    const cleanedSkills = skills.filter((s) => s.trim() !== '');
    const cleanedBenefits = benefits.filter((b) => b.trim() !== '');

    const jobData = {
      title,
      location,
      salaryMin: salaryMin ? Number(salaryMin) : undefined,
      salaryMax: salaryMax ? Number(salaryMax) : undefined,
      type,
      category,
      description,
      responsibilities: cleanedResponsibilities,
      requirements: cleanedRequirements,
      skills: cleanedSkills,
      benefits: cleanedBenefits,
      applicationDeadline: applicationDeadline ? new Date(applicationDeadline) : undefined,
    };

    setLoading(true);
    try {
      await onSubmit(jobData);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

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

  return (
    <form onSubmit={handleSubmit} className="space-y-8 bg-white dark:bg-gray-900 rounded-3xl p-6 md:p-8 border border-gray-100 dark:border-gray-800 shadow-sm max-w-4xl mx-auto">
      {/* Title Bar */}
      <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-800 pb-5">
        <div className="flex items-center space-x-3">
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-gray-500" />
            </button>
          )}
          <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">
            {isEditing ? 'Edit Job Posting' : 'Post a New Job'}
          </h2>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Title */}
        <div className="space-y-1.5">
          <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
            Job Title <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Senior Frontend Engineer"
            className="w-full bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
            required
          />
        </div>

        {/* Location */}
        <div className="space-y-1.5">
          <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
            Location <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="e.g. Bengaluru, Karnataka or Remote"
            className="w-full bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
            required
          />
        </div>

        {/* Category */}
        <div className="space-y-1.5">
          <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
            Category <span className="text-red-500">*</span>
          </label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        {/* Job Type */}
        <div className="space-y-1.5">
          <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
            Job Type <span className="text-red-500">*</span>
          </label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="w-full bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
          >
            {jobTypes.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>

        {/* Salary Min */}
        <div className="space-y-1.5">
          <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
            Minimum Salary (Annual INR / ₹)
          </label>
          <input
            type="number"
            value={salaryMin}
            onChange={(e) => setSalaryMin(e.target.value)}
            placeholder="e.g. 800000"
            className="w-full bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
          />
        </div>

        {/* Salary Max */}
        <div className="space-y-1.5">
          <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
            Maximum Salary (Annual INR / ₹)
          </label>
          <input
            type="number"
            value={salaryMax}
            onChange={(e) => setSalaryMax(e.target.value)}
            placeholder="e.g. 1500000"
            className="w-full bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
          />
        </div>

        {/* Deadline */}
        <div className="space-y-1.5 md:col-span-2">
          <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
            Application Deadline
          </label>
          <input
            type="date"
            value={applicationDeadline}
            onChange={(e) => setApplicationDeadline(e.target.value)}
            className="w-full bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
          />
        </div>
      </div>

      {/* Description */}
      <div className="space-y-1.5">
        <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
          Job Description <span className="text-red-500">*</span>
        </label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows="6"
          placeholder="Provide a detailed job description..."
          className="w-full bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none resize-y"
          required
        ></textarea>
      </div>

      {/* Dynamic Responsibilities */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
            Key Responsibilities
          </label>
          <button
            type="button"
            onClick={() => handleAddField(responsibilities, setResponsibilities)}
            className="inline-flex items-center text-xs font-semibold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300"
          >
            <Plus className="w-3.5 h-3.5 mr-1" /> Add Item
          </button>
        </div>
        <div className="space-y-2">
          {responsibilities.map((resp, idx) => (
            <div key={idx} className="flex items-center gap-2">
              <input
                type="text"
                value={resp}
                onChange={(e) =>
                  handleListChange(idx, e.target.value, responsibilities, setResponsibilities)
                }
                placeholder="e.g. Design and implement responsive UI pages"
                className="w-full bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
              />
              <button
                type="button"
                onClick={() => handleRemoveField(idx, responsibilities, setResponsibilities)}
                className="p-2.5 rounded-xl text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 shrink-0 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Dynamic Requirements */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
            Job Requirements
          </label>
          <button
            type="button"
            onClick={() => handleAddField(requirements, setRequirements)}
            className="inline-flex items-center text-xs font-semibold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300"
          >
            <Plus className="w-3.5 h-3.5 mr-1" /> Add Item
          </button>
        </div>
        <div className="space-y-2">
          {requirements.map((reqItem, idx) => (
            <div key={idx} className="flex items-center gap-2">
              <input
                type="text"
                value={reqItem}
                onChange={(e) =>
                  handleListChange(idx, e.target.value, requirements, setRequirements)
                }
                placeholder="e.g. 3+ years experience with React.js & Tailwind CSS"
                className="w-full bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
              />
              <button
                type="button"
                onClick={() => handleRemoveField(idx, requirements, setRequirements)}
                className="p-2.5 rounded-xl text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 shrink-0 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Dynamic Skills */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
            Required Skills
          </label>
          <button
            type="button"
            onClick={() => handleAddField(skills, setSkills)}
            className="inline-flex items-center text-xs font-semibold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300"
          >
            <Plus className="w-3.5 h-3.5 mr-1" /> Add Skill
          </button>
        </div>
        <div className="space-y-2">
          {skills.map((skillItem, idx) => (
            <div key={idx} className="flex items-center gap-2">
              <input
                type="text"
                value={skillItem}
                onChange={(e) => handleListChange(idx, e.target.value, skills, setSkills)}
                placeholder="e.g. React.js"
                className="w-full bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
              />
              <button
                type="button"
                onClick={() => handleRemoveField(idx, skills, setSkills)}
                className="p-2.5 rounded-xl text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 shrink-0 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Dynamic Benefits */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
            Benefits Offered
          </label>
          <button
            type="button"
            onClick={() => handleAddField(benefits, setBenefits)}
            className="inline-flex items-center text-xs font-semibold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300"
          >
            <Plus className="w-3.5 h-3.5 mr-1" /> Add Item
          </button>
        </div>
        <div className="space-y-2">
          {benefits.map((benefitItem, idx) => (
            <div key={idx} className="flex items-center gap-2">
              <input
                type="text"
                value={benefitItem}
                onChange={(e) => handleListChange(idx, e.target.value, benefits, setBenefits)}
                placeholder="e.g. Full Medical & Dental Insurance, 401(k)"
                className="w-full bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
              />
              <button
                type="button"
                onClick={() => handleRemoveField(idx, benefits, setBenefits)}
                className="p-2.5 rounded-xl text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 shrink-0 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4 border-t border-gray-100 dark:border-gray-800 pt-6">
        <button
          type="submit"
          disabled={loading}
          className="flex-grow py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-bold shadow-lg shadow-indigo-600/10 hover:shadow-indigo-600/25 transition-all duration-200 disabled:opacity-50"
        >
          {loading ? 'Submitting...' : isEditing ? 'Save Changes' : 'Publish Job Listing'}
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-3.5 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-xl text-sm font-semibold transition-colors"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
};

export default JobForm;
