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
  const { authState } = useAuth();
  const [userCount, setUserCount] = useState(0);
  const [selectedMonth, setSelectedMonth] = useState('');
  const [availableVehicles, setAvailableVehicles] = useState(0);
  const [totalVehicles, setTotalVehicles] = useState(0);
  const [unavailableVehicles, setUnavailableVehicles] = useState(0);
  const [expiredLeaseRentVehicles, setExpiredLeaseRentVehicles] = useState(0);
  const [notices, setNotices] = useState([]);
  const navigate = useNavigate();
  
  const getUserInfo = async () => {
    try {
      const response = await axios.get('https://hizenberk.pythonanywhere.com/api/users/', {
        headers: {
          Authorization: `Bearer ${authState.access}` 
        },
      });
      const nonAdmins = response.data.users.filter((user) => !user.is_admin);
      setUserCount(nonAdmins.length);
    } catch (err) {
      console.error('조회 실패:', err.response?.data);
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
      const fetchedNotices = response.data.notices.map((notice) => ({
        id: notice.id,
        title: notice.title,
        date: notice.created_at,
      }));
      setNotices(fetchedNotices);
    } catch (err) {
      console.error('공지사항 조회 실패:', err.response?.data);
    }
  };

  useEffect(() => {
    if (authState?.access) {
      getUserInfo();
      getVehicleInfo();
      getNotices();
    }
  }, [authState]);

  const handleYearChange = (event) => {
    const selectedYear = event.target.value;
    fetchDataForYear(selectedYear);
  };

  const fetchDataForYear = (year) => {
    console.log(`${year}년 데이터를 불러옵니다.`);
  };

  const handleMonthChange = (event) => {
    const selectedMonth = event.target.value;
    setSelectedMonth(selectedMonth);
    fetchDataForMonth(selectedMonth);
  };

  const fetchDataForMonth = (month) => {
    console.log(`${month}월 데이터를 불러옵니다.`);
  };

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
                    <p className="admin-middle-text">신규</p>
                    <p className="admin-middle-text">사용중지</p>
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
                  {/* 사용자 가이드 내용이 들어갑니다 */}
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
              </div>

              <div className="admin-bottom-d-box">
                
              <div className="admin-bottom-e-box">
                  <p className="operation-status-middle-title">운행건수</p>
                  <div className="op-box">
                     <p className="operation-number-count">1,000</p>
                     <p className="op-count"> 건</p>
                  </div>
                </div>
                <div className="user-average-box">
                  <div className="daily-average-box">
                    <p className="daily-average">일 평균</p>
                    <p className="daily-average-text">30</p>
                  </div>
                  <div className="weekly-average-box">
                    <p className="weekly-average">주 평균</p>
                    <p className="weekly-average-text">60</p>
                  </div>
                  <div className="monthly-average-box">
                    <p className="monthly-average">월 평균</p>
                    <p className="monthly-average-text">280</p>
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
                    <p className="operation-number-count">1,000</p>
                    <p className="op-count"> km</p>
                  </div>
                </div>
                <div className="user-average-box">
                  <div className="daily-average-box">
                    <p className="daily-average">일 평균</p>
                    <p className="daily-average-text">30</p>
                  </div>
                  <div className="weekly-average-box">
                    <p className="weekly-average">주 평균</p>
                    <p className="weekly-average-text">60</p>
                  </div>
                  <div className="monthly-average-box">
                    <p className="monthly-average">월 평균</p>
                    <p className="monthly-average-text">280</p>
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
                    <p className="label-text">업무용</p>
                    <div className="b-label" />
                    <p className="label-text">출/퇴근용</p>
                    <div className="c-label" />
                    <p className="label-text">비업무용</p>
                </div>
                <PieChart />
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
                    <p className="label-text">업무용</p>
                    <div className="b-label" />
                    <p className="label-text">출/퇴근용</p>
                    <div className="c-label" />
                    <p className="label-text">비업무용</p>
                  </div>
              <BarChart />
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
