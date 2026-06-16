import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Submissions.module.css";

const Submissions = () => {
  const navigate = useNavigate();

  // ✅ STATE (instead of static array)
  const [submissions, setSubmissions] = useState([]);

  // ✅ UPDATE STATUS AFTER OTP FLOW
  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/submissions?role=warden") // 🔥 DYNAMIC ID LATER
      .then((response) => response.json())
      .then((data) => {
        setSubmissions(data);
      })
      .catch((error) => console.error("Error fetching submissions:", error));
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
                  <strong>{item.form?.name}</strong>
                  <small>SUB-{item.id}</small>
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
