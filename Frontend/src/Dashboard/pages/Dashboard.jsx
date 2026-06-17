import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import ProfileCard from "../components/ProfileCard";
import ProfileCompletion from "../components/ProfileCompletion";
import Announcement from "../components/Announcement";
import ApplicationStats from "../components/ApplicationStats";
import CalendarCard from "../components/CalendarCard";
import QuickAccess from "../components/QuickAccess";
import RecentActivities from "../components/RecentActivities";

const Dashboard = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/");
      return;
    }

    try {
      setLoading(true);
      
      // Fetch profile and dashboard info in parallel
      const [profileRes, dashboardRes] = await Promise.all([
        fetch("http://127.0.0.1:8000/api/settings/profile", {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        }),
        fetch("http://127.0.0.1:8000/api/dashboard", {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        }),
      ]);

      if (profileRes.status === 401 || dashboardRes.status === 401) {
        toast.error("Session expired. Please login again.");
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        localStorage.removeItem("role");
        navigate("/");
        return;
      }

      if (!profileRes.ok || !dashboardRes.ok) {
        throw new Error("Failed to fetch dashboard data");
      }

      const profileData = await profileRes.json();
      const dashData = await dashboardRes.json();

      setProfile(profileData);
      setDashboardData(dashData);
    } catch (err) {
      console.error(err);
      toast.error("Error loading student dashboard");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100%", minHeight: "300px" }}>
        <p style={{ fontSize: "18px", color: "#64748b", fontWeight: "500" }}>Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="dashboard-grid">
      <div className="profile-area">
        <ProfileCard profile={profile} />
      </div>

      <div className="completion-area">
        <ProfileCompletion profile={profile} />
      </div>

      <div className="announcement-area">
        <Announcement announcements={dashboardData?.announcements} />
      </div>

      <div className="stats-area">
        <ApplicationStats stats={dashboardData?.stats} />
      </div>

      <div className="calendar-area">
        <CalendarCard calendarEvents={dashboardData?.calendar} />
      </div>

      <div className="quick-area">
        <QuickAccess />
      </div>

      <div className="recent-area">
        <RecentActivities activities={dashboardData?.activity} />
      </div>
    </div>
  );
};

export default Dashboard;
