import React, { useState } from "react";
import styles from "./StudentSubmissions.module.css";

const StudentSubmissions = () => {
  const [openId, setOpenId] = useState(null);

  const submissions = [
    {
      id: "SUB-001",
      title: "Bonafide Certificate",
      date: "28 March 2026",
      status: "Pending",
      icon: "ri-file-certificate-line",
      steps: [
        { label: "HOD Approval", status: "completed" },
        { label: "Academic Section", status: "current" },
        { label: "Dean Office", status: "pending" },
        { label: "Completed", status: "pending" },
      ],
    },
    {
      id: "SUB-002",
      title: "Transcript Request",
      date: "25 March 2026",
      status: "Approved",
      icon: "ri-file-text-line",
      steps: [
        { label: "HOD Approval", status: "completed" },
        { label: "Academic Section", status: "completed" },
        { label: "Dean Office", status: "completed" },
        { label: "Completed", status: "completed" },
      ],
    },
    {
      id: "SUB-003",
      title: "Hostel Clearance",
      date: "24 March 2026",
      status: "Rejected",
      icon: "ri-building-line",
      steps: [
        { label: "HOD Approval", status: "completed" },
        { label: "Academic Section", status: "rejected" },
        { label: "Dean Office", status: "pending" },
        { label: "Completed", status: "pending" },
      ],
    },
    {
      id: "SUB-004",
      title: "Leave Application",
      date: "23 March 2026",
      status: "Pending",
      icon: "ri-calendar-event-line",
      steps: [
        { label: "HOD Approval", status: "completed" },
        { label: "Academic Section", status: "current" },
        { label: "Dean Office", status: "pending" },
        { label: "Completed", status: "pending" },
      ],
    },
  ];

  const toggleRow = (id) => {
    setOpenId(openId === id ? null : id);
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "Pending":
        return "ri-time-line";
      case "Approved":
        return "ri-check-circle-line";
      case "Rejected":
        return "ri-close-circle-line";
      default:
        return "ri-question-line";
    }
  };

  return (
    <div className={styles.pageWrapper}>
      <div className={styles.container}>
        <div className={styles.header}>
          <div className={styles.titleSection}>
            <i className="ri-file-list-3-line"></i>
            <h2 className={styles.title}>My Submissions</h2>
          </div>
          <div className={styles.stats}>
            <div className={styles.stat}>
              <span className={styles.statNumber}>{submissions.length}</span>
              <span className={styles.statLabel}>Total</span>
            </div>
            <div className={styles.stat}>
              <span className={styles.statNumber}>
                {submissions.filter((s) => s.status === "Pending").length}
              </span>
              <span className={styles.statLabel}>Pending</span>
            </div>
            <div className={styles.stat}>
              <span className={styles.statNumber}>
                {submissions.filter((s) => s.status === "Approved").length}
              </span>
              <span className={styles.statLabel}>Approved</span>
            </div>
          </div>
        </div>

        <div className={styles.table}>
          {/* HEADER */}
          <div className={styles.headerRow}>
            <span>Application</span>
            <span>Date</span>
            <span>Status</span>
            <span></span>
          </div>

          {/* BODY */}
          <div className={styles.tableBody}>
            {submissions.map((item) => (
              <React.Fragment key={item.id}>
                {/* MAIN ROW */}
                <div className={styles.row} onClick={() => toggleRow(item.id)}>
                  <div className={styles.appInfo}>
                    <div className={styles.appIcon}>
                      <i className={item.icon}></i>
                    </div>
                    <div>
                      <strong className={styles.appTitle}>{item.title}</strong>
                      <small className={styles.appId}>{item.id}</small>
                    </div>
                  </div>

                  <span className={styles.date}>{item.date}</span>

                  <div
                    className={`${styles.status} ${styles[item.status.toLowerCase()]}`}
                  >
                    <i className={getStatusIcon(item.status)}></i>
                    <span>{item.status}</span>
                  </div>

                  <div className={styles.expandIcon}>
                    <i
                      className={`ri-arrow-down-s-line ${openId === item.id ? styles.rotated : ""}`}
                    ></i>
                  </div>
                </div>

                {/* DROPDOWN */}
                {openId === item.id && (
                  <div className={styles.dropdown}>
                    <div className={styles.workflow}>
                      <h4 className={styles.workflowTitle}>
                        Application Progress
                      </h4>
                      <div className={styles.progressBar}>
                        {item.steps.map((step, index) => (
                          <div key={index} className={styles.progressStep}>
                            <div
                              className={`${styles.stepCircle} ${styles[step.status]}`}
                            >
                              {step.status === "completed" && (
                                <i className="ri-check-line"></i>
                              )}
                              {step.status === "current" && (
                                <i className="ri-radio-button-line"></i>
                              )}
                              {step.status === "rejected" && (
                                <i className="ri-close-line"></i>
                              )}
                              {step.status === "pending" && (
                                <span className={styles.stepNumber}>
                                  {index + 1}
                                </span>
                              )}
                            </div>
                            <span
                              className={`${styles.stepLabel} ${styles[step.status]}`}
                            >
                              {step.label}
                            </span>
                            {index < item.steps.length - 1 && (
                              <div
                                className={`${styles.connector} ${styles[step.status]}`}
                              ></div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentSubmissions;
