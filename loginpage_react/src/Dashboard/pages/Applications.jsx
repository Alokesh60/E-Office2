import React, { useState, useEffect } from "react";
import styles from "./Application.module.css";
import { useNavigate } from "react-router-dom";

const Application = () => {
  const [forms, setForms] = useState([]);
  const navigate = useNavigate();

  const dummyForms = [
    { id: "dummy-1", name: "Bonafide Certificate", description: "Apply for bonafide certificate for academic purposes." },
    { id: "dummy-2", name: "Transcript Request", description: "Request official academic transcripts." },
    { id: "dummy-3", name: "Hostel Clearance", description: "Apply for hostel clearance before graduation." },
    { id: "dummy-4", name: "Leave Application", description: "Submit leave request to faculty." },
    { id: "dummy-5", name: "Scholarship Form", description: "Apply for institute scholarships." },
    { id: "dummy-6", name: "Scholarship Form", description: "Apply for institute scholarships." },
    { id: "dummy-6", name: "Scholarship Form", description: "Apply for institute scholarships." },
    { id: "dummy-6", name: "Scholarship Form", description: "Apply for institute scholarships." },
    { id: "dummy-6", name: "Scholarship Form", description: "Apply for institute scholarships." },
    { id: "dummy-6", name: "Scholarship Form", description: "Apply for institute scholarships." },

  ];

  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/forms")
      .then((res) => res.json())
      .then((data) => {
        if (data && data.length > 0) setForms(data);
        else setForms(dummyForms);
      })
      .catch(() => setForms(dummyForms));
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
            onClick={() => navigate("/student-submissions")}
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
                onClick={() => navigate(`/applications/${form.id}`)}
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

export default Application;