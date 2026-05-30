import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import JobCard from '../jobs/JobCard';
import LoadingSkeleton from '../common/LoadingSkeleton';
import { getFeaturedJobs } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

const FeaturedJobs = () => {
  const { user } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const res = await getFeaturedJobs();
        if (res.data.success) {
          setJobs(res.data.data);
        }
      } catch (error) {
        console.error('Error fetching featured jobs:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchFeatured();
  }, []);

  const isJobBookmarked = (jobId) => {
    if (!user || !user.savedJobs) return false;
    return user.savedJobs.includes(jobId);
  };

  const handleBookmarkToggleLocal = (jobId, isSaved) => {
    // Context handles actual state update, this triggers a re-render if needed
  };

  return (
    <section className="py-20 bg-white dark:bg-gray-900 border-y border-gray-100 dark:border-gray-800 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div className="space-y-3">
            <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white">
              Featured Opportunities
            </h2>
            <p className="text-gray-500 dark:text-gray-400 max-w-xl">
              Handpicked job openings from leading companies that are actively seeking top talent like you.
            </p>
          </div>
          <Link
            to="/jobs"
            className="inline-flex items-center text-sm font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 group mt-4 md:mt-0 transition-colors"
          >
            Explore All Listings
            <ArrowRight className="w-4 h-4 ml-1.5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Content */}
        {loading ? (
          <LoadingSkeleton count={3} />
        ) : jobs.length > 0 ? (
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: { staggerChildren: 0.1 },
              },
            }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {jobs.map((job) => (
              <motion.div
                key={job._id}
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
                }}
              >
                <JobCard
                  job={job}
                  isBookmarked={isJobBookmarked(job._id)}
                  onBookmarkToggle={handleBookmarkToggleLocal}
                />
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400">No jobs posted yet. Check back soon!</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default FeaturedJobs;
