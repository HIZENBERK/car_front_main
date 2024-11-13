import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom'; // React Router에서 useNavigate import
import axios from 'axios'; // 회사명 가져오기 위해 axios import
import '../CSS/Sidebar.css';
import { useAuth } from "../Component/AuthContext"; // CSS 파일 import
import 'bootstrap-icons/font/bootstrap-icons.css';

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
    //                 console.log(response.data);
    //                 setCompanyName(response.data.company_name); // 회사명 설정
    //             // }
    //         } catch (error) {
    //             console.error('회사명 가져오기 실패:', error);
    //         }
    //     };

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
        { name: '대시보드', path: '/admin', icon: 'fas fa-tachometer-alt', color: 'white' },
        { name: '공지사항', path: '/notice', icon: 'fas fa-bell', color: 'white' },
        { name: '사용자 관리', path: '/usermanagement', icon: 'fas fa-users', color: 'white' },
        { name: '차량 관리', path: '/CarManagement', icon: 'fas fa-car', color: 'white' },
        { name: '차량 운행 내역', path: '/CarHistory', icon: 'fas fa-history', color: 'white' },
        { name: '지출관리', path: '/expensemanagement', icon: 'fas fa-money-bill', color: 'white' },
    ];

    const settingsMenuItems = [
        { name: '설정', path: '/settings', icon: 'bi bi-gear-fill', color: 'white' } // 설정 메뉴 항목
    ];

    // 현재 경로가 해당 경로로 시작하는지 확인하는 함수
    const isSelected = (path) => location.pathname.startsWith(path);

    return (
        <div className="sidebar">
            <div className="company-section">
                <div className="profile-circle">
                  <img src={require('../Img/car.jpg')} alt="Car" style={{ width: '100%', height: '100%', borderRadius: '50%' }} />
                </div>
                <div className="company-name">{authState.company_name}</div> {/* 회사명 표시 */}
            </div>
            <div className="menu">
            {menuItems.map((item, index) => (
            <div key={index}>
                <div
                    className={`menu-item ${isSelected(item.path) ? 'selected' : ''}`}
                    style={{
                        backgroundColor: isSelected(item.path) ? '#ddd' : '#f8f8f8',
                        fontWeight: isSelected(item.path) ? 'bold' : 'normal',
                        display: 'flex',
                        alignItems: 'center',
                        padding: '10px',
                        cursor: 'pointer',
                    }}
                    onClick={() => handleClick(item.path)}
                >
                    <i className={item.icon}
                       style={{
                           marginRight: '8px',
                           color: isSelected(item.path) ? '#272b34' : item.color,
                    }}></i> {/* 아이콘 색상 추가 */}
                    {item.name}
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
                                fontWeight: isSelected(item.path) ? 'bold' : 'normal', // 선택된 경로는 글씨체 bold
                                display: 'flex', // flexbox 사용
                                alignItems: 'center', // 수직 중앙 정렬
                                padding: '10px', // 패딩 추가
                                cursor: 'pointer', // 커서 포인터
                                textAlign: 'left', // 텍스트 왼쪽 정렬
                            }}
                            onClick={() => handleClick(item.path)} // 클릭 시 해당 경로로 이동
                        >
                            <i className={item.icon} style={{ marginRight: '8px' }}></i> {/* 아이콘 추가 */}
                            {item.name} {/* 설정 메뉴 이름 출력 */}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Sidebar;
