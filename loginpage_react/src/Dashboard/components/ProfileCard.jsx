import React from "react";
import styles from "./ProfileCard.module.css";

const ProfileCard = ({ role = "student" }) => {
  const isFaculty = role === "faculty";

  return (
    <section className={styles.profile_card}>
      <div className={styles.profile_image_container}>
        <img
          src="/images/profile.png"
          alt="Tony Stark"
          className={styles.profile_avatar}
        />
      </div>
      <div className={styles.profile_info}>
        <h2 className={styles.profile_name}>Tony Stark</h2>
        {!isFaculty && <p className={styles.profile_id}>ID: 24XX100</p>}
        {isFaculty && (
          <p className={styles.profile_id}>Faculty · Computer Science</p>
        )}
        <button className={styles.edit_profile_btn}>Edit Profile</button>
      </div>
    </section>
  );
};

export default ProfileCard;
