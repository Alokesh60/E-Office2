import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import styles from "./StudentSubmissionDetails.module.css";

const StudentSubmissionDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [submission, setSubmission] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorStatus, setErrorStatus] = useState(null); // '401', '404', or generic error

  useEffect(() => {
    fetch(`http://127.0.0.1:8000/api/submission/${id}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        Accept: "application/json",
      },
    })
      .then((res) => {
        if (res.status === 401) {
          setErrorStatus("401");
          alert("Session expired. Please login again.");
          window.location.href = "/";
          throw new Error("Unauthorized");
        }
        if (!res.ok) {
          setErrorStatus("404");
          throw new Error("Submission not found");
        }
        return res.json();
      })
      .then((data) => {
        setSubmission(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <div className={styles.pageWrapper}>
        <div className={styles.centerState}>
          <h2>Loading submission...</h2>
        </div>
      </div>
    );
  }

  if (errorStatus === "401") {
    return (
      <div className={styles.pageWrapper}>
        <div className={styles.centerState}>
          <h2>Please login again</h2>
          <button className={styles.backBtn} onClick={() => navigate("/")}>
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  if (errorStatus === "404" || !submission) {
    return (
      <div className={styles.pageWrapper}>
        <div className={styles.centerState}>
          <h2>Submission not found</h2>
          <button className={styles.backBtn} onClick={() => navigate("/dashboard/student-submissions")}>
            Back to Submissions
          </button>
        </div>
      </div>
    );
  }

  const workflow = submission.form?.workflow || [];
  const currentStep = submission.current_step;
  const isApproved = submission.status === "approved";
  const isRejected = submission.status === "rejected";

  const formatRole = (role) =>
    role ? role.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()) : "";

  return (
    <div className={styles.pageWrapper}>
      <button
        className={styles.backBtn}
        onClick={() => navigate("/dashboard/student-submissions")}
        style={{ marginBottom: "20px" }}
      >
        ← Back to Submissions
      </button>

      <div className={styles.mainContainer}>
        {/* HEADER SECTION */}
        <div className={styles.header}>
          <h1>{submission.form?.name}</h1>
          <div className={styles.metaRow}>
            <span>
              <strong>Submitted:</strong> {new Date(submission.created_at).toLocaleDateString()}
            </span>
            <span>
              <strong>Application ID:</strong> SUB-{submission.id}
            </span>
            <span>
              <strong>Status:</strong>{" "}
              <span className={`${styles.statusBadge} ${styles[submission.status]}`}>
                {submission.status}
              </span>
            </span>
          </div>
        </div>

        {/* CONTENT GRID */}
        <div className={styles.content} style={{ marginTop: "25px" }}>
          {/* LEFT COLUMN: Submitted Answers */}
          <div className={styles.left}>
            <div className={styles.card}>
              <h3>Submitted Answers</h3>
              <div className={styles.answersGrid}>
                {submission.answers && submission.answers.length > 0 ? (
                  submission.answers.map((answer) => (
                    <div key={answer.id} className={styles.answerField}>
                      <span className={styles.questionLabel}>{answer.field?.label}</span>
                      {answer.field?.field_type === "file" ? (
                        <div>
                          <div className={styles.answerVal} style={{ fontStyle: "italic", fontSize: "13px" }}>
                            {answer.answer_text ? answer.answer_text.split("/").pop() : "No file uploaded"}
                          </div>
                          {answer.answer_text && (
                            <div className={styles.fileActions}>
                              <a
                                href={`http://127.0.0.1:8000/storage/${answer.answer_text}`}
                                target="_blank"
                                rel="noreferrer"
                                className={`${styles.btnLink} ${styles.primary}`}
                              >
                                View File
                              </a>
                              <a
                                href={`http://127.0.0.1:8000/storage/${answer.answer_text}`}
                                download
                                className={styles.btnLink}
                              >
                                Download File
                              </a>
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className={styles.answerVal}>
                          {answer.answer_text || <span style={{ color: "#aaa" }}>Empty</span>}
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <p style={{ color: "#64748b" }}>No answer details configured.</p>
                )}
              </div>
            </div>

            {/* TIMELINE OF APPROVAL LOGS */}
            <div className={styles.card}>
              <h3>Approval History</h3>
              <div className={styles.timeline}>
                {submission.logs && submission.logs.length > 0 ? (
                  submission.logs.map((log) => {
                    const actionClass = log.action === "approved" || log.action === "forwarded"
                      ? styles.approved
                      : log.action === "rejected"
                      ? styles.rejected
                      : styles.sent_back;

                    return (
                      <div
                        key={log.id}
                        className={`${styles.timelineItem} ${
                          log.action === "approved" || log.action === "forwarded"
                            ? styles.approved
                            : log.action === "rejected"
                            ? styles.rejected
                            : ""
                        }`}
                      >
                        <div className={styles.timelineMeta}>
                          <span className={styles.timelineRole}>{formatRole(log.role)}</span>
                          <span>{new Date(log.created_at).toLocaleString()}</span>
                        </div>
                        <div className={`${styles.timelineAction} ${actionClass}`}>
                          {log.action}
                        </div>
                        {(log.comment || log.comments) && (
                          <div className={styles.timelineComment}>
                            {log.comment || log.comments}
                          </div>
                        )}
                      </div>
                    );
                  })
                ) : (
                  <p style={{ color: "#64748b" }}>No history logs recorded yet.</p>
                )}
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Stepper workflow progress */}
          <div className={styles.right}>
            <div className={styles.card}>
              <h3>Workflow Stages</h3>
              <div className={styles.workflowList}>
                {workflow && workflow.length > 0 ? (
                  workflow.map((step, idx) => {
                    let indicatorState = "pending";
                    let isStepActive = false;

                    if (isApproved) {
                      indicatorState = "done";
                    } else if (isRejected && idx === currentStep) {
                      indicatorState = "pending"; // visual choice
                    } else if (idx < currentStep) {
                      indicatorState = "done";
                    } else if (idx === currentStep) {
                      indicatorState = "active";
                      isStepActive = true;
                    }

                    return (
                      <React.Fragment key={idx}>
                        <div className={`${styles.workflowStep} ${isStepActive ? styles.activeStep : ""}`}>
                          <div className={`${styles.stepIndicator} ${styles[indicatorState]}`}>
                            {indicatorState === "done" ? "✔" : idx + 1}
                          </div>
                          <span className={styles.stepText}>{formatRole(step)}</span>
                        </div>
                        {idx < workflow.length - 1 && (
                          <div className={styles.arrowConnector}>↓</div>
                        )}
                      </React.Fragment>
                    );
                  })
                ) : (
                  <p style={{ color: "#64748b" }}>No workflow defined.</p>
                )}
              </div>
              {!isApproved && !isRejected && workflow[currentStep] && (
                <div style={{ marginTop: "20px", fontSize: "14px", color: "#475569" }}>
                  <strong>Current Stage:</strong>
                  <div style={{ marginTop: "5px", color: "#1d4ed8", fontWeight: "600" }}>
                    {formatRole(workflow[currentStep])}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentSubmissionDetails;
