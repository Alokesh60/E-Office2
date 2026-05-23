import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import styles from "./FacultyApplication.module.css";
import toast from "react-hot-toast";

const FacultyApplication = () => {
  const { id } = useParams(); // 🔥 IMPORTANT
  const navigate = useNavigate();

  const [submission, setSubmission] = useState(null);
  const [activeTab, setActiveTab] = useState("forward");
  const [showModal, setShowModal] = useState(false);
  const [otp, setOtp] = useState("");

  // ✅ Fetch submission
  useEffect(() => {
    fetch(`http://127.0.0.1:8000/api/submission/${id}`)
      .then((res) => res.json())
      .then((data) => setSubmission(data))
      .catch((err) => console.error(err));
  }, [id]);

  const handleSubmitAction = () => {
    setShowModal(true);
  };

  // ✅ FINAL ACTION AFTER OTP
  const handleVerify = async () => {
    if (otp.length !== 6) {
      toast.error("Enter valid 6-digit OTP");
      return;
    }

    try {
      let url = "";

      if (activeTab === "forward") {
        url = `/api/submission/${id}/approve`;
      } else if (activeTab === "reject") {
        url = `/api/submission/${id}/reject`;
      } else if (activeTab === "backward") {
        url = `/api/submission/${id}/send-back`;
      }

      const res = await fetch(`http://127.0.0.1:8000${url}`, {
        method: "POST",
      });

      if (res.ok) {
        toast.success("Action completed!");
        navigate("/applications");
      } else {
        toast.error("Action failed");
      }
    } catch (err) {
      console.error(err);
      toast.error("Error occurred");
    }

    setShowModal(false);
    setOtp("");
  };

  if (!submission) return <p>Loading...</p>;

  const workflow = submission.form?.workflow || [];
  const currentStage = submission.current_step;

  const formatRole = (role) =>
    role?.replaceAll("_", " ").replace(/\b\w/g, (c) => c.toUpperCase());

  return (
    <div className={styles.pageWrapper}>
      <div className={styles.mainContainer}>
        <div className={styles.content}>
          {/* LEFT */}
          <div className={styles.left}>
            <div className={styles.header}>
              <h1>{submission.form?.name}</h1>
            </div>

            <div className={styles.card}>
              <h3>Submitted Form</h3>

              <pre style={{ fontSize: "12px" }}>
                {JSON.stringify(submission.answers, null, 2)}
              </pre>
            </div>

            {/* ACTIONS */}
            <div className={styles.actionCard}>
              <div className={styles.tabs}>
                <button
                  className={activeTab === "forward" ? styles.active : ""}
                  onClick={() => setActiveTab("forward")}
                >
                  Approve
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
                  Send Back
                </button>
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

          {/* RIGHT */}
          <div className={styles.right}>
            <div className={styles.card}>
              <h3>Workflow</h3>

              {workflow.map((step, index) => (
                <div key={index}>
                  {index < currentStage && "✔ "}
                  {index === currentStage && "⏳ "}
                  {index > currentStage && "⬜ "}

                  {formatRole(step)}

                  {index === currentStage && " (Current)"}
                </div>
              ))}

              {submission.status === "approved" && <div>✔ Completed</div>}
            </div>
          </div>
        </div>
      </div>

      {/* OTP MODAL */}
      {showModal && (
        <div className={styles.overlay}>
          <div className={styles.modal}>
            <h2>Verify Action</h2>

            <input
              type="text"
              maxLength="6"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="Enter OTP"
              className={styles.otpInput}
            />

            <button onClick={handleVerify}>Verify & Submit</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FacultyApplication;     
