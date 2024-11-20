import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import Modal from 'react-modal';
import 'react-datepicker/dist/react-datepicker.css';
import { ko } from 'date-fns/locale';
import '../CSS/CarHistory.css';
import UseMap from '../Component/UseMap';
import { makeXlsx } from "../Component/MakeXlsx";
import { useAuth } from "../Component/AuthContext"; // useAuth를 통해 인증 정보를 불러옵니다.

const CarHistory = () => {
  const { authState, refreshAccessToken } = useAuth(); // useAuth로 authState 가져오기
  const [markers, setMarkers] = useState([]);
  const [isMapOpen, setIsMapOpen] = useState(false);
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [recordOption, setRecordOption] = useState('전체');
  const [useType, setUseType] = useState('전체');
  const [distanceOption, setDistanceOption] = useState('전체');
  const [carData, setCarData] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false); // State to handle the registration modal
  const [recordIdToEdit, setRecordIdToEdit] = useState(null);
  const [selectedCoordinates, setSelectedCoordinates] = useState([]); // 선택된 좌표 저장
  const [currentPage, setCurrentPage] = useState(1); // 현재 페이지
  const [itemsPerPage, setItemsPerPage] = useState(10); // 페이지당 항목 수

  const [editingRecord, setEditingRecord] = useState({
    vehicle: '',
    departure_location: '',
    arrival_location: '',
    departure_mileage: 0,
    arrival_mileage: 0,
    departure_time: '',
    arrival_time: '',
    coordinates: [],
    driving_purpose: '',
    fuel_cost: 0,
    toll_fee: 0,
    other_costs: 0,
    created_at:'',
  });
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!authState.access) {
      setError('로그인이 필요합니다.');
      return;
    }
  
  //   fetch('https://hizenberk.pythonanywhere.com/api/driving-records/', {
  //     headers: {
  //       'Authorization': `Bearer ${authState.access}`,
  //     },
  //   })
  //     .then(response => {
  //       console.log("Response Status:", response.status); // 상태 코드 출력
  //       return response.json();
  //     })
  //     .then(data => {
  //       console.log("API Response Data:", data); // 응답 데이터 출력
  //       if (data.records && Array.isArray(data.records)) {
  //         setCarData(data.records);
  //       } else {
  //         console.error('Unexpected response format:', data);
  //       }
  //     })
  //     .catch(error => console.error('Error fetching driving records:', error));
  // }, [authState.access]);

  fetch('https://hizenberk.pythonanywhere.com/api/driving-records/', {
    headers: {
      'Authorization': `Bearer ${authState.access}`,
    },
  })
    .then(response => response.json())
    .then(data => {
      if (data.records && Array.isArray(data.records)) {
        setCarData(data.records);
      } else {
        console.error('Unexpected response format:', data);
      }
    })
    .catch(error => console.error('Error fetching driving records:', error));
}, [authState.access]);


const filterCarData = () => {
  return carData.filter((car) => {
    const recordDate = new Date(car.created_at.split('T')[0]);
    if (startDate && recordDate < startDate) return false;
    if (endDate && recordDate > endDate) return false;

    if (recordOption === '삭제된 차량 제외' && car.isDeleted) return false;
    if (useType !== '전체' && car.driving_purpose !== useType) return false;
    if (distanceOption === '3km 이하' && car.driving_distance > 3000) return false;

    return true;
  });
};

