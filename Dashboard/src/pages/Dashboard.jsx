import React from 'react';
import ProfileCard from '../components/ProfileCard';
import ProfileCompletion from '../components/ProfileCompletion';
import Announcement from '../components/Announcement';
import ApplicationStats from '../components/ApplicationStats';
import CalendarCard from '../components/CalendarCard';
import QuickAccess from '../components/QuickAccess';
import RecentActivities from '../components/RecentActivities';

const Dashboard = () => {
  return (
    <div className="dashboard-grid">
      <ProfileCard />
      <ProfileCompletion />
      <Announcement />
      <ApplicationStats />
      <CalendarCard />
      <RecentActivities />
      <QuickAccess />
    </div>
  );
};

export default Dashboard;

