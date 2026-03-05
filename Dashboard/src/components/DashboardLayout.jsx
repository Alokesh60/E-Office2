import React from 'react';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import { Outlet } from 'react-router-dom';

const DashboardLayout = () => {
  return (
    <div className="main-container">
      <Sidebar />
      <main className="content-area">
        <Topbar />
        <Outlet />
      </main>
    </div>
  );
};

export default DashboardLayout;
