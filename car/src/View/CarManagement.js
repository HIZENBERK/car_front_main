import React, { useState } from 'react';
import '../CSS/CarManagement.css'; // 스타일 파일 가져오기

const CarManagement = () => {
    const [activeTab, setActiveTab] = useState('차량목록');
    const [isFormVisible, setFormVisible] = useState(false); // 차량 등록 양식의 가시성 상태
    const [saleType, setSaleType] = useState(''); // 매매, 리스, 렌트 선택 상태

    const handleTabClick = (tab) => {
        setActiveTab(tab);
        setFormVisible(false); // 탭 변경 시 양식 닫기
    };

    const handleRegisterClick = () => {
        setFormVisible(true); // 등록 버튼 클릭 시 양식 보이기
    };

    const handleSubmit = () => {
        setFormVisible(false); // 확인 버튼 클릭 시 양식 닫기
        // 여기서 추가적으로 양식 데이터를 처리할 수 있습니다.
    };

    const handleSaleTypeChange = (type) => {
        setSaleType(type); // 선택한 매매, 리스, 렌트 상태로 변경
    };

    return (
        <div className="car-management">

            <div className="car-management-top">
                <p className="car-management-top-text">차량 관리</p>
            </div>
            
            <div className="car-management-a-box">

                <div className="car-management-b-box">
                    <div className="tab-menu">
                        <span 
                            className={`tab ${activeTab === '차량목록' ? 'active' : ''}`}
                            onClick={() => handleTabClick('차량목록')}
                        >
                            차량목록
                        </span>
                        <span 
                            className={`tab ${activeTab === '정비이력' ? 'active' : ''}`}
                            onClick={() => handleTabClick('정비이력')}
                        >
                            정비이력
                        </span>
                    </div>
                </div>

                {activeTab ==='차량목록' && (
                    <div className="car-management-c-box">
                            <div className="register-section">
                                <button className="register-button" onClick={handleRegisterClick}>차량등록</button>
                                <input className="dropdown-input" type="text" placeholder="▼" />
                                <button className="search-button">조회</button>
                            </div>
                    
                        <table className="car-table">
                            <thead>
                                <tr>
                                    <th>상태</th>
                                    <th>차량</th>
                                    <th>전체 누적거리</th>
                                    <th>이번달 운행 거리</th>
                                    <th>등록일</th>
                                </tr>
                            </thead>
                            <tbody>
                                {/* 테이블 데이터 (예시로 비워둠) */}
                                <tr><td colSpan="5" className="empty-row"></td></tr>
                                <tr><td colSpan="5" className="empty-row"></td></tr>
                                <tr><td colSpan="5" className="empty-row"></td></tr>
                                <tr><td colSpan="5" className="empty-row"></td></tr>
                                <tr><td colSpan="5" className="empty-row"></td></tr>
                            </tbody>
                        </table>
                    </div>
                )}

                {activeTab ==='정비이력' && (
                    <div className="car-management-d-box">
                        
                        <div className="car-management-e-box">
                            <div className="vehicle-list">
                                <p><b>구분</b> <span className="vehicle-label">차량</span></p>  {/* 구분 옆에 차량 추가 */}
                                <div className="separator"></div> {/* 구분선 추가 */}
                                <div className="vehicle-input-container">
                                    <input type="text" className="vehicle-input"/>
                                    <div className="vehicle-info-container">
                                        <span className="vehicle-number">123가1234</span> {/* 차량 번호 */}
                                        <span className="vehicle-model">올뉴K3</span> {/* 차량 모델 */}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="car-management-f-box">

                            <div className="car-management-g-box">
                                {/* 차량 정기 검사 섹션 */}
                                <div className="inspection-section">
                                    <p><b>차량 정기 검사</b></p>
                                    <div className="inspection-details">
                                        <div className="detail-box">
                                            <p>정기검사 만료일: <b>2025. 11. 11</b></p>
                                        </div>
                                        <div className="detail-box">
                                            <p>누적주행거리: <b>123,456 km</b></p>
                                        </div>
                                    </div>
                                    <div className="inspection-items">
                                        <div className="inspection-item">
                                            <label>엔진오일 및 필터:</label>
                                            <input type="text" className="inspection-input" />
                                        </div>
                                        <div className="inspection-item">
                                            <label>연료계 필터:</label>
                                            <input type="text" className="inspection-input" />
                                        </div>
                                        <div className="inspection-item">
                                            <label>브레이크 패드 및 디스크:</label>
                                            <input type="text" className="inspection-input" />
                                        </div>
                                        <div className="inspection-item">
                                            <label>타이어:</label>
                                            <input type="text" className="inspection-input" />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="car-management-h-box">

                                <div className="car-management-i-box">

                                </div>

                                <div className="car-management-j-box">

                                </div>

                            </div>

                        </div>

                    </div>
                )}

            </div>
            
        </div>
    );
};

export default CarManagement;
