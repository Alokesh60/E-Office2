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

  <div className="profile-area">
    <ProfileCard />
  </div>

  <div className="completion-area">
    <ProfileCompletion />
  </div>

  <div className="announcement-area">
    <Announcement />
  </div>

  <div className="stats-area">
    <ApplicationStats />
  </div>

  <div className="calendar-area">
    <CalendarCard />
  </div>

  <div className="quick-area">
    <QuickAccess />
  </div>

  <div className="recent-area">
    <RecentActivities />
  </div>

</div>
  );
};

export default Dashboard;

