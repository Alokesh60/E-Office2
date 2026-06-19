import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import styles from "./AdminDashboard.module.css";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [announcements, setAnnouncements] = useState([]);
  const [calendarEvents, setCalendarEvents] = useState([]);
  const [recentActivities, setRecentActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total_users: 0,
    total_applications: 0,
    pending_applications: 0,
    rejected_applications: 0,
  });

  // Modals visibility
  const [showAnnModal, setShowAnnModal] = useState(false);
  const [showHolidayModal, setShowHolidayModal] = useState(false);
  const [currentAnn, setCurrentAnn] = useState(null);

  // Announcement form states
  const [annTitle, setAnnTitle] = useState("");
  const [annBody, setAnnBody] = useState("");
  const [annIsActive, setAnnIsActive] = useState(true);
  const [annExpiresAt, setAnnExpiresAt] = useState("");

  // Holiday form states
  const [holTitle, setHolTitle] = useState("");
  const [holDate, setHolDate] = useState("");
  const [holType, setHolType] = useState("holiday");

  // Local actions tracking to update "Recent Activities" dynamically
  const [localActivities, setLocalActivities] = useState([
    {
      id: "local_1",
      title: "Announcement \"Office Closed\" updated",
      description: "by Admin",
      status: "announcement_update",
      time_formatted: "10:30 AM",
      created_at: new Date(Date.now() - 5 * 60 * 1000).toISOString()
    },
    {
      id: "local_2",
      title: "Holiday \"19 Jun\" added",
      description: "by Admin",
      status: "holiday_add",
      time_formatted: "09:45 AM",
      created_at: new Date(Date.now() - 50 * 60 * 1000).toISOString()
    },
    {
      id: "local_3",
      title: "New policy update published",
      description: "by Admin",
      status: "policy_publish",
      time_formatted: "09:15 AM",
      created_at: new Date(Date.now() - 80 * 60 * 1000).toISOString()
    },
    {
      id: "local_4",
      title: "User role updated for Rahul Verma",
      description: "by Admin",
      status: "user_update",
      time_formatted: "17 Jun 2026 04:20 PM",
      created_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
    },
    {
      id: "local_5",
      title: "Form \"Bonafide Certificate\" edited",
      description: "by Admin",
      status: "form_edit",
      time_formatted: "17 Jun 2026 03:10 PM",
      created_at: new Date(Date.now() - 25 * 60 * 60 * 1000).toISOString()
    }
  ]);

  const addLocalActivity = (title, description, status) => {
    const now = new Date();
    const timeStr = now.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit"
    });
    setLocalActivities(prev => [
      {
        id: `local_act_${Date.now()}`,
        title,
        description,
        status,
        time_formatted: timeStr,
        created_at: now.toISOString()
      },
      ...prev
    ]);
  };

  // Calendar navigation logic
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());

  const holidaysList = [];
  const deadlinesList = [];
  const otherEventsList = [];

  calendarEvents.forEach((evt) => {
    if (!evt.date) return;
    const d = new Date(evt.date);
    if (d.getMonth() === currentMonth && d.getFullYear() === currentYear) {
      if (evt.type === "holiday") {
        holidaysList.push(d.getDate());
      } else if (evt.type === "deadline") {
        deadlinesList.push(d.getDate());
      } else {
        otherEventsList.push(d.getDate());
      }
    }
  });

  const firstDay = new Date(currentYear, currentMonth, 1);
  const lastDate = new Date(currentYear, currentMonth + 1, 0).getDate();
  const startDay = firstDay.getDay();

  const monthTitle = firstDay.toLocaleString("default", {
    month: "long",
    year: "numeric"
  });

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear((y) => y - 1);
    } else {
      setCurrentMonth((m) => m - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear((y) => y + 1);
    } else {
      setCurrentMonth((m) => m + 1);
    }
  };

  const fetchData = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/");
      return;
    }

    try {
      setLoading(true);
      const [profileRes, annRes, dashRes] = await Promise.all([
        fetch("http://127.0.0.1:8000/api/settings/profile", {
          headers: { Authorization: `Bearer ${token}`, Accept: "application/json" }
        }),
        fetch("http://127.0.0.1:8000/api/admin/announcements", {
          headers: { Authorization: `Bearer ${token}`, Accept: "application/json" }
        }),
        fetch("http://127.0.0.1:8000/api/dashboard", {
          headers: { Authorization: `Bearer ${token}`, Accept: "application/json" }
        })
      ]);

      if (profileRes.status === 401 || annRes.status === 401 || dashRes.status === 401) {
        toast.error("Session expired. Please login again.");
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        localStorage.removeItem("role");
        navigate("/");
        return;
      }

      if (profileRes.ok && annRes.ok && dashRes.ok) {
        const profileData = await profileRes.json();
        const announcementsData = await annRes.json();
        const dashData = await dashRes.json();

        setProfile(profileData);
        setAnnouncements(announcementsData);
        setCalendarEvents(dashData.calendar || []);
        setRecentActivities(dashData.activity || []);
        if (dashData.stats) {
          setStats(dashData.stats);
        }
      }
    } catch (err) {
      console.error(err);
      toast.error("Error loading admin dashboard data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Announcements CRUD Handlers
  const handleOpenAnnCreate = () => {
    setCurrentAnn(null);
    setAnnTitle("");
    setAnnBody("");
    setAnnIsActive(true);
    setAnnExpiresAt("");
    setShowAnnModal(true);
  };

  const handleOpenAnnEdit = (ann) => {
    setCurrentAnn(ann);
    setAnnTitle(ann.title);
    setAnnBody(ann.body);
    setAnnIsActive(!!ann.is_active);
    setAnnExpiresAt(ann.expires_at ? ann.expires_at.split(" ")[0] : "");
    setShowAnnModal(true);
  };

  const handleSaveAnnouncement = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    const payload = {
      title: annTitle,
      body: annBody,
      is_active: annIsActive,
      expires_at: annExpiresAt || null
    };

    try {
      const url = currentAnn
        ? `http://127.0.0.1:8000/api/announcements/${currentAnn.id}`
        : "http://127.0.0.1:8000/api/announcements";
      const method = currentAnn ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          Accept: "application/json"
        },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        toast.success(
          currentAnn
            ? "Announcement updated successfully!"
            : "Announcement created successfully!"
        );
        setShowAnnModal(false);
        addLocalActivity(
          currentAnn ? `Announcement "${annTitle}" updated` : `New announcement "${annTitle}" created`,
          "by Admin",
          currentAnn ? "announcement_update" : "policy_publish"
        );
        fetchData();
      } else {
        const data = await res.json();
        toast.error(data.message || "Failed to save announcement");
      }
    } catch (err) {
      console.error(err);
      toast.error("Error saving announcement");
    }
  };

  const handleDeleteAnnouncement = async (id, title) => {
    if (!window.confirm(`Are you sure you want to delete "${title}"?`)) return;
    const token = localStorage.getItem("token");

    try {
      const res = await fetch(`http://127.0.0.1:8000/api/announcements/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json"
        }
      });

      if (res.ok) {
        toast.success("Announcement deleted successfully");
        addLocalActivity(
          `Announcement "${title}" deleted`,
          "by Admin",
          "announcement_delete"
        );
        fetchData();
      } else {
        toast.error("Failed to delete announcement");
      }
    } catch (err) {
      console.error(err);
      toast.error("Error deleting announcement");
    }
  };

  // Holiday CRUD Handlers
  const handleOpenHolidayCreate = () => {
    setHolTitle("");
    setHolDate("");
    setHolType("holiday");
    setShowHolidayModal(true);
  };

  const handleSaveHoliday = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    const payload = {
      title: holTitle,
      date: holDate,
      type: holType
    };

    try {
      const res = await fetch("http://127.0.0.1:8000/api/calendar-events", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          Accept: "application/json"
        },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        toast.success("Holiday added to calendar!");
        setShowHolidayModal(false);
        addLocalActivity(
          `Holiday "${holTitle}" added`,
          "by Admin",
          "holiday_add"
        );
        fetchData();
      } else {
        const data = await res.json();
        toast.error(data.message || "Failed to save holiday");
      }
    } catch (err) {
      console.error(err);
      toast.error("Error saving holiday");
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    const options = { day: "numeric", month: "short", year: "numeric" };
    return new Date(dateStr).toLocaleDateString("en-GB", options);
  };

  const formatTime = (dateStr) => {
    if (!dateStr) return "09:00 AM";
    return new Date(dateStr).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  const getStatusBadgeClass = (ann) => {
    const isExpired = ann.expires_at && new Date(ann.expires_at) < new Date();
    if (isExpired) return `${styles.badge} ${styles.badgeInactive}`;
    if (!ann.is_active) return `${styles.badge} ${styles.badgeInactive}`;
    const isScheduled = ann.created_at && new Date(ann.created_at) > new Date();
    if (isScheduled) return `${styles.badge} ${styles.badgeScheduled}`;
    return `${styles.badge} ${styles.badgeActive}`;
  };

  const getStatusText = (ann) => {
    const isExpired = ann.expires_at && new Date(ann.expires_at) < new Date();
    if (isExpired) return "Expired";
    if (!ann.is_active) return "Inactive";
    const isScheduled = ann.created_at && new Date(ann.created_at) > new Date();
    if (isScheduled) return "Scheduled";
    return "Active";
  };

  if (loading) {
    return (
      <div className={styles.loadingArea}>
        <p>Loading Admin Dashboard...</p>
      </div>
    );
  }

  // Generate calendar cells
  const cells = [];
  for (let i = 0; i < startDay; i++) {
    cells.push(<div key={`blank-${i}`} className={styles.dateCell}></div>);
  }
  for (let d = 1; d <= lastDate; d++) {
    const isToday =
      d === today.getDate() &&
      currentMonth === today.getMonth() &&
      currentYear === today.getFullYear();

    const isHoliday = holidaysList.includes(d);
    const isDeadline = deadlinesList.includes(d);

    const cellClasses = [styles.dateCell];
    if (isToday) cellClasses.push(styles.todayCell);
    if (isHoliday) cellClasses.push(styles.holidayCell);
    if (isDeadline) cellClasses.push(styles.deadlineCell);

    cells.push(
      <div key={d} className={cellClasses.join(" ")}>
        {d}
      </div>
    );
  }

  // Filter Upcoming Holidays dynamically
  const upcomingHolidays = calendarEvents
    .filter(evt => evt.type === "holiday" && evt.date && new Date(evt.date) >= new Date())
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .slice(0, 4);

  // Merge local activities with database activity logs for dynamic display
  const combinedActivities = [...localActivities, ...recentActivities]
    .slice(0, 5); // display top 5

  return (
    <div className={styles.adminDashboard}>
      <div className={styles.dashboardLayout}>
        {/* LEFT COLUMN: Announcements & System Overview */}
        <div className={styles.leftColumn}>
          {/* Announcements Card */}
          <div className={styles.announcementsCard}>
            <div className={styles.cardHeader}>
              <div className={styles.headerTitleArea}>
                <div className={styles.headerIconWrapper}>
                  <i className="ri-megaphone-line" />
                </div>
                <div className={styles.headerText}>
                  <h2>Announcements</h2>
                  <p>Create, edit and manage announcements for users.</p>
                </div>
              </div>
              <button className={styles.newAnnBtn} onClick={handleOpenAnnCreate}>
                <i className="ri-add-line" /> New Announcement
              </button>
            </div>

            <div className={styles.tableResponsive}>
              <table className={styles.announcementsTable}>
                <thead>
                  <tr>
                    <th style={{ width: "45%" }}>Title</th>
                    <th style={{ width: "15%" }}>Status</th>
                    <th style={{ width: "20%" }}>Published On</th>
                    <th style={{ width: "20%" }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {announcements.map((ann) => (
                    <tr key={ann.id}>
                      <td>
                        <div className={styles.annTitleCell}>
                          <div className={styles.annItemIcon}>
                            <i className="ri-megaphone-line" />
                          </div>
                          <div className={styles.annTitleText}>
                            <strong>{ann.title}</strong>
                            <p>{ann.body}</p>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span className={getStatusBadgeClass(ann)}>
                          {getStatusText(ann)}
                        </span>
                      </td>
                      <td>
                        <div className={styles.publishedOnWrapper}>
                          <i className="ri-calendar-line" />
                          <div className={styles.publishedOnDateTime}>
                            <span>{formatDate(ann.created_at)}</span>
                            <small>{formatTime(ann.created_at)}</small>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div className={styles.annItemActions}>
                          <button
                            className={styles.editBtn}
                            onClick={() => handleOpenAnnEdit(ann)}
                          >
                            <i className="ri-pencil-line" /> Edit
                          </button>
                          <button
                            className={styles.deleteBtn}
                            onClick={() => handleDeleteAnnouncement(ann.id, ann.title)}
                          >
                            <i className="ri-delete-bin-line" /> Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {announcements.length === 0 && (
                <p className={styles.noData}>No announcements available.</p>
              )}
            </div>

            <div className={styles.footerLinkContainer}>
              <Link to="#" className={styles.viewAllLink}>
                View All Announcements <i className="ri-arrow-right-line" />
              </Link>
            </div>
          </div>

          {/* System Overview Card */}
          <div className={styles.systemOverviewCard}>
            <div className={styles.cardHeader}>
              <div className={styles.headerTitleArea}>
                <div className={styles.headerText}>
                  <h2>System Overview</h2>
                  <p>Overview of key statistics of the system.</p>
                </div>
              </div>
            </div>

            <div className={styles.statsGrid}>
              {/* Stat 1: Total Users */}
              <div className={styles.statItem}>
                <div className={`${styles.statIconWrapper} ${styles.blue}`}>
                  <i className="ri-group-line" />
                </div>
                <div className={styles.statContent}>
                  <h3>{stats.total_users || 0}</h3>
                  <p>Total Users</p>
                </div>
              </div>

              {/* Stat 2: Total Applications */}
              <div className={styles.statItem}>
                <div className={`${styles.statIconWrapper} ${styles.green}`}>
                  <i className="ri-file-text-line" />
                </div>
                <div className={styles.statContent}>
                  <h3>{stats.total_applications || 0}</h3>
                  <p>Total Applications</p>
                </div>
              </div>

              {/* Stat 3: Pending Applications */}
              <div className={styles.statItem}>
                <div className={`${styles.statIconWrapper} ${styles.yellow}`}>
                  <i className="ri-time-line" />
                </div>
                <div className={styles.statContent}>
                  <h3>{stats.pending_applications || 0}</h3>
                  <p>Pending Applications</p>
                </div>
              </div>

              {/* Stat 4: Rejected Applications */}
              <div className={styles.statItem}>
                <div className={`${styles.statIconWrapper} ${styles.red}`}>
                  <i className="ri-close-circle-line" />
                </div>
                <div className={styles.statContent}>
                  <h3>{stats.rejected_applications || 0}</h3>
                  <p>Rejected Applications</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Calendar & Holidays Card */}
        <div className={styles.calendarCard}>
          <div className={styles.calendarHeader}>
            <div className={styles.headerTitleArea}>
              <div className={styles.headerIconWrapper}>
                <i className="ri-calendar-todo-line" />
              </div>
              <div className={styles.headerText}>
                <h2>Calendar & Holidays</h2>
                <p>Manage institute calendar and holidays.</p>
              </div>
            </div>
            <button className={styles.newHolidayBtn} onClick={handleOpenHolidayCreate}>
              <i className="ri-add-line" /> Add Holiday
            </button>
          </div>

          {/* Calendar Widget */}
          <div className={styles.calendarWidget}>
            <div className={styles.calNav}>
              <button onClick={handlePrevMonth}>
                <i className="ri-arrow-left-s-line" />
              </button>
              <h3>{monthTitle}</h3>
              <button onClick={handleNextMonth}>
                <i className="ri-arrow-right-s-line" />
              </button>
            </div>

            <div className={styles.weekdays}>
              {["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"].map((day) => (
                <div key={day} className={styles.weekday}>
                  {day}
                </div>
              ))}
            </div>

            <div className={styles.datesGrid}>{cells}</div>

            <div className={styles.legend}>
              <div className={styles.legendItem}>
                <span className={`${styles.dot} ${styles.blue}`} />
                <span>Today</span>
              </div>
              <div className={styles.legendItem}>
                <span className={`${styles.dot} ${styles.yellow}`} />
                <span>Holiday</span>
              </div>
              <div className={styles.legendItem}>
                <span className={`${styles.dot} ${styles.red}`} />
                <span>Deadline</span>
              </div>
            </div>
          </div>

          {/* Upcoming Holidays section inside the card */}
          <div className={styles.upcomingHolidays}>
            <h3>Upcoming Holidays</h3>
            <div className={styles.holidaysList}>
              {upcomingHolidays.map((evt) => (
                <div key={evt.id} className={styles.holidayItem}>
                  <div className={styles.holidayIconWrapper}>
                    <i className="ri-calendar-event-line" />
                  </div>
                  <div className={styles.holidayTextWrapper}>
                    <span className={styles.holidayDate}>{formatDate(evt.date)}</span>
                    <span className={styles.holidayTitle}>{evt.title}</span>
                  </div>
                </div>
              ))}

              {upcomingHolidays.length === 0 && (
                <p className={styles.noUpcomingHolidays}>No upcoming holidays.</p>
              )}
            </div>
          </div>

          <div className={styles.footerLinkContainer}>
            <Link to="#" className={styles.viewAllLink}>
              View All Holidays <i className="ri-arrow-right-line" />
            </Link>
          </div>
        </div>
      </div>

      {/* ANNOUNCEMENT MODAL */}
      {showAnnModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <h3>
              {currentAnn ? "Edit Announcement" : "Create New Announcement"}
            </h3>
            <form onSubmit={handleSaveAnnouncement}>
              <div className={styles.formGroup}>
                <label>Title</label>
                <input
                  type="text"
                  placeholder="Enter announcement title"
                  value={annTitle}
                  onChange={(e) => setAnnTitle(e.target.value)}
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label>Content / Body</label>
                <textarea
                  rows="4"
                  placeholder="Enter announcement body text"
                  value={annBody}
                  onChange={(e) => setAnnBody(e.target.value)}
                  required
                />
              </div>

              <div className={styles.formGroupRow}>
                <label className={styles.checkboxLabel}>
                  <input
                    type="checkbox"
                    checked={annIsActive}
                    onChange={(e) => setAnnIsActive(e.target.checked)}
                  />
                  <span>Active Announcement</span>
                </label>
              </div>

              <div className={styles.formGroup}>
                <label>Expires At (Optional)</label>
                <input
                  type="date"
                  value={annExpiresAt}
                  onChange={(e) => setAnnExpiresAt(e.target.value)}
                />
              </div>

              <div className={styles.modalButtons}>
                <button
                  type="button"
                  className={styles.cancelBtn}
                  onClick={() => setShowAnnModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" className={styles.saveBtn}>
                  Save Announcement
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* HOLIDAY MODAL */}
      {showHolidayModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <h3>Add Calendar Event / Holiday</h3>
            <form onSubmit={handleSaveHoliday}>
              <div className={styles.formGroup}>
                <label>Title</label>
                <input
                  type="text"
                  placeholder="e.g. Independence Day"
                  value={holTitle}
                  onChange={(e) => setHolTitle(e.target.value)}
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label>Date</label>
                <input
                  type="date"
                  value={holDate}
                  onChange={(e) => setHolDate(e.target.value)}
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label>Event Type</label>
                <select
                  value={holType}
                  onChange={(e) => setHolType(e.target.value)}
                  required
                >
                  <option value="holiday">Holiday</option>
                  <option value="deadline">Deadline</option>
                  <option value="event">General Event</option>
                </select>
              </div>

              <div className={styles.modalButtons}>
                <button
                  type="button"
                  className={styles.cancelBtn}
                  onClick={() => setShowHolidayModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" className={styles.saveBtn}>
                  Add to Calendar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
