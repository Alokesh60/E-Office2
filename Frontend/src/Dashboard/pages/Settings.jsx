import React, { useState, useEffect } from "react";
import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import styles from "./Settings.module.css";

const Settings = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

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
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    document.body.classList.add("settings-page-active");
    fetchProfile();
    return () => {
      document.body.classList.remove("settings-page-active");
    };
  }, []);

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

                <div className={styles.cardsContainer}>
                  {/* Notification Settings */}
                  <div className={styles.card}>
                    <h2>Notification Preferences</h2>

                    <div className={styles.toggleRow}>
                      <span>Email Notifications</span>
                      <input type="checkbox" defaultChecked />
                    </div>

                    <div className={styles.toggleRow}>
                      <span>Announcement Alerts</span>
                      <input type="checkbox" />
                    </div>

                    <div className={styles.toggleRow}>
                      <span>Deadline Reminders</span>
                      <input type="checkbox" />
                    </div>
                  </div>

                  {/* Connected Devices & Session Management */}
                  <div className={styles.card}>
                    <h3>Connected Devices & Session Management</h3>

                    <div className={styles.deviceList}>
                      <div className={styles.device}>
                        <div>
                          <strong>Current Device</strong>
                          <p>Chrome on Windows</p>
                          <p>IP: 192.168.0.102</p>
                        </div>

                        <button className={styles.secondaryBtn}>Logout</button>
                      </div>

                      <div className={styles.device}>
                        <div>
                          <strong>Mobile Device</strong>
                          <p>IP: 192.168.0.58</p>
                          <p>Last active: 2 hours ago</p>
                        </div>

                        <button className={styles.secondaryBtn}>Logout</button>
                      </div>
                      <div className={styles.device}>
                        <div>
                          <strong>Mobile Device</strong>
                          <p>IP: 192.168.0.58</p>
                          <p>Last active: 2 hours ago</p>
                        </div>

                        <button className={styles.secondaryBtn}>Logout</button>
                      </div>
                      <div className={styles.device}>
                        <div>
                          <strong>Mobile Device</strong>
                          <p>IP: 192.168.0.58</p>
                          <p>Last active: 2 hours ago</p>
                        </div>

                        <button className={styles.secondaryBtn}>Logout</button>
                      </div>
                    </div>

                    <button className={styles.primaryBtn}>
                      Logout All Other Devices
                    </button>
                  </div>
                </div>

                <div className={styles.bottomBtns}>
                  <button className={styles.resetBtn}>Reset to Default</button>
                  <button className={styles.saveBtn}>Save Settings</button>
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
