import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../CSS/CarManagement.css';
import 'bootstrap/dist/css/bootstrap.min.css';

const MaintenanceHistory = ({ authState, refreshAccessToken }) => {
    const [selectedCar, setSelectedCar] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [carData, setCarData] = useState([]);
    const [maintenanceData, setMaintenanceData] = useState([]);
    const [maintenanceDate, setMaintenanceDate] = useState('');
    const [cumulativeDistance, setCumulativeDistance] = useState('');
    const [maintenanceType, setMaintenanceType] = useState('엔진오일 및 필터');
    const [maintenanceCost, setMaintenanceCost] = useState('');

    // 차량 데이터를 불러오는 함수
    const fetchCarData = async () => {
        try {
            const response = await axios.get('https://hizenberk.pythonanywhere.com/api/vehicles/', {
                headers: { Authorization: `Bearer ${authState.access}` }
            });
            setCarData(response.data.vehicles);
        } catch (error) {
            if (error.response?.data?.code === 'token_not_valid') {
                const newAccessToken = await refreshAccessToken();
                if (newAccessToken) {
                    fetchCarData();
                }
            } else {
                console.error('차량 데이터 불러오기 실패:', error);
            }
        }
    };

    // 전체 정비 기록을 불러오는 함수
    const fetchMaintenanceData = async () => {
        try {
            const response = await axios.get('https://hizenberk.pythonanywhere.com/api/maintenances/', {
                headers: { Authorization: `Bearer ${authState.access}` }
            });
            setMaintenanceData(response.data.records);
        } catch (error) {
            if (error.response?.data?.code === 'token_not_valid') {
                const newAccessToken = await refreshAccessToken();
                if (newAccessToken) {
                    fetchMaintenanceData();
                }
            } else {
                console.error('정비 기록 불러오기 실패:', error);
            }
        }
    };

    useEffect(() => {
        fetchCarData();
        fetchMaintenanceData();
    }, []);

    // 차량 데이터가 로드될 때 첫 번째 차량 자동 선택
    useEffect(() => {
        if (carData.length > 0 && !selectedCar) {
            setSelectedCar(carData[0]);
        }
    }, [carData, selectedCar]);

    // 소모품 상태 계산 함수들
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

    const handleYearChange = (event) => {
        const selectedYear = event.target.value;
        console.log(`${selectedYear}년 데이터를 불러옵니다.`);
    };

    // 정비 기록 등록 함수
    const handleMaintenanceSubmit = async () => {
        if (!selectedCar || !maintenanceDate || !maintenanceType || !maintenanceCost) {
            console.error("모든 필드를 입력해야 합니다.");
            return;
        }

        const maintenanceTypeMapping = {
            '엔진오일 및 필터': 'engine_oil_change',
            '에어컨 필터 교체': 'air_filter_change',
            '브레이크 패드 교체': 'brake_pad_change',
            '타이어 교체': 'tire_change',
            '기타': 'other'
        };

        const mappedMaintenanceType = maintenanceTypeMapping[maintenanceType];

        if (!mappedMaintenanceType) {
            console.error("유효하지 않은 정비 유형입니다.");
            return;
        }

        try {
            const response = await axios.post('https://hizenberk.pythonanywhere.com/api/maintenances/create/', {
                vehicle: selectedCar.id,
                maintenance_date: maintenanceDate,
                maintenance_type: mappedMaintenanceType,
                maintenance_cost: parseFloat(maintenanceCost),
                maintenance_description: `${maintenanceType} 작업 완료`,
            }, {
                headers: { Authorization: `Bearer ${authState.access}` }
            });
            console.log('정비 기록 등록 성공:', response.data);
            closeModal();
        } catch (error) {
            if (error.response) {
                console.error('정비 기록 등록 실패:', error.response.data);
                if (error.response.data.errors) {
                    console.error('구체적인 오류:', error.response.data.errors.maintenance_type);
                }
            } else {
                console.error('정비 기록 등록 실패:', error.message);
            }
            if (error.response?.data?.code === 'token_not_valid') {
                const newAccessToken = await refreshAccessToken();
                if (newAccessToken) {
                    handleMaintenanceSubmit();
                }
            }
        }
    };

    // 정비 기록 삭제 함수
    const handleMaintenanceDelete = async (maintenanceId) => {
        try {
            await axios.delete(`https://hizenberk.pythonanywhere.com/api/maintenances/${maintenanceId}/`, {
                headers: { Authorization: `Bearer ${authState.access}` }
            });
            console.log('정비 기록 삭제 성공:', maintenanceId);
            setMaintenanceData(maintenanceData.filter(record => record.id !== maintenanceId));
        } catch (error) {
            if (error.response) {
                console.error('정비 기록 삭제 실패:', error.response.data);
            } else {
                console.error('정비 기록 삭제 실패:', error.message);
            }
            if (error.response?.data?.code === 'token_not_valid') {
                const newAccessToken = await refreshAccessToken();
                if (newAccessToken) {
                    handleMaintenanceDelete(maintenanceId);
                }
            }
        }
    };

    // 선택된 차량에 맞는 정비 기록 필터링
    const filteredMaintenanceData = selectedCar 
        ? maintenanceData.filter(record => record.vehicle === selectedCar.id) 
        : [];

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
                        {carData.map((car, index) => (
                            <tr key={index} onClick={() => handleCarTableClick(car)} className="car-management-clickable-row">
                                <td>
                                    <img src={car.img || '/Img/default_car.jpg'} alt="Car" className="car-management-car-table-td-img" />
                                </td>
                                <td className="car-management-car-table-td-num">{car.license_plate_number}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="car-management-f-box">
                {selectedCar && (
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
                                            <th>삭제</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredMaintenanceData.map((record, index) => (
                                            <tr key={index}>
                                                <td>{record.maintenance_date}</td>
                                                <td>{record.maintenance_type_display}</td>
                                                <td>{record.cumulative_distance || '데이터 없음'}</td>
                                                <td>{record.maintenance_cost} 원</td>
                                                <td>
                                                    <button 
                                                        onClick={() => handleMaintenanceDelete(record.id)}
                                                        className="car-management-delete-btn"
                                                    >
                                                        삭제
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </>
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
                                    <input type="date" className="car-label-input-date" onChange={(e) => setMaintenanceDate(e.target.value)} />
                                </div>
                            </div>
                            <div className="car-label-box">
                                <label className="car-label-text">누적 주행 거리:</label>
                                <input type="text" className="car-label-input" onChange={(e) => setCumulativeDistance(e.target.value)} />Km
                            </div>
                            <div className="car-label-box">
                                <select className="car-management-maintenance-select" onChange={(e) => setMaintenanceType(e.target.value)}>
                                    <option value="엔진오일 및 필터">엔진오일 및 필터</option>
                                    <option value="에어컨 필터 교체">에어컨 필터 교체</option>
                                    <option value="브레이크 패드 교체">브레이크 패드 교체</option>
                                    <option value="타이어 교체">타이어 교체</option>
                                    <option value="기타">기타</option>
                                </select>
                                <label className="car-label-text">금액:</label>
                                <input type="text" className="car-label-input-price" onChange={(e) => setMaintenanceCost(e.target.value)} />원
                            </div>
                        </div>
                        <button className="car-management-update-btn" onClick={handleMaintenanceSubmit}>등록</button>
                        <button className="car-management-close-btn" onClick={closeModal}>닫기</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MaintenanceHistory;
