import React from 'react';
import Sidebar from '../components/Sidebar';
import Topbar from '../components/Topbar';
import ProfileCard from '../components/ProfileCard';
import ProfileCompletion from '../components/ProfileCompletion';
import Announcement from '../components/Announcement';
import ApplicationStats from '../components/ApplicationStats';
import CalendarCard from '../components/CalendarCard';
import QuickAccess from '../components/QuickAccess';
import RecentActivities from '../components/RecentActivities';

const Dashboard = () => {
  return (
    <div className="main-container">
      <Sidebar />
      <main className="content-area">
        <Topbar />
        <div className="dashboard-grid">
          <ProfileCard />
          <ProfileCompletion />
          <Announcement />
          <ApplicationStats />
          <CalendarCard />
          <RecentActivities />
          <QuickAccess />
        </div>
      </main>
    </div>
  );
};

export default Dashboard;

