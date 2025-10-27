'use client';

import { ReactNode, useState, useEffect } from 'react';
import { SimpleLayoutType, MenuOrientation } from '@/config/constants';
import { Navbar } from '@/components/navbar';
import { Sidebar } from './Sidebar';
import { TopNav } from './TopNav';
import { useThemeConfig } from '@/app/providers';
import { ThemeConfig } from '@/config/theme';

interface LayoutProps {
  children: ReactNode;
  initialTheme: ThemeConfig;
}

export default function Layout({ children, initialTheme }: LayoutProps) {
  const [currentTheme, setCurrentTheme] = useState<ThemeConfig>(initialTheme);
  const { theme } = useThemeConfig();

  useEffect(() => {
    if (theme) {
      setCurrentTheme(theme);
    }
  }, [theme]);

  const isVertical = currentTheme.menuOrientation === MenuOrientation.VERTICAL;
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(currentTheme.miniDrawer);

  const handleSidebarToggle = (collapsed: boolean) => {
    setIsSidebarCollapsed(collapsed);
  };

  if (isVertical) {
  return (
      <div className="min-h-screen bg-background">
          <Sidebar 
          theme={currentTheme} 
          variant={SimpleLayoutType.SIMPLE} 
            isCollapsed={isSidebarCollapsed}
            onCollapsedChange={handleSidebarToggle}
          />
          <TopNav 
          theme={currentTheme} 
          variant={SimpleLayoutType.SIMPLE}
            isSidebarCollapsed={isSidebarCollapsed}
            onSidebarCollapsedChange={handleSidebarToggle}
          />
          <main 
          className="transition-all duration-300 ease-in-out p-6 mt-16"
            style={{
            marginLeft: currentTheme.themeDirection === 'rtl' ? 0 : (isSidebarCollapsed ? '60px' : '260px'),
            marginRight: currentTheme.themeDirection === 'rtl' ? (isSidebarCollapsed ? '60px' : '260px') : 0,
              width: `calc(100% - ${isSidebarCollapsed ? '60px' : '260px'})`,
            float: currentTheme.themeDirection === 'rtl' ? 'right' : 'left'
            }}
          >
            <div className={`
               rounded-lg p-6 min-h-[calc(100vh-6rem)]
            ${currentTheme.container && !isSidebarCollapsed ? 'container mx-auto' : ''}
            `}>
              <div className="p-6 space-y-6 rounded">
              {children}
              </div>
            </div>
          </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar theme={currentTheme} variant={SimpleLayoutType.SIMPLE} />
          <main className={`
        p-6
        ${currentTheme.container ? 'container mx-auto' : ''}
        ${currentTheme.themeDirection === 'rtl' ? 'dir-rtl' : ''}
          `}>
        <div className="bg-default-50 rounded-lg p-6 min-h-[calc(100vh-8rem)]">
            {children}
        </div>
          </main>
    </div>
  );
} 