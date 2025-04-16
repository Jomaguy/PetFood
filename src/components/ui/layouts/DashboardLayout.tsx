import React, { useState } from 'react';
import { Header } from '../molecules/Header';
import { Sidebar, SidebarItem } from '../molecules/Sidebar';
import { Breadcrumb, BreadcrumbItem } from '../molecules/Breadcrumb';
import { Container } from './Container';

interface DashboardLayoutProps {
  children: React.ReactNode;
  title: string;
  breadcrumbs?: BreadcrumbItem[];
  sidebarItems: SidebarItem[];
  className?: string;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  children,
  title,
  breadcrumbs = [],
  sidebarItems,
  className = '',
}) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Header with mobile sidebar toggle */}
      <Header className="sticky top-0 z-30" />
      
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar with toggle button for mobile */}
        <div className="lg:hidden fixed top-4 left-4 z-40">
          <button
            className="bg-white p-2 rounded-md shadow text-gray-500"
            onClick={toggleSidebar}
            aria-label="Toggle sidebar"
            aria-expanded={isSidebarOpen}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
        
        {/* Sidebar */}
        <Sidebar 
          items={sidebarItems} 
          isOpen={isSidebarOpen} 
          onClose={() => setIsSidebarOpen(false)} 
        />

        {/* Main content */}
        <main id="main-content" className="flex-1 overflow-auto p-4 lg:p-6" tabIndex={-1}>
          <Container maxWidth="full" className={className}>
            {/* Page title and breadcrumb */}
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">{title}</h1>
              {breadcrumbs.length > 0 && <Breadcrumb items={breadcrumbs} />}
            </div>

            {/* Page content */}
            <div className="bg-white rounded-lg shadow p-4 md:p-6">
              {children}
            </div>
          </Container>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout; 