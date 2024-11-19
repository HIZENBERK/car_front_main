import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../CSS/CarManagement.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

const MaintenanceHistory = ({ authState, refreshAccessToken }) => {
    const [selectedCar, setSelectedCar] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [carData, setCarData] = useState([]);
    const [maintenanceData, setMaintenanceData] = useState([]);
    const [maintenanceDate, setMaintenanceDate] = useState('');
    const [cumulativeDistance, setCumulativeDistance] = useState('');
    const [maintenanceType, setMaintenanceType] = useState('엔진오일 및 필터');
    const [maintenanceCost, setMaintenanceCost] = useState('');

    useEffect(() => {
        fetchCarData();
        fetchMaintenanceData();
    }, []); // 빈 의존성


    // 차량 데이터를 불러오는 함수
    const fetchCarData = async () => {
        try {
            const response = await axios.get('https://hizenberk.pythonanywhere.com/api/vehicles/', {
                headers: { Authorization: `Bearer ${authState.access}` },
            });
            console.log('차량 데이터:', response.data.vehicles);
            setCarData(response.data.vehicles);
        } catch (error) {
            console.error('차량 데이터 불러오기 실패:', error);
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
        if (selectedCar) {
            // console.log(selectedCar)
            // console.log(maintenanceData)
            //updateProgressBars();
        }
    }, [selectedCar]);

    // 차량 데이터가 로드될 때 첫 번째 차량 자동 선택
    useEffect(() => {
        if (carData.length > 0 && !selectedCar) {
            setSelectedCar(carData[0]);
        }
    }, [carData]);
    const updateProgressBars = () => {
        if (!selectedCar) return;
        console.log('5번 루프')
        // const newCumulativeDistance = parseFloat(cumulativeDistance || 0);

        // setCarData((prevCarData) =>
        //     prevCarData.map((car) => {
        //         if (car.id === selectedCar.id) {
        //             const updatedCar = { ...car };
        //
        //             // 소모품 별 업데이트
        //             if (maintenanceType === "엔진 오일 교체") {
        //                 updatedCar.engine_oil_filter = car.engine_oil_filter ;
        //             }
        //             if (maintenanceType === "에어컨 필터 교체") {
        //                 updatedCar.aircon_filter = car.aircon_filter;
        //             }
        //             if (maintenanceType === "브레이크 패드 교체") {
        //                 updatedCar.brake_pad = car.brake_pad ;
        //             }
        //             if (maintenanceType === "타이어 교체") {
        //                 updatedCar.tire = car.tire;
        //             }
        //
        //             return updatedCar;
        //         }
        //         return car;
        //     })
        // );

        //선택된 차량 상태도 동기화
        // setSelectedCar((prevCar) =>
        //     prevCar
        //         ? {
        //               ...prevCar,
        //               engine_oil_filter:
        //                   maintenanceType === "엔진 오일 교체"
        //                       ? Math.min(
        //                             (selectedCar.total_mileage || 0) + newCumulativeDistance,
        //                             10000
        //                         )
        //                       : selectedCar.total_mileage,
        //               aircon_filter:
        //                   maintenanceType === "에어컨 필터 교체"
        //                       ? Math.min(
        //                             (selectedCar.total_mileage || 0) + newCumulativeDistance,
        //                             15000
        //                         )
        //                       : selectedCar.total_mileage,
        //               brake_pad:
        //                   maintenanceType === "브레이크 패드 교체"
        //                       ? Math.min(
        //                             (selectedCar.total_mileage || 0) + newCumulativeDistance,
        //                             10000
        //                         )
        //                       : selectedCar.total_mileage,
        //               tire:
        //                   maintenanceType === "타이어 교체"
        //                       ? Math.min(
        //                             (selectedCar.total_mileage|| 0) + newCumulativeDistance,
        //                             60000
        //                         )
        //                       : selectedCar.total_mileage,
        //           }
        //         : null
        // );
    };




    // 소모품 상태 계산 함수들
    const calculateProgress = (current, max) => {
        return Math.min((current / max) * 100, 100);
    };

    const carStatusEngine = () => {
        const maxLimit = 10000; // 엔진 오일 교체 기준
        const currentDistance = selectedCar.engine_oil_filter || 0;
        return { engine_oil_filter: calculateProgress(currentDistance, maxLimit) };
    };

    const carStatusAc = () => {
        const maxLimit = 15000; // 에어컨 필터 교체 기준 거리
        const currentDistance = selectedCar.aircon_filter || 0;
        return { aircon_filter: calculateProgress(currentDistance, maxLimit) };
    };

    const carStatusBreak = () => {
        const maxLimit = 10000; // 브레이크 패드 교체 기준 거리
        const currentDistance = selectedCar.brake_pad || 0;
        return { brake_pad: calculateProgress(currentDistance, maxLimit) };
    };

    const carStatusTire = () => {
        const maxLimit = 60000; // 타이어 교체 기준 거리
        const currentDistance = selectedCar.tire || 0;
        return { tire: calculateProgress(currentDistance, maxLimit) };
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
        if (!selectedCar) {
            console.error("모든 필드를 입력해야 합니다.");
            return;
        }

        try {
            await axios.post(
                `https://hizenberk.pythonanywhere.com/api/maintenances/create/`,
                {
                    "vehicle": selectedCar.id,  // 차량 ID
                    "maintenance_date": maintenanceDate,  // 정비 일자
                    "maintenance_type": maintenanceType,  // 정비 유형
                    "maintenance_cost": maintenanceCost,  // 정비 비용
                    "maintenance_description": '' // 정비 내용 상세
                },
                { headers: { Authorization: `Bearer ${authState.access}` } }
            );

            // 업데이트 후 상태 업데이트
            setSelectedCar({
                ...selectedCar,
            });

            // 게이지 업데이트 호출
            fetchMaintenanceData();

            setCumulativeDistance(''); // 입력 필드 초기화
            closeModal(); // 모달 닫기
        } catch (error) {
            console.error('정비 기록 등록 실패:', error);
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

    // 정기 검사 만료일(구매일 부터 1년 후) 계산 함수
    const calculateExpirationDate = (purchaseDate) => {
        if (!purchaseDate) return "데이터 없음"; // 구매일이 없을 경우 처리
        const purchase = new Date(purchaseDate);
        purchase.setFullYear(purchase.getFullYear() + 1); // 1년 후로 설정
        return purchase.toISOString().split('T')[0]; // YYYY-MM-DD 형식으로 반환
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
                                {/* <td>
                                    <img src={car.img || '/Img/default_car.jpg'} alt="Car" className="car-management-car-table-td-img" />
                                </td> */}
                                <td className="car-management-car-table-td-num">{car.vehicle_type}</td>
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
                                <p className="car-management-g-box-middle-text">
                                    {selectedCar.purchase_date ? calculateExpirationDate(selectedCar.purchase_date) : '데이터 없음'}
                                </p>
                            </div>
                            <div className="car-management-g-box-middle-text-box">
                                <p className="car-management-g-box-middle-title">누적주행거리</p>
                                <p className="car-management-g-box-middle-text-distance">{selectedCar.total_mileage}</p>
                            </div>

                            <p className="car-management-g-box-middle-top-text">소모품 현황</p>

                            {/* 엔진 진행률 (백분율 계산 후 표시) */}
                            <div className="car-management-progressbar-box">
                                <div className="car-management-progressbar-title-box">
                                    <p className="car-management-progressbar-title">엔진오일 및 필터</p>
                                    <p className="car-management-progressbar-text">
                                        {selectedCar ? `${selectedCar.engine_oil_filter} / 10000Km` : '데이터 없음'}
                                    </p>
                                </div>
                                <div className="car-management-bar">
                                    <div
                                        className="car-management-bar-fill"
                                        style={{
                                            width: `${(selectedCar.engine_oil_filter / 10000) * 100}%`, // 백분율로 계산
                                        }}
                                    ></div>
                                </div>
                            </div>

                            {/* 에어컨 진행률 (백분율 계산 후 표시) */}
                            <div className="car-management-progressbar-box">
                                <div className="car-management-progressbar-title-box">
                                    <p className="car-management-progressbar-title">에어컨 필터(향균 필터)</p>
                                    <p className="car-management-progressbar-text">
                                        {selectedCar ? `${selectedCar.aircon_filter} / 15000Km` : '데이터 없음'}
                                    </p>
                                </div>
                                <div className="car-management-bar">
                                    <div
                                        className="car-management-bar-fill bg-info"
                                        style={{
                                            width: `${(selectedCar.aircon_filter / 15000) * 100}%`, // 백분율로 계산
                                        }}
                                    ></div>
                                </div>
                            </div>

                            {/* 브레이크 진행률 (백분율 계산 후 표시) */}
                            <div className="car-management-progressbar-box">
                                <div className="car-management-progressbar-title-box">
                                    <p className="car-management-progressbar-title">브레이크 패드 및 디스크</p>
                                    <p className="car-management-progressbar-text">
                                        {selectedCar ? `${selectedCar.brake_pad} / 10000Km` : '데이터 없음'}
                                    </p>
                                </div>
                                <div className="car-management-bar">
                                    <div
                                        className="car-management-bar-fill bg-danger"
                                        style={{
                                            width: `${(selectedCar.brake_pad / 10000) * 100}%`, // 백분율로 계산
                                        }}
                                    ></div>
                                </div>
                            </div>

                            {/* 타이어 진행률 (백분율 계산 후 표시) */}
                            <div className="car-management-progressbar-box">
                                <div className="car-management-progressbar-title-box">
                                    <p className="car-management-progressbar-title">타이어</p>
                                    <p className="car-management-progressbar-text">
                                        {selectedCar ? `${selectedCar.tire} / 60000Km` : '데이터 없음'}
                                    </p>
                                </div>
                                <div className="car-management-bar">
                                    <div
                                        className="car-management-bar-fill bg-warning"
                                        style={{
                                            width: `${(selectedCar.tire / 60000) * 100}%`, // 백분율로 계산
                                        }}
                                    ></div>
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
                                <button className="car-management-registration-maintenance" onClick={handleModalOpen}>정비
                                    등록
                                </button>
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
                                            <td>{record.cumulative_distance || selectedCar.total_mileage || '데이터 없음'}</td>
                                            <td>{record.maintenance_cost} 원</td>
                                            <td>
                                                <button
                                                    onClick={() => handleMaintenanceDelete(record.id)}
                                                    className="car-management-delete-btn"
                                                >
                                                    <i className="bi bi-x-circle"></i>
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
                                    <input type="date" className="car-label-input-date"
                                           onChange={(e) => setMaintenanceDate(e.target.value)}/>
                                </div>
                            </div>
                            <div className="car-label-box">
                                <select className="car-management-maintenance-select"
                                        onChange={(e) => setMaintenanceType(e.target.value)}>
                                    <option value="engine_oil_change">엔진 오일 교체</option>
                                    <option value="air_filter_change">에어컨 필터 교체</option>
                                    <option value="brake_pad_change">브레이크 패드 교체</option>
                                    <option value="tire_change">타이어 교체</option>
                                    <option value="other">기타</option>
                                </select>
                                <label className="car-label-text">금액:</label>
                                <input type="text" className="car-label-input-price"
                                       onChange={(e) => setMaintenanceCost(e.target.value)}/>원
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
