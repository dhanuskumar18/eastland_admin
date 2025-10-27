'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Search, ArrowUp, ArrowDown, Command, X, Moon, Sun, Settings, LogOut, User, Key, Lock, Shield, Monitor, Bell, CreditCard, Ticket, FileText, HelpCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useTheme } from 'next-themes';
import { useAuth } from '@/context/AuthContext';
import { navItems, NavItem } from '@/config/nav';

interface SearchCommand {
  id: string;
  title: string;
  icon: React.ReactNode;
  shortcut?: string;
  category: string;
  href?: string;
  actionType?: string;
  action?: () => void;
}

interface SearchPopupProps {
  isOpen: boolean;
  onClose: () => void;
  searchQuery?: string;
}

// Helper function to convert nav items to search commands
const convertNavItemsToCommands = (navItems: NavItem[]): SearchCommand[] => {
  const commands: SearchCommand[] = [];
  
  navItems.forEach((item, index) => {
    // Add main navigation item
    commands.push({
      id: `nav-${index}`,
      title: `Go to ${item.label}`,
      icon: item.icon || <Search className="w-4 h-4" />,
      category: 'Navigation',
      href: item.href,
      actionType: item.actionType,
      shortcut: getShortcutForLabel(item.label)
    });

    // Add child navigation items if they exist
    if (item.children) {
      item.children.forEach((child, childIndex) => {
        commands.push({
          id: `nav-${index}-${childIndex}`,
          title: `Go to ${child.label}`,
          icon: item.icon || <Search className="w-4 h-4" />,
          category: 'Navigation',
          href: child.href,
          actionType: child.actionType,
          shortcut: getShortcutForLabel(child.label)
        });
      });
    }
  });

  return commands;
};

// Helper function to create additional commands (theme, profile, settings, logout)
const createAdditionalCommands = (currentTheme?: string): SearchCommand[] => {
  return [
    // Theme commands
    {
      id: 'theme-toggle',
      title: `Switch to ${currentTheme === 'light' ? 'Dark' : 'Light'} Mode`,
      icon: currentTheme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />,
      category: 'Theme',
      shortcut: 'theme',
      action: () => {
        // This will be handled in the component
      }
    },
    {
      id: 'theme-light',
      title: 'Switch to Light Mode',
      icon: <Sun className="w-4 h-4" />,
      category: 'Theme',
      shortcut: 'light',
      action: () => {
        // This will be handled in the component
      }
    },
    
    // Profile commands
    {
      id: 'profile-main',
      title: 'Go to Profile',
      icon: <User className="w-4 h-4" />,
      category: 'Profile',
      href: '/profile',
      shortcut: 'profile'
    },
    {
      id: 'profile-basic',
      title: 'Profile - Basic Details',
      icon: <User className="w-4 h-4" />,
      category: 'Profile',
      href: '/profile',
      shortcut: 'basic'
    },
    {
      id: 'profile-password',
      title: 'Profile - Change Password',
      icon: <Key className="w-4 h-4" />,
      category: 'Profile',
      href: '/profile?section=change-password',
      shortcut: 'password'
    },
    {
      id: 'profile-lock',
      title: 'Profile - Lock Account',
      icon: <Lock className="w-4 h-4" />,
      category: 'Profile',
      href: '/profile?section=lock-account',
      shortcut: 'lock'
    },
    {
      id: 'profile-security',
      title: 'Profile - Security',
      icon: <Shield className="w-4 h-4" />,
      category: 'Profile',
      href: '/profile?section=security',
      shortcut: 'security'
    },
    {
      id: 'profile-twofactor',
      title: 'Profile - Two-Factor Authentication',
      icon: <Shield className="w-4 h-4" />,
      category: 'Profile',
      href: '/profile?section=security&tab=twofactor',
      shortcut: '2fa'
    },
    {
      id: 'profile-antiphishing',
      title: 'Profile - Anti-Phishing',
      icon: <Shield className="w-4 h-4" />,
      category: 'Profile',
      href: '/profile?section=security&tab=antiphishing',
      shortcut: 'antiphishing'
    },
    {
      id: 'profile-devices',
      title: 'Profile - Manage Devices',
      icon: <Monitor className="w-4 h-4" />,
      category: 'Profile',
      href: '/profile?section=manage-devices',
      shortcut: 'devices'
    },
    {
      id: 'profile-sessions',
      title: 'Profile - Login Sessions',
      icon: <Monitor className="w-4 h-4" />,
      category: 'Profile',
      href: '/profile?section=manage-devices&tab=sessions',
      shortcut: 'sessions'
    },
    {
      id: 'profile-history',
      title: 'Profile - Login History',
      icon: <Monitor className="w-4 h-4" />,
      category: 'Profile',
      href: '/profile?section=manage-devices&tab=history',
      shortcut: 'history'
    },
    {
      id: 'profile-notifications',
      title: 'Profile - Manage Notifications',
      icon: <Bell className="w-4 h-4" />,
      category: 'Profile',
      href: '/profile?section=manage-notifications',
      shortcut: 'notifications'
    },
    
    // Settings commands
    {
      id: 'settings-general',
      title: 'General Settings',
      icon: <Settings className="w-4 h-4" />,
      category: 'Settings',
      href: '/profile',
      shortcut: 'settings'
    },
    
    // Logout command
    {
      id: 'logout',
      title: 'Sign Out',
      icon: <LogOut className="w-4 h-4" />,
      category: 'Account',
      shortcut: 'logout',
      action: () => {
        // This will be handled in the component
      }
    }
  ];
};

