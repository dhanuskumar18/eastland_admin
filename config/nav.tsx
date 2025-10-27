import { NavActionType } from './constants';
import { PlaygroundIcon, DocumentationIcon, SettingsIcon } from '@/components/icons';
import { House, UsersIcon, FileText, Image, BarChart3, Settings, Globe, Database, Shield, Palette } from 'lucide-react';
import { ReactNode } from 'react';

interface BaseNavItem {
  label: string;
  href: string;
  icon?: ReactNode;
  actionType?: typeof NavActionType[keyof typeof NavActionType];
  section?: string;
}

export interface NavItem extends BaseNavItem {
  children?: BaseNavItem[];
}

export const navItems: NavItem[] = [
  {
    label: 'Dashboard',
    href: '/dashboard',
    icon: <House className="w-4 h-6 flex-shrink-0" />,
    actionType: NavActionType.LINK
  }
];

// Helper function to group nav items by section
export function getNavItemsBySection() {
  const sections = new Map<string, NavItem[]>();
  
  navItems.forEach(item => {
    if (item.section) {
      if (!sections.has(item.section)) {
        sections.set(item.section, []);
      }
      sections.get(item.section)?.push(item);
    }
  });
  
  return sections;
} 