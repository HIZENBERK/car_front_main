import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../CSS/Admin.css';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement, 
  ArcElement 
} from 'chart.js';
import PieChart from './PieChart';  
import BarChart from './BarChart';
import { useAuth } from "../Component/AuthContext";
import axios from 'axios';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement, 
  ArcElement 
);

function Admin() {
  const [users, setUsers] = useState([]);
  const { authState } = useAuth();
  const [userCount, setUserCount] = useState(0);
  const [availableVehicles, setAvailableVehicles] = useState(0);
  const [totalVehicles, setTotalVehicles] = useState(0);
  const [unavailableVehicles, setUnavailableVehicles] = useState(0);
  const [expiredLeaseRentVehicles, setExpiredLeaseRentVehicles] = useState(0);
  const [bannedUserCount, setBannedUserCount] = useState(0);
  const [newUserCount, setNewUserCount] = useState(0);
  const [currentMonthDrivingCount, setCurrentMonthDrivingCount] = useState(0);
  const [totalDrivingCount, setTotalDrivingCount] = useState(0);
  const [dailyAverage, setDailyAverage] = useState(0);
  const [weeklyAverage, setWeeklyAverage] = useState(0);
  const [monthlyAverage, setMonthlyAverage] = useState(0);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear()); // 현재 연도로 초기화
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1); // 현재 월로 초기화 (1월 = 0이므로 +1)
  const [totalDrivingDistance, setTotalDrivingDistance] = useState(0);
  const [dailyDrivingDistance, setDailyDrivingDistance] = useState(0);
  const [weeklyDrivingDistance, setWeeklyDrivingDistance] = useState(0);
  const [monthlyDrivingDistance, setMonthlyDrivingDistance] = useState(0);
  const [chartData, setChartData] = useState(null); // BarChart에 전달할 데이터
  const [pieChartData, setPieChartData] = useState(null); // PieChart에 전달할 데이터
  const [drivingRecords, setDrivingRecords] = useState([]);
  const [notices, setNotices] = useState([]);
  const navigate = useNavigate();
  
  const getUserInfo = async (filter = {}) => {
    try {
      const response = await axios.get('https://hizenberk.pythonanywhere.com/api/users/', {
        headers: {
          Authorization: `Bearer ${authState.access}`,
        },
      });
      console.log('서버 응답 데이터:', response.data);
  
      if (Array.isArray(response.data.users)) {
        // 전체 사용자 수
        const allUsers = response.data.users;
        setUserCount(allUsers.length);
  
        // 사용 중지 사용자 수
        const bannedUsers = allUsers.filter((user) => user.is_banned);
        setBannedUserCount(bannedUsers.length);
  
        // 신규 사용자 수 계산
        const today = new Date().toISOString().split('T')[0];
        const newUsers = allUsers.filter((user) => 
          user.created_at && user.created_at.startsWith(today)
        );
        setNewUserCount(newUsers.length);
  
        // 필터링 (필드 및 쿼리 조건에 따른 필터 적용)
        let filteredUsers = allUsers;
        if (filter.field && filter.query) {
          filteredUsers = allUsers.filter((user) => {
            const userValue = user[filter.field]?.toString().toLowerCase();
            return userValue && userValue.includes(filter.query.toLowerCase());
          });
        }
        setUsers(filteredUsers);
      } else {
        console.error('Unexpected response data format:', response.data);
        setUsers([]); // 데이터가 배열이 아니면 빈 배열로 설정
      }
    } catch (err) {
      console.error('조회 실패:', err.response?.status, err.response?.data);
    }
  };
  

  const getVehicleInfo = async () => {
    try {
      const response = await axios.get('https://hizenberk.pythonanywhere.com/api/vehicles/', {
        headers: {
          Authorization: `Bearer ${authState.access}`
        },
      });
      const vehicles = response.data.vehicles;

      setTotalVehicles(vehicles.length);

      const available = vehicles.filter(vehicle => vehicle.current_status === '가용차량');
      setAvailableVehicles(available.length);

      const unavailable = vehicles.filter(vehicle => vehicle.current_status === '사용불가');
      setUnavailableVehicles(unavailable.length);

      const today = new Date();
      const expiredLeaseRent = vehicles.filter(vehicle => 
        vehicle.purchase_type && ['리스', '렌트'].includes(vehicle.purchase_type) &&
        vehicle.expiration_date && new Date(vehicle.expiration_date) < today
      );

      setExpiredLeaseRentVehicles(expiredLeaseRent.length);

      // 만기 차량 상태를 "사용불가"로 업데이트
      for (const vehicle of expiredLeaseRent) {
        if (vehicle.current_status !== '사용불가') {
          await updateVehicleStatus(vehicle.license_plate_number, '사용불가');
        }
      }
    } catch (err) {
      console.error('차량 정보 조회 실패:', err.response?.data);
    }
  };

  const updateVehicleStatus = async (licensePlateNumber, status) => {
    try {
      await axios.patch(`https://hizenberk.pythonanywhere.com/api/vehicles/${licensePlateNumber}`, 
      {
        current_status: status
      }, {
        headers: { Authorization: `Bearer ${authState.access}` }
      });
      console.log(`차량 ${licensePlateNumber}의 상태가 "${status}"로 업데이트되었습니다.`);
    } catch (err) {
      console.error('차량 상태 업데이트 실패:', err.response?.data);
    }
  };

  const getNotices = async () => {
    try {
      const response = await axios.get('https://hizenberk.pythonanywhere.com/api/notices/all/', {
        headers: {
          Authorization: `Bearer ${authState.access}`
        },
      });
      const fetchedNotices = response.data.notices.map((notice) => {
        const formattedDate = new Date(notice.created_at).toISOString().split('T')[0]; // "YYYY-MM-DD" 형식으로 변환
        return {
          id: notice.id,
          title: notice.title,
          date: formattedDate,
        };
      });
      setNotices(fetchedNotices);
    } catch (err) {
      console.error('공지사항 조회 실패:', err.response?.data);
    }
  };

  const getDrivingRecords = async (year, month) => {
    try {
        const response = await axios.get('https://hizenberk.pythonanywhere.com/api/driving-records/', {
            headers: { Authorization: `Bearer ${authState.access}` },
        });

        const records = response.data.records || [];
        console.log("Driving Records:", records);

        // 중복 데이터 제거 (ID 기준 고유한 데이터)
        const uniqueRecords = [...new Map(records.map(record => [record.id, record])).values()];
        console.log("Unique Driving Records:", uniqueRecords);

        // 선택된 연도와 월에 맞는 데이터 필터링
        const filteredRecords = uniqueRecords.filter((record) => {
            const recordDate = new Date(record.created_at);
            return (
                recordDate.getFullYear() === year &&
                recordDate.getMonth() + 1 === month
            );
        });
        console.log("Filtered Records:", filteredRecords);

        // 총 운행 거리 계산 (미터에서 킬로미터로 변환)
        const totalDistance = filteredRecords.reduce(
            (sum, record) => sum + (record.driving_distance || 0) / 1000,
            0
        );
        console.log("Total Distance (km):", totalDistance);

        // 날짜 기준으로 운행 건수와 운행 거리 그룹화
        const recordByDay = {};
        const distanceByDay = {};
        filteredRecords.forEach((record) => {
            const day = new Date(record.created_at).toISOString().split('T')[0];
            recordByDay[day] = (recordByDay[day] || 0) + 1;
            distanceByDay[day] = (distanceByDay[day] || 0) + (record.driving_distance || 0) / 1000;
        });
        console.log("Records by Day:", recordByDay);
        console.log("Distances by Day:", distanceByDay);

        // 월별 일수와 주 계산
        const daysInMonth = new Date(year, month, 0).getDate();
        const weeksInMonth = Math.ceil(daysInMonth / 7);

        // 평균 계산
        const dailyCountTotal = Object.values(recordByDay).reduce((sum, count) => sum + count, 0);
        const dailyCountAverage = dailyCountTotal / Object.keys(recordByDay).length || 0;

        const dailyDistanceTotal = Object.values(distanceByDay).reduce((sum, dist) => sum + dist, 0);
        const dailyDistanceAverage = dailyDistanceTotal / Object.keys(distanceByDay).length || 0;

        const weeklyDistanceAverage = dailyDistanceTotal / weeksInMonth || 0;

        // 운행 목적별 데이터 집계
        const purposeCounts = filteredRecords.reduce((acc, record) => {
            const purpose = record.driving_purpose || 'non_business';
            const purposeLabel = {
                commuting: '출/퇴근',
                business: '일반업무',
                non_business: '비업무',
            }[purpose];
            if (purposeLabel) {
                acc[purposeLabel] = (acc[purposeLabel] || 0) + 1;
            }
            return acc;
        }, { '출/퇴근': 0, '일반업무': 0, '비업무': 0 });

        console.log("Purpose Counts:", purposeCounts);

        // PieChart 데이터 구성
        const pieChartData = {
            labels: ['출/퇴근', '일반업무', '비업무'],
            datasets: [
                {
                    label: '운행 비율',
                    data: [purposeCounts['출/퇴근'], purposeCounts['일반업무'], purposeCounts['비업무']],
                    backgroundColor: [
                        'rgba(255, 99, 132, 0.2)',
                        'rgba(54, 162, 235, 0.2)',
                        'rgba(255, 206, 86, 0.2)',
                    ],
                    borderColor: [
                        'rgba(255, 99, 132, 1)',
                        'rgba(54, 162, 235, 1)',
                        'rgba(255, 206, 86, 1)',
                    ],
                    borderWidth: 1,
                },
            ],
        };

        // BarChart 데이터 구성
        const barChartData = {
            labels: ['출/퇴근', '일반업무', '비업무'],
            datasets: [
                {
                    label: '운행 목적별 건수',
                    data: [purposeCounts['출/퇴근'], purposeCounts['일반업무'], purposeCounts['비업무']],
                    backgroundColor: ['rgba(255, 99, 132, 0.2)', 'rgba(54, 162, 235, 0.2)', 'rgba(255, 206, 86, 0.2)'],
                    borderColor: ['rgba(255, 99, 132, 1)', 'rgba(54, 162, 235, 1)', 'rgba(255, 206, 86, 1)'],
                    borderWidth: 1,
                },
            ],
        };

        console.log("PieChart Data:", pieChartData);
        console.log("BarChart Data:", barChartData);

        // 상태 업데이트
        setTotalDrivingDistance(totalDistance.toFixed(2));
        setDailyDrivingDistance(dailyDistanceAverage.toFixed(2));
        setWeeklyDrivingDistance(weeklyDistanceAverage.toFixed(2));
        setMonthlyDrivingDistance(totalDistance.toFixed(2));
        setTotalDrivingCount(filteredRecords.length);
        setDailyAverage(dailyCountAverage.toFixed(2));
        setWeeklyAverage((dailyCountTotal / weeksInMonth).toFixed(2));
        setMonthlyAverage(dailyCountTotal.toFixed(2));
        setPieChartData(pieChartData);
        setChartData(barChartData);
        setCurrentMonthDrivingCount(filteredRecords.length);

        // 모든 데이터 반환
        return {
            filteredRecords,
            totalDistance,
            purposeCounts,
            recordByDay,
            distanceByDay,
        };
    } catch (err) {
        console.error('운행 기록 조회 실패:', err.response?.data);
    }
};




