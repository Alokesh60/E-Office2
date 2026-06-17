import React from 'react';
import { useNavigate } from "react-router-dom";
import styles from "./ProfileCard.module.css";

const ProfileCard = ({ profile }) => {
  const navigate = useNavigate();

  return (
    <section className={styles.profile_card}>
      <div className={styles.profile_image_container}>
        <img
          src={profile?.avatar || "/images/profile.png"}
          alt={profile?.name || "User Avatar"}
          className={styles.profile_avatar}
          onError={(e) => {
            e.target.src = "/images/profile.png";
          }}
        />
      </div>
      <div className={styles.profile_info}>
        <h2 className={styles.profile_name}>{profile?.name || "N/A"}</h2>
        <p className={styles.profile_id}>ID: {profile?.student_id || "N/A"}</p>
        <button
          className={styles.edit_profile_btn}
          onClick={() => navigate("/dashboard/account")}
        >
          Edit Profile
        </button>
      </div>
    </section>
  );
};

export default ProfileCard;
