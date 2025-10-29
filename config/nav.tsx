import { NavActionType } from './constants';
import { PlaygroundIcon, DocumentationIcon, SettingsIcon } from '@/components/icons';
import { ReactNode } from 'react';
import Image from 'next/image';

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

// Helper component for custom icon images
const CustomIcon = ({ src }: { src: string }) => (
  <Image src={src} alt="" width={20} height={20} className="w-5 h-5" />
);

export const navItems: NavItem[] = [
  {
    label: 'Dashboard',
    href: '/dashboard',
    icon: <CustomIcon src="/images/icons/1.png" />,
    actionType: NavActionType.LINK
  },
  {
    label: 'Pages',
    href: '/pages',
    icon: <CustomIcon src="/images/icons/2.png" />,
    actionType: NavActionType.LINK
  },
  {
    label: 'YouTube Video',
    href: '/youtube-video',
    icon: <CustomIcon src="/images/icons/3.png" />,
    actionType: NavActionType.LINK
  },
  {
    label: 'Products',
    href: '/products',
    icon: <CustomIcon src="/images/icons/4.png" />,
    actionType: NavActionType.LINK
  },
  {
    label: 'Testimonials',
    href: '/testimonials',
    icon: <CustomIcon src="/images/icons/5.png" />,
    actionType: NavActionType.LINK
  },
  {
    label: 'Contact Form',
    href: '/contact-form',
    icon: <CustomIcon src="/images/icons/6.png" />,
    actionType: NavActionType.LINK
  },
  {
    label: 'Portfolio',
    href: '/portfolio',
    icon: <CustomIcon src="/images/icons/7.png" />,
    actionType: NavActionType.LINK
  },
  {
    label: 'SEO Optimization',
    href: '/seo-optimization',
    icon: <CustomIcon src="/images/icons/8.png" />,
    actionType: NavActionType.LINK
  },
  {
    label: 'Users',
    href: '/users',
    icon: <CustomIcon src="/images/icons/9.png" />,
    actionType: NavActionType.LINK
  },
  {
    label: 'Category',
    href: '/category',
    icon: <CustomIcon src="/images/icons/10.png" />,
    actionType: NavActionType.LINK
  },
  {
    label: 'Tags',
    href: '/tags',
    icon: <CustomIcon src="/images/icons/11.png" />,
    actionType: NavActionType.LINK
  },
  {
    label: 'Brands',
    href: '/brands',
    icon: <CustomIcon src="/images/icons/12.png" />,
    actionType: NavActionType.LINK
  },
  {
    label: 'Settings',
    href: '/settings',
    icon: <CustomIcon src="/images/icons/13.png" />,
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