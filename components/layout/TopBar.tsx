'use client';

import { Search } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { usePathname } from 'next/navigation';
import Image from 'next/image';

interface TopBarProps {
  isCollapsed: boolean;
  onToggleSidebar?: () => void;
}

export function TopBar({ isCollapsed, onToggleSidebar }: TopBarProps) {
  const { user } = useAuth();
  const pathname = usePathname();

  const getBreadcrumbs = () => {
    const segments = pathname.split('/').filter(Boolean);
    return segments.length > 0 ? ['Home', ...segments] : ['Home'];
  };

  const breadcrumbs = getBreadcrumbs();

  return (
    <div className="h-20 bg-white border-b border-gray-200 flex items-center justify-between px-6">
      {/* Left Section - Greeting and Breadcrumbs */}
      <div className="flex flex-col space-y-1">
          <h1 className="text-xl font-semibold text-gray-800">
            Hello {user?.firstName || 'User'}
          </h1>
          <div className="flex items-center text-sm">
            {breadcrumbs.map((crumb, index) => (
              <div key={index} className="flex items-center">
                {index > 0 && <span className="text-gray-400 mx-1">/</span>}
                <span className={index === breadcrumbs.length - 1 ? 'text-green-600 font-medium' : 'text-gray-500'}>
                  {crumb}
                </span>
              </div>
            ))}
          </div>
      </div>

      {/* Right Section - Search, Settings, Notifications, Profile */}
      <div className="flex items-center space-x-4">
        {/* Search Bar */}
        <div className="relative">
          <input
            type="text"
            placeholder="Search..."
            className="w-64 pl-10 pr-4 py-2 text-sm border border-gray-200 bg-gray-50 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent focus:bg-white"
            style={{ borderRadius: '80px' }}
          />
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-green-600" />
        </div>

        {/* Settings Icon */}
        <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
          <Image src="/images/icons/settings.png" alt="Settings" width={20} height={20} className="w-5 h-5" />
        </button>

        {/* Notifications Icon */}
        <button className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors">
          <Image src="/images/icons/circle_notifications.png" alt="Notifications" width={20} height={20} className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-green-600 rounded-full" />
        </button>

        {/* User Profile */}
        <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden cursor-pointer hover:ring-2 hover:ring-gray-300 transition-all">
          {user?.profile?.picture ? (
            <img 
              src={user.profile.picture} 
              alt={user.firstName || 'User'} 
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="text-gray-600 font-semibold text-sm">
              {user?.firstName?.[0]?.toUpperCase() || user?.lastName?.[0]?.toUpperCase() || 'U'}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
