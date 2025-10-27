'use client';

import React from 'react';
import { Loader2 } from 'lucide-react';

interface InlineLoaderProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const InlineLoader: React.FC<InlineLoaderProps> = ({
  size = 'sm',
  className = ''
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  };

  return (
    <Loader2
      className={`animate-spin text-gray-500 dark:text-gray-400 ${sizeClasses[size]} ${className}`}
    />
  );
};

export default InlineLoader;
