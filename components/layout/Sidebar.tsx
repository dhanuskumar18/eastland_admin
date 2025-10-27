'use client';

import Link from "next/link";
import { Button } from "@heroui/button";
import { ThemeConfig } from "@/config/theme";
import { SimpleLayoutType } from "@/config/constants";
import { getNavItemsBySection, NavItem, navItems } from "@/config/nav";
import { Logo, LogoutIcon, ChevronIcon } from "@/components/icons";
import { useState, useRef, useEffect } from "react";
import { usePathname } from 'next/navigation';
import { clsx } from 'clsx';
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useTheme } from "next-themes";

interface SidebarProps {
  theme: ThemeConfig;
  variant: typeof SimpleLayoutType[keyof typeof SimpleLayoutType];
  isCollapsed: boolean;
  onCollapsedChange: (collapsed: boolean) => void;
}

export function Sidebar({ theme, variant, isCollapsed, onCollapsedChange }: SidebarProps) {
  const navSections = getNavItemsBySection();
  const [expandedItems, setExpandedItems] = useState<string[]>([]);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const [popupPosition, setPopupPosition] = useState({ top: 0 , bottom: 0 });
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const pathname = usePathname();
  const { isAuthenticated, user, logout } = useAuth();
  const router = useRouter();
  const popupRef = useRef<HTMLDivElement>(null);
  const [isPopupHovered, setIsPopupHovered] = useState(false);
  const hoverTimeoutRef = useRef<NodeJS.Timeout>();
  const leaveTimeoutRef = useRef<NodeJS.Timeout>();
  const { resolvedTheme } = useTheme();
  useEffect(() => {
    return () => {
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
      }
      if (leaveTimeoutRef.current) {
        clearTimeout(leaveTimeoutRef.current);
      }
    };
  }, []);

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      console.log('Starting logout process...');
      await logout();
      console.log('Logout completed successfully');
    } catch (error: any) {
      console.error('Logout error in Sidebar:', error);
      console.error('Error response:', error.response?.data);
      console.error('Error status:', error.response?.status);
    } finally {
      setIsLoggingOut(false);
    }
  };

  const toggleSubmenu = (itemHref: string) => {
    setExpandedItems(prev => 
      prev.includes(itemHref) 
        ? prev.filter(href => href !== itemHref)
        : [...prev, itemHref]
    );
  };



  const handleMouseEnter = (e: React.MouseEvent, href: string | undefined) => {
    if (isCollapsed && href) {
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
      }
      if (leaveTimeoutRef.current) {
        clearTimeout(leaveTimeoutRef.current);
      }
      
      const target = e.currentTarget as HTMLElement;
      const rect = target.getBoundingClientRect();
      setPopupPosition({ top: rect.top, bottom: rect.bottom });
      setHoveredItem(href);
    }
  };

  const handleMouseLeave = () => {
    if (isCollapsed) {
      if (leaveTimeoutRef.current) {
        clearTimeout(leaveTimeoutRef.current);
      }
      
      leaveTimeoutRef.current = setTimeout(() => {
        if (!isPopupHovered) {
          setHoveredItem(null);
        }
      }, 100);
    }
  };

  const handlePopupMouseEnter = () => {
    if (leaveTimeoutRef.current) {
      clearTimeout(leaveTimeoutRef.current);
    }
    setIsPopupHovered(true);
  };

  const handlePopupMouseLeave = () => {
    setIsPopupHovered(false);
    setHoveredItem(null);
  };

  const menuAnimation = {
    initial: { opacity: 0, x: -10 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -10 },
    transition: { duration: 0.2 }
  };

  const renderPopupMenu = (item: NavItem) => {
    if (!isCollapsed || !hoveredItem || hoveredItem !== item.href) return null;

    return (
      <AnimatePresence>
        <motion.div
          ref={popupRef}
          style={{ 
            position: 'fixed',
            top: popupPosition.top,
            left: '60px',
            pointerEvents: 'auto'
          }}
                     className="
             absolute bg-main rounded-lg shadow-lg border border-border 
             min-w-[200px] z-[99999] py-2
           "
          initial={menuAnimation.initial}
          animate={menuAnimation.animate}
          exit={menuAnimation.exit}
          transition={menuAnimation.transition}
          onMouseEnter={handlePopupMouseEnter}
          onMouseLeave={handlePopupMouseLeave}
          role="menu"
          aria-label={`${item.label} submenu`}
        >
                     <div className="px-4 py-2 font-regular text-sm text-muted border-b border-border ">
            {item.label}
          </div>
          <ul className="mt-1" role="menu">
            {item.children?.map((child: NavItem) => (
              <li key={child.href} role="none">
                                 <Link
                   href={child.href}
                   className={clsx(`
                     flex items-center px-4 py-2 text-sm
                     hover:bg-overlay
                     hover:text-primary
                                           ${pathname === child.href ? 'bg-primary-blue text-white shadow-md ml-0 rounded-l-none rounded-r-xl' : ''}
                     transition-all duration-200`,
                     pathname === child.href ? 'text-white' : 'text-secondary',
                     'hover:ml-0 hover:rounded-l-none hover:rounded-r-xl'
                   )}
                   role="menuitem"
                   onClick={() => setHoveredItem(null)} // Only close the popup menu, not the submenu
                 >
                 <div className="w-4 h-4 mr-3 flex items-center justify-center">
                   {child.icon ? (
                     <span className={clsx(
                       "text-sm",
                       pathname === child.href ? 'text-white' : 'text-muted'
                     )}>
                       {child.icon}
                     </span>
                   ) : (
                     <span className={clsx(
                       "block rounded-full w-1.5 h-1.5",
                       pathname === child.href ? 'bg-white' : 'bg-muted'
                     )} />
                   )}
                 </div>
                 <span>
                    {child.label}
                  </span>
                 </Link>
              </li>
            ))}
          </ul>
        </motion.div>
      </AnimatePresence>
    );
  };

  const renderNavItem = (item: NavItem) => {
    const hasChildren = item.children && item.children.length > 0;
    const isExpanded = item.href ? expandedItems.includes(item.href) : false;
    const isActive = pathname === item.href;
    const hasActiveChild = item.children?.some(child => pathname === child.href);
    const isHovered = hoveredItem === item.href;

    return (
      <li key={item.href} className="relative group">
        <div 
          className="relative"
          onMouseEnter={(e) => handleMouseEnter(e, item.href)}
          onMouseLeave={handleMouseLeave}
        >
                     <Link
             href={item.href}
             className={clsx(`
               flex items-center mx-3 px-4 py-3 text-sm font-regular rounded-xl
               ${isCollapsed ? 'justify-center' : 'justify-start'}
               ${!isCollapsed && hasChildren ? 'pr-12' : ''}
               transition-all duration-300 ease-in-out group relative
                               ${isActive && !hasChildren 
                  ? 'bg-primary-blue text-white shadow-lg ml-0 rounded-l-none rounded-r-xl' 
                  : hasActiveChild 
                    ? 'bg-light-gray text-secondary'
                    : 'text-secondary hover:bg-overlay hover:text-primary'
                }`,
               !isCollapsed && 'hover:ml-0 hover:rounded-l-none hover:rounded-r-xl hover:mr-3'
             )}
            onClick={hasChildren ? (e) => {
              if (!isCollapsed) {
                // Allow navigation to parent page while also toggling submenu
                if (item.href) toggleSubmenu(item.href);
              }
            } : undefined}
            role={hasChildren ? 'button' : undefined}
            aria-expanded={hasChildren ? isExpanded : undefined}
            aria-haspopup={hasChildren ? 'true' : undefined}
          >
            <div className={clsx(
              "flex items-center justify-center",
              isCollapsed ? 'w-6 h-6' : 'w-5 h-5 mr-3',
              isActive && !hasChildren ? 'text-white' : 'text-inherit'
            )}>
              <span className="text-lg">{item.icon}</span>
            </div>
            {!isCollapsed && (
              <span className="flex-1 text-left">{item.label}</span>
            )}
            {isCollapsed && (
              <span className="sr-only">{item.label}</span>
            )}
          </Link>
          {!isCollapsed && hasChildren && (
                         <button
               onClick={(e) => {
                 e.preventDefault();
                 e.stopPropagation();
                 if (item.href) toggleSubmenu(item.href);
               }}
               className={clsx(`
                 absolute right-4 top-1/2 -translate-y-1/2
                 w-5 h-5 rounded-full flex items-center justify-center
                                   hover:bg-light-gray transition-all duration-300 ease-in-out`,
                  isExpanded ? 'rotate-90 bg-light-gray' : '',
                  hasActiveChild ? 'text-secondary' : 'text-muted'
               )}
              aria-label={isExpanded ? 'Collapse submenu' : 'Expand submenu'}
            >
              <svg 
                className="w-3 h-3" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
                strokeWidth={2.5}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          )}
        </div>

        {/* Render popup menu for collapsed state */}
        {renderPopupMenu(item)}

        {/* Regular submenu for expanded state */}
        <AnimatePresence>
          {!isCollapsed && hasChildren && isExpanded && (
            <motion.ul 
              className="mt-2 pr-3 space-y-1 overflow-hidden" 
              role="menu"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
            >
              {item.children?.map((child: NavItem) => (
                <motion.li 
                  key={child.href} 
                  role="none"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.2, delay: 0.1 }}
                >
                                   <Link
                     href={child.href}
                     className={clsx(`
                       flex items-center px-4 py-2.5 text-sm font-regular rounded-lg
                       transition-all duration-200 ease-in-out relative
                                               ${pathname === child.href 
                          ? 'bg-primary-blue text-white shadow-md ml-0 rounded-l-none rounded-r-lg' 
                          : 'ml-6 text-secondary hover:bg-overlay hover:text-primary'
                        }`,
                       'hover:ml-0 hover:rounded-l-none hover:rounded-r-lg'
                     )}
                    role="menuitem"
                  >
                    <div className="w-4 h-4 mr-3 flex items-center justify-center">
                      {child.icon ? (
                        <span className={clsx(
                          "text-sm",
                          pathname === child.href ? 'text-white' : 'text-muted'
                        )}>
                          {child.icon}
                        </span>
                      ) : (
                        <span className={clsx(
                          "block rounded-full w-1.5 h-1.5",
                          pathname === child.href ? 'bg-white' : 'bg-muted'
                        )} />
                      )}
                    </div>
                    <span>
                      {child.label}
                    </span>
                  </Link>
                </motion.li>
              ))}
            </motion.ul>
          )}
        </AnimatePresence>
      </li>
    );
  };

  return (
         <aside 
       className={`
         fixed top-0 left-0 h-screen bg-main text-primary
         transition-all duration-300 ease-in-out flex flex-col
         border-r border-border shadow-lg
         ${isCollapsed ? 'w-[60px]' : 'w-[260px]'}
         ${theme.themeDirection === 'rtl' ? 'left-auto right-0' : 'left-0'}
       `}
       role="navigation"
       aria-label="Main navigation"
     >
             {/* Header with Logo */}
       <div className="h-16 flex items-center px-6 border-b border-border">
        <div className="flex items-center justify-center flex-1">
        {/* {!isCollapsed ? (
            <Image
              src={resolvedTheme === "dark" ? "/images/logo/logo2.svg" : "/images/logo/amaramba_logo.png"}
              alt="Amaramba"
              width={1080}
              height={1080}
              className="h-[48px] object-contain"
            />
          ) : (
            <Image
              src={resolvedTheme === "dark" ? "/images/logo/logo2.svg" : "/images/logo/Logwwo.png"}
              alt="Amaramba"
              width={580}
              height={1080}
              className="w-[20px] h-[30px] object-contain"
            />
          )} */}
          Eastland distributors
        </div>
      </div>

      {/* Navigation Sections */}
      <div className="flex-1 overflow-y-auto">
        {navSections.size > 0 ? (
          // Render with sections if they exist
          Array.from(navSections.entries()).map(([sectionTitle, items]) => (
            <div key={sectionTitle} className="py-4">
              {!isCollapsed && (
                                 <h2 className="px-6 mb-3 text-xs font-regular text-muted uppercase tracking-wider">
                  {sectionTitle}
                </h2>
              )}
              <nav className="mt-2" aria-label={sectionTitle}>
                <ul className="space-y-1" role="menu">
                  {items.map(renderNavItem)}
                </ul>
              </nav>
            </div>
          ))
        ) : (
          // Render nav items directly without sections
          <div className="py-4">
            <nav className="mt-2" aria-label="Main navigation">
              <ul className="space-y-1" role="menu">
                {navItems.map(renderNavItem)}
              </ul>
            </nav>
          </div>
        )}
      </div>

      {/* User Profile */}
      {isAuthenticated && (
        <div 
                     className={`
             relative p-4 border-t border-border
             ${isCollapsed ? 'text-center' : ''}
           `}
          onMouseEnter={(e) => handleMouseEnter(e, 'profile')}
          onMouseLeave={handleMouseLeave}
        >
          <div className={`
            flex items-center gap-3
            ${isCollapsed ? 'justify-center' : 'justify-between'}
          `}>
            <div className="flex items-center min-w-0 gap-3 flex-1">
              {user?.profile?.picture ? (
                <img
                  src={user.profile.picture}
                  alt={user?.profile?.firstName || "User"}
                  className="w-9 h-9 rounded-full bg-light-gray flex-shrink-0 object-cover"
                />
              ) : (
                <div className="w-9 h-9 rounded-full bg-primary-blue flex-shrink-0 flex items-center justify-center">
                  <span className="text-white text-sm font-semibold">
                    {user?.profile?.firstName ? user.profile.firstName.charAt(0).toUpperCase() : 'U'}
                  </span>
                </div>
              )}
              {!isCollapsed && (
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-primary truncate">
                    {user?.profile?.firstName ? `${user.profile.firstName} ${user.profile.lastName || ''}` : 'User'}
                  </p>
                  <p className="text-xs text-muted truncate">
                    {user?.email || 'user@example.com'}
                  </p>
                </div>
              )}
            </div>
            {!isCollapsed && (
              <button
                className="text-muted hover:text-secondary transition-colors duration-200"
                onClick={handleLogout}
                disabled={isLoggingOut}
                aria-label="Sign out"
              >
                <LogoutIcon className="w-5 h-5" />
              </button>
            )}
          </div>

          {/* Profile Popup for Collapsed State */}
          <AnimatePresence>
            {isCollapsed && hoveredItem === 'profile' && (
              <motion.div
                ref={popupRef}
                style={{ 
                  position: 'fixed',
                  top: popupPosition.top,
                  left: '60px',
                  pointerEvents: 'auto',
                  transform: 'translateY(-80%)'
                }}
                className="
                  bg-background rounded-lg shadow-lg border border-default-200 
                  min-w-[240px] z-[99999] p-4
                "
                initial={menuAnimation.initial}
                animate={menuAnimation.animate}
                exit={menuAnimation.exit}
                transition={menuAnimation.transition}
                onMouseEnter={handlePopupMouseEnter}
                onMouseLeave={handlePopupMouseLeave}
                role="dialog"
                aria-label="User profile menu"
              >
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    {user?.profile?.picture ? (
                      <img
                        src={user.profile.picture}
                        alt={user?.profile?.firstName || "User"}
                        className="w-10 h-10 rounded-full bg-default-100 flex-shrink-0"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-primary-blue flex-shrink-0 flex items-center justify-center">
                        <span className="text-white text-sm font-semibold">
                          {user?.profile?.firstName ? user.profile.firstName.charAt(0).toUpperCase() : 'U'}
                        </span>
                      </div>
                    )}
                    <div className="flex-1 min-w-0 text-left">
                      <p className="text-sm font-medium text-default-900 truncate">
                        {user?.profile?.firstName ? `${user.profile.firstName} ${user.profile.lastName || ''}` : 'User'}
                      </p>
                      <p className="text-xs text-default-500 truncate">
                        {user?.email || 'user@example.com'}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col gap-1 pt-2 border-t border-default-100">
                    <Link
                      href="/settings/profile"
                      className="w-full"
                    >
                      <Button
                        variant="light"
                        className="w-full justify-start text-default-600 hover:text-default-900"
                      >
                        View Profile
                      </Button>
                    </Link>
                    <Link
                      href="/settings"
                      className="w-full"
                    >
                      <Button
                        variant="light"
                        className="w-full justify-start text-default-600 hover:text-default-900"
                      >
                        Settings
                      </Button>
                    </Link>
                    <Button
                      variant="light"
                      className="w-full justify-start text-default-500 hover:text-danger"
                      onClick={handleLogout}
                      isLoading={isLoggingOut}
                      isDisabled={isLoggingOut}
                    >
                      <LogoutIcon className="text-lg mr-2" />
                      Sign Out
                    </Button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </aside>
  );
} 