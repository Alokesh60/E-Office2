import React from 'react';
import { useNavigate } from "react-router-dom";
import styles from "./QuickAccess.module.css";

const QuickAccess = () => {
  const navigate = useNavigate();

  return (
    <section className={styles.quick_access_card}>
      <h2 className={styles.quick_access_title}>Quick Access</h2>
      <div className={styles.quick_access_items}>
        <div
          className={styles.quick_access_item}
          style={{ cursor: "pointer" }}
          onClick={() => navigate("/dashboard/files")}
        >
          <img src="/images/download-icon.png" alt="Download" className={styles.quick_access_icon} />
          <span className={styles.quick_access_text}>Download</span>
        </div>
        <div
          className={styles.quick_access_item}
          style={{ cursor: "pointer" }}
          onClick={() => navigate("/dashboard/applications")}
        >
          <img src="/images/apply-icon.png" alt="New Application" className={styles.quick_access_icon} />
          <span className={styles.quick_access_text}>Applications</span>
        </div>
        <div
          className={styles.quick_access_item}
          style={{ cursor: "pointer" }}
          onClick={() => navigate("/dashboard/student-submissions")}
        >
          <img src="/images/apply-icon.png" alt="New Application" className={styles.quick_access_icon} />
          <span className={styles.quick_access_text_large}>Progress</span>
        </div>
      </div>
    </section>
  );
};

export default QuickAccess;
