import React, { useState } from "react";
import styles from "./Security.module.css";

const Security = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [twoFAEnabled, setTwoFAEnabled] = useState(false);

  return (
    <div className={styles.securityWrapper}>
      <h1>Security & Password</h1>

      <div className={styles.securityGrid}>
        {/* LEFT – Change Password */}
        <div className={styles.passwordCard}>
          <img
            src="/images/lock-illustration.png"
            alt="Security img"
            className={styles.illustration}
          />
          <h3>Change Password</h3>

          <label>Current Password</label>
          <div className={styles.inputGroup}>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Enter current password"
            />
            <i
              className="ri-eye-line"
              onClick={() => setShowPassword(!showPassword)}
            />
          </div>

          <label>New Password</label>
          <div className={styles.inputGroup}>
            <input type="password" placeholder="Enter new password" />
            <i className="ri-eye-line" />
          </div>

          <label>Confirm New Password</label>
          <div className={styles.inputGroup}>
            <input type="password" placeholder="Confirm new password" />
            <i className="ri-eye-line" />
          </div>

          <button className={styles.primaryBtn}>
            <i className="ri-lock-line" /> Update Password
          </button>
        </div>

        {/* RIGHT – Two Factor Authentication */}
        <div className={styles.twoFACard}>
            <img
            src="/images/two-factor.png"
            alt="Security img"
            className={styles.illustration}
          />
          <h3>Two-Factor Authentication</h3>

          <p>
            Enhance the security of your account by enabling two-factor
            authentication.
          </p>

          <div className={styles.toggleRow}>
            <span>Enable Two-Factor Authentication</span>
            <label className={styles.switch}>
              <input
                type="checkbox"
                checked={twoFAEnabled}
                onChange={() => setTwoFAEnabled(!twoFAEnabled)}
              />
              <span className={styles.slider}></span>
            </label>
          </div>

          <div className={styles.authMethods}>
            <label className={styles.radioItem}>
              <input type="radio" name="auth" defaultChecked />
              <span>Mobile (SMS/Authenticator App)</span>
            </label>

            <label className={styles.radioItem}>
              <input type="radio" name="auth" />
              <span>Email Verification</span>
            </label>
          </div>

          <button className={styles.secondaryBtn}>Manage 2FA</button>
        </div>
      </div>
    </div>
  );
};

export default Security;
