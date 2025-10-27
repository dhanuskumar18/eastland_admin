'use client';

import Link from "next/link";
import { ThemeConfig } from "@/config/theme";
import { SimpleLayoutType } from "@/config/constants";
import { getNavItemsBySection, NavItem, navItems } from "@/config/nav";
import { LogoutIcon } from "@/components/icons";
import { useState } from "react";
import { usePathname } from 'next/navigation';
import { clsx } from 'clsx';
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import Image from "next/image";

interface SidebarProps {
  theme: ThemeConfig;
  variant: typeof SimpleLayoutType[keyof typeof SimpleLayoutType];
  isCollapsed: boolean;
  onCollapsedChange: (collapsed: boolean) => void;
}

export function Sidebar({ theme, variant, isCollapsed, onCollapsedChange }: SidebarProps) {
  const navSections = getNavItemsBySection();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const pathname = usePathname();
  const { isAuthenticated, logout } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      await logout();
    } catch (error: any) {
      console.error('Logout error in Sidebar:', error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  const renderNavItem = (item: NavItem) => {
    const isActive = pathname === item.href;

    return (
      <li key={item.href}>
        <Link
          href={item.href}
          className={clsx(
            'flex items-center text-sm font-medium rounded-lg transition-all duration-200',
            isActive 
              ? 'bg-green-100 text-green-600' 
              : 'text-gray-600 hover:bg-gray-50'
          )}
          style={{
            paddingLeft: isCollapsed ? '12px' : '16px',
            paddingRight: isCollapsed ? '12px' : '16px',
            paddingTop: '12px',
            paddingBottom: '12px'
          }}
        >
          <span className="flex items-center justify-center w-5 h-5">
            {item.icon}
          </span>
          {!isCollapsed && (
            <span className="ml-3">{item.label}</span>
          )}
        </Link>
      </li>
    );
  };

  return (
    <aside 
      className={clsx(
        'fixed top-0 left-0 h-screen bg-white flex flex-col transition-all duration-300 border-r border-gray-200',
        isCollapsed ? 'w-[60px]' : 'w-[260px]'
      )}
    >
      {/* Logo Section */}
      <div className="h-20   flex items-center justify-center border-b border-gray-200 px-4">
        <div className="relative w-full max-w-[200px] h-16">
          <Image 
            src="/images/logo/logo.png" 
            alt="Eastland Logo"
            fill
            className="object-contain"
          />
        </div>
      </div>

      {/* Navigation Menu */}
      <div className="flex-1 overflow-y-auto px-3 py-4">
        <nav>
          <ul className="space-y-3">
            {navItems.map(renderNavItem)}
          </ul>
        </nav>
      </div>

      {/* Logout Button */}
      {isAuthenticated && !isCollapsed && (
        <div className="p-4 border-t border-gray-200">
          <button
            className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            onClick={handleLogout}
            disabled={isLoggingOut}
          >
            <LogoutIcon className="w-5 h-5" />
            <span>{isLoggingOut ? 'Logging out...' : 'Logout'}</span>
          </button>
        </div>
      )}
    </aside>
  );
}
