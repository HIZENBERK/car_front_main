import React, { useState, useEffect, useRef } from 'react';
import DatePicker from 'react-datepicker';
import Modal from 'react-modal';
import 'react-datepicker/dist/react-datepicker.css';
import { ko } from 'date-fns/locale'; // 한국어 설정
import '../CSS/CarHistory.css';
import UseMap, { useMap } from '../Component/UseMap';
import * as XLSX from 'xlsx'
import ExcelJS from 'exceljs';
import saveAs from 'file-saver';
import {makeXlsx} from "../Component/MakeXlsx";

const CarHistory = () => {
  const [markers, setMarkers] = useState([]);
  const [isMapOpen, setIsMapOpen] = useState(false); // 모달 상태 관리
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [recordOption, setRecordOption] = useState('전체');
  const [useType, setUseType] = useState('전체');
  const [distanceOption, setDistanceOption] = useState('전체');

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

  const coordinates = [
    { latitude: 37.566742, longitude: 127.008330 },
    { latitude: 37.567924, longitude: 127.009059 },
    { latitude: 37.568919, longitude: 127.009649 },
    { latitude: 37.570067, longitude: 127.009950 },
    { latitude: 37.571121, longitude: 127.009510 },
    { latitude: 37.572116, longitude: 127.008620 },
    { latitude: 37.572916, longitude: 127.007911 },
    { latitude: 37.573519, longitude: 127.007332 },
    { latitude: 37.574310, longitude: 127.006635 },
    { latitude: 37.574540, longitude: 127.006045 },
    { latitude: 37.575013, longitude: 127.005644 },
    { latitude: 37.575635, longitude: 127.005031 },
    { latitude: 37.576070, longitude: 127.003921 },
    { latitude: 37.576277, longitude: 127.002269 },
    { latitude: 37.576570, longitude: 127.002256 },
    { latitude: 37.577090, longitude: 127.002264 },
    { latitude: 37.577577, longitude: 127.002249 },
    { latitude: 37.578124, longitude: 127.002226 },
    { latitude: 37.579110, longitude: 127.002196 },
    { latitude: 37.579576, longitude: 127.002192 },
    { latitude: 37.580075, longitude: 127.002177 },
    { latitude: 37.580995, longitude: 127.002067 },
    { latitude: 37.581608, longitude: 127.002059 },
    { latitude: 37.582240, longitude: 127.001945},
    { latitude: 37.583184, longitude: 127.001809 },
    { latitude: 37.584085, longitude: 127.001657 },
    { latitude: 37.584666, longitude: 127.001521},
    { latitude: 37.585053, longitude: 127.001498},
    { latitude: 37.585086, longitude: 127.001778}
  ];

  const coordinates2 = [
    {latitude: 37.3967, longitude: 126.9074},
    {latitude: 37.396708, longitude: 126.907916},
    {latitude: 37.396630, longitude: 126.908587},
    {latitude: 37.396204, longitude: 126.909412},
    {latitude: 37.396261, longitude: 126.911446}
  ];
  const coordinates3 = [
    {latitude: 37.3967, longitude: 126.9074},
    {latitude: 37.396708, longitude: 126.907916},
    {latitude: 37.396630, longitude: 126.908587},
    {latitude: 37.396204, longitude: 126.909412},
    {latitude: 37.396261, longitude: 126.911446}
  ];
  // km를 숫자로 변환하는 함수
  const getKmValue = (distance) => {
    return parseFloat(distance.split(' km')[0]);
  };

  const openMapModal = () => setIsMapOpen(true); // 지도 모달 열기
  const closeMapModal = () => setIsMapOpen(false); // 지도 모달 닫기

  // 운행 기록과 용도 및 거리 옵션에 따른 필터링 함수
  const filterCarData = () => {
    return carData.filter((car) => {
      // 운행 기록 옵션 필터링
      if (recordOption === '삭제된 차량 제외' && car.isDeleted) return false;
      // 운행 용도 필터링
      if (useType !== '전체' && car.purpose !== useType) return false;
      // 거리 옵션 필터링
      const carKm = getKmValue(car.distance);
      //if (distanceOption === '3km 이상' && carKm < 3) return false;
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

  const customModalStyles = {
    content: {
      marginLeft: '200px'// 왼쪽 마진 200px
    },
  };

  const handleDownloadExcel = async () => {
    // const filteredData = filterCarData().map((car) => ({
    //   일시시간: car.date,
    //   목적: car.purpose,
    //   차량운전자: `${car.car} (${car.driver})`,
    //   거리_소요시간: car.distance,
    //   출도착지: `출발: ${car.start} / 도착: ${car.end}`,
    //   누적주행거리: car.totalDistance,
    // }));
    //
    // const worksheet = XLSX.utils.json_to_sheet(filteredData);
    // const workbook = XLSX.utils.book_new();
    // XLSX.utils.book_append_sheet(workbook, worksheet, "CarHistory");
    //
    // // 엑셀 파일로 다운로드
    // XLSX.writeFile(workbook, "차량운행기록.xlsx");

    const filteredData = filterCarData(); // 필터링된 데이터 준비
    await makeXlsx(filteredData); // 함수 호출
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
            <div className="_black"></div>
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
            {/*<input*/}
            {/*  type="radio"*/}
            {/*  name="distance-option"*/}
            {/*  value="3km 이상"*/}
            {/*  checked={distanceOption === '3km 이상'}*/}
            {/*  onChange={handleDistanceOptionChange}*/}
            {/*/> 3km 이상*/}
            <div className="_black"></div>
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
            <div className="_black"></div>
            <input
              type="radio"
              name="use-type"
              value="출퇴근용"
              checked={useType === '출퇴근용'}
              onChange={handleUseTypeChange}
            /> 출/퇴근용
            <div className="_black"></div>
            <input
              type="radio"
              name="use-type"
              value="업무용"
              checked={useType === '업무용'}
              onChange={handleUseTypeChange}
            /> 업무용
            <div className="_black"></div>
            <input
              type="radio"
              name="use-type"
              value="비업무용"
              checked={useType === '비업무용'}
              onChange={handleUseTypeChange}
            /> 비업무용
          </div>
          <div className="car-history-d-box-date-check">
            <button className="car-history-date-check-button" onClick={() => setIsDatePickerOpen(!isDatePickerOpen)}>
              기간 조회
            </button>
          </div>
        </div>

        <div className="car-history-e-box">
          <div className="car-history-e-box-search-box">
            <input className="car-history-e-box-search-input" placeholder='통합검색...'></input>
          </div>
          <div className="car-history-e-box-see-box">

          </div>
        </div>

        <div className="car-history-f-box">
        <table className="car-history-table">
          <thead>
            <tr>
              <th>일시/시간</th>
              <th>목적</th>
              <th>차량(운전자)</th>
              <th>거리 / 소요시간(분)</th>
              <th>출발/도착지</th>
              <th>누적 주행거리</th>
              <th>운행 경로</th>
              <th>참고</th>
            </tr>
          </thead>
          <tbody className="car-history-tbody">
            {filterCarData().map((car) => (
              <tr key={car.id}>
                <td>{car.date}</td>
                <td>{car.purpose}</td>
                <td>{car.car}<br />{car.driver}</td>
                <td>{car.distance}</td>
                <td>출발: {car.start}<br />도착: {car.end}</td>
                <td>{car.totalDistance}</td>
                <td>
                  <button onClick={() => openMapModal(coordinates)}>지도보기</button>
                </td>
                <td>
                  <button>관리자 생성</button>
                </td>
              </tr>
            ))}
            </tbody>
          </table>
        </div>

      </div>
    {/* Date picker modal */}
    {isDatePickerOpen && (
        <div className="date-picker-popup">
          <div className="date-picker-popup-top">
            <h4 className="date-picker-popup-title">가는날을 선택하세요</h4>
            <button className="car-history-reset-button" onClick={handleReset}>날짜 지우기</button>
          </div>

    {/* 가로로 두 개의 DatePicker 배치 */}
    <div className="date-picker-container">
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
    </div>

          <div className="date-display">
            <p>시작 날짜: {startDate ? startDate.toLocaleDateString('ko-KR') : '선택되지 않음'}</p>
            <p>끝나는 날짜: {endDate ? endDate.toLocaleDateString('ko-KR') : '선택되지 않음'}</p>
          </div>

          <button className="car-history-date-btn" onClick={() => setIsDatePickerOpen(false)}>확인</button>
          <button className="car-history-close-btn" onClick={() => setIsDatePickerOpen(false)}>닫기</button>
        </div>
      )}

      {/* 지도 모달 */}
      <Modal
          isOpen={isMapOpen}
          onRequestClose={closeMapModal}
          shouldCloseOnOverlayClick={true}
          ariaHideApp={false}
          style={customModalStyles}
      >
        <UseMap onClose={closeMapModal} coord = {coordinates}/>
      </Modal>
      </div>
    </div>
  );
};

export default CarHistory;
