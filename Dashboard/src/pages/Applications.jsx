import React, { useState, useEffect } from "react";
import styles from "./Application.module.css";
import { useNavigate } from "react-router-dom";

const Application = () => {
  const [forms, setForms] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/forms")
      .then((res) => res.json())
      .then((data) => {
        setForms(data);
      })
      .catch((err) => console.error(err));
  }, []);

  const filtered = forms;

  return (
    <div className={styles.wrapper}>
      {/* Main card panel */}
      <div className={styles.panel}>
        <h2 className={styles.heading}>Application Forms</h2>
        <div className={styles.grid}>
          {filtered.map((form) => (
            <div key={form.id} className={styles.card}>
              <div className={styles.cardTop}>
                <div
                  className={styles.iconBox}
                  style={{ backgroundColor: "var(--first-color)" }}
                >
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
          {filtered.length === 0 && (
            <p className={styles.noResult}>No forms match your search.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Application;
