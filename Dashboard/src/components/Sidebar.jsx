import { Link, useLocation } from "react-router-dom";
import styles from "./Sidebar.module.css";

const Sidebar = () => {
  const location = useLocation();

  return (
    <nav className={styles.nav}>
      <ul className={styles.nav__list}>
        <Link
          to="/"
          className={`${styles.nav__link} ${location.pathname === "/" ? styles.active_link : ""}`}
        >
          <i className="ri-dashboard-3-fill"></i>
          <span className={styles.nav__name}>Home</span>
        </Link>

        <Link
          to="/account"
          className={`${styles.nav__link} ${location.pathname === "/account" ? styles.active_link : ""}`}
        >
          <i className="ri-account-box-fill"></i>
          <span className={styles.nav__name}>Accounts</span>
        </Link>

        <Link
          to="/applications"
          className={`${styles.nav__link} ${location.pathname === "/applications" ? styles.active_link : ""}`}
        >
          <i className="ri-rocket-fill"></i>
          <span className={styles.nav__name}>Applications</span>
        </Link>

        <Link
          to="/files"
          className={`${styles.nav__link} ${location.pathname === "/files" ? styles.active_link : ""}`}
        >
          <i className="ri-file-list-3-fill"></i>
          <span className={styles.nav__name}>Files</span>
        </Link>

        <Link
          to="/settings"
          className={`${styles.nav__link} ${location.pathname === "/settings" ? styles.active_link : ""}`}
        >
          <i className="ri-settings-3-fill"></i>
          <span className={styles.nav__name}>Settings</span>
        </Link>
      </ul>

      <div className={styles.nav__circle1}></div>
      <div className={styles.nav__circle2}></div>

      <div className={styles.nav__square1}></div>
      <div className={styles.nav__square2}></div>
    </nav>
  );
};

export default Sidebar;
