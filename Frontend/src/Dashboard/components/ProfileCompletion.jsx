import React from 'react';
import styles from "./ProfileCompletion.module.css";

const ProfileCompletion = () => {
  return (
    <section className={styles.progress_card}>

      <div className={styles.progress_circle_container}>
        <svg className={styles.progress_circle} width="100" height="100">
          <circle className={styles.progress_bg} cx="50" cy="50" r="45" />
          <circle className={styles.progress_fill} cx="50" cy="50" r="45" />
        </svg>
        <span className={styles.progress_percentage}>75%</span>
      </div>

      <div className={styles.progress_content}>
        <h3 className={styles.progress_title}>Profile Completion</h3>
        <p className={styles.missing_info}>Missing: Address, Email...</p>
      </div>

      <button className={styles.complete_now_btn}>Complete Now</button>

    </section>
  );
};

export default ProfileCompletion;