import React from 'react';
import '../CSS/Sidebar.css'; // 사이드바에 대한 CSS

const Sidebar = () => {
    return (
        <div className="sidebar">
            <div className="company-section">
                <div className="profile-circle"></div>
                <div className="company-name">회사명</div>
            </div>
            <div className="menu">
                <div className="menu-item">사용자 관리</div>
                <div className="menu-item">차량 관리</div>
                <div className="menu-item">차량 운행 내역</div>
                <div className="menu-item">지출관리</div>
            </div>
        </div>
    );
};

export default Sidebar;
