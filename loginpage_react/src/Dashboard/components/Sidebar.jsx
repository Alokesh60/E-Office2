import { Link, useLocation } from "react-router-dom";
import styles from "./Sidebar.module.css";

const Sidebar = () => {
  const location = useLocation();

  return (
    <nav className={styles.nav}>
      <ul className={styles.nav__list}>
        
        {/* HOME */}
        <Link
          to="/dashboard"
          className={`${styles.nav__link} ${
            location.pathname === "/dashboard" ? styles.active_link : ""
          }`}
        >
          <i className="ri-dashboard-3-fill"></i>
          <span className={styles.nav__name}>Home</span>
        </Link>

        {/* ACCOUNT */}
        <Link
          to="/dashboard/account"
          className={`${styles.nav__link} ${
            location.pathname.startsWith("/dashboard/account")
              ? styles.active_link
              : ""
          }`}
        >
          <i className="ri-account-box-fill"></i>
          <span className={styles.nav__name}>Accounts</span>
        </Link>

        {/* APPLICATIONS */}
        <Link
          to="/dashboard/applications"
          className={`${styles.nav__link} ${
            location.pathname.startsWith("/dashboard/applications")
              ? styles.active_link
              : ""
          }`}
        >
          <i className="ri-rocket-line"></i>
          <span className={styles.nav__name}>Applications</span>
        </Link>

        {/* FILES */}
        <Link
          to="/dashboard/files"
          className={`${styles.nav__link} ${
            location.pathname.startsWith("/dashboard/files")
              ? styles.active_link
              : ""
          }`}
        >
          <i className="ri-file-list-3-fill"></i>
          <span className={styles.nav__name}>Files</span>
        </Link>

        {/* SETTINGS */}
        <Link
          to="/dashboard/settings"
          className={`${styles.nav__link} ${
            location.pathname.startsWith("/dashboard/settings")
              ? styles.active_link
              : ""
          }`}
        >
          <i className="ri-settings-3-fill"></i>
          <span className={styles.nav__name}>Settings</span>
        </Link>
      </ul>

      {/* <div className={styles.nav__circle1}></div>
      <div className={styles.nav__circle2}></div>

      <div className={styles.nav__square1}></div>
      <div className={styles.nav__square2}></div> */}
    </nav>
  );
};

export default Sidebar;