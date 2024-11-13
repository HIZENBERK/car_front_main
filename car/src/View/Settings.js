import React, { useState } from 'react';
import '../CSS/Settings.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

function Settings() {
    const [showSources, setShowSources] = useState(false);

    const menuItems = [
        { name: '대시보드', icon: 'fas fa-tachometer-alt', color: 'black', source: 'https://fontawesome.com/icons' },
        { name: '공지사항', icon: 'fas fa-bell', color: 'black', source: 'https://fontawesome.com/icons' },
        { name: '사용자 관리', icon: 'fas fa-users', color: 'black', source: 'https://fontawesome.com/icons' },
        { name: '차량 관리', icon: 'fas fa-car', color: 'black', source: 'https://fontawesome.com/icons' },
        { name: '차량 운행 내역', icon: 'fas fa-history', color: 'black', source: 'https://fontawesome.com/icons' },
        { name: '지출관리', icon: 'fas fa-money-bill', color: 'black', source: 'https://fontawesome.com/icons' },
        { name: '뒤로 가기', icon: 'bi bi-arrow-return-left', color: 'black', source: 'https://icons.getbootstrap.kr/icons/arrow-return-left/' },
        { name: '설정', icon: 'bi bi-gear-fill', color: 'black', source: 'https://icons.getbootstrap.kr/icons/gear-fill/'}
    ];

    const toggleSources = () => {
        setShowSources(!showSources);
    };

    return (
        <div className="setting-container">
            <div className="setting-source-toggle" onClick={toggleSources}>
                아이콘 출처 {showSources ? '▲' : '▼'}
            </div>
            {showSources && (
                <div className="setting-source-list">
                    {menuItems.map((item, index) => (
                        <div key={index} className="setting-menu-item">
                            <i className={`${item.icon} setting-icon`}></i>
                            <span className="setting-menu-name">{item.name}</span>
                            <span className="setting-source">출처: {item.source}</span>
                        </div>
                    ))}
                    <div className="setting-company-section">
                        <div className="setting-profile-circle">
                            <img src={require('../Img/car.jpg')} alt="Car"/>
                        </div>
                        <span className="setting-menu-name">자동차 이미지</span>
                        <span className="setting-source">출처: https://kor.pngtree.com/so/%EC%9E%90%EB%8F%99%EC%B0%A8-%EC%95%84%EC%9D%B4%EC%BD%98 </span>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Settings;
