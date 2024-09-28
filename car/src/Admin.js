import React from 'react';
import './CSS/Admin.css';

function Admin() {
  const handleClick = (item) => {
    console.log(`${item} 클릭됨`); // 클릭 이벤트 핸들러 (나중에 실제 로직으로 대체 가능)
  };

  return (
    <div className="admin-container">
      
      <div className="admin-top">
        <p className="office-name">회사명 : </p>
        <p className="person-name"> 님 안녕하세요!</p>
      </div>
      <div className="admin-middle">
        <div className="user-info-box">
          <p className="admin-middle1-title">사용자</p>
          <div className="admin-middle1-content">

            <p className="admin-middle1-text">전체</p>
            <p className="admin-middle1-text">신규</p>
            <p className="admin-middle1-text">사용중지</p>
          </div>
        </div>

        <div className="vehicle-status-box">
          <p className="admin-middle1-title">차량 현황</p>
          <div className="admin-middle1-content">
            <p className="admin-middle1-text">가용 차량</p>
            <p className="admin-middle1-text">사용불가</p>
            <p className="admin-middle1-text">리스/렌트 만기 차량</p>
            <p className="admin-middle1-text">삭제</p>
          </div>
        </div>

        <div className="vehicle-run-box">
          <p className="admin-middle1-title">운행</p>
          <div className="admin-middle1-content">
            <p className="admin-middle1-text">금월 운행 건</p>
            <p className="admin-middle1-text">수정기록</p>
          </div>
        </div>

        <div className="notice-box">
          <p className="notice-title">공지사항</p>
          <div className="notice-content">
            {/* 여기에 공지사항 내용이 들어갑니다 */}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Admin;
