'use client';

import Link from "next/link";
import { Button } from "@heroui/button";
import { ThemeConfig } from "@/config/theme";
import { SimpleLayoutType } from "@/config/constants";
import { Logo, LogoutIcon, ChevronIcon } from "@/components/icons";
import { useState, useRef, useEffect } from "react";
import { usePathname, useSearchParams } from 'next/navigation';
import { clsx } from 'clsx';
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useTheme } from "next-themes";
import { 
  User, 
  Lock, 
  Smartphone, 
  TrendingUp, 
  HelpCircle, 
  FileText,
  ClipboardList,
  Shield,
  Settings,
  ArrowLeft,
  Key,
  Bell,
  Monitor,
  CreditCard,
  Ticket,
  LogOut
} from "lucide-react";

interface ProfileNavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
  children?: ProfileNavItem[];
}

interface ProfileSidebarProps {
  theme: ThemeConfig;
  variant: typeof SimpleLayoutType[keyof typeof SimpleLayoutType];
  isCollapsed: boolean;
  onCollapsedChange: (collapsed: boolean) => void;
}

function ProfileSidebarContent({ theme, variant, isCollapsed, onCollapsedChange }: ProfileSidebarProps) {
  const [expandedItems, setExpandedItems] = useState<string[]>([]);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const [popupPosition, setPopupPosition] = useState({ top: 0, bottom: 0 });
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { isAuthenticated, user, logout } = useAuth();
  const router = useRouter();
  const { resolvedTheme } = useTheme();
  const popupRef = useRef<HTMLDivElement>(null);
  const [isPopupHovered, setIsPopupHovered] = useState(false);
  const hoverTimeoutRef = useRef<NodeJS.Timeout>();
  const leaveTimeoutRef = useRef<NodeJS.Timeout>();

  // Profile-specific navigation items
  const profileNavItems: ProfileNavItem[] = [
    {
      label: 'Basic details',
      href: '/profile',
      icon: <User className="w-4 h-4" />
    },
    {
      label: 'Change password',
      href: '/profile?section=change-password',
      icon: <Key className="w-4 h-4" />
    },
    {
      label: 'Lock account',
      href: '/profile?section=lock-account',
      icon: <Lock className="w-4 h-4" />
    },
    {
      label: 'Security',
      href: '/profile?section=security',
      icon: <Shield className="w-4 h-4" />
    },
    {
      label: 'Manage devices',
      href: '/profile?section=manage-devices',
      icon: <Monitor className="w-4 h-4" />
    },
    {
      label: 'Manage Notifications',
      href: '/profile?section=manage-notifications',
      icon: <Bell className="w-4 h-4" />
    },

  ];

  // Get current section from URL
  const currentSection = searchParams.get('section') || 'basic-details';

  // Function to handle navigation with query parameters
  const handleNavigation = (href: string) => {
    router.push(href);
  };

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
      await logout();
      router.push('/');
    } catch (error) {
      console.error('Logout error:', error);
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

  const renderPopupMenu = (item: ProfileNavItem) => {
    if (!isCollapsed || !hoveredItem || hoveredItem !== item.href) return null;

    return (
      <AnimatePresence>
        <motion.div
          ref={popupRef}
          style={{ 
            position: 'fixed',
            top: popupPosition.top,
            left: '60px',
            pointerEvents: 'auto',
            zIndex: 99999
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
          <div className="px-4 py-2 font-regular text-sm text-muted border-b border-border">
            {item.label}
          </div>
          <ul className="mt-1" role="menu">
            {item.children?.map((child: ProfileNavItem) => (
              <li key={child.href} role="none">
                <button
                  onClick={() => {
                    handleNavigation(child.href);
                    setHoveredItem(null);
                  }}
                  className={clsx(`
                    flex items-center px-4 py-2 text-sm w-full min-w-0
                    hover:bg-overlay
                    hover:text-primary
                    ${child.href.includes(`section=${currentSection}`) ? '!bg-primary-blue text-white shadow-md' : ''}
                    `,
                    child.href.includes(`section=${currentSection}`) ? 'text-white' : 'text-secondary'
                  )}
                  role="menuitem"
                >
                  <div className="w-4 h-4 mr-3 flex items-center justify-center flex-shrink-0">
                    {child.icon ? (
                      <span className={clsx(
                        "text-sm",
                        child.href.includes(`section=${currentSection}`) ? 'text-white' : 'text-muted'
                      )}>
                        {child.icon}
                      </span>
                    ) : (
                      <span className={clsx(
                        "block rounded-full w-1.5 h-1.5",
                        child.href.includes(`section=${currentSection}`) ? 'bg-white' : 'bg-muted'
                      )} />
                    )}
                  </div>
                  <span className="truncate min-w-0">
                    {child.label}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </motion.div>
      </AnimatePresence>
    );
  };

  const renderNavItem = (item: ProfileNavItem) => {
    const hasChildren = item.children && item.children.length > 0;
    const isExpanded = item.href ? expandedItems.includes(item.href) : false;
    
    // Check if this item is active based on section parameter
    const isActive = item.href === '/profile' 
      ? currentSection === 'basic-details' || !searchParams.get('section')
      : item.href.includes(`section=${currentSection}`);
    
    const hasActiveChild = item.children?.some(child => 
      child.href.includes(`section=${currentSection}`)
    );
    const isHovered = hoveredItem === item.href;

    return (
      <li key={item.href} className="relative group">
        <div 
          className="relative"
          onMouseEnter={(e) => handleMouseEnter(e, item.href)}
          onMouseLeave={handleMouseLeave}
        >
          <button
            onClick={() => {
              if (hasChildren) {
                if (!isCollapsed) {
                  if (item.href) toggleSubmenu(item.href);
                }
              } else {
                handleNavigation(item.href);
              }
            }}
            className={clsx(`
              flex items-center px-4 py-3 text-sm font-regular rounded-xl w-full min-w-0
              ${isCollapsed ? 'justify-center mx-3' : 'justify-start mx-3'}
              ${!isCollapsed && hasChildren ? 'pr-12' : ''}
              group relative
              ${isActive && !hasChildren 
                ? '!bg-primary-blue text-white shadow-lg' 
                : hasActiveChild 
                  ? 'bg-light-gray text-secondary'
                  : 'text-secondary hover:bg-overlay hover:text-primary'
              }`
            )}
            role={hasChildren ? 'button' : undefined}
            aria-expanded={hasChildren ? isExpanded : undefined}
            aria-haspopup={hasChildren ? 'true' : undefined}
          >
            <div className={clsx(
              "flex items-center justify-center flex-shrink-0",
              isCollapsed ? 'w-6 h-6' : 'w-5 h-5 mr-3',
              isActive && !hasChildren ? 'text-white' : 'text-inherit'
            )}>
              <span className="text-lg">{item.icon}</span>
            </div>
            {!isCollapsed && (
              <span className="flex-1 text-left truncate min-w-0">{item.label}</span>
            )}
            {isCollapsed && (
              <span className="sr-only">{item.label}</span>
            )}
          </button>
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
                hover:bg-light-gray`,
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
              {item.children?.map((child: ProfileNavItem) => (
                <motion.li 
                  key={child.href} 
                  role="none"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.2, delay: 0.1 }}
                >
                  <button
                    onClick={() => handleNavigation(child.href)}
                    className={clsx(`
                      flex items-center px-4 py-2.5 text-sm font-regular rounded-lg w-full min-w-0
                      relative
                      ${child.href.includes(`section=${currentSection}`)
                        ? '!bg-primary-blue text-white shadow-md ml-6' 
                        : 'ml-6 text-secondary hover:bg-overlay hover:text-primary'
                      }`
                    )}
                    role="menuitem"
                  >
                    <div className="w-4 h-4 mr-3 flex items-center justify-center flex-shrink-0">
                      {child.icon ? (
                        <span className={clsx(
                          "text-sm",
                          child.href.includes(`section=${currentSection}`) ? 'text-white' : 'text-muted'
                        )}>
                          {child.icon}
                        </span>
                      ) : (
                        <span className={clsx(
                          "block rounded-full w-1.5 h-1.5",
                          child.href.includes(`section=${currentSection}`) ? 'bg-white' : 'bg-muted'
                        )} />
                      )}
                    </div>
                    <span className="truncate min-w-0">
                      {child.label}
                    </span>
                  </button>
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
        border-r border-border shadow-lg overflow-x-auto overflow-y-hidden
        ${isCollapsed ? 'w-[60px] min-w-[60px]' : 'w-[260px] min-w-[260px]'}
        ${theme.themeDirection === 'rtl' ? 'left-auto right-0' : 'left-0'}
      `}
      role="navigation"
      aria-label="Profile navigation"
    >
      {/* Header with Logo */}
      <div className="h-16 flex items-center px-6 border-b border-border">
        <div className="flex items-center justify-center flex-1">
          {!isCollapsed ? (
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
          )}
        </div>
      </div>

      {/* Profile Navigation */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden">
        <div className="py-4 min-w-full">
          <nav className="mt-2" aria-label="Profile navigation">
            <ul className="space-y-1 min-w-full" role="menu">
              {profileNavItems.map(renderNavItem)}
            </ul>
          </nav>
        </div>
      </div>

      {/* User Profile */}
      {true && (
        <div 
          className={`
            relative p-4 border-t border-border min-w-0
            bg-main/50 backdrop-blur-sm shadow-lg
            ${isCollapsed ? 'text-center' : ''}
          `}
          onMouseEnter={(e) => handleMouseEnter(e, 'profile')}
          onMouseLeave={handleMouseLeave}
        >
          <div className={`
            flex items-center gap-3 p-2 rounded-lg
            hover:bg-overlay/50 transition-colors duration-200
            ${isCollapsed ? 'justify-center' : 'justify-between'}
          `}>
            <div className="flex items-center min-w-0 gap-3 flex-1">
              {user?.profile?.picture ? (
                <img
                  src={user.profile.picture}
                  alt={user?.firstName || "User"}
                  className="w-9 h-9 rounded-full bg-light-gray flex-shrink-0 object-cover"
                />
              ) : (
                <div className="w-9 h-9 rounded-full bg-primary-blue flex-shrink-0 flex items-center justify-center">
                  <span className="text-white text-sm font-semibold">
                    {user?.firstName ? user.firstName.charAt(0).toUpperCase() : 'U'}
                  </span>
                </div>
              )}
              {!isCollapsed && (
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-primary truncate">
                    {user?.firstName ? `${user.firstName} ${user.lastName || ''}`.trim() : 'User'}
                  </p>
                  <p className="text-xs text-muted truncate">
                    {user?.email || 'user@example.com'}
                  </p>
                </div>
              )}
            </div>
            {!isCollapsed && (
              <button
                className="text-muted hover:text-secondary transition-colors duration-200 p-2 rounded-lg hover:bg-overlay/30"
                onClick={handleLogout}
                disabled={isLoggingOut}
                aria-label="Sign out"
                title="Sign out"
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
                  transform: 'translateY(-80%)',
                  zIndex: 99999
                }}
                className="
                  bg-background/95 backdrop-blur-md rounded-lg shadow-xl border border-default-200 
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
                  {/* <div className="flex items-center gap-3">
                    {user?.profile?.picture ? (
                      <img
                        src={user.profile.picture}
                        alt={user?.firstName || "User"}
                        className="w-10 h-10 rounded-full bg-default-100 flex-shrink-0"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-primary-blue flex-shrink-0 flex items-center justify-center">
                        <span className="text-white text-sm font-semibold">
                          {user?.firstName ? user.firstName.charAt(0).toUpperCase() : 'U'}
                        </span>
                      </div>
                    )}
                    <div className="flex-1 min-w-0 text-left">
                      <p className="text-sm font-medium text-default-900 truncate">
                        {user?.firstName ? `${user.firstName} ${user.lastName || ''}`.trim() : 'User'}
                      </p>
                      <p className="text-xs text-default-500 truncate">
                        {user?.email || 'user@example.com'}
                      </p>
                    </div>
                  </div> */}

                  {/* <div className="flex flex-col gap-1 pt-2 border-t border-default-100 ">
                    <button
                      onClick={() => handleNavigation('/profile')}
                      className="w-full text-left px-3 py-2 text-sm text-default-600 hover:text-default-900 hover:bg-default-100 rounded-md transition-colors"
                    >
                      <Settings className="w-4 h-4 mr-2 inline" />
                      Profile Settings
                    </button>
                    <button
                      onClick={handleLogout}
                      disabled={isLoggingOut}
                      className="w-full text-left px-3 py-2 text-sm text-red-500 hover:text-red-700 hover:bg-red-50 rounded-md transition-colors disabled:opacity-50"
                    >
                      <LogOut className="w-4 h-4 mr-2 inline" />
                      Sign Out
                    </button>
                   
                    <div className="text-xs text-red-400 px-3 py-1">
                      Auth: {isAuthenticated ? 'Yes' : 'No'} | User: {user ? 'Yes' : 'No'}
                    </div>
                  </div> */}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

    </aside>
  );
}

export function ProfileSidebar({ theme, variant, isCollapsed, onCollapsedChange }: ProfileSidebarProps) {
  return (
    <ProfileSidebarContent 
      theme={theme}
      variant={variant}
      isCollapsed={isCollapsed}
      onCollapsedChange={onCollapsedChange}
    />
  );
}
