import React, { useState } from "react";
import styles from "./Security.module.css";
import toast from "react-hot-toast";

const Security = () => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [saving, setSaving] = useState(false);
  const [twoFAEnabled, setTwoFAEnabled] = useState(false);
  const [authMethod, setAuthMethod] = useState("sms");

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();

    if (!currentPassword) {
      toast.error("Please enter your current password");
      return;
    }

    if (newPassword.length < 8) {
      toast.error("New password must be at least 8 characters long");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("New passwords do not match!");
      return;
    }

    try {
      setSaving(true);
      const res = await fetch("http://127.0.0.1:8000/api/settings/password", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          Accept: "application/json",
        },
        body: JSON.stringify({
          current_password: currentPassword,
          new_password: newPassword,
          new_password_confirmation: confirmPassword,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success("Password updated successfully!");
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
        setShowCurrent(false);
        setShowNew(false);
        setShowConfirm(false);
      } else {
        toast.error(data.message || "Failed to update password");
      }
    } catch (err) {
      console.error(err);
      toast.error("Error updating password");
    } finally {
      setSaving(false);
    }
  };

  const handleTwoFAToggle = () => {
    const nextState = !twoFAEnabled;
    setTwoFAEnabled(nextState);
    toast.success(
      nextState
        ? `Two-Factor Authentication enabled via ${authMethod === "sms" ? "Mobile" : "Email"} (Mock)`
        : "Two-Factor Authentication disabled (Mock)"
    );
  };

  const handleAuthMethodChange = (method) => {
    setAuthMethod(method);
    if (twoFAEnabled) {
      toast.success(`Authentication method set to ${method === "sms" ? "Mobile" : "Email"} (Mock)`);
    }
  };

  return (
    <div className={styles.securityWrapper}>
      <h1>Security & Password</h1>

      <div className={styles.securityGrid}>
        {/* LEFT – Change Password */}
        <form className={styles.passwordCard} onSubmit={handlePasswordUpdate}>
          <img
            src="/images/lock-illustration.png"
            alt="Security img"
            className={styles.illustration}
          />
          <h3>Change Password</h3>

          <label>Current Password</label>
          <div className={styles.inputGroup}>
            <input
              type={showCurrent ? "text" : "password"}
              placeholder="Enter current password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              disabled={saving}
              required
            />
            <i
              className={showCurrent ? "ri-eye-off-line" : "ri-eye-line"}
              onClick={() => setShowCurrent(!showCurrent)}
            />
          </div>

          <label>New Password</label>
          <div className={styles.inputGroup}>
            <input
              type={showNew ? "text" : "password"}
              placeholder="Enter new password (min 8 chars)"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              disabled={saving}
              required
            />
            <i
              className={showNew ? "ri-eye-off-line" : "ri-eye-line"}
              onClick={() => setShowNew(!showNew)}
            />
          </div>

          <label>Confirm New Password</label>
          <div className={styles.inputGroup}>
            <input
              type={showConfirm ? "text" : "password"}
              placeholder="Confirm new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              disabled={saving}
              required
            />
            <i
              className={showConfirm ? "ri-eye-off-line" : "ri-eye-line"}
              onClick={() => setShowConfirm(!showConfirm)}
            />
          </div>

          <button type="submit" className={styles.primaryBtn} disabled={saving}>
            <i className="ri-lock-line" /> {saving ? "Updating..." : "Update Password"}
          </button>
        </form>

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
                onChange={handleTwoFAToggle}
              />
              <span className={styles.slider}></span>
            </label>
          </div>

          <div className={styles.authMethods}>
            <label className={styles.radioItem}>
              <input
                type="radio"
                name="auth"
                checked={authMethod === "sms"}
                onChange={() => handleAuthMethodChange("sms")}
              />
              <span>Mobile (SMS/Authenticator App)</span>
            </label>

            <label className={styles.radioItem}>
              <input
                type="radio"
                name="auth"
                checked={authMethod === "email"}
                onChange={() => handleAuthMethodChange("email")}
              />
              <span>Email Verification</span>
            </label>
          </div>

          <button
            className={styles.secondaryBtn}
            onClick={() => toast.success("MFA configuration settings updated (Mock)")}
          >
            Manage 2FA
          </button>
        </div>
      </div>
    </div>
  );
};

export default Security;
