import React, { useState } from "react";
import styles from "./CalendarCard.module.css";
const CalendarCard = () => {
  const today = new Date();

  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());

  // Example events
  const events = {
    holiday: [5],
    deadline: [23],
  };

  const firstDay = new Date(currentYear, currentMonth, 1);
  const lastDate = new Date(currentYear, currentMonth + 1, 0).getDate();
  const startDay = firstDay.getDay();

  const monthTitle = firstDay.toLocaleString("default", {
    month: "long",
    year: "numeric",
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

  const renderDates = () => {
    const cells = [];

    // Blank cells before first day
    for (let i = 0; i < startDay; i++) {
      cells.push(<div key={`blank-${i}`} className={styles.date_cell}></div>);
    }

    // Actual days
    for (let d = 1; d <= lastDate; d++) {
      const isToday =
        d === today.getDate() &&
        currentMonth === today.getMonth() &&
        currentYear === today.getFullYear();

      const isHoliday = events.holiday.includes(d);
      const isDeadline = events.deadline.includes(d);

      const classes = [styles.date_cell];

      if (isToday) classes.push(styles.today);
      if (isHoliday) classes.push(styles.holiday);
      if (isDeadline) classes.push(styles.deadline);

      cells.push(
        <div key={d} className={classes.join(" ")}>
          {d}
        </div>,
      );
    }

    return cells;
  };

  return (
    <section className={`${styles.calendar_card} card`}>
      {/* HEADER */}
      <div className={styles.calendar_header}>
        <button className={styles.calendar_nav_btn} onClick={handlePrevMonth}>
          <i className="ri-arrow-left-s-line"></i>
        </button>

        <h3 className={styles.calendar_month}>{monthTitle}</h3>

        <button className={styles.calendar_nav_btn} onClick={handleNextMonth}>
          <i className="ri-arrow-right-s-line"></i>
        </button>
      </div>

      {/* WEEKDAYS */}
      <div className={styles.calendar_weekdays}>
        {["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"].map((day) => (
          <div key={day} className={styles.weekday}>
            {day}
          </div>
        ))}
      </div>

      {/* DATES */}
      <div className={styles.calendar_dates}>{renderDates()}</div>

      {/* LEGEND */}
      <div className={styles.calendar_legend}>
        <div className={styles.legend_item_cal}>
          <div className={`${styles.legend_box} ${styles.today}`}></div>
          <span>Today</span>
        </div>
        <div className={styles.legend_item_cal}>
          <div className={`${styles.legend_box} ${styles.holiday}`}></div>
          <span>Holiday</span>
        </div>
        <div className={styles.legend_item_cal}>
          <div className={`${styles.legend_box} ${styles.deadline}`}></div>
          <span>Deadline</span>
        </div>
      </div>
    </section>
  );
};

export default CalendarCard;
