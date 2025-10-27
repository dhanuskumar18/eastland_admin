import React from 'react';

interface LanguageSkeletonProps {
  type: 'list' | 'detail';
  searchQuery?: string;
}

const LanguageSkeleton: React.FC<LanguageSkeletonProps> = ({ type, searchQuery }) => {
  if (type === 'list') {
    return (
      <div className="container mx-auto p-6 animate-pulse">
        {/* Header Skeleton */}
        <div className="mb-6">
          <div className="h-8 w-48 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
          <div className="h-4 w-96 bg-gray-200 dark:bg-gray-700 rounded"></div>
        </div>

        {/* Search Bar Skeleton */}
        <div className="mb-6">
          <div className="relative">
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
            <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-full pl-10"></div>
          </div>
        </div>

        {/* Cards Skeleton */}
        <div className="space-y-3">
          {Array.from({ length: searchQuery ? 4 : 8 }).map((_, i) => (
            <div key={i} className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
                  <div>
                    <div className={`h-5 bg-gray-200 dark:bg-gray-700 rounded ${searchQuery ? 'w-28' : 'w-32'} mb-1`}></div>
                    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-24"></div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded-full w-8"></div>
                  <div className="w-4 h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (type === 'detail') {
    return (
      <div className="container mx-auto p-6 animate-pulse">
        {/* Back Button Skeleton */}
        <div className="mb-4">
          <div className="h-8 w-20 bg-gray-200 dark:bg-gray-700 rounded"></div>
        </div>
        
        {/* Header Section Skeleton */}
        <div className="mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <div className="h-8 w-64 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
              <div className="h-4 w-48 bg-gray-200 dark:bg-gray-700 rounded"></div>
            </div>
            <div className="h-10 w-32 bg-gray-200 dark:bg-gray-700 rounded"></div>
          </div>
        </div>

        {/* Page Fields Section Skeleton */}
        <div className="">
          <div className="flex items-center justify-between w-full my-2 gap-4 mb-4">
            <div className="flex items-center gap-3">
              <div className="w-2 h-8 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
              <div className="h-6 w-24 bg-gray-200 dark:bg-gray-700 rounded"></div>
            </div>
            <div className="h-4 w-32 bg-gray-200 dark:bg-gray-700 rounded"></div>
          </div>
          
          {/* Table Skeleton */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
            {/* Table Header */}
            <div className="bg-gray-50 dark:bg-gray-700 border-b-2 border-gray-200 dark:border-gray-600">
              <div className="flex items-center px-3 sm:px-6 py-4">
                <div className="w-48 sm:w-64 px-3 sm:px-6">
                  <div className="flex items-center gap-2">
                    <div className="w-1 h-4 bg-gray-300 dark:bg-gray-600 rounded-full"></div>
                    <div className="h-4 w-8 bg-gray-300 dark:bg-gray-600 rounded"></div>
                  </div>
                </div>
                <div className="px-3 sm:px-6">
                  <div className="flex items-center gap-2">
                    <div className="w-1 h-4 bg-gray-300 dark:bg-gray-600 rounded-full"></div>
                    <div className="h-4 w-16 bg-gray-300 dark:bg-gray-600 rounded"></div>
                  </div>
                </div>
                <div className="px-3 sm:px-6">
                  <div className="flex items-center gap-2">
                    <div className="w-1 h-4 bg-gray-300 dark:bg-gray-600 rounded-full"></div>
                    <div className="h-4 w-20 bg-gray-300 dark:bg-gray-600 rounded"></div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Table Body */}
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="flex items-center px-3 sm:px-6 py-4">
                  {/* Key Column */}
                  <div className="w-48 sm:w-64 px-3 sm:px-6">
                    <div className="flex flex-col gap-2">
                      <div className="h-6 w-40 bg-gray-200 dark:bg-gray-600 rounded-lg"></div>
                      <div className="h-4 w-12 bg-gray-200 dark:bg-gray-600 rounded-full"></div>
                    </div>
                  </div>
                  
                  {/* English Column */}
                  <div className="px-3 sm:px-6 flex-1">
                    <div className="min-h-[60px] sm:min-h-[80px] p-3 sm:p-4 border-2 border-gray-200 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700">
                      <div className="space-y-2">
                        <div className="h-4 w-full bg-gray-200 dark:bg-gray-600 rounded"></div>
                        <div className="h-4 w-3/4 bg-gray-200 dark:bg-gray-600 rounded"></div>
                        <div className="h-4 w-1/2 bg-gray-200 dark:bg-gray-600 rounded"></div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Portuguese Column */}
                  <div className="px-3 sm:px-6 flex-1">
                    <div className="min-h-[60px] sm:min-h-[80px] p-3 sm:p-4 border-2 border-gray-200 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700">
                      <div className="space-y-2">
                        <div className="h-4 w-full bg-gray-200 dark:bg-gray-600 rounded"></div>
                        <div className="h-4 w-2/3 bg-gray-200 dark:bg-gray-600 rounded"></div>
                        <div className="h-4 w-1/3 bg-gray-200 dark:bg-gray-600 rounded"></div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default LanguageSkeleton;
