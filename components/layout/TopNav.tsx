'use client';

import { Input } from "@heroui/input";
import { Kbd } from "@heroui/kbd";
import { ThemeSwitch } from "@/components/theme-switch";
import { ThemeConfig } from "@/config/theme";
import { SimpleLayoutType } from "@/config/constants";
import { SearchIcon } from "@/components/icons";
import { Button } from "@heroui/button";
import { useEffect, useState, useRef } from "react";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { usePathname, useRouter } from 'next/navigation';
import { NavbarProgressLoader } from '@/components/ui/Loader'
import { useLoader } from '@/context/LoaderContext'
import { useSearchPopup } from '@/hooks/useSearchPopup';
import SearchPopup from '@/components/ui/SearchPopup';
import { Settings, ArrowLeft, PanelLeftClose, PanelLeftOpen } from "lucide-react";

interface TopNavProps {
  theme: ThemeConfig;
  variant: typeof SimpleLayoutType[keyof typeof SimpleLayoutType];
  isSidebarCollapsed: boolean;
  onSidebarCollapsedChange: (collapsed: boolean) => void;
}

export function TopNav({ theme, variant, isSidebarCollapsed, onSidebarCollapsedChange }: TopNavProps) {
  const [isMac, setIsMac] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { isLoading, progress } = useLoader()
  const { isSearchOpen, searchQuery, openSearch, closeSearch } = useSearchPopup();
  
  // Check if we're in the profile tab
  const isProfilePage = pathname.startsWith('/profile');

  useEffect(() => {
    setIsMac(navigator.platform.toLowerCase().includes('mac'));

    const handleKeyDown = (e: KeyboardEvent) => {
      // Check for Cmd+K (Mac) or Ctrl+K (Windows/Linux)
      if ((isMac ? e.metaKey : e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        openSearch();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isMac, openSearch]);

  const searchInput = (
    <div
      onClick={() => openSearch()}
      className="flex items-center gap-3 px-4 py-2 bg-default-100 rounded-lg cursor-pointer hover:bg-default-200 transition-colors duration-200 min-w-[200px] border border-default-300"
    >
      <SearchIcon className="text-base text-default-400 flex-shrink-0" />
      <span className="text-sm text-default-500">Search...</span>
      <div className="flex gap-1 items-center ml-auto">
        <Kbd className="hidden lg:inline-block" keys={[isMac ? "command" : "ctrl"]}>
          K
        </Kbd>
      </div>
    </div>
  );

  return (
    <>
    <div className={`
      h-16 border-b border-default-200 bg-background
      flex items-center justify-between px-4
      fixed top-0 right-0 z-50
      transition-all duration-300 ease-in-out
      ${isSidebarCollapsed ? 'left-[60px]' : 'left-[260px]'}
      ${theme.themeDirection === 'rtl' ? 'left-0' : ''}
    `}>
      {/* Left side - Breadcrumb and Toggle */}
      <div className="h-full flex items-center space-x-4">
        <button
          onClick={() => onSidebarCollapsedChange(!isSidebarCollapsed)}
          className="w-8 h-8 flex items-center justify-center text-default-500 hover:text-default-900 rounded-lg hover:bg-default-100 transition-colors duration-200"
          aria-label={isSidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          title={isSidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {isSidebarCollapsed ? (
            <PanelLeftOpen className="w-4 h-4" />
          ) : (
            <PanelLeftClose className="w-4 h-4" />
          )}
        </button>
        <Breadcrumbs
          theme={theme}
          icons
          title={false}
        />
      </div>

      {/* Right side - Search, Settings, and Theme Toggle */}
      <div className="flex items-center space-x-4">
        <div className="relative">
          {searchInput}
        </div>
        <ThemeSwitch />
        <button
          onClick={() => isProfilePage ? router.push('/dashboard') : router.push('/profile')}
          className="p-2 rounded-lg hover:bg-default-100 transition-colors duration-200"
          aria-label={isProfilePage ? "Back to Dashboard" : "Profile Settings"}
          title={isProfilePage ? "Back to Dashboard" : "Profile Settings"}
        >
          {isProfilePage ? (
            <ArrowLeft className="w-5 h-5 text-default-500 hover:text-default-900" />
          ) : (
            <Settings className="w-5 h-5 text-default-500 hover:text-default-900" />
          )}
        </button>
      </div>
    </div>
    
    {/* Search Popup */}
    <SearchPopup 
      isOpen={isSearchOpen}
      onClose={closeSearch}
      searchQuery={searchQuery}
    />
    
    <NavbarProgressLoader isLoading={isLoading} progress={progress} />
    </>
  );
} 