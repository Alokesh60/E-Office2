import React from 'react';
import styles from "./ApplicationStats.module.css";

const ApplicationStats = () => {
  return (
    <section className={styles.statistics_card}>
      <h3 className={styles.statistics_title}>Application Statistics</h3>
      <div className={styles.chart_container}>
        <div className={styles.pie_chart}>
          <div className={styles.pie_chart_bg} style={{ background: 'conic-gradient(#298DD4 0deg 162deg, #E5B526 162deg 270deg, #E23648 270deg 342deg, #298DD4 342deg 360deg)' }}></div>
          <div className={styles.pie_center_circle}></div>
          <div className={styles.pie_center_text}>Total: 12</div>
        </div>
      </div>
      <div className={styles.statistics_legend}>
        <div className={styles.legend_item}>
          <div className={`${styles.legend_dot} ${styles.pending}`}></div>
          <span className={styles.legend_label}>Pending</span>
          <span className={styles.legend_percentage}>30%</span>
        </div>
        <div className={styles.legend_divider}></div>
        <div className={styles.legend_item}>
          <div className={`${styles.legend_dot} ${styles.accepted}`}></div>
          <span className={styles.legend_label}>Accepted</span>
          <span className={styles.legend_percentage}>45%</span>
        </div>
        <div className={styles.legend_divider}></div>
        <div className={styles.legend_item}>
          <div className={`${styles.legend_dot} ${styles.rejected}`}></div>
          <span className={styles.legend_label}>Rejected</span>
          <span className={styles.legend_percentage}>20%</span>
        </div>
      </div>
    </section>
  );
};

export default ApplicationStats;

