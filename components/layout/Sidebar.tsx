'use client';

import Link from "next/link";
import { ThemeConfig } from "@/config/theme";
import { SimpleLayoutType } from "@/config/constants";
import { getNavItemsBySection, NavItem, navItems } from "@/config/nav";
import { LogoutIcon } from "@/components/icons";
import { useState, useRef, useEffect } from "react";
import { usePathname } from 'next/navigation';
import { clsx } from 'clsx';
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

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
  const { isAuthenticated, logout } = useAuth();
  const router = useRouter();
  const popupRef = useRef<HTMLDivElement>(null);
  const [isPopupHovered, setIsPopupHovered] = useState(false);
  const hoverTimeoutRef = useRef<NodeJS.Timeout>();
  const leaveTimeoutRef = useRef<NodeJS.Timeout>();
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
      <div className="h-16 flex items-center justify-between px-6 border-b border-border">
        {!isCollapsed && (
          <span className="text-sm font-semibold">Eastland Distributors</span>
        )}
        <button
          onClick={() => onCollapsedChange(!isCollapsed)}
          className="text-secondary hover:text-primary transition-colors p-1 rounded-lg hover:bg-overlay"
          aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-5 w-5" 
            viewBox="0 0 20 20" 
            fill="currentColor"
          >
            {isCollapsed ? (
              <path fillRule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h6a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
            ) : (
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            )}
          </svg>
        </button>
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

      {/* Logout Button */}
      {isAuthenticated && (
        <div className="p-4 border-t border-border">
          <button
            className={`
              w-full flex items-center gap-3 px-4 py-3 rounded-xl
              text-secondary hover:bg-overlay hover:text-primary
              transition-all duration-300
              ${isCollapsed ? 'justify-center' : 'justify-start'}
            `}
            onClick={handleLogout}
            disabled={isLoggingOut}
            aria-label="Sign out"
          >
            <LogoutIcon className="w-5 h-5" />
            {!isCollapsed && (
              <span className="text-sm font-regular">
                {isLoggingOut ? 'Logging out...' : 'Logout'}
              </span>
            )}
          </button>
        </div>
      )}
    </aside>
  );
} 