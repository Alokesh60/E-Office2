import React, { useState, useEffect, useRef } from "react";
import styles from "./Account.module.css";
import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const Account = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const initialStudentIdRef = useRef("");

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const fetchProfile = async () => {
    try {
      const res = await fetch("http://127.0.0.1:8000/api/settings/profile", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          Accept: "application/json",
        },
      });

      if (res.status === 401) {
        toast.error("Session expired. Please login again.");
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        localStorage.removeItem("role");
        navigate("/");
        return;
      }

      if (!res.ok) {
        throw new Error("Failed to load profile settings");
      }

      const data = await res.json();
      setProfile(data);
      if (data.student_id) {
        initialStudentIdRef.current = data.student_id;
      }
    } catch (err) {
      console.error(err);
      toast.error("Error loading account settings");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    document.body.classList.add("account-page-active");
    fetchProfile();

    return () => {
      document.body.classList.remove("account-page-active");
    };
  }, []);

  const handleInputChange = (field, value) => {
    setProfile((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleAvatarUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      toast.error("Image size must be less than 2MB");
      return;
    }

    const formData = new FormData();
    formData.append("avatar", file);

    try {
      setSaving(true);
      const res = await fetch("http://127.0.0.1:8000/api/settings/avatar", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          Accept: "application/json",
        },
        body: formData,
      });

      if (res.status === 401) {
        toast.error("Session expired. Please login again.");
        navigate("/");
        return;
      }

      if (res.ok) {
        toast.success("Profile photo uploaded successfully!");
        await fetchProfile();
      } else {
        const errorData = await res.json();
        toast.error(errorData.message || "Failed to upload photo");
      }
    } catch (err) {
      console.error(err);
      toast.error("Error uploading photo");
    } finally {
      setSaving(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleRemoveAvatar = async () => {
    try {
      setSaving(true);
      const res = await fetch("http://127.0.0.1:8000/api/settings/avatar", {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          Accept: "application/json",
        },
      });

      if (res.status === 401) {
        toast.error("Session expired. Please login again.");
        navigate("/");
        return;
      }

      if (res.ok) {
        toast.success("Profile photo removed!");
        await fetchProfile();
      } else {
        toast.error("Failed to remove photo");
      }
    } catch (err) {
      console.error(err);
      toast.error("Error removing photo");
    } finally {
      setSaving(false);
    }
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setSaving(true);

    const payload = {
      name: profile.name,
      phone: profile.phone || "",
    };

    if (profile.role === "student" || profile.role === "staff") {
      payload.department = profile.department;
    }

    if (profile.role === "student") {
      payload.programme = profile.programme;
      payload.semester = profile.semester;
      if (!initialStudentIdRef.current) {
        payload.student_id = profile.student_id;
      }
    }

    try {
      const res = await fetch("http://127.0.0.1:8000/api/settings/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          Accept: "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (res.status === 401) {
        toast.error("Session expired. Please login again.");
        navigate("/");
        return;
      }

      if (res.ok) {
        toast.success("Settings saved successfully!");
        await fetchProfile();
      } else {
        const errors = await res.json();
        toast.error(errors.message || "Failed to save settings");
      }
    } catch (err) {
      console.error(err);
      toast.error("Error saving profile changes");
    } finally {
      setSaving(false);
    }
  };

  const formatRoleLabel = (role) => {
    if (role === "admin") return "Administrator";
    if (role === "student") return "Student";
    if (role === "staff") return "Staff";
    return role || "";
  };

  const formatDesignationLabel = (desig) => {
    if (!desig) return "";
    const mapping = {
      accounts_officer: "Accounts Officer",
      finance_officer: "Finance Officer",
      dean_student_welfare: "Dean Student Welfare",
      dean_academic: "Dean Academic",
      warden: "Warden",
    };
    if (mapping[desig]) return mapping[desig];
    return desig.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
  };

  const isStudent = profile?.role === "student";
  const isStaff = profile?.role === "staff";
  const isAdmin = profile?.role === "admin";

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
                    localStorage.removeItem("token");
                    localStorage.removeItem("user");
                    localStorage.removeItem("role");
                    navigate("/");
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
            {location.pathname === "/dashboard/account" && (
              <>
                <h1>Account Settings</h1>

                {loading ? (
                  <p style={{ fontSize: "16px", color: "#6b7a8c" }}>Loading profile settings...</p>
                ) : !profile ? (
                  <p style={{ color: "#ef4444" }}>Failed to load settings data.</p>
                ) : (
                  <form onSubmit={handleSaveProfile}>
                    {/* ROLE BADGES SECTION */}
                    <div className={styles.badgeContainer}>
                      <span className={`${styles.infoBadge} ${styles.roleBadge}`}>
                        Role: {formatRoleLabel(profile.role)}
                      </span>
                      {isStaff && profile.designation && (
                        <span className={styles.infoBadge}>
                          Designation: {formatDesignationLabel(profile.designation)}
                        </span>
                      )}
                    </div>

                    {/* AVATAR UPLOAD SECTION */}
                    <div className={styles.avatarSection}>
                      <img
                        src={profile.avatar || "/images/profile.png"}
                        alt="Profile Preview"
                        className={styles.avatarPreview}
                        onError={(e) => {
                          e.target.src = "/images/profile.png";
                        }}
                      />
                      <div className={styles.avatarBtns}>
                        <button
                          type="button"
                          className={styles.secondary}
                          style={{ margin: 0 }}
                          onClick={() => fileInputRef.current?.click()}
                          disabled={saving}
                        >
                          Change Photo
                        </button>
                        {profile.avatar && (
                          <button
                            type="button"
                            className={styles.dangerBtn}
                            onClick={handleRemoveAvatar}
                            disabled={saving}
                          >
                            Remove Photo
                          </button>
                        )}
                        <input
                          type="file"
                          ref={fileInputRef}
                          style={{ display: "none" }}
                          accept="image/png, image/jpeg, image/jpg, image/webp"
                          onChange={handleAvatarUpload}
                        />
                      </div>
                    </div>

                    {/* ACCOUNT FORM FIELDS */}
                    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                      <div>
                        <label>Full Name</label>
                        <input
                          type="text"
                          value={profile.name || ""}
                          placeholder="Enter your full name"
                          onChange={(e) => handleInputChange("name", e.target.value)}
                          required
                          disabled={saving}
                        />
                      </div>

                      <div>
                        <label>Email Address</label>
                        <input
                          type="email"
                          value={profile.email || ""}
                          className={styles.readonlyInput}
                          style={{ backgroundColor: "#f1f5f9", cursor: "not-allowed" }}
                          readOnly
                        />
                      </div>

                      <div>
                        <label>Phone Number</label>
                        <input
                          type="tel"
                          value={profile.phone || ""}
                          placeholder="Enter your phone number (e.g. +91 98765 43210)"
                          onChange={(e) => handleInputChange("phone", e.target.value)}
                          disabled={saving}
                        />
                      </div>

                      {/* CONDITIONAL FIELD: Student ID */}
                      {isStudent && (
                        <div>
                          <label>Student ID</label>
                          {initialStudentIdRef.current ? (
                            <input
                              type="text"
                              value={profile.student_id || ""}
                              className={styles.readonlyInput}
                              style={{ backgroundColor: "#f1f5f9", cursor: "not-allowed" }}
                              readOnly
                            />
                          ) : (
                            <input
                              type="text"
                              value={profile.student_id || ""}
                              placeholder="Enter your Student ID (cannot be changed once saved)"
                              onChange={(e) => handleInputChange("student_id", e.target.value)}
                              required
                              disabled={saving}
                            />
                          )}
                        </div>
                      )}

                      {/* CONDITIONAL FIELD: Staff Designation */}
                      {isStaff && (
                        <div>
                          <label>Designation</label>
                          <input
                            type="text"
                            value={formatDesignationLabel(profile.designation) || ""}
                            className={styles.readonlyInput}
                            style={{ backgroundColor: "#f1f5f9", cursor: "not-allowed" }}
                            readOnly
                          />
                        </div>
                      )}

                      {/* CONDITIONAL FIELD: Department */}
                      {(isStudent || isStaff) && (
                        <div>
                          <label>Department</label>
                          <select
                            value={profile.department || ""}
                            onChange={(e) => handleInputChange("department", e.target.value)}
                            disabled={saving}
                            required
                          >
                            <option value="" disabled hidden>Select your department</option>
                            <option value="Computer Science">Computer Science</option>
                            <option value="Electrical Engineering">Electrical Engineering</option>
                            <option value="Mechanical Engineering">Mechanical Engineering</option>
                            <option value="Civil Engineering">Civil Engineering</option>
                            <option value="Electronics & Communication">Electronics & Communication</option>
                            <option value="Instrumentation Engineering">Instrumentation Engineering</option>
                          </select>
                        </div>
                      )}

                      {/* CONDITIONAL FIELD: Academic fields for Student */}
                      {isStudent && (
                        <div className={styles.formGrid}>
                          <div>
                            <label>Programme</label>
                            <select
                              value={profile.programme || ""}
                              onChange={(e) => handleInputChange("programme", e.target.value)}
                              disabled={saving}
                              required
                            >
                              <option value="" disabled hidden>Select programme</option>
                              <option value="B.Tech">B.Tech</option>
                              <option value="M.Tech">M.Tech</option>
                              <option value="MBA">MBA</option>
                              <option value="M.Sc">M.Sc</option>
                              <option value="Ph.D">Ph.D</option>
                            </select>
                          </div>

                          <div>
                            <label>Semester</label>
                            <select
                              value={profile.semester || ""}
                              onChange={(e) => handleInputChange("semester", e.target.value)}
                              disabled={saving}
                              required
                            >
                              <option value="" disabled hidden>Select semester</option>
                              <option value="1st Semester">1st Semester</option>
                              <option value="2nd Semester">2nd Semester</option>
                              <option value="3rd Semester">3rd Semester</option>
                              <option value="4th Semester">4th Semester</option>
                              <option value="5th Semester">5th Semester</option>
                              <option value="6th Semester">6th Semester</option>
                              <option value="7th Semester">7th Semester</option>
                              <option value="8th Semester">8th Semester</option>
                            </select>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className={styles.actions}>
                      <button
                        type="submit"
                        className={styles.primary}
                        disabled={saving}
                      >
                        {saving ? "Saving Changes..." : "Save Changes"}
                      </button>
                    </div>
                  </form>
                )}
              </>
            )}

            <Outlet context={{ profile, fetchProfile }} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Account;
