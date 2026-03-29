import React, { useEffect } from 'react';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import { Outlet } from 'react-router-dom';

const DashboardLayout = () => {
  useEffect(() => {
    document.body.classList.add("scroll-page-active");
    return () => document.body.classList.remove("scroll-page-active");
  }, []);

  return (
    <div className="layout"> {/* 🔥 NEW */}

      <Topbar />

      <div className="main-container">
        <Sidebar />

        <main className="content-area">
          <Outlet />
        </main>
      </div>

    </div>
  );
};

export default DashboardLayout;