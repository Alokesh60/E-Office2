import React from "react";
import styles from "./Account.module.css";
import { useEffect } from "react";
import { NavLink, Outlet, useLocation } from "react-router-dom";

const Account = () => {
  const location = useLocation();
  useEffect(() => {
    document.body.classList.add("account-page-active");
    return () => document.body.classList.remove("account-page-active");
  }, []);

  return (
    <div className={styles.accountRoot}>
      <div className={styles.accountPage}>
        <div className={styles.accountWrapper}>
          {/* LEFT – Settings Navigation Card */}
          <div className={`${styles.card} ${styles.accountNav}`}>
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
                  <i className="ri-user-line" />
                  <span>Account</span>
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

              <li>
                <NavLink
                  to="application"
                  className={({ isActive }) =>
                    isActive
                      ? `${styles.navItem} ${styles.active}`
                      : styles.navItem
                  }
                >
                  <i className="ri-apps-line" />
                  <span>Application Settings</span>
                </NavLink>
              </li>

              <li>
                <NavLink
                  to="help"
                  className={({ isActive }) =>
                    isActive
                      ? `${styles.navItem} ${styles.active}`
                      : styles.navItem
                  }
                >
                  <i className="ri-question-line" />
                  <span>Help & Support</span>
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="about"
                  className={({ isActive }) =>
                    isActive
                      ? `${styles.navItem} ${styles.active}`
                      : styles.navItem
                  }
                >
                  <i className="ri-global-line" />
                  <span>About</span>
                </NavLink>
              </li>

              <li>
                <NavLink
                  className={`${styles.navItem} ${styles.logoutBtn}`}
                  onClick={() => {
                    console.log("Logout clicked");
                    // add your logout logic here
                  }}
                >
                  <i className="ri-logout-box-r-line" />
                  <span>Logout</span>
                </NavLink>
              </li>
            </ul>
          </div>

          {/* CENTER – Account Settings Form Card */}
          <div className={`${styles.card} ${styles.accountForm}`}>
            {location.pathname === "/account" && (
              <>
                <h1>Account Settings</h1>

                <h4>Basic Information</h4>
                <div className={styles.formGrid}>
                  <div>
                    <label>First Name</label>
                    <input type="text" placeholder="Enter your first name" />
                  </div>
                  <div>
                    <label>Last Name</label>
                    <input type="text" placeholder="Enter your last name" />
                  </div>
                </div>

                <div>
                  <label>College Email Address</label>
                  <input type="email" placeholder="Enter your college email" />
                </div>

                <div>
                  <label>Alternate Email Address</label>
                  <input
                    type="email"
                    placeholder="Enter your alternate email"
                  />
                </div>

                <div>
                  <label>Student ID</label>
                  <input type="text" placeholder="Enter your student ID" />
                </div>

                <h4>Contact Information</h4>
                <div className={styles.formGrid}>
                  <div>
                    <label>Phone Number</label>
                    <input type="tel" placeholder="Enter your phone number" />
                  </div>
                  <div>
                    <label>Alternate Phone Number</label>
                    <input
                      type="tel"
                      placeholder="Enter your alternate phone"
                    />
                  </div>
                </div>

                <div className={styles.actions}>
                  <button type="button" className={styles.primary}>
                    Save Changes
                  </button>
                </div>
              </>
            )}

            <Outlet />
          </div>

          {/* RIGHT – Profile Summary Card */}
          <div className={`${styles.card} ${styles.profileCard}`}>
            <h3>Profile</h3>
            <img
              src="/images/profile.png"
              alt="Profile"
              className={styles.avatar}
            />
            <button type="button" className={styles.secondary}>
              Complete Now
            </button>
            <div className={styles.profileInfo}>
              <div>
                <span>Role:</span>
                <span>Student</span>
              </div>
              <div>
                <span>Department:</span>
                <span>Computer Science</span>
              </div>
              <div>
                <span>Programme:</span>
                <span>B.Tech</span>
              </div>
              <div>
                <span>Semester:</span>
                <span>3rd Semester</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Account;
