import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // React Router에서 useNavigate import
import axios from 'axios'; // 회사명 가져오기 위해 axios import
import '../CSS/Sidebar.css';
import {useAuth} from "../Component/AuthContext"; // CSS 파일 import

const Sidebar = () => {
    const [selectedItem, setSelectedItem] = useState(null); // 선택된 항목 상태
    const [companyName, setCompanyName] = useState(''); // 회사명 상태
    const navigate = useNavigate(); // 페이지 이동을 위한 useNavigate 훅 사용
    const { authState, logout, LogoutSuccess, setLogoutSuccess } = useAuth();
    // 회사명을 가져오는 함수 (토큰 사용)
    // useEffect(() => {
    //     const fetchCompanyName = async () => {
    //         try {
    //             // const token = localStorage.getItem('token'); // localStorage에서 토큰 가져오기
    //             // if (token) {
    //                 const response = await axios.get('https://hizenberk.github.io/api/users/');
    //                 console.log(response.data)
    //                 setCompanyName(response.data.company_name); // 회사명 설정
    //             // }
    //         } catch (error) {
    //             console.error('회사명 가져오기 실패:', error);
    //         }
    //     };
    //
    //     fetchCompanyName().then(r => null); // 컴포넌트가 마운트될 때 회사명 가져오기
    // }, []);

    // 클릭 핸들러: 선택한 항목의 인덱스와 경로로 이동 처리
    const handleClick = (index, path) => {
        setSelectedItem(index); // 선택된 항목 상태 업데이트
        if (path) {
            navigate(path); // 경로가 있을 경우에만 해당 경로로 이동
        }
    };

    // 메뉴 항목 리스트와 각각의 경로 정의
    const menuItems = [
        { name: '대시보드', path: '/admin' },
        { name: '사용자 관리', path: '/usermanagement' },
        { name: '차량 관리', path: '/CarHistory' }, // 차량 관리 메뉴
        { name: '차량 운행 내역', path: '/trip-history' },
        { name: '지출관리', path: '/expensemanagement' }
    ];

    const settingsMenuItems = [
        { name: '설정', path: '/settings' } // 설정 메뉴 항목
    ];

    return (
        <div className="sidebar">
            <div className="company-section">
                <div className="profile-circle"></div>
                <div className="company-name">{authState.company_name}</div> {/* 회사명 표시 */}
            </div>
            <div className="menu">
                <hr />
                {menuItems.map((item, index) => (
                    <div key={index}>
                        <div
                            className={`menu-item ${selectedItem === index ? 'selected' : ''}`} // 선택된 항목에 'selected' 클래스 추가
                            onClick={() => handleClick(index, item.path)} // 클릭 시 해당 경로로 이동
                        >
                            {item.name} {/* 메뉴 이름 출력 */}
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
                            onClick={() => handleClick(menuItems.length + index, item.path)} // 클릭 시 해당 경로로 이동
                        >
                            {item.name} {/* 설정 메뉴 이름 출력 */}
                        </div>
                        <hr />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Sidebar;
