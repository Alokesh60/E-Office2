import React, { useEffect } from "react";
import styles from "./Settings.module.css";

const Settings = ({ role }) => {
  useEffect(() => {
    document.body.classList.add("settings-page-active");
    return () => document.body.classList.remove("settings-page-active");
  }, []);

  return (
    <div className={styles.settingsPage}>
      <div className={styles.header}>
        <div>
          <h1>Settings</h1>
          <p>Manage your account settings and preferences</p>
        </div>
      </div>

      <div className={styles.settingsLayout}>
        {/* LEFT SIDE */}
        <div className={styles.leftColumn}>
          <div className={styles.card}>
            <h2>Profile Settings</h2>

            <div className={styles.profileTop}>
              <img
                src="/images/profile.png"
                alt="profile"
                className={styles.avatar}
              />

              <div className={styles.profilename}>
                <h4>Tony Stark</h4>
                {/* Conditionally render the ID based on role */}
                {role === "student" ? (
                  <p>ID: 24KX100</p>
                ) : role === "faculty" ? (
                  <p>Emp ID: FAC-1029</p>
                ) : null}

                <div className={styles.photoBtns}>
                  <button className={styles.secondaryBtn}>
                    Upload New Photo
                  </button>

                  <button className={styles.secondaryBtn}>Remove Photo</button>
                </div>
              </div>
              <img
                src="/images/profilecard.png"
                alt="profile"
                className={styles.profileIllustration}
              />
            </div>

            {/* Department is common to both */}
            <label>Department</label>
            <select>
              <option>Computer Science and Engineering</option>
              <option>Electronics and Communication Engineering</option>
              <option>Electronics and Instrumentation Engineering</option>
              <option>Electrical Engineering</option>
              <option>Mechanical Engineering</option>
              <option>Civil Engineering</option>
            </select>

            {/* Conditionally render form fields based on role */}
            {role === "student" ? (
              <>
                <label>Programme</label>
                <select>
                  <option>B.Tech</option>
                  <option>M.Tech</option>
                  <option>MBA</option>
                  <option>PHd</option>
                </select>

                <label>Semester</label>
                <select>
                  <option>1st Semester</option>
                  <option>2ndt Semester</option>
                  <option>3rd Semester</option>
                  <option>4th Semester</option>
                  <option>5th Semester</option>
                </select>
              </>
            ) : role === "faculty" ? (
              <>
                <label>Designation</label>
                <select>
                  <option>Assistant Professor</option>
                  <option>Associate Professor</option>
                  <option>Professor</option>
                </select>

                <label>Cabin Allocation</label>
                <select>
                  <option>Room 402 - Main Block</option>
                  <option>Room 105 - Annex</option>
                </select>
              </>
            ) : null}

            <button className={styles.primaryBtn}>Update Profile</button>
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className={styles.rightColumn}>
          {/* Notification Settings */}
          <div className={styles.card}>
            <h2>Notification Settings</h2>

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

          {/* Connected Devices */}
          <div className={styles.card}>
            <h3>Connected Devices</h3>

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
      </div>

      <div className={styles.bottomBtns}>
        <button className={styles.resetBtn}>Reset to Default</button>
        <button className={styles.saveBtn}>Save Settings</button>
      </div>
    </div>
  );
};

export default Settings;
