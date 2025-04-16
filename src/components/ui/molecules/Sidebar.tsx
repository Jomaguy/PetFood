import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

export interface SidebarItem {
  label: string;
  href: string;
  icon?: React.ReactNode;
}

interface SidebarProps {
  items: SidebarItem[];
  className?: string;
  isOpen?: boolean;
  onClose?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ 
  items, 
  className = '',
  isOpen = true,
  onClose
}) => {
  const router = useRouter();

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && onClose && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-10 lg:hidden" 
          onClick={onClose}
          aria-hidden="true"
        />
      )}
      
      {/* Sidebar */}
      <aside 
        className={`
          fixed top-0 left-0 z-20 h-full bg-white shadow-lg transform transition-transform duration-300 ease-in-out
          w-64 lg:translate-x-0 lg:static lg:h-auto
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
          ${className}
        `}
      >
        {/* Close button (mobile only) */}
        {onClose && (
          <button 
            className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 lg:hidden"
            onClick={onClose}
            aria-label="Close sidebar"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
        
        {/* Logo/Title */}
        <div className="p-4 border-b">
          <Link href="/" className="text-xl font-semibold text-primary-600">
            Dashboard
          </Link>
        </div>
        
        {/* Navigation */}
        <nav className="p-4">
          <ul className="space-y-2">
            {items.map((item, index) => {
              const isActive = router.pathname === item.href;
              return (
                <li key={index}>
                  <Link 
                    href={item.href}
                    className={`
                      flex items-center p-2 rounded-md transition-colors
                      ${isActive 
                        ? 'bg-primary-50 text-primary-700 font-medium' 
                        : 'text-gray-700 hover:bg-gray-100'
                      }
                    `}
                    aria-current={isActive ? 'page' : undefined}
                  >
                    {item.icon && <span className="mr-3">{item.icon}</span>}
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
        
        {/* Skip to main content (accessibility) */}
        <a 
          href="#main-content" 
          className="sr-only focus:not-sr-only focus:absolute focus:top-0 focus:left-0 focus:p-4 focus:bg-white focus:z-50"
        >
          Skip to main content
        </a>
      </aside>
    </>
  );
};

export default Sidebar; 