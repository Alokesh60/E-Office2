import React, { useState, useEffect } from "react";
import styles from "./Application.module.css";
import { useNavigate } from "react-router-dom";

const ApplicationSubmitted = () => {
  const [forms, setForms] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/forms")
      .then((res) => res.json())
      .then((data) => {
        if (data) setForms(data);
      })
      .catch((err) => console.error("Error fetching forms: ", err));
  }, []);

  return (
    <div className={styles.wrapper}>
      {/* ✅ SINGLE CONTAINER */}
      <div className={styles.panel}>
        {/* HEADER INSIDE PANEL */}
        <div className={styles.topBar}>
          <h2 className={styles.heading}>Application Forms</h2>

          <button
            className={styles.submissionBtn}
            onClick={() => navigate("/dashboard/student-submissions")}
          >
            📄 View My Submissions
          </button>
        </div>

        {/* GRID */}
        <div className={styles.grid}>
          {forms.map((form) => (
            <div key={form.id} className={styles.card}>
              <div className={styles.cardTop}>
                <div className={styles.iconBox}>
                  <i className="ri-file-line"></i>
                </div>

                <div className={styles.cardText}>
                  <h3>{form.name}</h3>
                  <p>{form.description}</p>
                </div>
              </div>

              <button
                className={styles.fillBtn}
                onClick={() => navigate(`/dashboard/applications/${form.id}`)}
              >
                <i className="ri-edit-line"></i> Fill Form
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ApplicationSubmitted;
