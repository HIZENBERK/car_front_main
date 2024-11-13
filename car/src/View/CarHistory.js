import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import Modal from 'react-modal';
import 'react-datepicker/dist/react-datepicker.css';
import { ko } from 'date-fns/locale';
import '../CSS/CarHistory.css';
import UseMap from '../Component/UseMap';
import { makeXlsx } from "../Component/MakeXlsx";
import { useAuth } from "../Component/AuthContext";

const CarHistory = () => {
  const { authState } = useAuth(); // useAuth로 authState 가져오기
  const [markers, setMarkers] = useState([]);
  const [isMapOpen, setIsMapOpen] = useState(false);
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [recordOption, setRecordOption] = useState('전체');
  const [useType, setUseType] = useState('전체');
  const [distanceOption, setDistanceOption] = useState('전체');
  const [carData, setCarData] = useState([]);
  const [formData, setFormData] = useState({
    vehicle: '',
    departure_location: '',
    arrival_location: '',
    departure_mileage: '',
    arrival_mileage: '',
    departure_time: '',  // 빈 문자열로 초기화
    arrival_time: '',    // 빈 문자열로 초기화
    driving_purpose: '',
    fuel_cost: '',
    toll_fee: '',
    other_costs: '',
    coordinates: [
      { latitude: '', longitude: '' },
      { latitude: '', longitude: '' },
    ],
  });

  useEffect(() => {
    fetch('https://hizenberk.pythonanywhere.com/api/driving-records/')
      .then(response => response.json())
      .then(data => {
        console.log('Fetched data:', data);
        if (data.records && Array.isArray(data.records)) {
          setCarData(data.records);
        } else {
          console.error('Unexpected response format:', data);
        }
      })
      .catch(error => console.error('Error fetching driving records:', error));
  }, []);

  // 날짜 포맷 함수
  const formatDate = (date) => {
    if (date) {
      return new Date(date).toISOString(); // '2024-11-13T01:38:47.474857Z' 형식으로 변환
    }
    return '';
  };

  // formData 유효성 검사
  const validateFormData = (formData) => {
    const { departure_time, arrival_time, departure_mileage, arrival_mileage, coordinates } = formData;

    // departure_time과 arrival_time이 모두 존재하는지 체크
    if (!departure_time || !arrival_time || isNaN(new Date(departure_time).getTime()) || isNaN(new Date(arrival_time).getTime())) {
      throw new Error("Both departure and arrival times are required and must be valid.");
    }

    // 시간 순서 검사 (departure_time이 arrival_time보다 늦을 수 없음)
    if (new Date(departure_time) > new Date(arrival_time)) {
      throw new Error("Departure time cannot be later than arrival time.");
    }

    // 출발/도착 전 누적 주행거리 유효성 검사
    if (departure_mileage <= 0 || arrival_mileage <= 0) {
      throw new Error("Mileage must be a positive integer.");
    }

    // 좌표 유효성 검사
    if (!Array.isArray(coordinates) || coordinates.length !== 2) {
      throw new Error("Coordinates must be an array with two elements.");
    }

    coordinates.forEach((coordinate, index) => {
      if (isNaN(coordinate.latitude) || isNaN(coordinate.longitude)) {
        throw new Error(`Invalid coordinates at index ${index}. Both latitude and longitude must be valid numbers.`);
      }
    });

    // 모든 유효성 검사를 통과하면 true 반환
    return true;
  };

  // 입력값을 formData에 반영
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // 좌표 변경 핸들러
  const handleCoordinateChange = (index, field, value) => {
    const updatedCoordinates = [...formData.coordinates];
    updatedCoordinates[index][field] = value;
    setFormData({ ...formData, coordinates: updatedCoordinates });
  };

  // 폼 제출 처리
  const handleSubmit = (e) => {
    e.preventDefault();

    // 출발 시간과 도착 시간을 포맷팅
    const updatedFormData = {
      ...formData,
      departure_time: formatDate(formData.departure_time),
      arrival_time: formatDate(formData.arrival_time),
    };

    // 유효성 검사 실행
    try {
      validateFormData(updatedFormData);
    } catch (error) {
      console.error("Validation error:", error.message);
      return; // 유효성 검사 실패 시 종료
    }

    // 서버에 데이터 전송
    fetch('https://hizenberk.pythonanywhere.com/api/driving-records/create/', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${authState.access}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(updatedFormData),
    })
      .then(response => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error('Failed to register driving record');
        }
      })
      .then(data => {
        console.log('Success:', data);
        setCarData(prevData => [...prevData, data]);
        setFormData({
          vehicle: '',
          departure_location: '',
          arrival_location: '',
          departure_mileage: '',
          arrival_mileage: '',
          departure_time: '',
          arrival_time: '',
          driving_purpose: '',
          fuel_cost: '',
          toll_fee: '',
          other_costs: '',
          coordinates: [
            { latitude: '', longitude: '' },
            { latitude: '', longitude: '' },
          ],
        });
      })
      .catch(error => console.error('Error:', error));
  };

  // 수정 처리
  const handleUpdate = (id) => {
    console.log("Updated Form Data Before Submit:", formData);

    const updatedFormData = {
      ...formData,
      departure_time: formatDate(formData.departure_time),
      arrival_time: formatDate(formData.arrival_time),
    };

    console.log("Updated Form Data:", updatedFormData);

    try {
      validateFormData(updatedFormData);
    } catch (error) {
      console.error("Validation error:", error.message);
      return; // 유효성 검사 실패 시 종료
    }

    fetch(`https://hizenberk.pythonanywhere.com/api/driving-records/${id}/`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${authState.access}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedFormData),
    })
      .then((response) => {
        if (!response.ok) {
          return response.json().then((errorData) => {
            console.error("Error Response Data:", errorData);
            throw new Error(errorData.message || 'Failed to update driving record');
          });
        }
        return response.json();
      })
      .then((data) => {
        console.log('Update successful:', data);
        setCarData((prevData) =>
          prevData.map((car) => (car.id === id ? data : car))
        );
      })
      .catch((error) => console.error('Error:', error));
  };

  // 삭제 처리
  const handleDelete = (id) => {
    if (!id) {
      console.error("Invalid ID for deletion");
      return;
    }
    fetch(`https://hizenberk.pythonanywhere.com/api/driving-records/${id}/`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${authState.access}`,
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to delete driving record');
        }
        setCarData((prevData) => prevData.filter((car) => car.id !== id));
      })
      .catch((error) => console.error('Error:', error));
  };

  // 필터링
  const filterCarData = () => {
    return carData.filter((car) => {
      if (recordOption === '삭제된 차량 제외' && car.isDeleted) return false;
      if (useType !== '전체' && car.driving_purpose !== useType) return false;
      if (distanceOption === '3km 이하' && car.driving_distance > 3000) return false;
      return true;
    });
  };

  // 핸들러 정의
  const handleRecordOptionChange = (e) => setRecordOption(e.target.value);
  const handleDistanceOptionChange = (e) => setDistanceOption(e.target.value);
  const handleUseTypeChange = (e) => setUseType(e.target.value);
  const handleReset = () => {
    setStartDate(null);
    setEndDate(null);
  };

  const customModalStyles = {
    content: { marginLeft: '200px' },
  };

  const handleDownloadExcel = async () => {
    const filteredData = filterCarData();
    await makeXlsx(filteredData);
  };

  const openMapModal = () => setIsMapOpen(true);
  const closeMapModal = () => setIsMapOpen(false);

  // DatePicker에서 값이 변경될 때 null 처리
  const handleDateChange = (name, date) => {
    if (date) {
      setFormData({ ...formData, [name]: date });
    } else {
      setFormData({ ...formData, [name]: '' });  // 날짜가 없을 때는 빈 문자열로 처리
    }
  };

  return (
    <div className="car-history-container">
      <div className="car-history-background">
        <div className="car-history-b-box">
          <p className="carhistory-name">차량 운행 내역</p>
          <div className="car-history-download-btn-box">
            <button className="download-btn" onClick={handleDownloadExcel}>엑셀 다운로드</button>
          </div>
        </div>

        {/* 운행 기록 등록 폼 */}
        <div className="car-history-form">
          <h2>운행 기록 등록</h2>
          <form onSubmit={handleSubmit}>
            <input
              type="number"
              name="vehicle"
              value={formData.vehicle}
              onChange={handleInputChange}
              placeholder="차량 ID"
              required
            />
            <input
              type="text"
              name="departure_location"
              value={formData.departure_location}
              onChange={handleInputChange}
              placeholder="출발지"
              required
            />
            <input
              type="text"
              name="arrival_location"
              value={formData.arrival_location}
              onChange={handleInputChange}
              placeholder="도착지"
              required
            />
            <input
              type="number"
              name="departure_mileage"
              value={formData.departure_mileage}
              onChange={handleInputChange}
              placeholder="출발 전 누적 주행거리"
              required
            />
            <input
              type="number"
              name="arrival_mileage"
              value={formData.arrival_mileage}
              onChange={handleInputChange}
              placeholder="도착 후 누적 주행거리"
              required
            />
            <DatePicker
              selected={formData.departure_time}
              onChange={(date) => handleDateChange('departure_time', date)}
              showTimeSelect
              timeFormat="HH:mm"
              dateFormat="yyyy-MM-dd HH:mm"
              placeholderText="출발 시간 선택"
              required
            />
            <DatePicker
              selected={formData.arrival_time}
              onChange={(date) => handleDateChange('arrival_time', date)}
              showTimeSelect
              timeFormat="HH:mm"
              dateFormat="yyyy-MM-dd HH:mm"
              placeholderText="도착 시간 선택"
              required
            />
            <input
              type="text"
              name="driving_purpose"
              value={formData.driving_purpose}
              onChange={handleInputChange}
              placeholder="운행 목적"
              required
            />
            <input
              type="number"
              name="fuel_cost"
              value={formData.fuel_cost}
              onChange={handleInputChange}
              placeholder="연료비"
            />
            <input
              type="number"
              name="toll_fee"
              value={formData.toll_fee}
              onChange={handleInputChange}
              placeholder="통행료"
            />
            <input
              type="number"
              name="other_costs"
              value={formData.other_costs}
              onChange={handleInputChange}
              placeholder="기타 비용"
            />
            <input
              type="number"
              name="latitude"
              value={formData.coordinates[0].latitude}
              onChange={(e) => handleCoordinateChange(0, 'latitude', e.target.value)}
              placeholder="출발지 위도"
              required
            />
            <input
              type="number"
              name="longitude"
              value={formData.coordinates[0].longitude}
              onChange={(e) => handleCoordinateChange(0, 'longitude', e.target.value)}
              placeholder="출발지 경도"
              required
            />
            <input
              type="number"
              name="latitude"
              value={formData.coordinates[1].latitude}
              onChange={(e) => handleCoordinateChange(1, 'latitude', e.target.value)}
              placeholder="도착지 위도"
              required
            />
            <input
              type="number"
              name="longitude"
              value={formData.coordinates[1].longitude}
              onChange={(e) => handleCoordinateChange(1, 'longitude', e.target.value)}
              placeholder="도착지 경도"
              required
            />
            <button type="submit">등록</button>
          </form>
        </div>

        <div className="car-history-a-box">
          <div className="car-history-c-box">
            <div className="car-history-c-box-list-option">
              <label className="car-history-middle-title">운행 기록 옵션:</label>
              <input
                type="radio"
                name="record-option"
                value="전체"
                checked={recordOption === '전체'}
                onChange={handleRecordOptionChange}
              /> 전체
              <input
                type="radio"
                name="record-option"
                value="삭제된 차량 제외"
                checked={recordOption === '삭제된 차량 제외'}
                onChange={handleRecordOptionChange}
              /> 삭제된 차량 제외
            </div>
            <div className="car-history-c-box-way-option">
              <label className="car-history-middle-title">거리 옵션:</label>
              <input
                type="radio"
                name="distance-option"
                value="전체"
                checked={distanceOption === '전체'}
                onChange={handleDistanceOptionChange}
              /> 전체
              <input
                type="radio"
                name="distance-option"
                value="3km 이하"
                checked={distanceOption === '3km 이하'}
                onChange={handleDistanceOptionChange}
              /> 3km 이하
            </div>
          </div>

          <div className="car-history-d-box">
            <div className="car-history-d-box-operation">
              <label className='car-history-middle-title'>운행 용도:</label>
              <input
                type="radio"
                name="use-type"
                value="전체"
                checked={useType === '전체'}
                onChange={handleUseTypeChange}
              /> 전체
              <input
                type="radio"
                name="use-type"
                value="business"
                checked={useType === 'business'}
                onChange={handleUseTypeChange}
              /> 업무용
              <input
                type="radio"
                name="use-type"
                value="personal"
                checked={useType === 'personal'}
                onChange={handleUseTypeChange}
              /> 개인용
            </div>
            <div className="car-history-d-box-date-check">
              <button className="car-history-date-check-button" onClick={() => setIsDatePickerOpen(!isDatePickerOpen)}>
                기간 조회
              </button>
            </div>
          </div>

          <div className="car-history-f-box">
            <table className="car-history-table">
              <thead>
                <tr>
                  <th>출발 시간</th>
                  <th>도착 시간</th>
                  <th>목적</th>
                  <th>차량 ID</th>
                  <th>거리 (m)</th>
                  <th>소요시간</th>
                  <th>출발/도착지</th>
                  <th>운행 경로</th>
                  <th>총 비용</th>
                  <th>수정</th>
                  <th>삭제</th>
                </tr>
              </thead>
              <tbody className="car-history-tbody">
                {filterCarData().map((car) => (
                  <tr key={car.id}> {/* Ensure each row has a unique key */}
                    <td>{new Date(car.departure_time).toISOString()}</td>
                    <td>{new Date(car.arrival_time).toISOString()}</td>
                    <td>{car.driving_purpose}</td>
                    <td>{car.vehicle}</td>
                    <td>{car.driving_distance} m</td>
                    <td>{car.driving_time}</td>
                    <td>
                      출발: {car.departure_location}<br />
                      도착: {car.arrival_location}
                    </td>
                    <td>
                      <button onClick={() => openMapModal()}>지도보기</button>
                    </td>
                    <td>{car.total_cost} 원</td>
                    <td>
                      <button onClick={() => handleUpdate(car.id)}>수정</button>
                    </td>
                    <td>
                      <button onClick={() => handleDelete(car.id)}>삭제</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {isDatePickerOpen && (
          <div className="date-picker-popup">
            <div className="date-picker-popup-top">
              <h4 className="date-picker-popup-title">가는날을 선택하세요</h4>
              <button className="car-history-reset-button" onClick={handleReset}>날짜 지우기</button>
            </div>
            <div className="date-picker-container">
              <DatePicker
                locale={ko}
                selected={startDate}
                onChange={(dates) => {
                  const [start, end] = dates;
                  setStartDate(start);
                  setEndDate(end);
                }}
                startDate={startDate}
                endDate={endDate}
                selectsRange
                inline
                showMonthDropdown
                showYearDropdown
                dropdownMode="select"
              />
            </div>
            <button className="car-history-date-btn" onClick={() => setIsDatePickerOpen(false)}>확인</button>
            <button className="car-history-close-btn" onClick={() => setIsDatePickerOpen(false)}>닫기</button>
          </div>
        )}

        <Modal
          isOpen={isMapOpen}
          onRequestClose={closeMapModal}
          shouldCloseOnOverlayClick={true}
          ariaHideApp={false}
          style={customModalStyles}
        >
          <UseMap onClose={closeMapModal} coord={markers} />
        </Modal>
      </div>
    </div>
  );
};

export default CarHistory;
