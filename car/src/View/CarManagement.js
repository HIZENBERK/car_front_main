import React, { useState } from 'react';
import '../CSS/CarManagement.css'; // 스타일 파일 가져오기

const CarManagement = () => {
    const [activeTab, setActiveTab] = useState('차량목록');
    const [isFormVisible, setFormVisible] = useState(false); // 차량 등록 양식의 가시성 상태
    const [saleType, setSaleType] = useState(''); // 매매, 리스, 렌트 선택 상태
    const [selectedCar, setSelectedCar] = useState(null); // 선택된 차량 데이터

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

    const car_list = [
        { state: '리스', car: '제네시스', cumulative_distance: '123km', distance: '20km', date: '10-23' },
        { state: '리스', car: '포터', cumulative_distance: '123km', distance: '20km', date: '10-23' },
        { state: '리스', car: '람보르기니', cumulative_distance: '123km', distance: '20km', date: '10-23' },
    ];

    const car_data = [
        { img: '이미지', num: '123가 4567', expiration_date: '10/12', cumulative_distance: '123km', engine: '1234', ac: '3333', break: '555', tire: '4213' },
        { img: '이미지', num: '125나 8545' },
        { img: '이미지', num: '254허 2554' },
        { img: '이미지', num: '224경 4653' },
    ];

    // 차량 테이블의 행을 클릭했을 때
    const handleCarTableClick = (car) => {
        setSelectedCar(car); // 선택된 차량 데이터를 상태에 저장
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

                {activeTab === '차량목록' && (
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
                                {car_list.map((car_list, index) => (
                                    <tr key={index} className="clickable-row">
                                        <td>{car_list.state}</td>
                                        <td>{car_list.car}</td>
                                        <td>{car_list.cumulative_distance}</td>
                                        <td>{car_list.distance}</td>
                                        <td>{car_list.date}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {activeTab === '정비이력' && (
                    <div className="car-management-d-box">
                        <div className="car-management-e-box">
                            <table className="car-management-car-table">
                                <thead>
                                    <tr>
                                        <th className="car-management-car-table-car">차량</th>
                                        <th className="car-management-car-table-car-num">차량 번호</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {car_data.map((car, index) => (
                                        <tr key={index} onClick={() => handleCarTableClick(car)} className="car-management-clickable-row">
                                            <td className="car-management-car-table-td-img">{car.img}</td>
                                            <td className="car-management-car-table-td-num">{car.num}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        <div className="car-management-f-box">

                            <div className="car-management-g-box">
                                {/* 선택된 차량 데이터 표시 */}
                                {selectedCar ? (
                                    <div className="regular-vehicle-inspection">
                                        <p>선택된 차량 번호: {selectedCar.num}</p>
                                        <p>정기검사 만료일: {selectedCar.expiration_date}</p>
                                        <p>누적 주행거리: {selectedCar.cumulative_distance}</p>
                                        <p>엔진오일: {selectedCar.engine}</p>
                                        <p>에어컨: {selectedCar.ac}</p>
                                        <p>브레이크: {selectedCar.break}</p>
                                        <p>타이어: {selectedCar.tire}</p>
                                    </div>
                                ) : (
                                    <p>차량을 선택하세요.</p>
                                )}
                            </div>

                            <div className="car-management-h-box">

                                <div className="car-management-i-box">
                                    {/* 추가적으로 원하는 내용 여기에 표시 */}
                                </div>

                                <div className="car-management-j-box">
                                    {/* 추가적으로 원하는 내용 여기에 표시 */}
                                </div>

                            </div>

                        </div>

                    </div>
                )}

            </div>
            
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
                                    checked={saleType === '매매'} 
                                    onChange={() => handleSaleTypeChange('매매')} 
                                /> 매매
                            </label>
                            <label>
                                <input 
                                    type="checkbox" 
                                    value="리스" 
                                    checked={saleType === '리스'} 
                                    onChange={() => handleSaleTypeChange('리스')} 
                                /> 리스
                            </label>
                            <label>
                                <input 
                                    type="checkbox" 
                                    value="렌트" 
                                    checked={saleType === '렌트'} 
                                    onChange={() => handleSaleTypeChange('렌트')} 
                                /> 렌트
                            </label>
                        </div>
                    </div>
                    <div className="form-group">
                        <label>선수금:</label>
                        <input type="number" disabled={saleType !== '매매'} />
                    </div>
                    <div className="form-group">
                        <label>보증금:</label>
                        <input type="number" disabled={saleType !== '매매'} />
                    </div>
                    <div className="form-group">
                        <label>만기일:</label>
                        <input type="date" disabled={saleType !== '매매'} />
                    </div>
                    <button className="submit-button" onClick={handleSubmit}>확인</button> {/* 확인 버튼 */}
                </div>
            )}
            
        </div>
    );
};

export default CarManagement;
