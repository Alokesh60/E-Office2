import React from 'react';

const ProfileCard = () => {
  return (
    <section class="profile-card">
                    <div class="profile-image-container">
                        <img src="/images/profile.png" alt="Tony Stark" class="profile-avatar"/>
                    </div>
                    <div class="profile-info">
                        <h2 class="profile-name">Tony Stark</h2>
                        <p class="profile-id">ID: 24XX100</p>
                        <button class="edit-profile-btn">Edit Profile</button>
                    </div>
                </section>
  );
};

export default ProfileCard;

