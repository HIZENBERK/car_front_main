import React, { useState } from 'react';
import '../CSS/ExpenseManagement.css';

const ExpenseManagement = () => {
  // 더미 데이터
  const dummyData = [
    { id: 1, type: '지출', date: '9.19', status: '승인', user: '김영엽 부장/영업부', vehicle: '12가1234', detail: '유류비', payment: '법인카드', amount: '3,421원', receipt: '첨부파일', attachment: '이미지' },
    { id: 2, type: '지출', date: '9.20', status: '승인', user: '박현수 대리/기술부', vehicle: '34나5678', detail: '정비비', payment: '법인카드', amount: '15,300원', receipt: '첨부파일', attachment: '이미지' },
  ];

  // 상태 관리
  const [rowsPerPage, setRowsPerPage] = useState(10);  // 페이지당 보여줄 행 수
  const [currentPage, setCurrentPage] = useState(1);   // 현재 페이지

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

  // 페이지당 행 수 변경 핸들러
  const handleRowsPerPageChange = (e) => {
    setRowsPerPage(parseInt(e.target.value));
    setCurrentPage(1);  // 페이지 수 초기화
  };

  return (
    <div className="expense-management">
      <main className="main-content">
        <div className="header">
          <h1>지출 내역</h1>
          <div className="filters">
            <button className="filter-btn">전체(10)</button>
            <button className="filter-btn">승인(8)</button>
            <button className="filter-btn">대기(1)</button>
            <button className="filter-btn">반려(1)</button>
            <button className="download-btn">엑셀 다운로드</button>
          </div>
        </div>

        <div className="table-controls">
          <select className="rows-per-page" value={rowsPerPage} onChange={handleRowsPerPageChange}>
            <option value="10">10개씩 보기</option>
            <option value="20">20개씩 보기</option>
            <option value="30">30개씩 보기</option>
          </select>
          <input type="text" className="search-box" placeholder="검색..." />
        </div>

        <table className="expense-table">
          <thead>
            <tr>
              <th><input type="checkbox" /></th>
              <th>구분</th>
              <th>지출 일자</th>
              <th>상태</th>
              <th>사용자</th>
              <th>차량</th>
              <th>지출 및 정비/상세 내역</th>
              <th>결제 수단</th>
              <th>금액</th>
              <th>영수증 상세</th>
              <th>첨부파일</th>
            </tr>
          </thead>
          <tbody>
            {currentRows.map((row) => (
              <tr key={row.id}>
                <td><input type="checkbox" /></td>
                <td>{row.type}</td>
                <td>{row.date}</td>
                <td>{row.status}</td>
                <td>{row.user}</td>
                <td>{row.vehicle}</td>
                <td>{row.detail}</td>
                <td>{row.payment}</td>
                <td>{row.amount}</td>
                <td>{row.receipt}</td>
                <td>{row.attachment}</td>
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
      </main>
    </div>
  );
};

export default ExpenseManagement;
