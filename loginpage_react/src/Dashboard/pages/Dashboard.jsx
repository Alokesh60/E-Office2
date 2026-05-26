import React from "react";
import ProfileCard from "../components/ProfileCard";
import ProfileCompletion from "../components/ProfileCompletion";
import Announcement from "../components/Announcement";
import ApplicationStats from "../components/ApplicationStats";
import CalendarCard from "../components/CalendarCard";
import QuickAccess from "../components/QuickAccess";
import RecentActivities from "../components/RecentActivities";
import PendingWork from "../components/PendingWork";
import "../dashboard.css";

const Dashboard = ({ role = "student" }) => {
  const isFaculty = role === "faculty";

  return (
    <div
      className="dashboard-grid"
      style={
        isFaculty
          ? {
              // Replaced the second "profile" with "completion" so it has a spot on the grid
              gridTemplateAreas: `
                "profile announcement announcement stats" 
                "completion announcement announcement stats" 
                "calendar quick recent recent"
              `,
            }
          : {}
      }
    >
      <div className="profile-area">
        <ProfileCard role={role} />
      </div>

      {/* Removed the !isFaculty condition so it always renders */}
      <div className="completion-area">
        <ProfileCompletion />
      </div>

      <div className="announcement-area">
        {isFaculty ? <PendingWork /> : <Announcement />}
      </div>

      <div className="stats-area">
        <ApplicationStats />
      </div>

      <div className="calendar-area">
        <CalendarCard />
      </div>

      <div className="quick-area">
        <QuickAccess role={role} />
      </div>

      <div className="recent-area">
        <RecentActivities />
      </div>
    </div>
  );
};

export default Dashboard;
