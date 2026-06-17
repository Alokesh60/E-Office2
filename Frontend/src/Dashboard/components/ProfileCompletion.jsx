import React from 'react';
import { useNavigate } from "react-router-dom";
import styles from "./ProfileCompletion.module.css";

const ProfileCompletion = ({ profile }) => {
  const navigate = useNavigate();

  const fields = ["avatar", "name", "email", "student_id", "department", "programme", "semester"];
  const filledCount = fields.filter(
    (f) => profile && profile[f] !== null && profile[f] !== undefined && profile[f] !== ""
  ).length;

  const percentage = profile ? Math.round((filledCount / fields.length) * 100) : 0;

  // Map fields to human readable labels
  const fieldLabels = {
    avatar: "Photo",
    name: "Name",
    email: "Email",
    student_id: "Student ID",
    department: "Department",
    programme: "Programme",
    semester: "Semester",
  };

  const missingFields = fields
    .filter((f) => !profile || profile[f] === null || profile[f] === undefined || profile[f] === "")
    .map((f) => fieldLabels[f]);

  const missingText = missingFields.length > 0
    ? `Missing: ${missingFields.join(", ")}`
    : "Profile fully complete!";

  // Calculate SVG stroke offset (circumference of r=45 is ~283)
  const offset = 283 - (283 * percentage) / 100;

  return (
    <section className={styles.progress_card}>
      <div className={styles.progress_circle_container}>
        <svg className={styles.progress_circle} width="100" height="100">
          <circle className={styles.progress_bg} cx="50" cy="50" r="45" />
          <circle
            className={styles.progress_fill}
            cx="50"
            cy="50"
            r="45"
            style={{ strokeDashoffset: offset }}
          />
        </svg>
        <span className={styles.progress_percentage}>{percentage}%</span>
      </div>

      <div className={styles.progress_content}>
        <h3 className={styles.progress_title}>Profile Completion</h3>
        <p className={styles.missing_info}>{missingText}</p>
      </div>

      <button
        className={styles.complete_now_btn}
        onClick={() => navigate("/dashboard/account")}
      >
        Complete Now
      </button>
    </section>
  );
};

export default ProfileCompletion;