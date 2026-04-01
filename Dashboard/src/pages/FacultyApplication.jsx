import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./FacultyApplication.module.css";
import toast from "react-hot-toast";

const FacultyApplication = () => {
  const [activeTab, setActiveTab] = useState("forward");
  const [showModal, setShowModal] = useState(false);
  const [otp, setOtp] = useState("");

  const navigate = useNavigate(); // 🔥 NEW

  const currentStage = 2;

  const workflow = [
    "HOD Approval",
    "Academic Section",
    "Dean Office",
    "Completed",
  ];

  const handleSubmitAction = () => {
    setShowModal(true);
  };

  const handleVerify = () => {
    if (otp.length !== 6) {
      toast.error("Enter valid 6-digit OTP");
      return;
    }

    // 🔥 STORE UPDATED STATUS
    const updatedId = "SUB-2026-0342"; // dynamic later
    localStorage.setItem("updatedSubmission", updatedId);

    setShowModal(false);
    setOtp("");

    // 🔥 REDIRECT TO SUBMISSIONS PAGE
    navigate("/applications");
  };

  return (
    <div className={styles.pageWrapper}>
      <div className={styles.mainContainer}>
        <div className={styles.content}>
          {/* LEFT SIDE */}
          <div className={styles.left}>
            {/* HEADER */}
            <div className={styles.header}>
              <p className={styles.breadcrumb}>
                Submissions &gt; Bonafide Certificate Request
              </p>
              <h1>Bonafide Certificate Request</h1>
            </div>

            {/* FORM CARD */}
            <div className={styles.card}>
              <h3>Submitted Form</h3>

              <div className={styles.scrollSection}>
                <div className={styles.grid}>
                  <div>
                    <label>Full Name</label>
                    <div className={styles.value}>Rahul Verma</div>
                  </div>

                  <div>
                    <label>Scholar ID</label>
                    <div className={styles.value}>22CS1045</div>
                  </div>

                  <div>
                    <label>Email</label>
                    <div className={styles.value}>
                      rahul.verma@students.nits.ac.in
                    </div>
                  </div>

                  <div>
                    <label>Programme</label>
                    <div className={styles.value}>B.Tech</div>
                  </div>
                </div>

                <div className={styles.fullWidth}>
                  <label>Additional Details</label>
                  <div className={styles.value}>
                    Required for student visa application...
                  </div>
                </div>

                {/* DOCUMENTS */}
                <div className={styles.documents}>
                  <h4>Supporting Documents</h4>

                  <div className={styles.docGroup}>
                    <p className={styles.docTitle}>Bonafide Certificate</p>
                    <div className={styles.docItem}>
                      📄 bonafide_certificate.pdf
                    </div>
                  </div>

                  <div className={styles.docGroup}>
                    <p className={styles.docTitle}>Visa Documents</p>
                    <div className={styles.docItem}>
                      📄 visa_invitation_letter.pdf
                    </div>
                  </div>

                  <div className={styles.docGroup}>
                    <p className={styles.docTitle}>Identity Proof</p>
                    <div className={styles.docItem}>📄 passport_copy.pdf</div>
                  </div>
                </div>
              </div>
            </div>

            {/* ACTION CARD */}
            <div className={styles.actionCard}>
              <div className={styles.tabs}>
                {currentStage === 3 ? (
                  <button className={styles.active}>Approve</button>
                ) : (
                  <>
                    <button
                      className={activeTab === "forward" ? styles.active : ""}
                      onClick={() => setActiveTab("forward")}
                    >
                      Forward
                    </button>

                    <button
                      className={activeTab === "forwardTo" ? styles.active : ""}
                      onClick={() => setActiveTab("forwardTo")}
                    >
                      Forward To
                    </button>

                    <button
                      className={activeTab === "reject" ? styles.active : ""}
                      onClick={() => setActiveTab("reject")}
                    >
                      Reject
                    </button>

                    <button
                      className={activeTab === "backward" ? styles.active : ""}
                      onClick={() => setActiveTab("backward")}
                    >
                      Backward
                    </button>
                  </>
                )}
              </div>

              <textarea placeholder="Add remarks..." />

              <button
                className={styles.primaryBtn}
                onClick={handleSubmitAction}
              >
                Submit Action
              </button>
            </div>
          </div>

          {/* RIGHT SIDE */}
          <div className={styles.right}>
            <div className={`${styles.card} ${styles.profileCard}`}>
              <div className={styles.avatar}>RV</div>
              <h3>Rahul Verma</h3>

              <div className={styles.meta}>
                <div>
                  <span>Dept</span>
                  <span>Computer Science</span>
                </div>
                <div>
                  <span>Semester</span>
                  <span>5th</span>
                </div>
                <div>
                  <span>Email</span>
                  <span>rahul@nits.ac.in</span>
                </div>
              </div>
            </div>

            <div className={styles.card}>
              <h3>Approval Workflow</h3>

              <div className={styles.timeline}>
                {workflow.map((step, index) => (
                  <div key={index} className={styles.timelineItem}>
                    <div
                      className={`${styles.circle}
                      ${
                        index < currentStage
                          ? styles.done
                          : index === currentStage
                            ? styles.current
                            : styles.pending
                      }`}
                    ></div>

                    <div className={styles.stepText}>
                      {step}
                      {index === currentStage && (
                        <span className={styles.currentLabel}>(Current)</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 🔥 OTP MODAL */}
      {showModal && (
        <div className={styles.overlay}>
          <div className={styles.modal}>
            <h2>Verify & Sign Document</h2>
            <p>Enter OTP sent to your email</p>

            <input
              type="text"
              maxLength="6"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="Enter OTP"
              className={styles.otpInput}
            />

            <div className={styles.signatureBox}>
              <p>Signature Preview</p>
              <img src="/images/signature.png" alt="signature" />
            </div>

            <div className={styles.modalActions}>
              <button
                className={styles.cancelBtn}
                onClick={() => setShowModal(false)}
              >
                Cancel
              </button>

              <button
                className={styles.verifyBtn}
                onClick={handleVerify}
                disabled={otp.length !== 6}
              >
                Verify & Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FacultyApplication;
