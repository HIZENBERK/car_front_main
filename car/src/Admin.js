import React from 'react';
import './CSS/Admin.css';

function Admin() {
  const handleClick = (item) => {
    console.log(`${item} 클릭됨`); // 클릭 이벤트 핸들러 (나중에 실제 로직으로 대체 가능)
  };

  return (
    <div className="admin-container">
      <div className="admin-list">
      <p className="blank"> </p>
        <hr />
        <button className="admin-button" onClick={() => handleClick('대시보드')}>대시보드</button>
        <hr />
        <button className="admin-button" onClick={() => handleClick('사용자 관리')}>사용자 관리</button>
        <hr />
        <button className="admin-button" onClick={() => handleClick('차량 관리')}>차량 관리</button>
        <hr />
        <button className="admin-button" onClick={() => handleClick('차량 운행 내역')}>차량 운행 내역</button>
        <hr />
        <button className="admin-button" onClick={() => handleClick('지출 관리')}>지출 관리</button>
        <hr />
        <div className="spacer"></div>
        <hr />
        <button className="admin-button" onClick={() => handleClick('설정')}>설정</button>
        <hr />
        <p className="blank2"> </p>
      </div>

      <div className="admin-top">
        <p className="office-name">회사명 : </p>
        <p className="person-name"> 님 안녕하세요!</p>
      </div>
      <hr className="divider" />

      <div className="admin-middle">
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
