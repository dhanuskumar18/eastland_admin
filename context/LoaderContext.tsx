'use client';

import React, { createContext, useContext, useState, useCallback, useRef } from 'react';

interface LoaderContextType {
  isLoading: boolean;
  progress: number;
  startLoading: () => void;
  updateProgress: (value: number) => void;
  finishLoading: () => void;
  resetLoader: () => void;
  startLoadingWithProgress: (duration?: number) => void;
}

const LoaderContext = createContext<LoaderContextType | undefined>(undefined);

export const useLoader = () => {
  const context = useContext(LoaderContext);
  if (context === undefined) {
    throw new Error('useLoader must be used within a LoaderProvider');
  }
  return context;
};

interface LoaderProviderProps {
  children: React.ReactNode;
}

export const LoaderProvider: React.FC<LoaderProviderProps> = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const startLoading = useCallback(() => {
    setIsLoading(true);
    setProgress(0);
  }, []);

  const updateProgress = useCallback((value: number) => {
    setProgress(Math.min(100, Math.max(0, value)));
  }, []);

  const finishLoading = useCallback(() => {
    setProgress(100);
    setTimeout(() => {
      setIsLoading(false);
      setProgress(0);
    }, 500);
  }, []);

  const resetLoader = useCallback(() => {
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
      progressIntervalRef.current = null;
    }
    setIsLoading(false);
    setProgress(0);
  }, []);

  const startLoadingWithProgress = useCallback((duration: number = 2000) => {
    // Clear any existing interval
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
    }

    setIsLoading(true);
    setProgress(0);

    // Calculate interval for smooth progress
    const totalSteps = 100;
    const stepDuration = duration / totalSteps;
    let currentStep = 0;

    progressIntervalRef.current = setInterval(() => {
      currentStep++;
      
      // Simulate realistic progress with acceleration and deceleration
      if (currentStep <= 20) {
        // Slow start (0-20%)
        setProgress(Math.floor((currentStep / 20) * 15));
      } else if (currentStep <= 80) {
        // Fast middle (20-80%)
        setProgress(Math.floor(15 + ((currentStep - 20) / 60) * 70));
      } else {
        // Slow finish (80-100%)
        setProgress(Math.floor(85 + ((currentStep - 80) / 20) * 15));
      }

      if (currentStep >= totalSteps) {
        if (progressIntervalRef.current) {
          clearInterval(progressIntervalRef.current);
          progressIntervalRef.current = null;
        }
        // Ensure we reach 100%
        setProgress(100);
        // Wait a bit then hide
        setTimeout(() => {
          setIsLoading(false);
          setProgress(0);
        }, 300);
      }
    }, stepDuration);
  }, []);

  const value: LoaderContextType = {
    isLoading,
    progress,
    startLoading,
    updateProgress,
    finishLoading,
    resetLoader,
    startLoadingWithProgress,
  };

  return (
    <LoaderContext.Provider value={value}>
      {children}
    </LoaderContext.Provider>
  );
};
