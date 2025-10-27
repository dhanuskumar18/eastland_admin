'use client';

import React from 'react';
import { useTheme } from 'next-themes';
import { cn } from '@/lib/utils';

interface CardProps {
  title?: string;
  children: React.ReactNode;
  className?: string;
  titleClassName?: string;
}

interface CardHeaderProps {
  children: React.ReactNode;
  className?: string;
}

interface CardContentProps {
  children: React.ReactNode;
  className?: string;
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ title, children, className, titleClassName, ...props }, ref) => {
    const { resolvedTheme } = useTheme();

    return (
      <div
        ref={ref}
        className={cn(
          "bg-dark2 rounded-lg shadow-sm border border-dark2-200 dark:border-gray-700 p-6 transition-all duration-300",
          className
        )}
        {...props}
      >
        {title && (
          <h3 className={cn(
            "text-lg font-semibold mb-4 transition-colors duration-300",
            resolvedTheme === 'dark' ? 'text-gray-100' : 'text-gray-900',
            titleClassName
          )}>
            {title}
          </h3>
        )}
        {children}
      </div>
    );
  }
);

export const CardHeader = React.forwardRef<HTMLDivElement, CardHeaderProps>(
  ({ children, className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("flex flex-col space-y-1.5 p-6", className)}
        {...props}
      >
        {children}
      </div>
    );
  }
);

export const CardContent = React.forwardRef<HTMLDivElement, CardContentProps>(
  ({ children, className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("p-6 pt-0", className)}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = 'Card';
CardHeader.displayName = 'CardHeader';
CardContent.displayName = 'CardContent';
