import React from 'react';
import styles from "./RecentActivities.module.css";

const RecentActivities = ({ activities }) => {
  return (
    <section className={styles.recent_activities_card}>
      <h2 className={styles.activities_title}>Recent Activities</h2>
      <div className={styles.activities_list}>
        {activities && activities.length > 0 ? (
          activities.map((act) => (
            <div key={act.id} className={styles.activity_item}>
              <div className={styles.activity_icon}>
                {act.status === 'approved' && <i className="ri-checkbox-circle-fill" style={{ color: '#298DD4' }} />}
                {act.status === 'rejected' && <i className="ri-close-circle-fill" style={{ color: '#E23648' }} />}
                {act.status === 'sent_back' && <i className="ri-arrow-go-back-fill" style={{ color: '#E5B526' }} />}
                {act.status === 'submitted' && <i className="ri-send-plane-fill" style={{ color: '#64748b' }} />}
                {act.status === 'forwarded' && <i className="ri-arrow-right-circle-fill" style={{ color: '#64748b' }} />}
              </div>
              <div className={styles.activity_details}>
                <span className={styles.activity_action}>{act.title}</span>
                <p className={styles.activity_desc}>{act.description}</p>
              </div>
              <span className={styles.activity_time}>{act.time_formatted}</span>
            </div>
          ))
        ) : (
          <p className={styles.no_activities}>No recent activities</p>
        )}
      </div>
    </section>
  );
};

export default RecentActivities;
