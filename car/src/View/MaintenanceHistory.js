import React, { useState } from 'react';
import '../CSS/CarManagement.css';
import 'bootstrap/dist/css/bootstrap.min.css';

const MaintenanceHistory = () => {
    const [selectedCar, setSelectedCar] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const car_data = [
        { img: '/Img/9409_42742_3533.jpg', num: '123가 4567', expiration_date: '10/12', cumulative_distance: '123km', engine: '1234', ac: '3333', break: '555', tire: '4213' },
        { img: '/Img/60920_127896_4054.jpg', num: '125나 8545', expiration_date: '10/30', cumulative_distance: '144km', engine: '4850', ac: '2341', break: '3411', tire: '5000' },
        { img: '/Img/63219_148910_538.jpg', num: '254허 2554', expiration_date: '9/15', cumulative_distance: '200km', engine: '1000', ac: '4000', break: '3500', tire: '3332' },
        { img: '/Img/carnival_exterior_front_view_pc.jpg', num: '224경 4653', expiration_date: '10/15', cumulative_distance: '300km', engine: '2000', ac: '2000', break: '8000', tire: '3214' },
    ];

    const carStatusEngine = () => {
        const maxLimit = 10000;
        return {
            engine: selectedCar ? (selectedCar.engine / maxLimit) * 100 : 0,
        };
    };

    const carStatusAc = () => {
        const maxLimit = 15000;
        return {
            ac: selectedCar ? (selectedCar.ac / maxLimit) * 100 : 0,
        };
    };

    const carStatusBreak = () => {
        const maxLimit = 10000;
        return {
            break: selectedCar ? (selectedCar.break / maxLimit) * 100 : 0,
        };
    };

    const carStatusTire = () => {
        const maxLimit = 60000;
        return {
            tire: selectedCar ? (selectedCar.tire / maxLimit) * 100 : 0,
        };
    };

    const handleCarTableClick = (car) => {
        setSelectedCar(car);
    };

    const handleModalOpen = () => {
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    const updateModal = () => {
        setIsModalOpen(false);
    };

    const handleYearChange = (event) => {
        const selectedYear = event.target.value;
        console.log(`${selectedYear}년 데이터를 불러옵니다.`);
    };

    return (
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
                            <tr key={index} onClick={() => handleCarTableClick(car)}
                                className="car-management-clickable-row">
                                <img src={car.img} alt="Car" className="car-management-car-table-td-img" />
                                <td className="car-management-car-table-td-num">{car.num}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="car-management-f-box">
                {selectedCar ? (
                    <>
                        <div className="car-management-g-box">
                            <div className="car-management-g-box-top">
                                <p className="car-management-g-box-top-text">차량 정기 검사</p>
                                <a
                                    className="car-management-g-box-top-text-href"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    href='https://www.cyberts.kr/cp/pvr/prm/readCpPvrPrsecResveMainView.do'
                                >
                                    정기검사예약
                                </a>
                            </div>
                            <div className="car-management-g-box-middle-text-box">
                                <p className="car-management-g-box-middle-title">정기검사 만료일</p>
                                <p className="car-management-g-box-middle-text">{selectedCar.expiration_date}</p>
                            </div>
                            <div className="car-management-g-box-middle-text-box">
                                <p className="car-management-g-box-middle-title">누적주행거리</p>
                                <p className="car-management-g-box-middle-text-distance">{selectedCar.cumulative_distance}</p>
                            </div>

                            <p className="car-management-g-box-middle-top-text">소모품 현황</p>
                            {/* 엔진 진행률 */}
                            <div className="car-management-progressbar-box">
                                <div className="car-management-progressbar-title-box">
                                    <p className="car-management-progressbar-title">엔진오일 및 필터</p>
                                    <p className="car-management-progressbar-text">{selectedCar ? `${selectedCar.engine} / 10000Km` : '데이터 없음'}</p>
                                </div>
                                <div className="progress" role="progressbar" aria-label="Animated striped example"
                                    aria-valuenow={carStatusEngine().engine} aria-valuemin="0" aria-valuemax="100" style={{ width: '80%' }}>
                                    <div className="progress-bar progress-bar-striped progress-bar-animated"
                                        style={{ width: `${carStatusEngine().engine}%` }}>
                                    </div>
                                </div>
                            </div>
                            {/* 에어컨 진행률 */}
                            <div className="car-management-progressbar-box">
                                <div className="car-management-progressbar-title-box">
                                    <p className="car-management-progressbar-title">에어컨 필터(향균 필터)</p>
                                    <p className="car-management-progressbar-text">{selectedCar ? `${selectedCar.ac} / 15000Km` : '데이터 없음'}</p>
                                </div>
                                <div className="progress" role="progressbar" aria-label="Animated striped example"
                                    aria-valuenow={carStatusAc().ac} aria-valuemin="0" aria-valuemax="100" style={{ width: '80%' }}>
                                    <div className="progress-bar progress-bar-striped progress-bar-animated bg-info"
                                        style={{ width: `${carStatusAc().ac}%` }}>
                                    </div>
                                </div>
                            </div>
                            {/* 브레이크 진행률 */}
                            <div className="car-management-progressbar-box">
                                <div className="car-management-progressbar-title-box">
                                    <p className="car-management-progressbar-title">브레이크 패드 및 디스크</p>
                                    <p className="car-management-progressbar-text">{selectedCar ? `${selectedCar.break} / 10000Km` : '데이터 없음'}</p>
                                </div>
                                <div className="progress" role="progressbar" aria-label="Animated striped example"
                                    aria-valuenow={carStatusBreak().break} aria-valuemin="0" aria-valuemax="100" style={{ width: '80%' }}>
                                    <div className="progress-bar progress-bar-striped progress-bar-animated bg-danger"
                                        style={{ width: `${carStatusBreak().break}%` }}>
                                    </div>
                                </div>
                            </div>
                            {/* 타이어 진행률 */}
                            <div className="car-management-progressbar-box">
                                <div className="car-management-progressbar-title-box">
                                    <p className="car-management-progressbar-title">타이어</p>
                                    <p className="car-management-progressbar-text">{selectedCar ? `${selectedCar.tire} / 60000Km` : '데이터 없음'}</p>
                                </div>
                                <div className="progress" role="progressbar" aria-label="Animated striped example"
                                    aria-valuenow={carStatusTire().tire} aria-valuemin="0" aria-valuemax="100" style={{ width: '80%' }}>
                                    <div className="progress-bar progress-bar-striped progress-bar-animated bg-warning"
                                        style={{ width: `${carStatusTire().tire}%` }}>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="car-management-h-box">
                            <div className="car-management-i-box">
                                <select className="car-management-year-select" onChange={handleYearChange}>
                                    <option value="2024">2024년</option>
                                    <option value="2023">2023년</option>
                                    <option value="2022">2022년</option>
                                    <option value="2021">2021년</option>
                                </select>
                                <button className="car-management-registration-maintenance" onClick={handleModalOpen}>정비 등록</button>
                            </div>
                            <div className="car-management-j-box">
                                <table className="car-management-car-maintenance-table">
                                    <thead>
                                        <tr>
                                            <th>정비 일자</th>
                                            <th>정비 내용</th>
                                            <th>누적 주행 거리</th>
                                            <th>금액</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td>10/10</td>
                                            <td>타이어</td>
                                            <td>123km</td>
                                            <td>21,300</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="car-management-select-car-box">
                        <p className="car-management-select-car">차량을 선택하세요.</p>
                    </div>
                )}
            </div>

            {isModalOpen && (
                <div className="car-management-modal-overlay">
                    <div className="car-management-modal">
                        <h2>정비 등록</h2>
                        <div className="car-management-modal-content">
                            <div className="car-label-box">
                                <label className="car-label-text">정비 일자:</label>
                                <div className="car-label-input-with-icon">
                                    <input type="date" className="car-label-input-date" />
                                </div>
                            </div>
                            <div className="car-label-box">
                                <label className="car-label-text">누적 주행 거리:</label>
                                <input type="text" className="car-label-input" />Km
                            </div>
                            <div className="car-label-box">
                                <select className="car-management-maintenance-select" onChange={handleYearChange}>
                                    <option value="엔진오일 및 필터">엔진오일 및 필터</option>
                                    <option value="에어컨 필터(향균 필터)">에어컨 필터(향균 필터)</option>
                                    <option value="브레이크 패드 및 디스크">브레이크 패드 및 디스크</option>
                                    <option value="타이어">타이어</option>
                                </select>
                                <label className="car-label-text">금액:</label>
                                <input type="text" className="car-label-input-price" />원
                            </div>
                        </div>
                        <button className="car-management-update-btn" onClick={updateModal}>등록</button>
                        <button className="car-management-close-btn" onClick={closeModal}>닫기</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MaintenanceHistory;
