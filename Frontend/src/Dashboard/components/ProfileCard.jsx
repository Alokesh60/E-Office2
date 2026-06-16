import React from 'react';
import styles from "./ProfileCard.module.css";

const ProfileCard = () => {
  return (
    <section className={styles.profile_card}>
                    <div className={styles.profile_image_container}>
                        <img src="/images/profile.png" alt="Tony Stark" class={styles.profile_avatar}/>
                    </div>
                    <div className={styles.profile_info}>
                        <h2 className={styles.profile_name}>Tony Stark</h2>
                        <p className={styles.profile_id}>ID: 24XX100</p>
                        <button className={styles.edit_profile_btn}>Edit Profile</button>
                    </div>
                </section>
  );
};

export default ProfileCard;

