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
    },
    {
      id: "SUB-002",
      title: "Transcript Request",
      date: "25 March 2026",
      status: "Approved",
    },
    {
      id: "SUB-003",
      title: "Hostel Clearance",
      date: "24 March 2026",
      status: "Rejected",
    },
    {
      id: "SUB-004",
      title: "Leave Application",
      date: "23 March 2026",
      status: "Pending",
    },
  ];

  const toggleRow = (id) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <div className={styles.pageWrapper}>
      <div className={styles.container}>
        <h2 className={styles.title}>My Submissions</h2>

        <div className={styles.table}>
          {/* HEADER */}
          <div className={styles.headerRow}>
            <span>Application</span>
            <span>Date</span>
            <span>Status</span>
          </div>

          {/* BODY */}
          <div className={styles.tableBody}>
            {submissions.map((item) => (
              <React.Fragment key={item.id}>
                {/* MAIN ROW */}
                <div className={styles.row} onClick={() => toggleRow(item.id)}>
                  <div>
                    <strong>{item.title}</strong>
                    <small>{item.id}</small>
                  </div>

                  <span>{item.date}</span>

                  <span
                    className={`${styles.status} ${styles[item.status.toLowerCase()]}`}
                  >
                    {item.status}
                  </span>

                  <span className={styles.expandIcon}>
                    {openId === item.id ? "−" : "+"}
                  </span>
                </div>

                {/* DROPDOWN */}
                {openId === item.id && (
                  <div className={styles.dropdown}>
                    <div className={styles.workflow}>
                      <div className={`${styles.step} ${styles.completed}`}>
                        ✔ HOD Approval
                      </div>

                      <div className={`${styles.step} ${styles.current}`}>
                        ● Academic Section (Current)
                      </div>

                      <div className={styles.step}>○ Dean Office</div>

                      <div className={styles.step}>○ Completed</div>
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
