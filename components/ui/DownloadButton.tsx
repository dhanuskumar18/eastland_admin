'use client';

import React, { useState } from 'react';
import { Download, CheckCircle, XCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DownloadButtonProps {
  onDownload: () => Promise<void> | void;
  fileName?: string;
  fileType?: 'csv' | 'excel' | 'pdf' | 'json';
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  disabled?: boolean;
  showProgress?: boolean;
}

export default function DownloadButton({
  onDownload,
  fileName = 'download',
  fileType = 'csv',
  variant = 'outline',
  size = 'md',
  className,
  disabled = false,
  showProgress = false,
}: DownloadButtonProps) {
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadStatus, setDownloadStatus] = useState<'idle' | 'downloading' | 'success' | 'error'>('idle');

  const handleDownload = async () => {
    if (isDownloading || disabled) return;

    try {
      setIsDownloading(true);
      setDownloadStatus('downloading');
      
      await onDownload();
      
      setDownloadStatus('success');
      setTimeout(() => {
        setDownloadStatus('idle');
        setIsDownloading(false);
      }, 2000);
      
    } catch (error) {
      console.error('Download failed:', error);
      setDownloadStatus('error');
      setTimeout(() => {
        setDownloadStatus('idle');
        setIsDownloading(false);
      }, 2000);
    }
  };

  const getFileIcon = () => {
    switch (fileType) {
      case 'csv':
        return '📊';
      case 'excel':
        return '📈';
      case 'pdf':
        return '📄';
      case 'json':
        return '🔧';
      default:
        return '📁';
    }
  };

  const getFileExtension = () => {
    switch (fileType) {
      case 'csv':
        return '.csv';
      case 'excel':
        return '.xlsx';
      case 'pdf':
        return '.pdf';
      case 'json':
        return '.json';
      default:
        return '';
    }
  };

  const getVariantClasses = () => {
    switch (variant) {
      case 'outline':
        return 'border border-blue-600 dark:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20';
      case 'ghost':
        return 'hover:bg-gray-100 dark:hover:bg-gray-700';
      default:
        return 'bg-primary-blue hover:bg-primary-blue dark:bg-primary-blue dark:hover:bg-primary-blue text-white';
    }
  };

  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'p-2';
      case 'lg':
        return 'p-3';
      default:
        return 'p-2.5';
    }
  };

  const getStatusIcon = () => {
    switch (downloadStatus) {
      case 'downloading':
        return (
          <div className="animate-spin rounded-full h-4 w-4 border-2 border-current border-t-transparent" />
        );
      case 'success':
        return <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400" />;
      case 'error':
        return <XCircle className="w-4 h-4 text-red-600 dark:text-red-400" />;
      default:
        return <Download className="w-4 h-4" />;
    }
  };

  const getStatusColor = () => {
    switch (downloadStatus) {
      case 'downloading':
        return 'text-blue-600 dark:text-blue-400';
      case 'success':
        return 'text-green-600 dark:text-green-400';
      case 'error':
        return 'text-red-600 dark:text-red-400';
      default:
        return 'text-blue-600 dark:text-blue-500';
    }
  };

  return (
    <div className="relative group">
      <button
        onClick={handleDownload}
        disabled={disabled || isDownloading}
        className={cn(
          'rounded-lg transition-all duration-300 cursor-pointer flex items-center justify-center',
          getVariantClasses(),
          getSizeClasses(),
          getStatusColor(),
          disabled && 'opacity-50 cursor-not-allowed',
          className
        )}
      >
        {getStatusIcon()}
      </button>
      
      {/* Progress indicator */}
      {showProgress && isDownloading && (
        <div className="absolute -bottom-1 left-0 right-0 h-1 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
          <div className="h-full bg-primary-blue dark:bg-primary-blue animate-pulse" style={{ width: '100%' }} />
        </div>
      )}
    </div>
  );
}

// Specialized download buttons for common file types
export function CSVDownloadButton(props: Omit<DownloadButtonProps, 'fileType'>) {
  return <DownloadButton {...props} fileType="csv" />;
}

export function ExcelDownloadButton(props: Omit<DownloadButtonProps, 'fileType'>) {
  return <DownloadButton {...props} fileType="excel" />;
}

export function PDFDownloadButton(props: Omit<DownloadButtonProps, 'fileType'>) {
  return <DownloadButton {...props} fileType="pdf" />;
}

export function JSONDownloadButton(props: Omit<DownloadButtonProps, 'fileType'>) {
  return <DownloadButton {...props} fileType="json" />;
}
