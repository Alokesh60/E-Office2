import React, { useState, useEffect } from "react";
import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import styles from "./Settings.module.css";

const Settings = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Notification states
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [announcementAlerts, setAnnouncementAlerts] = useState(false);
  const [deadlineReminders, setDeadlineReminders] = useState(false);

  // Connected devices state
  const [devices, setDevices] = useState([]);

  const fetchProfile = async () => {
    try {
      const res = await fetch("http://127.0.0.1:8000/api/settings/profile", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          Accept: "application/json",
        },
      });

      if (res.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        localStorage.removeItem("role");
        navigate("/");
        return;
      }

      if (res.ok) {
        const data = await res.json();
        setProfile(data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const fetchNotifications = async () => {
    try {
      const res = await fetch("http://127.0.0.1:8000/api/settings/notifications", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          Accept: "application/json",
        },
      });
      if (res.ok) {
        const data = await res.json();
        setEmailNotifications(!!data.email_notifications);
        setAnnouncementAlerts(!!data.announcement_alerts);
        setDeadlineReminders(!!data.deadline_reminders);
      }
    } catch (err) {
      console.error("Error loading notification settings", err);
    }
  };

  const fetchDevices = async () => {
    try {
      const res = await fetch("http://127.0.0.1:8000/api/settings/devices", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          Accept: "application/json",
        },
      });
      if (res.ok) {
        const data = await res.json();
        setDevices(data);
      }
    } catch (err) {
      console.error("Error loading active devices", err);
    }
  };

  const getDeviceIcon = (device) => {
    if (!device) return "ri-smartphone-line";
    const devLower = device.toLowerCase();
    if (devLower.includes("windows") || devLower.includes("pc") || devLower.includes("mac")) {
      return "ri-computer-line";
    }
    return "ri-smartphone-line";
  };

  useEffect(() => {
    document.body.classList.add("settings-page-active");
    
    const initFetch = async () => {
      setLoading(true);
      await Promise.all([
        fetchProfile(),
        fetchNotifications(),
        fetchDevices()
      ]);
      setLoading(false);
    };

    initFetch();

    return () => {
      document.body.classList.remove("settings-page-active");
    };
  }, []);

  const handleSaveSettings = async () => {
    try {
      setSaving(true);
      const res = await fetch("http://127.0.0.1:8000/api/settings/notifications", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          Accept: "application/json",
        },
        body: JSON.stringify({
          email_notifications: emailNotifications,
          announcement_alerts: announcementAlerts,
          deadline_reminders: deadlineReminders,
        }),
      });

      if (res.ok) {
        toast.success("Notification preferences saved successfully!");
      } else {
        toast.error("Failed to save notification preferences");
      }
    } catch (err) {
      console.error(err);
      toast.error("Error saving settings");
    } finally {
      setSaving(false);
    }
  };

  const handleResetSettings = async () => {
    try {
      setSaving(true);
      const res = await fetch("http://127.0.0.1:8000/api/settings/notifications/reset", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          Accept: "application/json",
        },
      });

      if (res.ok) {
        toast.success("Preferences reset to defaults!");
        setEmailNotifications(true);
        setAnnouncementAlerts(false);
        setDeadlineReminders(false);
      } else {
        toast.error("Failed to reset settings");
      }
    } catch (err) {
      console.error(err);
      toast.error("Error resetting settings");
    } finally {
      setSaving(false);
    }
  };

  const handleLogoutDevice = async (tokenId) => {
    try {
      const res = await fetch(`http://127.0.0.1:8000/api/settings/devices/${tokenId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          Accept: "application/json",
        },
      });

      if (res.ok) {
        toast.success("Session revoked successfully!");
        fetchDevices();
      } else {
        const errData = await res.json();
        toast.error(errData.message || "Failed to logout device");
      }
    } catch (err) {
      console.error(err);
      toast.error("Error logging out device");
    }
  };

  const handleLogoutAllOtherDevices = async () => {
    try {
      const res = await fetch("http://127.0.0.1:8000/api/settings/devices", {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          Accept: "application/json",
        },
      });

      if (res.ok) {
        toast.success("All other active sessions revoked!");
        fetchDevices();
      } else {
        toast.error("Failed to logout other sessions");
      }
    } catch (err) {
      console.error(err);
      toast.error("Error logging out other sessions");
    }
  };

  return (
    <div className={styles.settingsRoot}>
      <div className={styles.settingsPage}>
        <div className={styles.settingsWrapper}>
          {/* LEFT – Settings Navigation Card */}
          <div className={styles.settingsNav}>
            <ul>
              <li>
                <NavLink
                  to=""
                  end
                  className={({ isActive }) =>
                    isActive
                      ? `${styles.navItem} ${styles.active}`
                      : styles.navItem
                  }
                >
                  <i className="ri-settings-3-line" />
                  <span>Settings</span>
                </NavLink>
              </li>

              <li>
                <NavLink
                  to="security"
                  className={({ isActive }) =>
                    isActive
                      ? `${styles.navItem} ${styles.active}`
                      : styles.navItem
                  }
                >
                  <i className="ri-lock-line" />
                  <span>Security & Password</span>
                </NavLink>
              </li>
            </ul>
          </div>

          {/* RIGHT – Settings Content Card */}
          <div className={styles.settingsContent}>
            {location.pathname === "/dashboard/settings" && (
              <>
                <div className={styles.header}>
                  <div>
                    <h1>Settings</h1>
                    <p className="settings_line">Manage your account settings and preferences</p>
                  </div>
                </div>

                {loading ? (
                  <p style={{ padding: "20px", color: "#496c8a" }}>Loading settings...</p>
                ) : (
                  <div className={styles.cardsContainer}>
                    {/* Notification Settings */}
                    <div className={styles.card}>
                      <h2>Notification Preferences</h2>

                      <div className={styles.toggleRow}>
                        <span>Email Notifications</span>
                        <input
                          type="checkbox"
                          checked={emailNotifications}
                          onChange={(e) => setEmailNotifications(e.target.checked)}
                          disabled={saving}
                        />
                      </div>

                      <div className={styles.toggleRow}>
                        <span>Announcement Alerts</span>
                        <input
                          type="checkbox"
                          checked={announcementAlerts}
                          onChange={(e) => setAnnouncementAlerts(e.target.checked)}
                          disabled={saving}
                        />
                      </div>

                      <div className={styles.toggleRow}>
                        <span>Deadline Reminders</span>
                        <input
                          type="checkbox"
                          checked={deadlineReminders}
                          onChange={(e) => setDeadlineReminders(e.target.checked)}
                          disabled={saving}
                        />
                      </div>
                    </div>

                    {/* Connected Devices & Session Management */}
                    <div className={styles.card}>
                      <h3>Account login activity</h3>
                      <p style={{ fontSize: "14px", color: "#475569", margin: "-8px 0 15px 0", textAlign: "left" }}>
                        You're currently logged in on these devices:
                      </p>

                      <div className={styles.deviceList}>
                        {/* CURRENT DEVICE */}
                        {devices.filter(d => d.is_current).map((device) => (
                          <div key={device.id} className={styles.deviceItem}>
                            <div className={styles.deviceIcon}>
                              <i className={getDeviceIcon(device.device)} />
                            </div>
                            <div className={styles.deviceInfo}>
                              <strong>{device.device} (Current Device)</strong>
                              <p className={styles.deviceMeta}>{device.location}</p>
                              <p className={styles.deviceTime}>{device.time}</p>
                            </div>
                          </div>
                        ))}

                        {/* OTHER DEVICES */}
                        {devices.some(d => !d.is_current) && (
                          <>
                            <h4 className={styles.subHeader}>Logins on other devices</h4>
                            {devices.filter(d => !d.is_current).map((device) => (
                              <div key={device.id} className={styles.deviceItem}>
                                <div className={styles.deviceIcon}>
                                  <i className={getDeviceIcon(device.device)} />
                                </div>
                                <div className={styles.deviceInfo}>
                                  <strong>{device.device}</strong>
                                  <p className={styles.deviceMeta}>{device.location}</p>
                                  <p className={styles.deviceTime}>{device.time}</p>
                                </div>
                                <button
                                  className={styles.logoutBtnSmall}
                                  onClick={() => handleLogoutDevice(device.id)}
                                >
                                  Logout
                                </button>
                              </div>
                            ))}
                          </>
                        )}

                        {devices.length === 0 && (
                          <p style={{ color: "#64748b", fontSize: "13px", textAlign: "center", padding: "10px 0" }}>
                            No active sessions found.
                          </p>
                        )}
                      </div>

                      {devices.some(d => !d.is_current) && (
                        <button 
                          className={styles.primaryBtn}
                          onClick={handleLogoutAllOtherDevices}
                          style={{ width: "fit-content", alignSelf: "flex-start", marginTop: "10px" }}
                        >
                          Logout All Other Devices
                        </button>
                      )}
                    </div>
                  </div>
                )}

                <div className={styles.bottomBtns}>
                  <button 
                    className={styles.resetBtn} 
                    onClick={handleResetSettings}
                    disabled={saving || loading}
                  >
                    Reset to Default
                  </button>
                  <button 
                    className={styles.saveBtn} 
                    onClick={handleSaveSettings}
                    disabled={saving || loading}
                  >
                    {saving ? "Saving..." : "Save Settings"}
                  </button>
                </div>
              </>
            )}

            <Outlet context={{ profile, fetchProfile }} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
