'use client';

import { useEffect, useState } from 'react';
import NextLink from 'next/link';
import { usePathname } from 'next/navigation';
import { Breadcrumbs as HeroUIBreadcrumbs, BreadcrumbItem } from '@heroui/react';
import { ThemeConfig } from '@/config/theme';
import { NavItem, navItems } from '@/config/nav';
import { HomeIcon } from './icons';
import { ReactNode } from 'react';

interface MenuItem extends NavItem {
  type?: string;
  title?: string;
  children?: MenuItem[];
}

interface BreadcrumbsProps {
  card?: boolean;
  custom?: boolean;
  divider?: boolean;
  heading?: string;
  icon?: boolean;
  icons?: boolean;
  maxItems?: number;
  links?: Array<{
    title: string;
    to?: string;
    icon?: React.ComponentType<{ className?: string }>;
  }>;
  rightAlign?: boolean;
  separator?: React.ComponentType;
  title?: boolean;
  titleBottom?: boolean;
  theme: ThemeConfig;
  className?: string;
}

export function Breadcrumbs({
  card = false,
  custom = false,
  heading,
  icon,
  icons,
  maxItems,
  links,
  rightAlign = false,
  separator,
  title = true,
  titleBottom = true,
  theme,
  className = '',
  ...others
}: BreadcrumbsProps) {
  const location = usePathname();
  const [main, setMain] = useState<MenuItem | null>(null);
  const [item, setItem] = useState<MenuItem | null>(null);

  const iconClasses = `
    ${theme.themeDirection === 'rtl' ? 'ml-3' : 'mr-3'}
    w-4 h-6 flex-shrink-0
  `;

  useEffect(() => {
    // Reset state if we're on the home page
    if (location === '/') {
      setMain(null);
      setItem(null);
      return;
    }

    navItems?.forEach((menu: NavItem) => {
      const menuItem: MenuItem = {
        ...menu,
        title: menu.label,
        type: menu.children ? 'group' : 'item'
      };
      
      if (menuItem.href && menuItem.href === location) {
        setMain(menuItem);
        setItem(menuItem);
      } else if (menuItem.children) {
        getCollapse(menuItem);
      }
    });
  }, [location]);

  // set active item state
  const getCollapse = (menu: MenuItem) => {
    if (!custom && menu.children) {
      menu.children.forEach((collapse) => {
        const collapseItem: MenuItem = {
          ...collapse,
          title: collapse.label,
          type: collapse.children ? 'collapse' : 'item'
        };

        if (collapseItem.type === 'collapse') {
          getCollapse(collapseItem);
          if (collapseItem.href === location) {
            setMain(collapseItem);
            setItem(collapseItem);
          }
        } else if (collapseItem.type === 'item') {
          if (location === collapseItem.href) {
            setMain(menu);
            setItem(collapseItem);
          }
        }
      });
    }
  };

  // Custom Breadcrumbs
  if (custom && links && links.length > 0) {
    return (
      <div className="h-full flex items-center">
        <div className={`flex ${rightAlign ? 'justify-between items-center' : 'items-center'} gap-4`}>
          {title && !titleBottom && (
            <h2 className="text-2xl font-semibold">{heading}</h2>
          )}
          <HeroUIBreadcrumbs {...others}>
            <BreadcrumbItem>
              <NextLink href="/" className="flex items-center text-dark-600 hover:text-dark-900 transition-colors duration-200">
                <span className="flex items-center justify-center">
                  {icons && <HomeIcon className={iconClasses} />}
                  {(!icon || icons) && 'Home'}
                </span>
              </NextLink>
            </BreadcrumbItem>
            {links.map((link, index) => {
              const Icon = link.icon;
              return (
                <BreadcrumbItem key={index}>
                  {link.to ? (
                    <NextLink 
                      href={link.to} 
                      className="flex items-center text-dark-600 hover:text-dark-900 transition-colors duration-200"
                    >
                      <span className="flex items-center justify-center">
                        {Icon && <Icon className={iconClasses} />}
                        {link.title}
                      </span>
                    </NextLink>
                  ) : (
                    <span className="flex items-center justify-center text-dark-900 font-medium">
                      {Icon && <Icon className={iconClasses} />}
                      {link.title}
                    </span>
                  )}
                </BreadcrumbItem>
              );
            })}
          </HeroUIBreadcrumbs>
          {title && titleBottom && (
            <h2 className="text-2xl font-semibold mt-1">{heading}</h2>
          )}
        </div>
      </div>
    );
  }

  // Dynamic Breadcrumbs
  if (item && (item.type === 'item' || (item.type === 'group' && item.href))) {
    return (
      <div className="h-full flex items-center">
        <div className={`flex ${rightAlign ? 'justify-between items-center' : 'items-center'} gap-4`}>
          {title && !titleBottom && (
            <h2 className="text-2xl font-semibold">{item.title}</h2>
          )}
          <HeroUIBreadcrumbs {...others}>
            <BreadcrumbItem>
              <NextLink href="/" className="flex items-center text-dark-600 hover:text-dark-900 transition-colors duration-200">
                <span className="flex items-center justify-center">
                  {icons && <HomeIcon className={iconClasses} />}
                  {(!icon || icons) && 'Home'}
                </span>
              </NextLink>
            </BreadcrumbItem>
            {main && main.type === 'collapse' && (
              <BreadcrumbItem>
                <NextLink 
                  href={main.href || '/'} 
                  className="flex items-center text-dark-600 hover:text-dark-900 transition-colors duration-200"
                >
                  <span className="flex items-center justify-center">
                    {icons && main.icon && <span className={iconClasses}>{main.icon}</span>}
                    {main.title}
                  </span>
                </NextLink>
              </BreadcrumbItem>
            )}
            <BreadcrumbItem>
              <span className="flex flex-row items-center justify-center text-dark-900 font-medium">
                {icons && item.icon && <span className={iconClasses}>{item.icon}</span>}
                <span>{item.title}</span>
              </span>
            </BreadcrumbItem>
          </HeroUIBreadcrumbs>
          {title && titleBottom && (
            <h2 className="text-2xl font-semibold mt-1">{item.title}</h2>
          )}
        </div>
      </div>
    );
  }

  return null;
} 