// DatePicker 확인 버튼 로직
const handleDatePickerConfirm = () => {
  setIsDatePickerOpen(false); // DatePicker 닫기
};

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

  const openMapModal = (coordinates) => {
    setSelectedCoordinates(coordinates); // 선택된 경로 좌표를 저장
    setIsMapOpen(true); // 지도 모달 열기
  };
  
  const closeMapModal = () => {
    setIsMapOpen(false); // 지도 모달 닫기
    setSelectedCoordinates([]); // 좌표 초기화
  };

  const handleEditRecord = (recordId) => {
    const record = carData.find((car) => car.id === recordId);
    if (!record) {
      console.error("Record not found for ID:", recordId);
      return;
    }
    setEditingRecord({ ...record }); // 복사하여 상태에 저장
    setRecordIdToEdit(recordId);
    setIsModalOpen(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditingRecord((prevState) => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async () => {
    if (!authState.access) {
      // Access token이 없으면 로그인을 요청합니다.
      setError("로그인이 필요합니다.");
      return;
    }

    const payload = {
      vehicle: editingRecord.vehicle,
      departure_location: editingRecord.departure_location,
      arrival_location: editingRecord.arrival_location,
      departure_mileage: editingRecord.departure_mileage,
      arrival_mileage: editingRecord.arrival_mileage,
      departure_time: editingRecord.departure_time,
      arrival_time: editingRecord.arrival_time,
      coordinates: editingRecord.coordinates,
      driving_purpose: editingRecord.driving_purpose,
      fuel_cost: editingRecord.fuel_cost,
      toll_fee: editingRecord.toll_fee,
      other_costs: editingRecord.other_costs
    };

    try {
      const response = await fetch(
        `https://hizenberk.pythonanywhere.com/api/driving-records/${recordIdToEdit}/`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${authState.access}` // Bearer 토큰을 Authorization 헤더에 추가
          },
          body: JSON.stringify(payload)
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData.message || 'Failed to update record');
        return;
      }

      // 성공적으로 수정된 후, carData를 다시 갱신
      fetch('https://hizenberk.pythonanywhere.com/api/driving-records/', {
        headers: {
          'Authorization': `Bearer ${authState.access}`,
        },
      })
        .then(response => response.json())
        .then(data => {
          if (data.records && Array.isArray(data.records)) {
            setCarData(data.records);
          }
        })
        .catch(error => console.error('Error fetching driving records:', error));

      setIsModalOpen(false);
    } catch (err) {
      setError('Server error. Please try again later.');
    }
  };

  const handleDeleteRecord = async (recordId) => {
    if (!authState.access) {
      setError('로그인이 필요합니다.');
      return;
    }

    try {
      const response = await fetch(
        `https://hizenberk.pythonanywhere.com/api/driving-records/${recordId}/`,
        {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${authState.access}`,
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData.message || 'Failed to delete record');
        return;
      }

      // 성공적으로 삭제 후, carData를 갱신
      setCarData((prevData) => prevData.filter(car => car.id !== recordId));
    } catch (err) {
      setError('Server error. Please try again later.');
    }
  };

  const handleRegisterRecord = async () => {
    if (!authState.access) {
      setError('로그인이 필요합니다.');
      return;
    }

    // Ensure `driving_purpose` is one of the valid options
    const validDrivingPurposes = ["business", "personal", "other"]; // Add other valid options as needed
    if (!validDrivingPurposes.includes(editingRecord.driving_purpose)) {
      setError('운행 목적이 유효하지 않습니다.');
      return;
    }

    const payload = {
      vehicle: editingRecord.vehicle,
      departure_location: editingRecord.departure_location,
      arrival_location: editingRecord.arrival_location,
      departure_mileage: editingRecord.departure_mileage,
      arrival_mileage: editingRecord.arrival_mileage,
      departure_time: editingRecord.departure_time,
      arrival_time: editingRecord.arrival_time,
      coordinates: editingRecord.coordinates,
      driving_purpose: editingRecord.driving_purpose,
      fuel_cost: editingRecord.fuel_cost,
      toll_fee: editingRecord.toll_fee,
      other_costs: editingRecord.other_costs
    };

    console.log("Payload being sent:", payload); // Log the payload for debugging

    try {
      const response = await fetch(
        'https://hizenberk.pythonanywhere.com/api/driving-records/create/',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${authState.access}`,
          },
          body: JSON.stringify(payload)
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Error data:", errorData); // Log the detailed error from the server
        setError(errorData.message || '운행 기록 생성에 실패했습니다.');
        return;
      }

      // Successfully created, update the carData
      fetch('https://hizenberk.pythonanywhere.com/api/driving-records/', {
        headers: {
          'Authorization': `Bearer ${authState.access}`,
        },
      })
        .then(response => response.json())
        .then(data => {
          if (data.records && Array.isArray(data.records)) {
            setCarData(data.records);
          }
        })
        .catch(error => console.error('Error fetching driving records:', error));

      setIsRegisterModalOpen(false); // Close the register modal after submission
    } catch (err) {
      console.error("Server error:", err);
      setError('Server error. Please try again later.');
    }
  };

  const getDrivingPurposeInKorean = (purpose) => {
    switch (purpose) {
      case "commuting":
        return "출/퇴근";
      case "business":
        return "일반업무";
      case "non_business":
        return "비업무";
      default:
        return "알 수 없음";
    }
  };

  const paginateCarData = () => {
    const filteredData = filterCarData(); // 필터링된 데이터
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredData.slice(startIndex, endIndex);
  };


  const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);

  const handleItemsPerPageChange = (e) => {
    setItemsPerPage(Number(e.target.value));
    setCurrentPage(1); // 항목 수 변경 시 페이지를 1로 초기화
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

        {/* 운행 기록 목록 */}
        <div className="car-history-a-box">
          <div className="car-history-c-box">
            <div className="car-history-c-box-list-option">
              <label className="car-history-middle-title">운행 기록 옵션:</label>
              <input
                type="radio"
                name="record-option"
                value="전체"
                checked={recordOption === "전체"}
                onChange={(e) => setRecordOption(e.target.value)}
              />{" "}
              전체
              <input
                type="radio"
                name="record-option"
                value="삭제된 차량 제외"
                checked={recordOption === "삭제된 차량 제외"}
                onChange={(e) => setRecordOption(e.target.value)}
              />{" "}
              삭제된 차량 제외
            </div>
            <div className="car-history-c-box-way-option">
              <label className="car-history-middle-title">거리 옵션:</label>
              <input
                type="radio"
                name="distance-option"
                value="전체"
                checked={distanceOption === "전체"}
                onChange={(e) => setDistanceOption(e.target.value)}
              />{" "}
              전체
              <input
                type="radio"
                name="distance-option"
                value="3km 이하"
                checked={distanceOption === "3km 이하"}
                onChange={(e) => setDistanceOption(e.target.value)}
              />{" "}
              3km 이하
            </div>
          </div>

          <div className="car-history-d-box">
            <div className="car-history-d-box-operation">
              <label className="car-history-middle-title">운행 용도:</label>
              <input
                type="radio"
                name="use-type"
                value="전체"
                checked={useType === "전체"}
                onChange={(e) => setUseType(e.target.value)}
              />{" "}
              전체
              <input
                type="radio"
                name="use-type"
                value="commuting"
                checked={useType === "commuting"}
                onChange={(e) => setUseType(e.target.value)}
              />{" "}
              출퇴근
              <input
                type="radio"
                name="use-type"
                value="business"
                checked={useType === "business"}
                onChange={(e) => setUseType(e.target.value)}
              />{" "}
              일반업무
              <input
                type="radio"
                name="use-type"
                value="non_business"
                checked={useType === "non_business"}
                onChange={(e) => setUseType(e.target.value)}
              />{" "}
              비업무
            </div>
<div className="car-history-d-box-date-check">
              <button className="car-history-date-check-button" onClick={() => setIsDatePickerOpen(!isDatePickerOpen)}>
                기간 조회
              </button>
              <button className="car-history-date-check-button" onClick={() => setIsRegisterModalOpen(true)}>
                등록
              </button>
            </div>
          </div>

          <div className="car-history-f-box">
  <div>
    <label>페이지당 항목 수:</label>
    <select value={itemsPerPage} onChange={handleItemsPerPageChange}>
      <option value={10}>10</option>
      <option value={20}>20</option>
      <option value={30}>30</option>
    </select>
  </div>
  <table className="car-history-table">
    <thead>
      <tr>
        <th>운행 기록 생성일</th>
        <th>출발 시간</th>
        <th>도착 시간</th>
        <th>목적</th>
        <th>차종</th>
        <th>차량 번호</th>
        <th>이름</th>
        <th>거리 (km)</th>
        <th>소요시간</th>
        <th>출발/도착지</th>
        <th>총 비용</th>
      </tr>
    </thead>
    <tbody className="car-history-tbody">
      {paginateCarData().map((car) => (
        <tr key={car.id}>
          <td>{car.created_at.split("T")[0]}</td>
          <td>{new Date(car.departure_time).toLocaleTimeString('ko-KR', { hour12: false })}</td>
        <td>{new Date(car.arrival_time).toLocaleTimeString('ko-KR', { hour12: false })}</td>
          <td>{getDrivingPurposeInKorean(car.driving_purpose)}</td>
          <td>{car.vehicle_type}</td>
          <td>{car.vehicle_license_plate_number}</td>
          <td>{car.user_name}</td>
          <td>{car.driving_distance}Km</td>
          <td>{car.driving_time}</td>
          <td>
            출발: {car.departure_location}
            <br />
            도착: {car.arrival_location}
          </td>
          <td>{car.total_cost} 원</td>
        </tr>
      ))}
    </tbody>
  </table>
  {/* 페이지 번호 표시 영역 */}
  <div className="pagination-buttons" style={{ textAlign: "center", marginTop: "20px" }}>
    {Array.from(
      { length: Math.ceil(filterCarData().length / itemsPerPage) },
      (_, index) => (
        <button
          key={index + 1}
          onClick={() => handlePageChange(index + 1)}
          className={currentPage === index + 1 ? "active" : ""}
          style={{ margin: "5px" }}
        >
          {index + 1}
        </button>
      )
    )}
  </div>
</div>
</div>

        {/* Date Picker and Modal Code remains the same */}
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

        {/* Register Modal for car record */}
        <Modal
  isOpen={isModalOpen}
  onRequestClose={() => setIsModalOpen(false)}
  ariaHideApp={false}
  className="car-history-update-modal"
>
  <div className="car-history-update-modal-box">
  <div className="car-history-update-modal-box-top-box">
    <h2>운행 기록 수정</h2>
  </div>
  {error && <p className="error-message">{error}</p>}
  <div className="car-history-update-modal-body-box">
    <label className="car-history-update-modal-label">차량 ID :</label>
    <input
      type="text"
      name="vehicle"
      className="car-history-update-modal-input"
      value={editingRecord.vehicle || ''} // 안전한 기본값
      onChange={handleInputChange}
    />
  </div>
  <div className="car-history-update-modal-body-box">
    <label className="car-history-update-modal-label">출발지 :</label>
    <input
      type="text"
      name="departure_location"
      className="car-history-update-modal-input"
      value={editingRecord.departure_location || ''}
      onChange={handleInputChange}
    />
  </div>
  <div className="car-history-update-modal-body-box">
    <label className="car-history-update-modal-label">도착지 :</label>
    <input
      type="text"
      name="arrival_location"
      className="car-history-update-modal-input"
      value={editingRecord.arrival_location || ''}
      onChange={handleInputChange}
    />
  </div>
  <div className="car-history-update-modal-body-box">
    <label className="car-history-update-modal-label">연료비 :</label>
    <input
      type="number"
      name="fuel_cost"
      className="car-history-update-modal-input"
      value={editingRecord.fuel_cost || 0}
      onChange={handleInputChange}
    />
  </div>
  <div className="car-history-update-modal-body-box">
    <label className="car-history-update-modal-label">통행료 :</label>
    <input
      type="number"
      name="toll_fee"
      className="car-history-update-modal-input"
      value={editingRecord.toll_fee || 0}
      onChange={handleInputChange}
    />
  </div>
  <div className="car-history-update-modal-body-box">
    <label className="car-history-update-modal-label">운행 목적 :</label>
    <input
      type="text"
      name="driving_purpose"
      className="car-history-update-modal-input"
      value={editingRecord.driving_purpose || ''}
      onChange={handleInputChange}
    />
  </div>
 
  <div className="car-history-update-modal-body-box">
    <label className="car-history-update-modal-label">기타 비용 :</label>
    <input
      type="number"
      name="other_costs"
      className="car-history-update-modal-input"
      value={editingRecord.other_costs || 0}
      onChange={handleInputChange}
    />
  </div>
  <div className="car-history-update-modal-body-box">
    <label className="car-history-update-modal-label">출발 시간 :</label>
    <input
      type="datetime-local"
      name="departure_time"
      className="car-history-update-modal-input"
      value={editingRecord.departure_time || ''}
      onChange={handleInputChange}
    />
  </div>
  <div className="car-history-update-modal-body-box">
    <label className="car-history-update-modal-label">도착 시간 :</label>
    <input
      type="datetime-local"
      name="arrival_time"
      className="car-history-update-modal-input"
      value={editingRecord.arrival_time || ''}
      onChange={handleInputChange}
    />
  </div>
  
  <div className="car-history-update-modal-body-box">
    <label className="car-history-update-modal-label">출발 전 누적 주행거리 :</label>
    <input
      type="number"
      name="departure_mileage"
      className="car-history-update-modal-input"
      value={editingRecord.departure_mileage || 0}
      onChange={handleInputChange}
    />
  </div>
  <div className="car-history-update-modal-body-box">
    <label className="car-history-update-modal-label">도착 후 누적 주행거리 :</label>
    <input
      type="number"
      name="arrival_mileage"
      className="car-history-update-modal-input"
      value={editingRecord.arrival_mileage || 0}
      onChange={handleInputChange}
    />
  </div>
  <div style={{ marginTop: '20px' }}>
    <button className="car-history-update-modal-update-btn" onClick={handleSubmit}>수정</button>
    <button className="car-history-update-modal-close-btn" onClick={() => setIsModalOpen(false)}>닫기</button>
  </div></div>
</Modal>
{isMapOpen && (
  <Modal
    isOpen={isMapOpen}
    onRequestClose={closeMapModal}
    ariaHideApp={false}
    style={{ content: { marginLeft: '200px' } }}
  >
    <UseMap onClose={closeMapModal} coord={selectedCoordinates}/>
  </Modal>
)}
{/* Register Modal for car record */}
<Modal
  isOpen={isRegisterModalOpen}
  onRequestClose={() => setIsRegisterModalOpen(false)}
  ariaHideApp={false}
  className="car-history-update-modal"
>
<div className="car-history-update-modal-box">
  <div className="car-history-update-modal-box-top-box">
    <h2>운행 기록 등록</h2>
  </div>
  {error && <p className="error-message">{error}</p>}
  <div className="car-history-update-modal-body-box">
    <label className="car-history-update-modal-label">차량 ID :</label>
    <input
      type="text"
      name="vehicle"
      className="car-history-update-modal-input"
      onChange={handleInputChange}
    />
  </div>
  <div className="car-history-update-modal-body-box">
    <label className="car-history-update-modal-label">출발지 :</label>
    <input
      type="text"
      name="departure_location"
      className="car-history-update-modal-input"
      onChange={handleInputChange}
    />
  </div>
  <div className="car-history-update-modal-body-box">
    <label className="car-history-update-modal-label">도착지 :</label>
    <input
      type="text"
      name="arrival_location"
      className="car-history-update-modal-input"
      onChange={handleInputChange}
    />
  </div>
  <div className="car-history-update-modal-body-box">
    <label className="car-history-update-modal-label">연료비 :</label>
    <input
      type="number"
      name="fuel_cost"
      className="car-history-update-modal-input"
      onChange={handleInputChange}
    />
  </div>
  <div className="car-history-update-modal-body-box">
    <label className="car-history-update-modal-label">통행료 :</label>
    <input
      type="number"
      name="toll_fee"
      className="car-history-update-modal-input"
      onChange={handleInputChange}
    />
  </div>
  <div className="car-history-update-modal-body-box">
    <label className="car-history-update-modal-label">운행 목적 :</label>
    <input
      type="text"
      name="driving_purpose"
      className="car-history-update-modal-input"
      onChange={handleInputChange}
    />
  </div>
 
  <div className="car-history-update-modal-body-box">
    <label className="car-history-update-modal-label">기타 비용 :</label>
    <input
      type="number"
      name="other_costs"
      className="car-history-update-modal-input"
      onChange={handleInputChange}
    />
  </div>
  <div className="car-history-update-modal-body-box">
    <label className="car-history-update-modal-label">출발 시간 :</label>
    <input
      type="datetime-local"
      name="departure_time"
      className="car-history-update-modal-input"
      onChange={handleInputChange}
    />
  </div>
  <div className="car-history-update-modal-body-box">
    <label className="car-history-update-modal-label">도착 시간 :</label>
    <input
      type="datetime-local"
      name="arrival_time"
      className="car-history-update-modal-input"
      onChange={handleInputChange}
    />
  </div>
  
  <div className="car-history-update-modal-body-box">
    <label className="car-history-update-modal-label">출발 전 누적 주행거리 :</label>
    <input
      type="number"
      name="departure_mileage"
      className="car-history-update-modal-input"
      onChange={handleInputChange}
    />
  </div>
  <div className="car-history-update-modal-body-box">
    <label className="car-history-update-modal-label">도착 후 누적 주행거리 :</label>
    <input
      type="number"
      name="arrival_mileage"
      className="car-history-update-modal-input"
      onChange={handleInputChange}
    />
  </div>
  <div style={{ marginTop: '20px' }}>
    <button className="car-history-update-modal-update-btn" onClick={handleSubmit}>수정</button>
    <button className="car-history-update-modal-close-btn" onClick={() => setIsRegisterModalOpen(false)}>닫기</button>
  </div></div>
</Modal>

      </div>
    </div>
  );
};

export default CarHistory;