import React from "react";
import styles from "./Account.module.css";
import  { useEffect } from "react";

const Account = () => {
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
              <li className={styles.active}>
                <i className="ri-user-line" aria-hidden="true" />
                <span>Account</span>
              </li>
              <li>
                <i className="ri-lock-line" aria-hidden="true" />
                <span>Security & Password</span>
              </li>
              <li>
                <i className="ri-apps-line" aria-hidden="true" />
                <span>Application Settings</span>
              </li>
              <li>
                <i className="ri-global-line" aria-hidden="true" />
                <span>Language & Region</span>
              </li>
              <li>
                <i className="ri-question-line" aria-hidden="true" />
                <span>Help & Support</span>
              </li>
              <li>
                <i className="ri-information-line" aria-hidden="true" />
                <span>About Us</span>
              </li>
              <li className={styles.logout}>
                <i className="ri-logout-box-r-line" aria-hidden="true" />
                <span>Logout</span>
              </li>
            </ul>
          </div>

          {/* CENTER – Account Settings Form Card */}
          <div className={`${styles.card} ${styles.accountForm}`}>
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
              <input type="email" placeholder="Enter your alternate email" />
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
                <input type="tel" placeholder="Enter your alternate phone" />
              </div>
            </div>

            <div className={styles.actions}>
              <button type="button" className={styles.primary}>
                Save Changes
              </button>
            </div>
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
              <div><span>Role:</span><span>Student</span></div>
              <div><span>Department:</span><span>Computer Science</span></div>
              <div><span>Programme:</span><span>B.Tech</span></div>
              <div><span>Semester:</span><span>3rd Semester</span></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Account;
