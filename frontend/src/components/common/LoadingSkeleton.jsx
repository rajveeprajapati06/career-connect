import React from 'react';

export const Skeleton = ({ className = '' }) => {
  return (
    <div className={`bg-gray-200 dark:bg-gray-800 animate-pulse rounded-lg ${className}`}></div>
  );
};

export const JobCardSkeleton = () => {
  return (
    <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-6 space-y-4 shadow-sm">
      <div className="flex items-start justify-between">
        <div className="flex items-center space-x-3 w-full">
          <Skeleton className="w-12 h-12 rounded-xl shrink-0" />
          <div className="space-y-2 w-2/3">
            <Skeleton className="h-5 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        </div>
        <Skeleton className="w-6 h-6 rounded-full" />
      </div>
      <div className="flex flex-wrap gap-2 pt-2">
        <Skeleton className="h-6 w-20 rounded-lg" />
        <Skeleton className="h-6 w-24 rounded-lg" />
        <Skeleton className="h-6 w-16 rounded-lg" />
      </div>
      <hr className="border-gray-100 dark:border-gray-800" />
      <div className="flex items-center justify-between pt-1">
        <Skeleton className="h-4 w-28" />
        <Skeleton className="h-8 w-24 rounded-xl" />
      </div>
    </div>
  );
};

export const ProfileSkeleton = () => {
  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-3xl p-6 md:p-8 flex flex-col md:flex-row items-center gap-6">
        <Skeleton className="w-24 h-24 md:w-32 md:h-32 rounded-full" />
        <div className="space-y-3 w-full text-center md:text-left">
          <Skeleton className="h-7 w-48 mx-auto md:mx-0" />
          <Skeleton className="h-5 w-36 mx-auto md:mx-0" />
          <Skeleton className="h-5 w-24 mx-auto md:mx-0" />
        </div>
      </div>
      <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-3xl p-6 md:p-8 space-y-6">
        <Skeleton className="h-6 w-36" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-10 w-full" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-10 w-full" />
          </div>
        </div>
        <div className="space-y-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-28 w-full" />
        </div>
      </div>
    </div>
  );
};

export const TableSkeleton = ({ rows = 5, cols = 4 }) => {
  return (
    <div className="w-full bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden">
      <div className="border-b border-gray-100 dark:border-gray-800 px-6 py-4 flex gap-4">
        {Array.from({ length: cols }).map((_, i) => (
          <Skeleton key={i} className="h-5 w-1/4" />
        ))}
      </div>
      <div className="divide-y divide-gray-100 dark:divide-gray-800">
        {Array.from({ length: rows }).map((_, rowIndex) => (
          <div key={rowIndex} className="px-6 py-4 flex gap-4">
            {Array.from({ length: cols }).map((_, colIndex) => (
              <Skeleton key={colIndex} className="h-4 w-1/4" />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

const LoadingSkeleton = ({ variant = 'card', count = 3 }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, i) => {
        if (variant === 'profile') return <ProfileSkeleton key={i} />;
        if (variant === 'table') return <TableSkeleton key={i} />;
        return <JobCardSkeleton key={i} />;
      })}
    </div>
  );
};

export default LoadingSkeleton;
