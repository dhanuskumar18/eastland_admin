'use client';

import React from 'react';

interface TableSkeletonProps {
  rows?: number;
  columns?: number;
  showHeader?: boolean;
  className?: string;
}

const TableSkeleton: React.FC<TableSkeletonProps> = ({
  rows = 5,
  columns = 6,
  showHeader = true,
  className = ''
}) => {
  return (
    <div className={`w-full animate-pulse ${className}`}>
      {/* Table Header Skeleton */}
      {showHeader && (
        <div className="bg-gray-50 dark:bg-dark2 rounded-t-lg">
          <div className="flex items-center px-6 py-3 w-full">
            {/* Checkbox Header */}
            <div className="w-12 flex-shrink-0">
              <div className="h-4 w-4 bg-gray-200 dark:bg-dark2 rounded"></div>
            </div>

            {/* Dynamic column headers based on columns prop */}
            {Array.from({ length: columns }, (_, index) => (
              <div
                key={index}
                className="px-3"
                style={{ width: `${100 / columns}%` }}
              >
                <div className="h-4 w-16 bg-gray-200 dark:bg-dark2 rounded"></div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Table Rows Skeleton */}
      <div className="border border-gray-200 dark:border-gray-700 rounded-b-lg overflow-hidden">
        {Array.from({ length: rows }, (_, rowIndex) => (
          <div
            key={rowIndex}
            className="border-b border-gray-200 dark:border-gray-700 last:border-b-0"
          >
            <div className="flex items-center px-6 py-4 w-full">
              {/* Checkbox */}
              <div className="w-12 flex-shrink-0">
                <div className="h-4 w-4 bg-gray-200 dark:bg-dark2 rounded"></div>
              </div>

              {/* Dynamic column content */}
              {Array.from({ length: columns }, (_, colIndex) => (
                <div
                  key={colIndex}
                  className="px-3"
                  style={{ width: `${100 / columns}%` }}
                >
                  {colIndex === 0 ? (
                    // First column with avatar for profile-like data
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gray-200 dark:bg-dark2 rounded-full"></div>
                      <div className="space-y-2">
                        <div className="h-4 w-24 bg-gray-200 dark:bg-dark2 rounded"></div>
                        <div className="h-3 w-16 bg-gray-200 dark:bg-dark2 rounded"></div>
                      </div>
                    </div>
                  ) : colIndex === columns - 1 ? (
                    // Last column for actions
                    <div className="flex items-center space-x-2">
                      <div className="h-6 w-6 bg-gray-200 dark:bg-dark2 rounded"></div>
                      <div className="h-6 w-6 bg-gray-200 dark:bg-dark2 rounded"></div>
                      <div className="h-6 w-6 bg-gray-200 dark:bg-dark2 rounded"></div>
                    </div>
                  ) : (
                    // Regular columns
                    <div className="space-y-2">
                      <div className="h-4 w-20 bg-gray-200 dark:bg-dark2 rounded"></div>
                      {Math.random() > 0.7 && (
                        <div className="h-3 w-16 bg-gray-200 dark:bg-dark2 rounded"></div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TableSkeleton;