// Helper function to generate shortcuts based on labels
const getShortcutForLabel = (label: string): string => {
  const shortcuts: { [key: string]: string } = {
    'Dashboard': 'dash',
    'Client': 'client',
    'Wallets': 'wallet',
    'Admin': 'admin',
    'ACD-Accounts': 'acd',
    'Deposit': 'deposit',
    'Withdrawal': 'withdraw'
  };
  
  return shortcuts[label.trim()] || '';
};

export default function SearchPopup({ isOpen, onClose, searchQuery = '' }: SearchPopupProps) {
  const [query, setQuery] = useState(searchQuery);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const { logout } = useAuth();

  // Generate commands from navigation items and additional commands
  const allCommands = useMemo(() => {
    const navCommands = convertNavItemsToCommands(navItems);
    const additionalCommands = createAdditionalCommands(theme);
    return [...navCommands, ...additionalCommands];
  }, [theme]);

  // Filter commands based on search query
  const filteredCommands = useMemo(() => {
    if (!query.trim()) return allCommands;
    
    return allCommands.filter(cmd =>
      cmd.title.toLowerCase().includes(query.toLowerCase()) ||
      (cmd.href && cmd.href.toLowerCase().includes(query.toLowerCase())) ||
      (cmd.shortcut && cmd.shortcut.toLowerCase().includes(query.toLowerCase()))
    );
  }, [query, allCommands]);

  useEffect(() => {
    if (isOpen) {
      setQuery(searchQuery);
      setSelectedIndex(0);
      inputRef.current?.focus();
    }
  }, [isOpen, searchQuery]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [filteredCommands]);

  // Scroll to selected item when selection changes
  useEffect(() => {
    if (scrollContainerRef.current && filteredCommands.length > 0) {
      const container = scrollContainerRef.current;
      const itemHeight = 60; // Approximate height of each item
      const containerHeight = container.clientHeight;
      const scrollTop = selectedIndex * itemHeight;
      
      // Calculate the center position
      const centerPosition = scrollTop - (containerHeight / 2) + (itemHeight / 2);
      
      container.scrollTo({
        top: Math.max(0, centerPosition),
        behavior: 'smooth'
      });
    }
  }, [selectedIndex, filteredCommands.length]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      switch (e.key) {
        case 'Escape':
          onClose();
          break;
        case 'ArrowDown':
          e.preventDefault();
          setSelectedIndex(prev => 
            prev < filteredCommands.length - 1 ? prev + 1 : 0
          );
          break;
        case 'ArrowUp':
          e.preventDefault();
          setSelectedIndex(prev => 
            prev > 0 ? prev - 1 : filteredCommands.length - 1
          );
          break;
        case 'Enter':
          e.preventDefault();
          if (filteredCommands[selectedIndex]) {
            handleCommandSelect(filteredCommands[selectedIndex]);
          }
          break;
        case 'k':
          if (e.metaKey || e.ctrlKey) {
            e.preventDefault();
            onClose();
          }
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, selectedIndex, filteredCommands, onClose]);

  const handleCommandSelect = (command: SearchCommand) => {
    console.log('Selected command:', command);
    
    // Handle theme commands
    if (command.id.startsWith('theme-')) {
      if (command.id === 'theme-toggle') {
        setTheme(theme === 'light' ? 'dark' : 'light');
      } else if (command.id === 'theme-light') {
        setTheme('light');
      } else if (command.id === 'theme-dark') {
        setTheme('dark');
      }
    }
    // Handle logout command
    else if (command.id === 'logout') {
      logout();
      router.push('/');
    }
    // Handle navigation commands
    else if (command.href) {
      router.push(command.href);
    }
    // Handle action commands
    else if (command.action) {
      command.action();
    }
    
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50 flex items-start justify-center pt-20"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: -20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -20 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className="w-full max-w-2xl mx-4 bg-dark2 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-600 overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Search Input */}
          <div className="p-4 border-b border-gray-100 dark:border-gray-700">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 w-5 h-5" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search navigation..."
                className="w-full pl-10 pr-4 py-3 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 border-0 outline-none text-lg bg-transparent"
              />
            </div>
          </div>

          {/* Commands List */}
          <div ref={scrollContainerRef} className="max-h-96 overflow-y-auto">
            {filteredCommands.map((command, index) => (
              <motion.div
                key={command.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`
                  relative flex items-center px-4 py-3 cursor-pointer transition-all duration-150
                  ${index === selectedIndex 
                    ? 'bg-blue-50 dark:bg-blue-900/20 border-l-4 border-l-[#48c5fd]' 
                    : 'hover:bg-gray-50 dark:hover:bg-gray-700'
                  }
                `}
                onClick={() => handleCommandSelect(command)}
              >
                {/* Selection Indicator */}
                {index === selectedIndex && (
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#48c5fd] rounded-r-full" />
                )}
                
                {/* Icon */}
                <div className="flex-shrink-0 mr-3 text-gray-600 dark:text-gray-400">
                  {command.icon}
                </div>
                
                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="text-gray-900 dark:text-light-gray font-medium">{command.title}</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">in {command.category}</div>
                </div>
                
                {/* Shortcut */}
                {command.shortcut && (
                  <div className="flex-shrink-0 ml-3">
                    {command.shortcut === 'Select' ? (
                      <div className="flex items-center text-gray-500 dark:text-gray-400 text-sm">
                        <span>Select</span>
                        <ArrowUp className="w-4 h-4 ml-1" />
                      </div>
                    ) : (
                      <div className="text-xs text-gray-400 dark:text-gray-500 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                        {command.shortcut}
                      </div>
                    )}
                  </div>
                )}
              </motion.div>
            ))}
          </div>

          {/* Footer */}
          <div className="px-4 py-3 bg-gray-50 dark:bg-gray-700 border-t border-gray-100 dark:border-gray-600">
            <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
              <div className="flex items-center space-x-4">
                <div className="flex items-center">
                  <ArrowUp className="w-3 h-3 mr-1" />
                  <ArrowDown className="w-3 h-3 mr-1" />
                  <span>to navigate</span>
                </div>
                <div className="flex items-center">
                  <span className="bg-gray-200 dark:bg-gray-600 px-1 rounded text-xs">esc</span>
                  <span className="ml-1">to close</span>
                </div>
              </div>
              <div className="flex items-center">
                <Command className="w-3 h-3 mr-1" />
                <span className="bg-gray-200 dark:bg-gray-600 px-1 rounded text-xs">k</span>
                <span className="ml-1">to toggle</span>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
