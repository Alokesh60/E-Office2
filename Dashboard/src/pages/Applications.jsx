import React, { useState } from "react";
import styles from "./Application.module.css";

const forms = [
  {
    id: 1,
    title: "Bonafide Certificate",
    description: "Application for bonafide certificate.",
    icon: "ri-file-user-line",
    color: "var(--first-color)",
  },
  {
    id: 2,
    title: "Transcript Request",
    description: "Request for official transcript of records.",
    icon: "ri-file-search-line",
    color: "var(--first-color)",
  },
  {
    id: 3,
    title: "Leave Application",
    description: "Application for leave of absence.",
    icon: "ri-time-line",
    color: "var(--first-color)",
  },
  {
    id: 4,
    title: "NOC Request",
    description: "Apply for No Objection Certificate (NOC).",
    icon: "ri-chat-check-line",
    color: "var(--first-color)",
  },
  {
    id: 5,
    title: "Fee Concession",
    description: "Request for fee concession and scholarships.",
    icon: "ri-money-dollar-circle-line",
    color: "var(--first-color)",
  },
  {
    id: 6,
    title: "ID Card Renewal",
    description: "Application for renewal of student ID card.",
    icon: "ri-bank-card-line",
    color: "var(--first-color)",
  },
  {
    id: 7,
    title: "Library Access Form",
    description: "Request for library access and book lending.",
    icon: "ri-book-open-line",
    color: "var(--first-color)",
  },
  {
    id: 8,
    title: "Certificate Request",
    description: "Apply for course completion or merit certificate.",
    icon: "ri-medal-line",
    color: "var(--first-color)",
  },
];

const Application = () => {
  const [activeForm, setActiveForm] = useState(null);

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
                  style={{ backgroundColor: form.color }}
                >
                  <i className={form.icon}></i>
                </div>
                <div className={styles.cardText}>
                  <h3>{form.title}</h3>
                  <p>{form.description}</p>
                </div>
              </div>
              <button
                className={styles.fillBtn}
                onClick={() => setActiveForm(form)}
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

      {/* Modal */}
      {activeForm && (
        <div
          className={styles.modalOverlay}
          onClick={() => setActiveForm(null)}
        >
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <div
                className={styles.modalIcon}
                style={{ backgroundColor: activeForm.color }}
              >
                <i className={activeForm.icon}></i>
              </div>
              <div>
                <h3>{activeForm.title}</h3>
                <p>{activeForm.description}</p>
              </div>
              <button
                className={styles.closeBtn}
                onClick={() => setActiveForm(null)}
              >
                <i className="ri-close-line"></i>
              </button>
            </div>
            <div className={styles.modalBody}>
              <div className={styles.formRow}>
                <label>Full Name</label>
                <input type="text" placeholder="Enter your full name" />
              </div>
              <div className={styles.formRow}>
                <label>Roll Number</label>
                <input type="text" placeholder="Enter your roll number" />
              </div>
              <div className={styles.formRow}>
                <label>Department</label>
                <input type="text" placeholder="Enter your department" />
              </div>
              <div className={styles.formRow}>
                <label>Reason / Remarks</label>
                <textarea placeholder="Describe your reason..." rows={3} />
              </div>
            </div>
            <div className={styles.modalFooter}>
              <button
                className={styles.cancelBtn}
                onClick={() => setActiveForm(null)}
              >
                Cancel
              </button>
              <button
                className={styles.submitBtn}
                onClick={() => {
                  alert(`${activeForm.title} submitted successfully!`);
                  setActiveForm(null);
                }}
              >
                Submit Application
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Application;
