import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../Sidebar/Sidebar';
import Navbar from '../Navbar/Navbar';
import { useUIStore } from '../../../store/uiStore';

const Layout = () => {
  const { sidebarOpen, isMobile } = useUIStore();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar />
      <Navbar />
      
      <main
        className={`
          transition-all duration-300 
          ${!isMobile && sidebarOpen ? 'lggs:ml-64' : 'lggs:ml-20'}
          ${isMobile ? 'ml-0' : ''}
        `}
      >
        <div className=" ">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default Layout;