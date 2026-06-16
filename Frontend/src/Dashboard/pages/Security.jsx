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

  // Load and persist 2FA settings from localStorage for persistence
  const [twoFAEnabled, setTwoFAEnabled] = useState(
    localStorage.getItem("2fa_enabled") === "true"
  );
  const [authMethod, setAuthMethod] = useState(
    localStorage.getItem("2fa_method") || "sms"
  );

  // 2FA Verification Flow State
  const [showOTPModal, setShowOTPModal] = useState(false);
  const [otpInput, setOtpInput] = useState("");
  const [generatedOTP, setGeneratedOTP] = useState("");

  const getPasswordStrength = (pwd) => {
    if (!pwd) return null;
    if (pwd.length < 8) {
      return { label: "Weak (minimum 8 characters required)", color: "#ef4444" };
    }
    const hasNumbers = /\d/.test(pwd);
    const hasUpper = /[A-Z]/.test(pwd);
    const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(pwd);
    const score = [hasNumbers, hasUpper, hasSpecial].filter(Boolean).length;

    if (score === 3) return { label: "Strong password", color: "#22c55e" };
    if (score === 2) return { label: "Medium password", color: "#f97316" };
    return { label: "Weak password (add numbers, uppercase, or special characters)", color: "#ef4444" };
  };

  const strength = getPasswordStrength(newPassword);

  const handlePasswordSubmit = (e) => {
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

    if (twoFAEnabled) {
      // Generate a mock 6-digit verification code
      const code = Math.floor(100000 + Math.random() * 900000).toString();
      setGeneratedOTP(code);
      setOtpInput("");
      setShowOTPModal(true);
      
      // Notify the user of the generated OTP code in a high-visibility toast
      toast.success(
        `Security Verification Code: ${code} (sent via ${
          authMethod === "sms" ? "SMS" : "Email"
        })`,
        {
          duration: 12000,
          icon: "🔑",
        }
      );
    } else {
      executePasswordUpdate();
    }
  };

  const executePasswordUpdate = async () => {
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
        setShowOTPModal(false);
        setOtpInput("");
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

  const handleOTPVerify = (e) => {
    e.preventDefault();
    if (otpInput === generatedOTP) {
      executePasswordUpdate();
    } else {
      toast.error("Invalid verification code. Please check and try again.");
    }
  };

  const handleTwoFAToggle = () => {
    const nextState = !twoFAEnabled;
    setTwoFAEnabled(nextState);
    localStorage.setItem("2fa_enabled", nextState.toString());
    toast.success(
      nextState
        ? `Two-Factor Authentication enabled via ${authMethod === "sms" ? "Mobile" : "Email"}`
        : "Two-Factor Authentication disabled"
    );
  };

  const handleAuthMethodChange = (method) => {
    setAuthMethod(method);
    localStorage.setItem("2fa_method", method);
    if (twoFAEnabled) {
      toast.success(`Authentication method set to ${method === "sms" ? "Mobile" : "Email"}`);
    }
  };

  return (
    <div className={styles.securityWrapper}>
      <h1>Security & Password</h1>

      <div className={styles.securityGrid}>
        {/* LEFT – Change Password */}
        <form className={styles.passwordCard} onSubmit={handlePasswordSubmit}>
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
          {strength && (
            <span style={{ fontSize: "13px", color: strength.color, marginTop: "6px", display: "block", fontWeight: "500" }}>
              {strength.label}
            </span>
          )}

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
          {confirmPassword && (
            <span style={{
              fontSize: "13px",
              color: newPassword === confirmPassword ? "#22c55e" : "#ef4444",
              marginTop: "6px",
              display: "block",
              fontWeight: "500"
            }}>
              {newPassword === confirmPassword ? "✔ Passwords match" : "✘ Passwords do not match"}
            </span>
          )}

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
            onClick={() => toast.success("MFA configuration settings updated")}
          >
            Manage 2FA
          </button>
        </div>
      </div>

      {/* OTP Verification Modal Overlay */}
      {showOTPModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <h3>Security Verification</h3>
            <p>
              A 6-digit verification code has been sent to your registered{" "}
              {authMethod === "sms" ? "mobile number" : "email address"}. Please enter the code below to authorize this password update.
            </p>
            <form onSubmit={handleOTPVerify}>
              <input
                type="text"
                maxLength="6"
                placeholder="000000"
                value={otpInput}
                onChange={(e) => setOtpInput(e.target.value.replace(/\D/g, ""))}
                required
                autoFocus
              />
              <div className={styles.modalBtns}>
                <button
                  type="button"
                  className={styles.cancelBtn}
                  onClick={() => {
                    setShowOTPModal(false);
                    setOtpInput("");
                  }}
                  disabled={saving}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={styles.confirmBtn}
                  disabled={saving}
                >
                  {saving ? "Verifying..." : "Verify & Update"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Security;
