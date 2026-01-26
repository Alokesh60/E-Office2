import React from 'react';


const Sidebar = () => {
  return (
        
        <nav class="nav">
            <ul class="nav__list">
                <a href="#" class="nav__link active-link">
                    <i class="ri-dashboard-3-line"></i>
                    <span class="nav__name">Home</span>
                </a>

                <a href="#" class="nav__link">
                    <i class="ri-account-box-line"></i>
                    <span class="nav__name">Accounts</span>
                </a>

                <a href="#" class="nav__link">
                    <i class="ri-rocket-line"></i>
                    <span class="nav__name">Applications</span>
                </a>

                <a href="#" class="nav__link">
                    <i class="ri-file-list-3-line"></i>
                    <span class="nav__name">Files</span>
                </a>

                <a href="#" class="nav__link">
                    <i class="ri-settings-3-line"></i>
                    <span class="nav__name">Settings</span>
                </a>
            </ul>

            <div class="nav__circle-1"></div>
            <div class="nav__circle-2"></div>

            <div class="nav__square-1"></div>
            <div class="nav__square-2"></div>
        </nav>

  );
};

export default Sidebar;

