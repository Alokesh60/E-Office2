import React from 'react';

const QuickAccess = () => {
  return (
    <section className="quick-access-card">
      <h2 className="quick-access-title">Quick Access</h2>
      <div className="quick-access-items">
        <div className="quick-access-item">
          <img src="/images/download-icon.png" alt="Download" className="quick-access-icon" />
          <span className="quick-access-text">Download</span>
        </div>
        <div className="quick-access-item">
          <img src="/images/apply-icon.png" alt="New Application" className="quick-access-icon" />
          <span className="quick-access-text">Applications</span>
        </div>
        <div className="quick-access-item">
          <img src="/images/apply-icon.png" alt="New Application" className="quick-access-icon" />
          <span className="quick-access-text-large">Progress</span>
        </div>
      </div>
    </section>
  );
};

export default QuickAccess;

