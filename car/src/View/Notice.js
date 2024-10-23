import React, { useState } from 'react';
import '../CSS/Notice.css';

const Modal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const handleSubmit = () => {
    // 등록 처리 로직을 여기에 추가 (예: 서버로 데이터 전송)
    onClose();  // 모달 창 닫기
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>1</h2>
          <h2>관리자</h2>
          <button onClick={onClose} className="close-btn">X</button>
        </div>
        <div className="modal-body">
          <label>제목</label>
          <input type="text" className="modal-input" />
          <label>내용</label>
          <textarea className="modal-textarea"></textarea>
        </div>
        <div className="modal-footer">
          <button className="modal-delete-btn">삭제</button>
          <div className="right-buttons">
            <button className="modal-save-btn">수정</button>
            <button className="modal-submit-btn" onClick={handleSubmit}>등록</button>
          </div>
        </div>
      </div>
    </div>
  );
};

const Notice = () => {
  // 더미 데이터
  const dummyData = [
    { id: 1, number: '1', name: '9.19', user: '승인', date: '2024/10/23' },
    { id: 2, number: '2', name: '9.20', user: '승인', date: '2024/10/23' },
  ];

  // 상태 관리
  const [rowsPerPage, setRowsPerPage] = useState(10);  // 페이지당 보여줄 행 수
  const [currentPage, setCurrentPage] = useState(1);   // 현재 페이지
  const [isModalOpen, setIsModalOpen] = useState(false); // 모달 창 상태

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

  // 행 클릭 핸들러
  const handleRowClick = () => {
    setIsModalOpen(true);  // 모달 창 열기
  };

  return (
    <div className="notice-management">
      <main className="main-content">
        <div className="header">
          <h2>공지 사항</h2>
        </div>

        <table className="notice-table">
          <thead>
            <tr>
              <th>번호</th>
              <th>제목</th>
              <th>작성자</th>
              <th>등록일</th>
            </tr>
          </thead>
          <tbody>
            {currentRows.map((row) => (
              <tr key={row.id} onClick={handleRowClick}>
                <td>{row.number}</td>
                <td>{row.name}</td>
                <td>{row.user}</td>
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

        {/* 모달 컴포넌트 사용 */}
        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      </main>
    </div>
  );
};

export default Notice;
