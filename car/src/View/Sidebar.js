import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom'; // React Router에서 useNavigate import
import axios from 'axios'; // 회사명 가져오기 위해 axios import
import '../CSS/Sidebar.css';
import {useAuth} from "../Component/AuthContext"; // CSS 파일 import

const Sidebar = () => {
    const [companyName, setCompanyName] = useState(''); // 회사명 상태
    const navigate = useNavigate(); // 페이지 이동을 위한 useNavigate 훅 사용
    const location = useLocation(); // 현재 경로 감지
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
    const handleClick = (path) => {
        if (path) {
            navigate(path); // 경로가 있을 경우에만 해당 경로로 이동
        }
    };

    // 메뉴 항목 리스트와 각각의 경로 정의
    const menuItems = [
        { name: '대시보드', path: '/admin' },
        { name: '공지사항', path: '/notice' },
        { name: '사용자 관리', path: '/usermanagement' },
        { name: '차량 관리', path: '/CarManagement' }, // 차량 관리 메뉴
        { name: '차량 운행 내역', path: '/CarHistory' },
        { name: '지출관리', path: '/expensemanagement' },
        { name: '사용자 추가', path: '/signup' }
    ];

    const settingsMenuItems = [
        { name: '설정', path: '/settings' } // 설정 메뉴 항목
    ];

    // 현재 경로가 해당 경로로 시작하는지 확인하는 함수
    const isSelected = (path) => location.pathname.startsWith(path);

    return (
        <div className="sidebar">
            <div className="company-section">
                <div className="profile-circle"></div>
                <div className="company-name">{authState.company_name}</div> {/* 회사명 표시 */}
            </div>
            <div className="menu">
                {menuItems.map((item, index) => (
                    <div key={index}>
                        <div
                            className={`menu-item ${isSelected(item.path) ? 'selected' : ''}`} // 선택된 경로에 'selected' 클래스 추가
                            style={{
                                backgroundColor: isSelected(item.path) ? '#ddd' : '#f8f8f8', // 선택된 경로는 #ddd, 그 외는 #f8f8f8
                                fontWeight: isSelected(item.path) ? 'bold' : 'normal' // 선택된 경로는 글씨체 bold
                            }}
                            onClick={() => handleClick(item.path)} // 클릭 시 해당 경로로 이동
                        >
                            {item.name} {/* 메뉴 이름 출력 */}
                        </div>
                    </div>
                ))}
            </div>
            <div className="settings-menu">
                {settingsMenuItems.map((item, index) => (
                    <div key={index}>
                        <div
                            className={`menu-item ${isSelected(item.path) ? 'selected' : ''}`} // 선택된 경로에 'selected' 클래스 추가
                            style={{
                                backgroundColor: isSelected(item.path) ? '#ddd' : '#f8f8f8', // 선택된 경로는 #ddd, 그 외는 #f8f8f8
                                fontWeight: isSelected(item.path) ? 'bold' : 'normal' // 선택된 경로는 글씨체 bold
                            }}
                            onClick={() => handleClick(item.path)} // 클릭 시 해당 경로로 이동
                        >
                            {item.name} {/* 설정 메뉴 이름 출력 */}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Sidebar;
