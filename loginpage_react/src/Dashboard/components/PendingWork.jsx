import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./PendingWork.module.css";

// ─── Static fallback data (mirrors real submission shape) ────────────────────
const DUMMY_PENDING = [
  {
    id: "SUB-2026-0342",
    title: "Bonafide Certificate Request",
    student: "Rahul Verma",
    date: "28 March 2026",
    status: "Pending",
    priority: "high",
  },
  {
    id: "SUB-2026-0345",
    title: "Transcript Request",
    student: "Aman Das",
    date: "27 March 2026",
    status: "Pending",
    priority: "medium",
  },
  {
    id: "SUB-2026-0349",
    title: "Leave Application",
    student: "Priya Sharma",
    date: "26 March 2026",
    status: "Pending",
    priority: "low",
  },
  {
    id: "SUB-2026-0351",
    title: "Hostel Clearance",
    student: "Kiran Mehta",
    date: "25 March 2026",
    status: "Pending",
    priority: "high",
  },
  {
    id: "SUB-2026-0355",
    title: "Scholarship Form",
    student: "Deepak Roy",
    date: "24 March 2026",
    status: "Pending",
    priority: "medium",
  },
];

// Pill icon per form type
const typeIcon = (title) => {
  if (title.toLowerCase().includes("bonafide")) return "ri-award-line";
  if (title.toLowerCase().includes("transcript")) return "ri-file-text-line";
  if (title.toLowerCase().includes("leave")) return "ri-calendar-check-line";
  if (title.toLowerCase().includes("hostel")) return "ri-home-4-line";
  if (title.toLowerCase().includes("scholarship"))
    return "ri-money-dollar-circle-line";
  return "ri-file-list-3-line";
};

// ─── Component ────────────────────────────────────────────────────────────────
const PendingWork = () => {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Try to pull real submissions from the backend; fall back to dummy data
    fetch("http://127.0.0.1:8000/api/submissions?status=pending", {
      credentials: "include",
    })
      .then((res) => {
        if (!res.ok) throw new Error("no data");
        return res.json();
      })
      .then((data) => {
        const pending = (data || [])
          .filter((s) => s.status === "Pending" || s.status === "pending")
          .slice(0, 6); // cap at 6 for dashboard card
        setItems(pending.length ? pending : DUMMY_PENDING);
      })
      .catch(() => setItems(DUMMY_PENDING))
      .finally(() => setLoading(false));
  }, []);

  const priorityClass = (p) => {
    if (p === "high") return styles.high;
    if (p === "medium") return styles.medium;
    return styles.low;
  };

  return (
    <section className={styles.card}>
      {/* ── Header ── */}
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <span className={styles.badge}>
            <i className="ri-time-line" />
            {items.length}
          </span>
          <h2 className={styles.title}>Pending Work</h2>
        </div>
        <button
          className={styles.viewAll}
          onClick={() => navigate("/applications")}
        >
          View All <i className="ri-arrow-right-s-line" />
        </button>
      </div>

      {/* ── Body ── */}
      <div className={styles.list}>
        {loading ? (
          <div className={styles.loading}>
            <i className="ri-loader-4-line" /> Loading…
          </div>
        ) : items.length === 0 ? (
          <div className={styles.empty}>
            <i className="ri-checkbox-circle-line" />
            <p>All caught up! No pending submissions.</p>
          </div>
        ) : (
          items.map((item, idx) => (
            <div
              key={item.id || idx}
              className={styles.item}
              onClick={() => navigate(`/applications/${item.id}`)}
            >
              {/* Icon */}
              <div className={styles.iconWrap}>
                <i className={typeIcon(item.title)} />
              </div>

              {/* Text */}
              <div className={styles.info}>
                <span className={styles.itemTitle}>{item.title}</span>
                <span className={styles.meta}>
                  <i className="ri-user-3-line" />
                  {item.student}
                  <span className={styles.dot}>·</span>
                  <i className="ri-calendar-line" />
                  {item.date}
                </span>
              </div>

              {/* Priority dot */}
              <span
                className={`${styles.priorityDot} ${priorityClass(item.priority)}`}
                title={`${item.priority} priority`}
              />

              {/* Arrow */}
              <i className={`ri-arrow-right-s-line ${styles.arrow}`} />
            </div>
          ))
        )}
      </div>
    </section>
  );
};

export default PendingWork;
