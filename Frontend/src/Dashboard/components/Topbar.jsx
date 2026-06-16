import React from 'react';
import styles from "./Topbar.module.css";

const Topbar = () => {
  return (
    <header className={styles.top_header}>
        <div className={styles.header_left}>
                <img src="/images/logo.png" alt="Logo" className={styles.College}/>
                <div className={styles.college_name}>
                    <h1>
                        <span className={`${styles.changetext} ${styles.activetext}`}>राष्ट्रीय प्रौद्योगिकी संस्थान सिलचर</span>
    
                    </h1>
                    <p>NATIONAL INSTITUTE OF TECHNOLOGY SILCHAR</p>
                    <small>An Institute of National Importance</small>
                    </div>
                </div>

                <div className={styles.search_container}>
                    <div className={styles.search_bar}>
                        <img src="/images/search.png" alt="Search" className={styles.search_icon_img}/>
                        <input type="text" placeholder="Search applications....." className={styles.search_input}/>
                        <button className={styles.search_button}>
                            <i className="fas fa-search"></i>
                        </button>
                    </div>
                </div>
                <div className={styles.header_icons}>
                    <div className={styles.notification_bell}>
                        <img src="/images/notification-icon.png" alt="Notifications"/>
                    </div>
                    <div className={styles.profile_circle}>
                        <img src="/images/profile.png" alt="Profile"/>
                    </div>
                </div>
            </header>
  );
};

export default Topbar;

