import React, { useState } from 'react';
import '../CSS/UserManagement.css';

const UserManagement = () => {

  const dummyData = [
    { id: 1, Department: '인사과', name: '박준석', num: '1', contact: '01012345678', power: '최강.', date: '11.15' },
    { id: 2, Department: '행정반', name: '제이팍', num: '2', contact: '01024803579', power: '약함', date: '12.12' },
  ];

  // 상태 관리
  const [rowsPerPage, setRowsPerPage] = useState(10);  // 페이지당 보여줄 행 수
  const [currentPage, setCurrentPage] = useState(1);   // 현재 페이지
  const [selectedRow, setSelectedRow] = useState(null); // 선택된 row 데이터
  const [isModalOpen, setIsModalOpen] = useState(false); // 모달 열림 상태

  // 페이지당 데이터를 나누기
  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = dummyData.slice(indexOfFirstRow, indexOfLastRow);

  // 총 페이지 수 계산
  const totalPages = Math.ceil(dummyData.length / rowsPerPage);

  // 페이지 변경 핸들러
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // 모달 열기
  const handleRowClick = (row) => {
    setSelectedRow(row);
    setIsModalOpen(true); // 모달 열기
  };

  // 모달 닫기
  const closeModal = () => {
    setIsModalOpen(false); // 모달 닫기
  };

  return (
    <div className="usermanagement-container">

      <div className="usermanagement-top">
        <p className="usermanagement-top-title">사용자 관리</p>
      </div>

      <div className="usermanagement-a-box">

        <div className="usermanagement-b-box">

          <div className="usermanagement-d-box">
            <button className="user-registration">사용자 등록</button>
          </div>

          <div className="usermanagement-e-box">
            <select className="select">
              <option value="Department">부서</option>
              <option value="name">이름</option>
              <option value="num">사번</option>
              <option value="contact">연락처</option>
              <option value="power">권한</option>
              <option value="date">등록일</option>
            </select>
            <input type="text" className="search-box" placeholder="검색..." />
            <button className="user-check">조회</button>
          </div>

        </div>

        <div className="usermanagement-c-box">
          <table className="table">
            <thead>
              <tr>
                <th><input type="checkbox" /></th>
                <th>부서</th>
                <th>이름</th>
                <th>사번</th>
                <th>연락처</th>
                <th>권한</th>
                <th>등록일</th>
              </tr>
            </thead>
            <tbody>
              {currentRows.map((row) => (
                <tr key={row.id} onClick={() => handleRowClick(row)} className="user-click-td">
                  <td><input type="checkbox" /></td>
                  <td>{row.Department}</td>
                  <td>{row.name}</td>
                  <td>{row.num}</td>
                  <td>{row.contact}</td>
                  <td>{row.power}</td>
                  <td>{row.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="pagination">
            <button
              className="page-btn"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              &lt;
            </button>
            {[...Array(totalPages)].map((_, index) => (
              <button
                key={index}
                className={`page-btn ${currentPage === index + 1 ? 'active' : ''}`}
                onClick={() => handlePageChange(index + 1)}
              >
                {index + 1}
              </button>
            ))}
            <button
              className="page-btn"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              &gt;
            </button>
          </div>
        </div>

      </div>

      {/* 모달 */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>사용자 정보</h2>
            <div className="modal-content">
              <div className="user-label-box">
                <label className="user-label-text">부서:</label>
                <input type="text" className="user-label-input_two" placeholder={selectedRow.Department} />
              </div>
              <div className="user-label-box">
                <label className="user-label-text">이름:</label>
                <input type="text" className="user-label-input_two" placeholder={selectedRow.name} />
              </div>
              <div className="user-label-box">
                <label className="user-label-text">사번:</label>
                <input type="text" className="user-label-input_two" placeholder={selectedRow.num} />
              </div>
              <div className="user-label-box">
                <label className="user-label-text">연락처:</label>
                <input type="text" className="user-label-input-three" placeholder={selectedRow.contact} />
              </div>
              <div className="user-label-box">
                <label className="user-label-text">권한:</label>
                <input type="text" className="user-label-input_two" placeholder={selectedRow.power} />
              </div>
              <div className="user-label-box">
                <label className="user-label-text">등록일:</label>
                <input type="text" className="user-label-input-three" placeholder={selectedRow.date} />
              </div>
            </div>
            
            <button className="update-btn">변경</button>
            <button className="close-btn" onClick={closeModal}>닫기</button>
          </div>
        </div>
      )}

    </div>
  );
};

export default UserManagement;
