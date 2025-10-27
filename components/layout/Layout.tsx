'use client';

import { ReactNode, useState, useEffect } from 'react';
import { SimpleLayoutType, MenuOrientation } from '@/config/constants';
import { Sidebar } from './Sidebar';
import { TopBar } from './TopBar';
import { useThemeConfig } from '@/app/providers';
import { ThemeConfig } from '@/config/theme';

interface LayoutProps {
  children: ReactNode;
  initialTheme: ThemeConfig;
}

export default function Layout({ children, initialTheme }: LayoutProps) {
  const [currentTheme, setCurrentTheme] = useState<ThemeConfig>(initialTheme);
  const { theme } = useThemeConfig();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false); // Start expanded

  useEffect(() => {
    if (theme) {
      setCurrentTheme(theme);
    }
  }, [theme]);

  const handleSidebarToggle = (collapsed: boolean) => {
    setIsSidebarCollapsed(collapsed);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar 
        theme={currentTheme} 
        variant={SimpleLayoutType.SIMPLE} 
        isCollapsed={isSidebarCollapsed}
        onCollapsedChange={handleSidebarToggle}
      />
      
      {/* Main Content Area */}
      <div 
        className="transition-all duration-300"
        style={{
          marginLeft: isSidebarCollapsed ? '60px' : '260px',
        }}
      >
        {/* Top Bar */}
        <TopBar 
          isCollapsed={isSidebarCollapsed}
          onToggleSidebar={() => handleSidebarToggle(!isSidebarCollapsed)}
        />
        
        {/* Page Content */}
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
