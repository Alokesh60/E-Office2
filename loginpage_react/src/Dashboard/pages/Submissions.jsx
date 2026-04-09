import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Submissions.module.css";

const Submissions = () => {
  const navigate = useNavigate();

  // ✅ STATE (instead of static array)
  const [submissions, setSubmissions] = useState([
    {
      id: "SUB-2026-0342",
      title: "Bonafide Certificate Request",
      student: "Rahul Verma",
      date: "28 March 2026",
      status: "Pending",
    },
    {
      id: "SUB-2026-0343",
      title: "Transcript Request",
      student: "Aman Das",
      date: "27 March 2026",
      status: "Approved",
    },
    {
      id: "SUB-2026-0344",
      title: "Hostel Clearance",
      student: "Priya Sharma",
      date: "26 March 2026",
      status: "Rejected",
    },
    {
      id: "SUB-2026-0345",
      title: "Bonafide Certificate Request",
      student: "Rahul Verma",
      date: "25 March 2026",
      status: "Pending",
    },
    {
      id: "SUB-2026-0346",
      title: "Transcript Request",
      student: "Aman Das",
      date: "24 March 2026",
      status: "Approved",
    },
    {
      id: "SUB-2026-0347",
      title: "Hostel Clearance",
      student: "Priya Sharma",
      date: "23 March 2026",
      status: "Rejected",
    },
  ]);

  // ✅ UPDATE STATUS AFTER OTP FLOW
  useEffect(() => {
    const updatedId = localStorage.getItem("updatedSubmission");

    if (updatedId) {
      setSubmissions((prev) =>
        prev.map((item) =>
          item.id === updatedId
            ? { ...item, status: "Approved" }
            : item
        )
      );

      localStorage.removeItem("updatedSubmission");
    }
  }, []);

  return (
    <div className={styles.pageWrapper}>
      <div className={styles.container}>
        
        <h2 className={styles.title}>Submissions</h2>

        <div className={styles.table}>

          {/* HEADER */}
          <div className={styles.headerRow}>
            <span>Application</span>
            <span>Student</span>
            <span>Date</span>
            <span>Status</span>
          </div>

          {/* BODY (SCROLLABLE) */}
          <div className={styles.tableBody}>
            {submissions.map((item) => (
              <div
                key={item.id}
                className={styles.row}
                onClick={() => navigate(`/applications/${item.id}`)}
              >
                <div className={styles.applicationCell}>
                  <strong>{item.title}</strong>
                  <small>{item.id}</small>
                </div>

                <span className={styles.text}>{item.student}</span>
                <span className={styles.text}>{item.date}</span>

                <span
                  className={`${styles.status} ${
                    styles[item.status.toLowerCase()]
                  }`}
                >
                  {item.status}
                </span>
              </div>
            ))}
          </div>

        </div>
      </div>
    </div>
  );
};

export default Submissions;