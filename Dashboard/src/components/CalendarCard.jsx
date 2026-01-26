import React, { useState } from "react";

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
      cells.push(<div key={`blank-${i}`} className="date-cell"></div>);
    }

    // Actual days
    for (let d = 1; d <= lastDate; d++) {
      const isToday =
        d === today.getDate() &&
        currentMonth === today.getMonth() &&
        currentYear === today.getFullYear();

      const isHoliday = events.holiday.includes(d);
      const isDeadline = events.deadline.includes(d);

      let className = "date-cell";
      if (isToday) className += " today";
      if (isHoliday) className += " holiday";
      if (isDeadline) className += " deadline";

      cells.push(
        <div key={d} className={className}>
          {d}
        </div>
      );
    }

    return cells;
  };

  return (
    <section className="calendar-card card">

      {/* HEADER */}
      <div className="calendar-header">
        <button className="calendar-nav-btn" onClick={handlePrevMonth}>
          <i className="ri-arrow-left-s-line"></i>
        </button>

        <h3 className="calendar-month">{monthTitle}</h3>

        <button className="calendar-nav-btn" onClick={handleNextMonth}>
          <i className="ri-arrow-right-s-line"></i>
        </button>
      </div>

      {/* WEEKDAYS */}
      <div className="calendar-weekdays">
        {["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"].map((day) => (
          <div key={day} className="weekday">
            {day}
          </div>
        ))}
      </div>

      {/* DATES */}
      <div className="calendar-dates">
        {renderDates()}
      </div>

      {/* LEGEND */}
      <div className="calendar-legend">
        <div className="legend-item-cal">
          <div className="legend-box today"></div>
          <span>Today</span>
        </div>
        <div className="legend-item-cal">
          <div className="legend-box holiday"></div>
          <span>Holiday</span>
        </div>
        <div className="legend-item-cal">
          <div className="legend-box deadline"></div>
          <span>Deadline</span>
        </div>
      </div>

    </section>
  );
};

export default CalendarCard;
