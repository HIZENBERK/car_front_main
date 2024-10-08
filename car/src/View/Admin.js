import React, { useState } from 'react';
import '../CSS/Admin.css';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement, // 만약 바 차트를 사용하는 경우
  ArcElement // 만약 파이 차트를 사용하는 경우
} from 'chart.js';
import PieChart from './PieChart';  // PieChart 가져오기
import BarChart from './BarChart';
import {useAuth} from "../Component/AuthContext";  // BarChart 가져오기

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement, // 바 차트일 경우
  ArcElement // 파이 차트일 경우
);

function Admin() {
  const handleClick = (item) => {
    console.log(`${item} 클릭됨`); // 클릭 이벤트 핸들러 (나중에 실제 로직으로 대체 가능)
  };

  const [selectedMonth, setSelectedMonth] = useState('');

  const handleYearChange = (event) => {
    const selectedYear = event.target.value;
    // 선택된 년도에 따른 데이터를 불러오는 로직
    console.log(`선택된 년도: ${selectedYear}`);
    
    // API 호출 또는 로컬 데이터를 가져오는 부분
    fetchDataForYear(selectedYear);
  };
  
  const fetchDataForYear = (year) => {
    // 선택된 년도에 맞는 데이터를 불러오는 로직 구현
    // 예시: API 호출 또는 상태 업데이트
    console.log(`${year}년 데이터를 불러옵니다.`);
  };

  //Month Select
  const handleMonthChange = (event) => {
    const selectedMonth = event.target.value;
    // 선택된 달에 따른 데이터를 불러오는 로직
    console.log(`선택된 달: ${selectedMonth}`);
    setSelectedMonth(selectedMonth); // 선택된 달을 상태로 업데이트
    fetchDataForMonth(selectedMonth);
    
    // API 호출 또는 로컬 데이터를 가져오는 부분
    fetchDataForMonth(selectedMonth);
  };
  const { authState } = useAuth();
  
  const fetchDataForMonth = (Month) => {
    // 선택된 달에 맞는 데이터를 불러오는 로직 구현
    // 예시: API 호출 또는 상태 업데이트
    console.log(`${Month}월 데이터를 불러옵니다.`);
  };

  return (
    <div className="admin-container">
      
      <div className="admin-top">
        <p className="office-name">회사명 : {authState.company_name}</p>
        <p className="person-name"> {authState.name} 님 안녕하세요!</p>
      </div>

      <div className="admin-a-box">

        <div className="admin-b-box">

          <div className="admin-d-box">

            <div className="admin-f-box">

              <div className="admin-middle">
                <div className="user-info-box">
                  <p className="admin-middle-title">사용자</p>
                  <div className="admin-middle-content">
                    <p className="admin-middle-text">전체</p>
                    <p className="admin-middle-text">신규</p>
                    <p className="admin-middle-text">사용중지</p>
                  </div>
                </div>

                <div className="vehicle-status-box">
                  <p className="admin-middle-title">차량 현황</p>
                  <div className="admin-middle-content">
                    <p className="admin-middle-text">가용 차량</p>
                    <p className="admin-middle-text">사용불가</p>
                    <p className="admin-middle-text">리스/렌트 만기 차량</p>
                  </div>
                </div>

                <div className="vehicle-run-box">
                  <p className="admin-middle-title">운행</p>
                  <div className="admin-middle-content">
                    <p className="admin-middle-text">금월 운행 건</p>
                    <p className="admin-middle-text">수정기록</p>
                  </div>
                </div>
              </div>

            </div>

            <div className="admin-g-box">

              <div className="user-guide-box">
                <p className="admin-middle-title">사용자 가이드</p>
                <div className="user-guide-content">
                  {/* 여기에 사용자 가이드 내용이 들어갑니다 */}
                </div>
              </div>

            </div>

          </div>

          <div className="admin-e-box">
            <div className="notice-box">
              <p className="notice-title">공지사항</p>
              <div className="notice-content">
                {/* 여기에 공지사항 내용이 들어갑니다 */}
              </div>
            </div>
          </div>
          
        </div>

        <div className="admin-c-box">

          <div className="admin-bottom">
            <div className="operation-status-box">
              <div className="operation-status-top">
                <p className="admin-bottom-title">운행 현황</p>
                <select className="year-select" onChange={handleYearChange}>
                  <option value="2024">2024년</option>
                  <option value="2023">2023년</option>
                  <option value="2022">2022년</option>
                  <option value="2021">2021년</option>
                </select>
                <select className="month-select" onChange={handleMonthChange}>
                  <option value="1">1월</option>
                  <option value="2">2월</option>
                  <option value="3">3월</option>
                  <option value="4">4월</option>
                  <option value="5">5월</option>
                  <option value="6">6월</option>
                  <option value="7">7월</option>
                  <option value="8">8월</option>
                  <option value="9">9월</option>
                  <option value="10">10월</option>
                  <option value="11">11월</option>
                  <option value="12">12월</option>
                </select>
                <p className="operation-status-top-title">{selectedMonth ? `${selectedMonth}월 운행비율` : '1월 운행비율'}</p>
                <p className="month-distance-title">월간 운행비율</p>
                <div className="b-label-box">
                    <div className="a-label" />
                    <p className="label-text">업무용</p>
                    <div className="b-label" />
                    <p className="label-text">출/퇴근용</p>
                    <div className="c-label" />
                    <p className="label-text">비업무용</p>
                  </div>
              </div>
              <div className="operation-status-middle">
                <div className="operation-number">
                  <p className="operation-status-middle-title">운행건수</p>
                    <div className="op-box">
                     <p className="operation-number-count">1,000</p>
                     <p className="op-count"> 건</p>
                    </div>
                    <p className="daily-average">일 평균</p>
                    <hr className="custom-line" />
                    <p className="weekly-average">주 평균</p>
                    <hr className="custom-line" />
                    <p className="monthly-average">월 평균</p>
                    <hr className="custom-line" />
                </div>
                <div className="operation-distance">
                  <p className="operation-status-middle-title">운행거리</p>
                  <div className="op-box">
                    <p className="operation-number-count">1,000</p>
                    <p className="op-count"> km</p>
                  </div>
                  <p className="daily-average">일 평균</p>
                  <hr className="custom-line" />
                  <p className="weekly-average">주 평균</p>
                  <hr className="custom-line" />
                  <p className="monthly-average">월 평균</p>
                  <hr className="custom-line" />
                </div>
                <div className="operation-percentage">
                  <div className="a-label-box">
                    <div className="a-label" />
                    <p className="label-text">업무용</p>
                    <div className="b-label" />
                    <p className="label-text">출/퇴근용</p>
                    <div className="c-label" />
                    <p className="label-text">비업무용</p>
                  </div>
                  <PieChart />
                </div>
                <div className="month-distance">
                  <BarChart />
                </div>

              </div>

            </div>

          </div>
          
        </div>

      </div> 

      

    </div>
  );
}

export default Admin;
