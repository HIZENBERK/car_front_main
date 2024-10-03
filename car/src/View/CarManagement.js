import React, { useState } from 'react';
import '../CSS/CarManagement.css'; // 스타일 파일 가져오기

const CarManagement = () => {
    const [activeTab, setActiveTab] = useState('차량목록');
    const [isFormVisible, setFormVisible] = useState(false); // 차량 등록 양식의 가시성 상태
    const [isSaleChecked, setIsSaleChecked] = useState(false); // 매매 체크 상태

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

    const handleSaleChange = () => {
        setIsSaleChecked(!isSaleChecked); // 매매 체크박스 상태 토글
    };

    return (
        <div className="car-management">
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
            
            <div className="underline"></div> {/* 길게 그어줄 선 추가 */}
            
            {activeTab === '차량목록' && ( // 차량목록 탭일 때만 등록 섹션 보이기
                <div className="register-section">
                    <button className="register-button" onClick={handleRegisterClick}>차량등록</button>
                    <input className="dropdown-input" type="text" placeholder="▼" />
                    <button className="search-button">조회</button>
                </div>
            )}
            
            {activeTab === '차량목록' && ( // 차량목록 탭일 때만 차량 목록 테이블 보이기
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
            )}

            {/* 정비 이력 화면 */}
            {activeTab === '정비이력' && (
                <div className="maintenance-section">
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

                        {/* 더 많은 차량 리스트 */}
                    </div>

                    {/* 차량 정기 검사 섹션 */}
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


                    <div className="year-selector">
                        <select>
                            <option>2024년</option>
                            {/* 추가 연도 옵션 */}
                        </select>
                    </div>

                    <div className="maintenance-table">
                        <table>
                            <thead>
                                <tr>
                                    <th>정비일자</th>
                                    <th>정비내용</th>
                                    <th>누적주행거리</th>
                                    <th>금액</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>2024.9.19</td>
                                    <td>타이어</td>
                                    <td>12,345km</td>
                                    <td>45,000원</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* 차량 등록 양식 */}
            {isFormVisible && (
                <div className="registration-form active">
                    <div className="form-group">
                        <label>등록일:</label>
                        <input type="date" defaultValue={new Date().toISOString().split("T")[0]} />
                    </div>
                    <div className="form-group">
                        <label>차량 등록번호:</label>
                        <input type="text" />
                    </div>
                    <div className="form-group">
                        <label>차대번호:</label>
                        <input type="text" />
                    </div>
                    <div className="form-group">
                        <label>유형:</label>
                        <div className="checkbox-group">
                            <label>
                                <input 
                                    type="checkbox" 
                                    value="매매" 
                                    checked={isSaleChecked} 
                                    onChange={handleSaleChange} 
                                /> 매매
                            </label>
                            <label>
                                <input 
                                    type="checkbox" 
                                    value="리스" 
                                    onChange={handleSaleChange} 
                                /> 리스
                            </label>
                            <label>
                                <input 
                                    type="checkbox" 
                                    value="렌트" 
                                    onChange={handleSaleChange} 
                                /> 렌트
                            </label>
                        </div>
                    </div>
                    <div className="form-group">
                        <label>선수금:</label>
                        <input type="number" disabled={isSaleChecked} />
                    </div>
                    <div className="form-group">
                        <label>보증금:</label>
                        <input type="number" disabled={isSaleChecked} />
                    </div>
                    <div className="form-group">
                        <label>만기일:</label>
                        <input type="date" disabled={isSaleChecked} />
                    </div>
                    <button className="submit-button" onClick={handleSubmit}>확인</button> {/* 확인 버튼 */}
                </div>
            )}
        </div>
    );
};

export default CarManagement;
