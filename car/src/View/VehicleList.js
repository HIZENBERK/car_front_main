import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../CSS/CarManagement.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

const VehicleList = ({ authState, refreshAccessToken }) => {
    const [vehicles, setVehicles] = useState([]);
    const [isFormVisible, setIsFormVisible] = useState(false);
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
    const [editingVehicleId, setEditingVehicleId] = useState(null);

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
    //         if (error.response?.data?.code === 'token_not_valid') {
    //             const newAccessToken = await refreshAccessToken();
    //             if (newAccessToken) {
    //                 getVehicles(); // 새 토큰으로 요청 재시도
    //             }
    //         } else {
    //             console.error('차량 목록 조회 실패:', error);
    //         }
    //     }
    // };

                {       //위에 주석 다시 사용할때는 이거 지워야함
                    console.error('차량 목록 조회 실패:', error);//위에 주석 다시 사용할때는 이거 지워야함
                }//위에 주석 다시 사용할때는 이거 지워야함
            }//위에 주석 다시 사용할때는 이거 지워야함
        };//위에 주석 다시 사용할때는 이거 지워야함

    useEffect(() => {
        getVehicles();
    }, []);

    const handleRegisterClick = () => {
        setIsFormVisible(true);
        setEditingVehicleId(null); // 차량 등록 시 기존 데이터 초기화
        resetFormFields();
    };

    const handleRegisterOrUpdateVehicle = async (e) => {
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
            if (editingVehicleId) {
                // 차량 정보 수정 요청
                await axios.patch(
                    `https://hizenberk.pythonanywhere.com/api/vehicles/${licensePlateNumber}`,
                    vehicleData,
                    { headers: { Authorization: `Bearer ${authState.access}` } }
                );
                console.log('차량 정보 수정 성공');
            } else {
                // 차량 등록 요청
                await axios.post(
                    'https://hizenberk.pythonanywhere.com/api/vehicles/create/',
                    vehicleData,
                    { headers: { Authorization: `Bearer ${authState.access}` } }
                );
                console.log('차량 등록 성공');
            }
            setIsFormVisible(false);
            getVehicles();
            resetFormFields();
        } catch (error) {
            // if (error.response?.data?.code === 'token_not_valid') {
            //     const newAccessToken = await refreshAccessToken();
            //     if (newAccessToken) {
            //         handleRegisterOrUpdateVehicle(e); // 새 토큰으로 등록/수정 요청 재시도
            //     }
            // } else 
            {
                console.error('차량 등록/수정 실패:', error.response?.data);
            }
        }
    };

    const handleEditVehicle = (vehicle) => {
        setVehicleCategory(vehicle.vehicle_category);
        setVehicleType(vehicle.vehicle_type);
        setCarRegistrationNumber(vehicle.car_registration_number);
        setLicensePlateNumber(vehicle.license_plate_number);
        setPurchaseDate(vehicle.purchase_date);
        setPurchasePrice(vehicle.purchase_price);
        setTotalMileage(vehicle.total_mileage);
        setChassisNumber(vehicle.chassis_number);
        setPurchaseType(vehicle.purchase_type);
        setDownPayment(vehicle.down_payment);
        setDeposit(vehicle.deposit);
        setExpirationDate(vehicle.expiration_date);
        setCurrentStatus(vehicle.current_status);
        setEditingVehicleId(vehicle.id);
        setIsFormVisible(true);
    };

    const handleDeleteVehicle = async (licensePlateNumber) => {
        try {
            await axios.delete(`https://hizenberk.pythonanywhere.com/api/vehicles/${licensePlateNumber}`, {
                headers: { Authorization: `Bearer ${authState.access}` }
            });
            console.log('차량 삭제 성공');
            getVehicles();
        } catch (error) {
            // if (error.response?.data?.code === 'token_not_valid') {
            //     const newAccessToken = await refreshAccessToken();
            //     if (newAccessToken) {
            //         handleDeleteVehicle(licensePlateNumber); // 새 토큰으로 삭제 요청 재시도
            //     }
            // } else 
            {
                console.error('차량 삭제 실패:', error.response?.data);
            }
        }
    };

    const resetFormFields = () => {
        setVehicleCategory('');
        setVehicleType('');
        setCarRegistrationNumber('');
        setLicensePlateNumber('');
        setPurchaseDate('');
        setPurchasePrice('');
        setTotalMileage('');
        setChassisNumber('');
        setPurchaseType('');
        setDownPayment('');
        setDeposit('');
        setExpirationDate('');
        setCurrentStatus('');
    };

    return (
        <div>
            <div className="register-section">
                <button className="register-button" onClick={handleRegisterClick}>차량 등록</button>
            </div>

            <table className="car-table">
                <thead>
                    <tr>
                        <th>차종</th>
                        <th>차량 번호</th>
                        <th>구매 날짜</th>
                        <th>총 주행 거리</th>
                        <th>상태</th>
                        <th>수정</th>
                        <th>삭제</th>
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
                            <td><button onClick={() => handleEditVehicle(vehicle)}>수정</button></td>
                            <td><button onClick={() => handleDeleteVehicle(vehicle.license_plate_number)}>삭제</button></td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {isFormVisible && (
                <form className="vehiclelist-registration-form" onSubmit={handleRegisterOrUpdateVehicle}>
                    <div className="vehiclelist-registration-form-box">

                        <div className="vehiclelist-registration-form-a-box">

                            <div className="vehiclelist-registration-form-c-box">
                                <div className="signup-return-box" onClick={() => setIsFormVisible(false)}>
                                <i className="bi bi-arrow-return-left"></i>
                                <span>뒤로 가기</span>
                                </div>
                                <p className="vehiclelist-registration-form-title">차량</p>
                            </div>

                            <div className="vehiclelist-registration-form-d-box">
                                <div className="vehiclelist-form-group-7">
                                <label>차량 카테고리:</label>
                                <input
                                    type="text"
                                    value={vehicleCategory}
                                    onChange={(e) => setVehicleCategory(e.target.value)}
                                    className="vehiclelist-input"
                                />
                                </div>
                                <div className="vehiclelist-form-group-2">
                                    <label>차종:</label>
                                    <input type="text" value={vehicleType} onChange={(e) => setVehicleType(e.target.value)} />
                                </div>
                                <div className="vehiclelist-form-group-8">
                                    <label>자동차 등록번호:</label>
                                    <input type="text" value={carRegistrationNumber} onChange={(e) => setCarRegistrationNumber(e.target.value)} />
                                </div>
                                <div className="vehiclelist-form-group">
                                    <label>차량 번호:</label>
                                    <input type="text" value={licensePlateNumber} onChange={(e) => setLicensePlateNumber(e.target.value)} />
                                </div>
                                <div className="vehiclelist-form-group">
                                    <label>구매 날짜:</label>
                                    <input type="date" value={purchaseDate} onChange={(e) => setPurchaseDate(e.target.value)} />
                                </div>
                                <div className="vehiclelist-form-group">
                                    <label>구매 가격:</label>
                                    <input type="number" value={purchasePrice} onChange={(e) => setPurchasePrice(e.target.value)} />
                                </div>
                            </div>

                        </div>

                        <div className="vehiclelist-registration-form-line-box"></div>

                        <div className="vehiclelist-registration-form-b-box">

                            <div className="vehiclelist-registration-form-c-box">
                                <p className="vehiclelist-registration-form-title">등록</p>
                            </div>

                            <div className="vehiclelist-registration-form-e-box">
                                <div className="vehiclelist-form-group-7-2">
                                    <label>총 주행 거리:</label>
                                    <input type="number" value={totalMileage} onChange={(e) => setTotalMileage(e.target.value)} />
                                </div>
                                <div className="vehiclelist-form-group">
                                    <label>차대 번호:</label>
                                    <input type="text" value={chassisNumber} onChange={(e) => setChassisNumber(e.target.value)} />
                                </div>
                                <div className="vehiclelist-form-group-check-4">
                                    <label>구매 유형:</label>
                                    <select value={purchaseType} onChange={(e) => setPurchaseType(e.target.value)}>
                                        <option value="">선택</option>
                                        <option value="매매">매매</option>
                                        <option value="리스">리스</option>
                                        <option value="렌트">렌트</option>
                                    </select>
                                </div>
                                <div className="vehiclelist-form-group-3">
                                    <label>선수금:</label>
                                    <input type="number" value={downPayment} onChange={(e) => setDownPayment(e.target.value)} />
                                </div>
                                <div className="vehiclelist-form-group-3">
                                    <label>보증금:</label>
                                    <input type="number" value={deposit} onChange={(e) => setDeposit(e.target.value)} />
                                </div>
                                <div className="vehiclelist-form-group-3">
                                    <label>만기일:</label>
                                    <input type="date" value={expirationDate} onChange={(e) => setExpirationDate(e.target.value)} />
                                </div>
                                <div className="vehiclelist-form-group-check-6">
                                    <label>차량 현재 상황:</label>
                                    <select value={currentStatus} onChange={(e) => setCurrentStatus(e.target.value)}>
                                        <option value="">선택</option>
                                        <option value="가용차량">가용차량</option>
                                        <option value="사용불가">사용불가</option>
                                        <option value="삭제">삭제</option>
                                    </select>
                                </div>
                                
                            </div>
                            <div className="vehiclelist-registration-form-f-box">
                                <button type="submit" className="vehiclelist-submit-button">
                                    {editingVehicleId ? "수정" : "등록"}
                                </button>
                            </div>
                        </div>

                    </div>
                </form>
            )}
        </div>
    );
};

export default VehicleList;
