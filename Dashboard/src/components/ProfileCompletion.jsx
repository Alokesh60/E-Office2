import React from 'react';

const ProfileCompletion = () => {
  return (
    <section class="progress-card">
                    <h3 class="progress-title">Profile Completion</h3>
                    <div class="progress-circle-container">
                        <svg class="progress-circle" width="100" height="100">
                            <circle class="progress-bg" cx="50" cy="50" r="45"></circle>
                            <circle class="progress-fill" cx="50" cy="50" r="45"></circle>
                        </svg>
                        <span class="progress-percentage">75%</span>
                    </div>
                    <p class="missing-info">Missing: Address, Email...</p>
                    <button class="complete-now-btn">Complete Now</button>
                </section>
  );
};

export default ProfileCompletion;

