import React from 'react';
import './CSS/Admin.css';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement, // 만약 바 차트를 사용하는 경우
  ArcElement // 만약 파이 차트를 사용하는 경우
} from 'chart.js';
import PieChart from './View/PieChart';  // PieChart 가져오기
import BarChart from './View/BarChart';  // BarChart 가져오기

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

  

  return (
    <div className="admin-container">
      
      <div className="admin-top">
        <p className="office-name">회사명 : </p>
        <p className="person-name"> 님 안녕하세요!</p>
      </div>

      <div className="a-box">

        <div className="b-box">

          <div className="d-box">

            <div className="f-box">

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

            <div className="g-box">

              <div className="user-guide-box">
                <p className="admin-middle-title">사용자 가이드</p>
                <div className="user-guide-content">
                  {/* 여기에 사용자 가이드 내용이 들어갑니다 */}
                </div>
              </div>

            </div>

          </div>

          <div className="e-box">

          <div className="notice-box">
            <p className="notice-title">공지사항</p>
            <div className="notice-content">
              {/* 여기에 공지사항 내용이 들어갑니다 */}
            </div>
          </div>

          </div>
          
        </div>

        <div className="c-box">

          <div className="admin-bottom">
            <div className="operation-status-box">
              <div className="operation-status-top">
                <p className="admin-bottom-title">운행 현황</p>
                <select className="year-select" onChange={handleYearChange}>
                  <option value="2024">2024</option>
                  <option value="2023">2023</option>
                  <option value="2022">2022</option>
                  <option value="2021">2021</option>
                </select>
                <p className="operation-status-top-title">운행비율</p>
                <p className="month-distance-title">월간 운행거리</p>
                <div className="b-label-box">
                    <div className="d-label" />
                    <p className="label-text">업무용</p>
                    <div className="e-label" />
                    <p className="label-text">출/퇴근용</p>
                    <div className="f-label" />
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