// Helper function to calculate ISO week number
Date.prototype.getWeekNumber = function () {
    const oneJan = new Date(this.getFullYear(), 0, 1);
    const numberOfDays = Math.floor((this - oneJan) / (24 * 60 * 60 * 1000));
    return Math.ceil((this.getDay() + 1 + numberOfDays) / 7);
};


  useEffect(() => {
    if (authState?.access) {
      getUserInfo();
      getVehicleInfo();
      getNotices();
      getDrivingRecords(selectedYear, selectedMonth); // Pass selectedYear and selectedMonth
    }
  }, [authState, selectedYear, selectedMonth]);

  const handleYearChange = (event) => {
    const updatedYear = parseInt(event.target.value, 10); // 선택된 연도를 즉시 변수에 저장
    setSelectedYear(updatedYear); // 상태 업데이트
    fetchDataForYearAndMonth(updatedYear, selectedMonth); // 최신 연도와 기존 월 사용
  };
  
  const handleMonthChange = (event) => {
    const updatedMonth = parseInt(event.target.value, 10); // 선택된 월을 즉시 변수에 저장
    setSelectedMonth(updatedMonth); // 상태 업데이트
    fetchDataForYearAndMonth(selectedYear, updatedMonth); // 기존 연도와 최신 월 사용
  };

  const fetchDataForYearAndMonth = (year, month) => {
    console.log(`${year}년 ${month}월 데이터를 불러옵니다.`);
    getDrivingRecords(year, month); // 서버 호출 함수
  };

  const fetchDataForYear = (year) => {
    console.log(`${year}년 데이터를 불러옵니다.`);
  };

  const fetchDataForMonth = (month) => {
    console.log(`${month}월 데이터를 불러옵니다.`);
  };

  const filteredRecords = drivingRecords.filter((record) => {
    const recordDate = new Date(record.created_at + 'Z');
    return (
      recordDate.getFullYear() === selectedYear &&
      recordDate.getMonth() + 1 === selectedMonth
    );
  });
  
  

  const handleNoticeClick = (notice) => {
    // Ensure 'notice' has an 'id' property
    navigate(`/notices/${notice.id}`);
};

  if (!authState) {
    return <div>Loading...</div>;
  }
  

  return (
    <div className="admin-container">
      <div className="admin-background">
      <div className="admin-top">
        <p className="office-name">회사명 : {authState.company_name}</p>
        <p className="person-name">{authState.name} 님 안녕하세요!</p>
      </div>

      <div className="admin-a-box">
        <div className="admin-b-box">
          <div className="admin-d-box">
            <div className="admin-f-box">
              <div className="admin-middle">
                <div className="user-info-box">
                  <p className="admin-middle-title">사용자</p>
                  <div className="admin-middle-content">
                    <p className="admin-middle-text">전체: {userCount}명</p>
                    <p className="admin-middle-text">신규: {newUserCount}명</p>
                    <p className="admin-middle-text">사용중지: {bannedUserCount}명</p>
                  </div>
                </div>

                <div className="vehicle-status-box">
                  <p className="admin-middle-title">차량 현황</p>
                  <div className="admin-middle-content">
                    <p className="admin-middle-text">가용 차량: {availableVehicles}대</p>
                    <p className="admin-middle-text">사용불가: {unavailableVehicles}대</p>
                    <p className="admin-middle-text">리스/렌트 만기 차량: {expiredLeaseRentVehicles}대</p>
                  </div>
                </div>

                <div className="vehicle-run-box">
                  <p className="admin-middle-title">운행</p>
                  <div className="admin-middle-content">
                    <p className="admin-middle-text">금월 운행: {currentMonthDrivingCount}건</p>
                    <p className="admin-middle-text">수정기록</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="admin-g-box">
              <div className="user-guide-box">
              <p className="admin-middle-title">사용자 가이드</p>
                <div className="user-guide-content">
                  <ul>
                    <li>대시보드에서 사용자의 통계 및 차량 정보를 확인할 수 있습니다.</li>
                    <li>왼쪽 메뉴에서 사용자 관리, 차량 관리, 운행 기록을 선택하여 자세한 내용을 확인하세요.</li>
                    <li>공지사항을 클릭하면 자세한 내용을 확인할 수 있습니다.</li>
                    <li>운행 데이터를 확인하려면 원하는 연도와 월을 선택하세요.</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <div className="admin-e-box">
            <div className="notice-box">
              <p className="notice-title">공지사항</p>
              <div className="notice-content">
                <table>
                  <thead>
                    <tr>
                      <th>제목</th>
                      <th className="notice-date-th">작성 날짜</th>
                    </tr>
                  </thead>
                  <tbody>
                    {notices.map((notice, index) => (
                      <tr key={index} onClick={() => handleNoticeClick(notice)} className="clickable-row">
                        <td>{notice.title}</td>
                        <td className="notice-date-td">{notice.date}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        <div className="admin-c-box">
  <div className="admin-bottom-a-box">
    <div className="admin-bottom-b-box">
      <div className="admin-bottom-c-box">
        <p className="admin-bottom-title">
          운행 현황
        </p>
        <select className="year-select" onChange={handleYearChange} value={selectedYear}>
          <option value="2024">2024년</option>
          <option value="2023">2023년</option>
          <option value="2022">2022년</option>
          <option value="2021">2021년</option>
        </select>
        <select className="month-select" onChange={handleMonthChange} value={selectedMonth}>
          {Array.from({ length: 12 }, (_, index) => (
            <option key={index + 1} value={index + 1}>{index + 1}월</option>
          ))}
        </select>
      </div>

      <div className="admin-bottom-d-box">
        <div className="admin-bottom-e-box">
          <p className="operation-status-middle-title">운행건수</p>
          <div className="op-box">
            <p className="operation-number-count">{totalDrivingCount}</p>
            <p className="op-count"> 건</p>
          </div>
        </div>
        <div className="user-average-box">
          <div className="daily-average-box">
            <p className="daily-average">일 평균</p>
            <p className="daily-average-text">{dailyAverage}건</p>
          </div>
          <div className="weekly-average-box">
            <p className="weekly-average">주 평균</p>
            <p className="weekly-average-text">{weeklyAverage}건</p>
          </div>
          <div className="monthly-average-box">
            <p className="monthly-average">월 평균</p>
            <p className="monthly-average-text">{monthlyAverage}건</p>
          </div>
        </div>
      </div>
    </div>
            <div className="admin-bottom-b-box">

              <div className="admin-bottom-c-box">

              </div>

              <div className="admin-bottom-d-box">

                <div className="admin-bottom-e-box">
                  <p className="operation-status-middle-title">운행거리</p>
                  <div className="op-box">
                    <p className="operation-number-count">{totalDrivingDistance}</p>
                    <p className="op-count"> km</p>
                  </div>
                </div>
                <div className="user-average-box">
                  <div className="daily-average-box">
                    <p className="daily-average">일 평균</p>
                    <p className="daily-average-text">{dailyDrivingDistance}km</p>
                  </div>
                  <div className="weekly-average-box">
                    <p className="weekly-average">주 평균</p>
                    <p className="weekly-average-text">{weeklyDrivingDistance}km</p>
                  </div>
                  <div className="monthly-average-box">
                    <p className="monthly-average">월 평균</p>
                    <p className="monthly-average-text">{monthlyDrivingDistance}km</p>
                  </div>
                </div>
                
              </div>

            </div>

            <div className="admin-bottom-b-box">

              <div className="admin-bottom-c-box">
                <p className="operation-status-top-title">{selectedMonth ? `${selectedMonth}월 운행비율` : '1월 운행비율'}</p>
              </div>

              <div className="admin-bottom-d-box">
                <div className="operation-percentage">
                  <div className="a-label-box">
                    <div className="a-label" />
                    <p className="label-text">출/퇴근</p>
                    <div className="b-label" />
                    <p className="label-text">일반업무</p>
                    <div className="c-label" />
                    <p className="label-text">비업무</p>
                </div>
                {pieChartData ? <PieChart data={pieChartData} /> : <p>데이터를 불러오는 중입니다...</p>}
              </div>
            </div>
            </div>

            <div className="admin-bottom-b-box">
              <div className="admin-bottom-c-box">
                <p className="month-distance-title">월간 운행비율</p>
              </div>

              <div className="admin-bottom-d-box">
                <div className="operation-percentage">
                  <div className="b-label-box">
                    <div className="a-label" />
                    <p className="label-text">출/퇴근</p>
                    <div className="b-label" />
                    <p className="label-text">일반업무</p>
                    <div className="c-label" />
                    <p className="label-text">비업무</p>
                  </div>
                  <BarChart data={chartData} /> 
                </div>
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
