import React, { useState, useEffect } from 'react';
import '../CSS/CarManagement.css';
import axios from 'axios';
import { useAuth } from "../Component/AuthContext";

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

    return (
        <div className="car-management">
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
                            <label>구매 유형</label>
                            <select value={purchaseType} onChange={(e) => setPurchaseType(e.target.value)}>
                                <option value="">선택</option>
                                <option value="매매">매매</option>
                                <option value="리스">리스</option>
                                <option value="렌트">렌트</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label>선수금</label>
                            <input type="number" value={downPayment} onChange={(e) => setDownPayment(e.target.value)} />
                        </div>
                        <div className="form-group">
                            <label>보증금</label>
                            <input type="number" value={deposit} onChange={(e) => setDeposit(e.target.value)} />
                        </div>
                        <div className="form-group">
                            <label>만기일</label>
                            <input type="date" value={expirationDate} onChange={(e) => setExpirationDate(e.target.value)} />
                        </div>
                        <div className="form-group">
                            <label>차량 현재 상황</label>
                            <select value={currentStatus} onChange={(e) => setCurrentStatus(e.target.value)}>
                                <option value="">선택</option>
                                <option value="가용차량">가용차량</option>
                                <option value="사용불가">사용불가</option>
                                <option value="삭제">삭제</option>
                            </select>
                        </div>
                        <button type="submit" className="submit-button">등록</button>
                    </form>
                )}
            </div>
        </div>
    );
};

export default CarManagement;
