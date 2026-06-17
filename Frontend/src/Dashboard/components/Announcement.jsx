import React from 'react';
import styles from "./Announcement.module.css";

const Announcement = ({ announcements }) => {
  return (
    <section className={styles.announcement_card}>
      <div className={styles.announcement_wrapper}>
        <h2 className={styles.announcement_title}>Announcement</h2>
        <div className={styles.announcement_list}>
          {announcements && announcements.length > 0 ? (
            announcements.map((item) => (
              <div key={item.id} className={styles.announcement_item}>
                <h4 className={styles.item_title}>{item.title}</h4>
                <p className={styles.item_body}>{item.body}</p>
                <span className={styles.item_date}>
                  {new Date(item.created_at).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </span>
              </div>
            ))
          ) : (
            <p className={styles.no_announcements}>No announcements yet</p>
          )}
        </div>
      </div>
    </section>
  );
};

export default Announcement;
