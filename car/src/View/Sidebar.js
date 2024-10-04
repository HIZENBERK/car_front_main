import React, { useState } from 'react';
import axios from 'axios'; // axios 임포트
import '../CSS/Sidebar.css'; // 사이드바에 대한 CSS

const Sidebar = () => {
    const [companyName, setCompanyName] = useState('');   // 회사 이름 상태
    const [errorMessage, setErrorMessage] = useState(''); // 에러 메시지 상태
    const [selectedItem, setSelectedItem] = useState(null); // 선택된 항목의 상태 관리

    const handleLogin = async () => {
        try {
          // 로그인 성공 시 회사 이름 API 호출 (예: 로그인 후 토큰이나 유저 데이터가 필요할 수 있음)
          const response = await axios.get('https://hizenberk.github.io/api/users/');
          // 성공적으로 회사 이름을 받아왔을 때 상태 업데이트
          setCompanyName(response.data.company_name);
          setErrorMessage(''); // 에러 메시지 초기화
        } catch (error) {
          // 에러 발생 시 에러 메시지 설정
          setErrorMessage('로그인 또는 데이터 불러오기에 실패했습니다.');
          console.error('Error:', error);
        }
      };

    const handleClick = (index) => {
        setSelectedItem(index); // 클릭된 항목의 인덱스를 상태로 설정
    };

    const menuItems = ['대시보드', '사용자 관리', '차량 관리', '차량 운행 내역', '지출관리']; // 메뉴 항목들
    const settingsMenuItems = ['설정']; // 설정 메뉴 항목들

    return (
        <div className="sidebar">
            <div className="company-section">
                <div className="profile-circle"></div>
                <div className="company-name">{companyName}</div>
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
