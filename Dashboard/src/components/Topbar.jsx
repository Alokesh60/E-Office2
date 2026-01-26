import React from 'react';

const Topbar = () => {
  return (
    <header className="top-header">
                <img src="/images/logo.png" alt="Logo" className="College"/>
                <div class="college-name">
                    <h1>
                        <span class="changetext activetext">राष्ट्रीय प्रौद्योगिकी संस्थान सिलचर</span>
    
                    </h1>
                    <p>NATIONAL INSTITUTE OF TECHNOLOGY SILCHAR</p>
                    <small>An Institute of National Importance</small>
                    
                </div>

                <div className="search-container">
                    <div className="search-bar">
                        <img src="/images/search.png" alt="Search" className="search-icon-img"/>
                        <input type="text" placeholder="Search applications....." className="search-input"/>
                        <button className="search-button">
                            <i class="fas fa-search"></i>
                        </button>
                    </div>
                </div>
                <div className="header-icons">
                    <div className="notification-bell">
                        <img src="/images/notification-icon.png" alt="Notifications"/>
                    </div>
                    <div className="profile-circle">
                        <img src="/images/profile.png" alt="Profile"/>
                    </div>
                </div>
            </header>
  );
};

export default Topbar;

