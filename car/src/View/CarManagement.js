import React, { useState, useEffect } from 'react';
import '../CSS/CarManagement.css';
import axios from 'axios';
import { useAuth } from "../Component/AuthContext";
import 'bootstrap/dist/css/bootstrap.min.css';

const CarManagement = () => {
    const { authState, refreshAccessToken } = useAuth();
    const [activeTab, setActiveTab] = useState('차량목록');
    const [isFormVisible, setIsFormVisible] = useState(false);
    const [vehicles, setVehicles] = useState([]);

    // 차량 등록 필드 상태
    const [vehicleCategory, setVehicleCategory] = useState('');
    const [vehicleType, setVehicleType] = useState('');
    const [carRegistrationNumber, setCarRegistrationNumber] = useState('');
    const [licensePlateNumber, setLicensePlateNumber] = useState('');
    const [purchaseDate, setPurchaseDate] = useState('');
    const [purchasePrice, setPurchasePrice] = useState('');
    const [totalMileage, setTotalMileage] = useState('');
    const [chassisNumber, setChassisNumber] = useState('');
    const [purchaseType, setPurchaseType] = useState('');
    const [downPayment, setDownPayment] = useState('');
    const [deposit, setDeposit] = useState('');
    const [expirationDate, setExpirationDate] = useState('');
    const [currentStatus, setCurrentStatus] = useState('');

    // 차량 목록을 서버에서 가져오는 함수
    const getVehicles = async () => {
        try {
            const response = await axios.get('https://hizenberk.pythonanywhere.com/api/vehicles/', {
                headers: {
                    Authorization: `Bearer ${authState.access}`
                }
            });
            setVehicles(response.data.vehicles);
        } catch (error) {
            if (error.response?.data?.code === 'token_not_valid') {
                const newAccessToken = await refreshAccessToken();
                if (newAccessToken) {
                    // 새 토큰으로 요청 재시도
                    getVehicles();
                }
            } else {
                console.error('차량 목록 조회 실패:', error);
            }
        }
    };

    useEffect(() => {
        getVehicles();
    }, []);

    const handleTabClick = (tab) => {
        setActiveTab(tab);
        setIsFormVisible(false);
    };

    const handleRegisterClick = () => {
        setIsFormVisible(true);
    };

    const handleRegisterVehicle = async (e) => {
        e.preventDefault();

        const vehicleData = {
            vehicle_category: vehicleCategory,
            vehicle_type: vehicleType,
            car_registration_number: carRegistrationNumber,
            license_plate_number: licensePlateNumber,
            purchase_date: purchaseDate || null,
            purchase_price: purchasePrice ? parseFloat(purchasePrice) : null,
            total_mileage: totalMileage ? parseInt(totalMileage, 10) : 0,
            chassis_number: chassisNumber,
            purchase_type: purchaseType,
            down_payment: downPayment ? parseFloat(downPayment) : null,
            deposit: deposit ? parseFloat(deposit) : null,
            expiration_date: expirationDate || null,
            current_status: currentStatus
        };

        try {
            const response = await axios.post(
                'https://hizenberk.pythonanywhere.com/api/vehicles/create/',
                vehicleData,
                {
                    headers: {
                        Authorization: `Bearer ${authState.access}`
                    }
                }
            );
            console.log('차량 등록 성공:', response.data);
            setIsFormVisible(false);
            getVehicles();
        } catch (error) {
            if (error.response?.data?.code === 'token_not_valid') {
                const newAccessToken = await refreshAccessToken();
                if (newAccessToken) {
                    // 새 토큰으로 등록 요청 재시도
                    handleRegisterVehicle(e);
                }
            } else {
                console.error('차량 등록 실패:', error.response?.data);
            }
        }
    };

    const [selectedCar, setSelectedCar] = useState(null); // 선택된 차량 데이터 상태

    const carStatus = () => {
        const maxLimit = 5000;
    
        // 각 부품의 진행률을 계산합니다.
        const calculatePercentage = (value) => (value / maxLimit) * 100;
    
        // selectedCar가 null이 아닐 때만 진행률을 계산합니다.
        return {
            engine: selectedCar ? calculatePercentage(selectedCar.engine) : 0,
            ac: selectedCar ? calculatePercentage(selectedCar.ac) : 0,
            break: selectedCar ? calculatePercentage(selectedCar.break) : 0,
            tire: selectedCar ? calculatePercentage(selectedCar.tire) : 0,
        };
    };

    // 차량 목록 예시 데이터
    const carDataList = [
        { num: '123가 4567', expiration_date: '2023-12-31', cumulative_distance: '123,000 km', engine: '양호', ac: '정상', break: '정상', tire: '교체 필요' },
        { num: '125나 8545', expiration_date: '2024-06-15', cumulative_distance: '87,000 km', engine: '교체 필요', ac: '정상', break: '정상', tire: '양호' },
    ];
    const car_data = [
        { img: '이미지', num: '123가 4567', expiration_date: '10/12', cumulative_distance: '123km', engine: '1234', ac: '3333', break: '555', tire: '4213' },
        { img: '이미지', num: '125나 8545', expiration_date: '10/30', cumulative_distance: '144km', engine: '4850', ac: '2341', break: '3411', tire: '5000' },
        { img: '이미지', num: '254허 2554', expiration_date: '9/15', cumulative_distance: '200km', engine: '1000', ac: '4000', break: '3500', tire: '3332' },
        { img: '이미지', num: '224경 4653', expiration_date: '10/15', cumulative_distance: '300km', engine: '2000', ac: '2000', break: '4192', tire: '3214' },
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
                        </div>

                        {/* 차량 목록 표시 */}
                        <table className="car-table">
                            <thead>
                                <tr>
                                    <th>차종</th>
                                    <th>차량 번호</th>
                                    <th>구매 날짜</th>
                                    <th>총 주행 거리</th>
                                    <th>상태</th>
                                </tr>
                            </thead>
                            <tbody>
                                {vehicles.map((vehicle) => (
                                    <tr key={vehicle.id}>
                                        <td>{vehicle.vehicle_type}</td>
                                        <td>{vehicle.license_plate_number}</td>
                                        <td>{vehicle.purchase_date}</td>
                                        <td>{vehicle.total_mileage} km</td>
                                        <td>{vehicle.current_status}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {isFormVisible && (
                    <form className="registration-form" onSubmit={handleRegisterVehicle}>
                        <div className="form-group">
                            <label>차량 카테고리</label>
                            <input
                                type="text"
                                value={vehicleCategory}
                                onChange={(e) => setVehicleCategory(e.target.value)}
                                placeholder="차량 카테고리를 입력하세요"
                            />
                        </div>
                        <div className="form-group">
                            <label>차종</label>
                            <input type="text" value={vehicleType} onChange={(e) => setVehicleType(e.target.value)} />
                        </div>
                        <div className="form-group">
                            <label>자동차 등록번호</label>
                            <input type="text" value={carRegistrationNumber} onChange={(e) => setCarRegistrationNumber(e.target.value)} />
                        </div>
                        <div className="form-group">
                            <label>차량 번호</label>
                            <input type="text" value={licensePlateNumber} onChange={(e) => setLicensePlateNumber(e.target.value)} />
                        </div>
                        <div className="form-group">
                            <label>구매 날짜</label>
                            <input type="date" value={purchaseDate} onChange={(e) => setPurchaseDate(e.target.value)} />
                        </div>
                        <div className="form-group">
                            <label>구매 가격</label>
                            <input type="number" value={purchasePrice} onChange={(e) => setPurchasePrice(e.target.value)} />
                        </div>
                        <div className="form-group">
                            <label>총 주행 거리</label>
                            <input type="number" value={totalMileage} onChange={(e) => setTotalMileage(e.target.value)} />
                        </div>
                        <div className="form-group">
                            <label>차대 번호</label>
                            <input type="text" value={chassisNumber} onChange={(e) => setChassisNumber(e.target.value)} />
                        </div>
                        <div className="form-group">
                            <label>구매 방법</label>
                            <input type="text" value={purchaseType} onChange={(e) => setPurchaseType(e.target.value)} />
                        </div>
                        <div className="form-group">
                            <label>선납금</label>
                            <input type="number" value={downPayment} onChange={(e) => setDownPayment(e.target.value)} />
                        </div>
                        <div className="form-group">
                            <label>보증금</label>
                            <input type="number" value={deposit} onChange={(e) => setDeposit(e.target.value)} />
                        </div>
                        <div className="form-group">
                            <label>유효 기간</label>
                            <input type="date" value={expirationDate} onChange={(e) => setExpirationDate(e.target.value)} />
                        </div>
                        <div className="form-group">
                            <label>현재 상태</label>
                            <input type="text" value={currentStatus} onChange={(e) => setCurrentStatus(e.target.value)} />
                        </div>
                        <button type="submit">등록하기</button>
                    </form>
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
                            {/* 선택된 차량 데이터 표시 */}
                            {selectedCar ? (
                                <>
                                    <div className="car-management-g-box">
                                        <div className="car-management-g-box-top">
                                            <p className="car-management-g-box-top-text">차량 정기 검사</p>
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
                                                <p className="car-management-progressbar-text">{selectedCar ? `${selectedCar.engine} / 5000Km` : '데이터 없음'}</p>
                                            </div>
                                            <div
                                                className="progress"
                                                role="progressbar"
                                                aria-label="Animated striped example"
                                                aria-valuenow={carStatus().engine} // 엔진 진행률
                                                aria-valuemin="0"
                                                aria-valuemax="100"
                                                style={{ width: '80%' }} // 전체 너비 조정
                                            >
                                                <div
                                                    className="progress-bar progress-bar-striped progress-bar-animated"
                                                    style={{ width: `${carStatus().engine}%` }} // 진행률 너비 설정
                                                >
                                                </div>
                                            </div>
                                        </div>
                                        {/* 에어컨 진행률 */}
                                        <div className="car-management-progressbar-box">
                                            <div className="car-management-progressbar-title-box">
                                                <p className="car-management-progressbar-title">에어컨 상태</p>
                                                <p className="car-management-progressbar-text">{selectedCar ? `${selectedCar.ac} / 5000Km` : '데이터 없음'}</p>
                                             </div>
                                            <div
                                                className="progress"
                                                role="progressbar"
                                                aria-label="Animated striped example"
                                                aria-valuenow={carStatus().ac} // 에어컨 진행률
                                                aria-valuemin="0"
                                                aria-valuemax="100"
                                                style={{ width: '80%' }} // 전체 너비 조정
                                            >
                                                <div
                                                    className="progress-bar progress-bar-striped progress-bar-animated bg-info"
                                                    style={{ width: `${carStatus().ac}%` }} // 진행률 너비 설정
                                                >
                                                </div>
                                            </div>
                                        </div>
                                        {/* 브레이크 진행률 */}
                                        <div className="car-management-progressbar-box">
                                            <div className="car-management-progressbar-title-box">
                                                <p className="car-management-progressbar-title">브레이크 상태</p>
                                                <p className="car-management-progressbar-text">{selectedCar ? `${selectedCar.break} / 5000Km` : '데이터 없음'}</p>
                                            </div>
                                            <div
                                                className="progress"
                                                role="progressbar"
                                                aria-label="Animated striped example"
                                                aria-valuenow={carStatus().break} // 브레이크 진행률
                                                aria-valuemin="0"
                                                aria-valuemax="100"
                                                style={{ width: '80%' }} // 전체 너비 조정
                                            >
                                                <div
                                                    className="progress-bar progress-bar-striped progress-bar-animated bg-danger"
                                                    style={{ width: `${carStatus().break}%` }} // 진행률 너비 설정
                                                >
                                                </div>
                                            </div>
                                        </div>
                                        {/* 타이어 진행률 */}
                                        <div className="car-management-progressbar-box">
                                            <div className="car-management-progressbar-title-box">
                                                <p className="car-management-progressbar-title">타이어 상태</p>
                                                <p className="car-management-progressbar-text">{selectedCar ? `${selectedCar.tire} / 5000Km` : '데이터 없음'}</p>
                                            </div>
                                            <div
                                                className="progress"
                                                role="progressbar"
                                                aria-label="Animated striped example"
                                                aria-valuenow={carStatus().tire} // 타이어 진행률
                                                aria-valuemin="0"
                                                aria-valuemax="100"
                                                style={{ width: '80%' }} // 전체 너비 조정
                                            >
                                                <div
                                                    className="progress-bar progress-bar-striped progress-bar-animated bg-warning"
                                                    style={{ width: `${carStatus().tire}%` }} // 진행률 너비 설정
                                                >
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="car-management-h-box">
                                        <div className="car-management-i-box"></div>
                                        <div className="car-management-j-box"></div>
                                    </div>
                                </>
                            ) : (
                                <div className="car-management-select-car-box">
                                    <p className="car-management-select-car">차량을 선택하세요.</p>
                                </div>
                            )}
                        </div>

                    </div>
                )}

            </div>
        </div>
    );
};

export default CarManagement;
