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
  const { authState } = useAuth(); // useAuth 훅에서 authState 가져오기
  const [userCount, setUserCount] = useState(0);
  const [selectedMonth, setSelectedMonth] = useState('');
  const navigate = useNavigate();  // 경로 이동을 위한 useNavigate 훅

  const getUserInfo = async () => {
    try {
      const response = await axios.get('https://hizenberk.pythonanywhere.com/api/users/', {
        headers: {
          Authorization: `Bearer ${authState.access}` 
        },
      });

      // is_admin이 false인 유저만 필터링하여 사용자 수 저장
      const nonAdmins = response.data.users.filter((user) => !user.is_admin);
      setUserCount(nonAdmins.length);
    } catch (err) {
      console.error('조회 실패:', err.response?.data);
    }
  };

  useEffect(() => {
    // 사용자가 로그인 상태일 때 데이터를 가져오기
    if (authState?.access) {
      getUserInfo();
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
    setSelectedMonth(selectedMonth);  // 선택된 달을 상태로 업데이트
    fetchDataForMonth(selectedMonth);
  };

  const fetchDataForMonth = (month) => {
    console.log(`${month}월 데이터를 불러옵니다.`);
  };

  // 공지사항 데이터를 배열로 정의 (제목과 작성 날짜)
  const notices = [
    { title: '공지사항 1', date: '2024-09-30' },
    { title: '공지사항 2', date: '2024-10-01' },
    { title: '공지사항 3', date: '2024-10-02' },
  ];

  // 공지사항 클릭 핸들러 함수
  const handleNoticeClick = (notice) => {
    console.log(`${notice.title} 클릭됨`);
    navigate(`/notice/${notice.title}`);  // 공지사항 제목에 맞는 경로로 이동
  };

  // authState가 아직 로딩 중일 때 로딩 메시지 표시
  if (!authState) {
    return <div>Loading...</div>;
  }

  return (
    <div className="admin-container">
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
  );
}

export default Admin;
