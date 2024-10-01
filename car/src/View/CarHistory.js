import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { ko } from 'date-fns/locale'; // 한국어 설정
import '../CSS/CarHistory.css';

const CarHistory = () => {
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [recordOption, setRecordOption] = useState('전체');
  const [useType, setUseType] = useState('전체');
  const [distanceOption, setDistanceOption] = useState('전체'); // 거리 옵션 추가

  // 운행 기록 데이터 (기본 샘플 데이터)
  const carData = [
    {
      id: 1,
      date: "2024-09-24",
      purpose: "업무용",
      car: "K3(123가1234)",
      driver: "김아무개 실장 / 차주회사",
      distance: "6 km / 00:10",
      start: "서울특별시",
      end: "서울특별시",
      totalDistance: "123,456 km",
      isDeleted: false,
    },
    {
      id: 2,
      date: "2024-09-25",
      purpose: "출퇴근용",
      car: "K5(456가7890)",
      driver: "박아무개 팀장 / 차주회사",
      distance: "12 km / 00:20",
      start: "인천광역시",
      end: "서울특별시",
      totalDistance: "123,500 km",
      isDeleted: false,
    },
    {
      id: 3,
      date: "2024-09-26",
      purpose: "비업무용",
      car: "아반떼(789가1234)",
      driver: "최아무개 차장 / 차주회사",
      distance: "8 km / 00:15",
      start: "부천시",
      end: "서울특별시",
      totalDistance: "123,800 km",
      isDeleted: true,
    },
  ];

  // km를 숫자로 변환하는 함수
  const getKmValue = (distance) => {
    return parseFloat(distance.split(' km')[0]);
  };

  // 운행 기록과 용도 및 거리 옵션에 따른 필터링 함수
  const filterCarData = () => {
    return carData.filter((car) => {
      // 운행 기록 옵션 필터링
      if (recordOption === '삭제된 차량 제외' && car.isDeleted) return false;
      // 운행 용도 필터링
      if (useType !== '전체' && car.purpose !== useType) return false;
      // 거리 옵션 필터링
      const carKm = getKmValue(car.distance);
      if (distanceOption === '3km 이상' && carKm < 3) return false;
      if (distanceOption === '3km 이하' && carKm > 3) return false;
      return true;
    });
  };

  // 필터 적용 시 사용자가 선택한 운행 기록 옵션 저장
  const handleRecordOptionChange = (e) => {
    setRecordOption(e.target.value);
  };

  // 필터 적용 시 사용자가 선택한 운행 용도 저장
  const handleUseTypeChange = (e) => {
    setUseType(e.target.value);
  };

  // 거리 필터 적용 시 사용자가 선택한 거리 옵션 저장
  const handleDistanceOptionChange = (e) => {
    setDistanceOption(e.target.value);
  };

  // 날짜 선택 초기화
  const handleReset = () => {
    setStartDate(null);
    setEndDate(null);
  };

  return (
    <div className="container">
      <div className="filters">
        <div className="filter-row">
          <label>운행기록 옵션:</label>
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

        <div className="filter-row">
          <label>운행 용도:</label>
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
            value="출퇴근용"
            checked={useType === '출퇴근용'}
            onChange={handleUseTypeChange}
          /> 출/퇴근용
          <input
            type="radio"
            name="use-type"
            value="업무용"
            checked={useType === '업무용'}
            onChange={handleUseTypeChange}
          /> 업무용
          <input
            type="radio"
            name="use-type"
            value="비업무용"
            checked={useType === '비업무용'}
            onChange={handleUseTypeChange}
          /> 비업무용
        </div>

        <div className="filter-row">
          <label>거리 옵션:</label>
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
            value="3km 이상"
            checked={distanceOption === '3km 이상'}
            onChange={handleDistanceOptionChange}
          /> 3km 이상
          <input
            type="radio"
            name="distance-option"
            value="3km 이하"
            checked={distanceOption === '3km 이하'}
            onChange={handleDistanceOptionChange}
          /> 3km 이하
        </div>

        <div className="filter-row">
          <button onClick={() => setIsDatePickerOpen(!isDatePickerOpen)}>
            기간 조회
          </button>
        </div>
      </div>

      {/* Date picker modal */}
      {isDatePickerOpen && (
        <div className="date-picker-popup">
          <h4>가는날을 선택하세요</h4>

          {/* 세로로 두 개의 DatePicker 배치 */}
          <DatePicker
            locale={ko} // 한국어 설정
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
            showMonthDropdown  // 월 선택 드롭다운 표시
            showYearDropdown   // 연도 선택 드롭다운 표시
            dropdownMode="select"  // 드롭다운 모드로 연도/월 선택
          />

          <DatePicker
            locale={ko} // 한국어 설정
            selected={endDate}
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

          <div className="date-display">
            <p>시작 날짜: {startDate ? startDate.toLocaleDateString('ko-KR') : '선택되지 않음'}</p>
            <p>끝나는 날짜: {endDate ? endDate.toLocaleDateString('ko-KR') : '선택되지 않음'}</p>
          </div>
          <button className="reset-button" onClick={handleReset}>날짜 지우기</button>
          <button onClick={() => setIsDatePickerOpen(false)}>확인</button>
        </div>
      )}

      <table className="car-history-table">
        <thead>
          <tr>
            <th>일시/시간</th>
            <th>목적</th>
            <th>차량(운전자)</th>
            <th>거리 / 소요시간(분)</th>
            <th>출/도착지</th>
            <th>누적 주행거리</th>
            <th>연수증</th>
            <th>참고</th>
          </tr>
        </thead>
        <tbody>
          {filterCarData().map((car) => (
            <tr key={car.id}>
              <td>{car.date}</td>
              <td>{car.purpose}</td>
              <td>{car.car}<br />{car.driver}</td>
              <td>{car.distance}</td>
              <td>출발: {car.start}<br />도착: {car.end}</td>
              <td>{car.totalDistance}</td>
              <td><button>지도보기</button></td>
              <td><button>관리자 생성</button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CarHistory;
