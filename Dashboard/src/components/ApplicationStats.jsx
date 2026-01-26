import React from 'react';

const ApplicationStats = () => {
  return (
    <section className="statistics-card">
      <h3 className="statistics-title">Application Statistics</h3>
      <div className="chart-container">
        <div className="pie-chart">
          <div className="pie-chart-bg" style={{ background: 'conic-gradient(#298DD4 0deg 162deg, #E5B526 162deg 270deg, #E23648 270deg 342deg, #298DD4 342deg 360deg)' }}></div>
          <div className="pie-center-circle"></div>
          <div className="pie-center-text">Total: 12</div>
        </div>
      </div>
      <div className="statistics-legend">
        <div className="legend-item">
          <div className="legend-dot pending"></div>
          <span className="legend-label">Pending</span>
          <span className="legend-percentage">30%</span>
        </div>
        <div className="legend-divider"></div>
        <div className="legend-item">
          <div className="legend-dot accepted"></div>
          <span className="legend-label">Accepted</span>
          <span className="legend-percentage">45%</span>
        </div>
        <div className="legend-divider"></div>
        <div className="legend-item">
          <div className="legend-dot rejected"></div>
          <span className="legend-label">Rejected</span>
          <span className="legend-percentage">20%</span>
        </div>
      </div>
    </section>
  );
};

export default ApplicationStats;

