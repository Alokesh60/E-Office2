import React from 'react';
import styles from "./ApplicationStats.module.css";

const ApplicationStats = ({ stats }) => {
  const total = stats?.total || 0;
  const pending = stats?.pending || 0;
  const approved = stats?.approved || 0;
  const rejected = stats?.rejected || 0;

  // Degrees for the conic-gradient circle
  // Accepted (#298DD4) starts at 0deg
  // Pending (#E5B526) starts after Accepted
  // Rejected (#E23648) starts after Pending
  const accDeg = Math.round(approved * 3.6);
  const penDeg = Math.round((approved + pending) * 3.6);
  const rejDeg = Math.round((approved + pending + rejected) * 3.6);

  // Fallback gradient if there are no applications yet
  const backgroundStyle = total > 0
    ? `conic-gradient(#298DD4 0deg ${accDeg}deg, #E5B526 ${accDeg}deg ${penDeg}deg, #E23648 ${penDeg}deg ${rejDeg}deg, #298DD4 ${rejDeg}deg 360deg)`
    : `conic-gradient(#cbd5e1 0deg 360deg)`; // gray circle if total is 0

  return (
    <section className={styles.statistics_card}>
      <h3 className={styles.statistics_title}>Application Statistics</h3>
      <div className={styles.chart_container}>
        <div className={styles.pie_chart}>
          <div
            className={styles.pie_chart_bg}
            style={{ background: backgroundStyle }}
          />
          <div className={styles.pie_center_circle}></div>
          <div className={styles.pie_center_text}>Total: {total}</div>
        </div>
      </div>
      <div className={styles.statistics_legend}>
        <div className={styles.legend_item}>
          <div className={`${styles.legend_dot} ${styles.pending}`}></div>
          <span className={styles.legend_label}>Pending</span>
          <span className={styles.legend_percentage}>{pending}%</span>
        </div>
        <div className={styles.legend_divider}></div>
        <div className={styles.legend_item}>
          <div className={`${styles.legend_dot} ${styles.accepted}`}></div>
          <span className={styles.legend_label}>Accepted</span>
          <span className={styles.legend_percentage}>{approved}%</span>
        </div>
        <div className={styles.legend_divider}></div>
        <div className={styles.legend_item}>
          <div className={`${styles.legend_dot} ${styles.rejected}`}></div>
          <span className={styles.legend_label}>Rejected</span>
          <span className={styles.legend_percentage}>{rejected}%</span>
        </div>
      </div>
    </section>
  );
};

export default ApplicationStats;
