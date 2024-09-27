import React, { useState } from 'react';
import '../CSS/Sidebar.css'; // 사이드바에 대한 CSS

const Sidebar = () => {
    const [selectedItem, setSelectedItem] = useState(null); // 선택된 항목의 상태 관리

    const handleClick = (index) => {
        setSelectedItem(index); // 클릭된 항목의 인덱스를 상태로 설정
    };

    const menuItems = ['대시보드', '사용자 관리', '차량 관리', '차량 운행 내역', '지출관리']; // 메뉴 항목들
    const settingsMenuItems = ['설정']; // 설정 메뉴 항목들

    return (
        <div className="sidebar">
            <div className="company-section">
                <div className="profile-circle"></div>
                <div className="company-name">회사명</div>
            </div>
            <div className="menu">
                <hr />
                {menuItems.map((item, index) => (
                    <div key={index}>
                        <div
                            className={`menu-item ${selectedItem === index ? 'selected' : ''}`} // 선택된 항목에 'selected' 클래스 추가
                            onClick={() => handleClick(index)} // 클릭 시 해당 인덱스를 선택
                        >
                            {item}
                        </div>
                        <hr />
                    </div>
                ))}
            </div>
            <div className="settings-menu">
                <hr />
                
                {settingsMenuItems.map((item, index) => (
                    <div key={index}>
                        <div
                            className={`menu-item ${selectedItem === menuItems.length + index ? 'selected' : ''}`} // 선택된 항목에 'selected' 클래스 추가
                            onClick={() => handleClick(menuItems.length + index)} // 클릭 시 해당 인덱스를 선택
                        >
                            {item}
                        </div>
                        <hr />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Sidebar;
