import React, { useState, useEffect } from "react";
import styles from "./StudentSubmissions.module.css";

const StudentSubmissions = () => {
  const [submissions, setSubmissions] = useState([]);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/student/submissions")
      .then((res) => res.json())
      .then((data) => {
        console.log("Api data : ", data);

        if (Array.isArray(data)) {
          setSubmissions(data);
        } else if (data) {
          setSubmissions([data]);
        } else {
          setSubmissions([]);
        }
      })
      .catch((err) => {
        console.error(err);
        setSubmissions([]);
      });
  }, []);

  console.log("Submissions: ", submissions);

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
            {!submissions || submissions.length === 0 ? (
              <div className={styles.emptyState}>
                <p>No submissions yet</p>
              </div>
            ) : (
              submissions.map((item) => (
                <React.Fragment key={item.id}>
                  {/* MAIN ROW */}
                  <div className={styles.row}>
                    <div>
                      <strong>{item.form?.name}</strong>
                      <small>SUB-{item.id}</small>
                    </div>

                    <span>
                      {new Date(item.created_at).toLocaleDateString()}
                    </span>

                    <span className={`${styles.status} ${styles[item.status]}`}>
                      {item.status}
                    </span>
                  </div>
                </React.Fragment>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentSubmissions;
