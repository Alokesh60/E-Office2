import React from 'react';
import { Link, useLocation } from 'react-router-dom';


const Sidebar = () => {
  const location = useLocation();
  
  return (
        
        <nav className="nav">
            <ul className="nav__list">
                <Link to="/" className={`nav__link ${location.pathname === '/' ? 'active-link' : ''}`}>
                    <i className="ri-dashboard-3-line"></i>
                    <span className="nav__name">Home</span>
                </Link>

                <Link to="/account" className={`nav__link ${location.pathname === '/account' ? 'active-link' : ''}`}>
                    <i className="ri-account-box-line"></i>
                    <span className="nav__name">Accounts</span>
                </Link>

                <Link to="#" className="nav__link">
                    <i className="ri-rocket-line"></i>
                    <span className="nav__name">Applications</span>
                </Link>

                <Link to="/files" className={`nav__link ${location.pathname === '/files' ? 'active-link' : ''}`}>
                    <i className="ri-file-list-3-line"></i>
                    <span className="nav__name">Files</span>
                </Link>

                <Link to="/settings" className={`nav__link ${location.pathname === '/settings' ? 'active-link' : ''}`}>
                    <i className="ri-settings-3-line"></i>
                    <span className="nav__name">Settings</span>
                </Link>
            </ul>

            <div className="nav__circle-1"></div>
            <div className="nav__circle-2"></div>

            <div className="nav__square-1"></div>
            <div className="nav__square-2"></div>
        </nav>

  );
};

export default Sidebar;

