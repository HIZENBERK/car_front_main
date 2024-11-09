import React, { useState, useEffect } from 'react';
import axios from 'axios'; // axios 추가
import { useNavigate } from 'react-router-dom'; // useNavigate 훅 임포트
import '../CSS/UserManagement.css';
import { useAuth } from "../Component/AuthContext";

const UserManagement = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]); // 사용자 목록을 저장할 상태
  const { authState } = useAuth(); 
  
  const [searchField, setSearchField] = useState("Department"); // 검색 필드
  const [searchQuery, setSearchQuery] = useState(""); // 검색어

  

  const getUserInfo = async (filter = {}) => {
    try {
      const response = await axios.get('https://hizenberk.pythonanywhere.com/api/users/', {
        headers: {
          Authorization: `Bearer ${authState.access}` 
        },
      });
      console.log('서버 응답 데이터:', response.data);
      
      if (Array.isArray(response.data.users)) {
        let filteredUsers = response.data.users;
        
        // 필터링 적용
        if (filter.field && filter.query) {
          filteredUsers = filteredUsers.filter((user) => {
            const userValue = user[filter.field]?.toString().toLowerCase(); // 사용자의 필드 값 (예: 부서, 이름 등)
            return userValue && userValue.includes(filter.query.toLowerCase()); // 대소문자 구분 없이 검색
          });
        }
        
        setUsers(filteredUsers);
      } else {
        console.error("Unexpected response data format:", response.data);
        setUsers([]); // 데이터가 배열이 아니면 빈 배열로 설정
      }
    } catch (err) {
      console.error('조회 실패:', err.response?.status, err.response?.data);
    }
  };

  useEffect(() => {
    if (authState?.access) {
      getUserInfo(); // 초기 사용자 목록 불러오기
    }
  }, [authState]);

  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRow, setSelectedRow] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = users.slice(indexOfFirstRow, indexOfLastRow); // 사용자 데이터로 수정
  const totalPages = Math.ceil(users.length / rowsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleRowClick = (user) => {
    setSelectedRow(user); // 선택된 사용자의 데이터를 설정
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const updateModal = () => {
    setIsModalOpen(false);
  }

  const handleUserRegistration = () => {
    navigate('/signup');
  };

  const handleSearch = () => {
    // 검색 버튼 클릭 시, 선택된 필드와 검색어로 필터링하여 getUserInfo 호출
    getUserInfo({ field: searchField, query: searchQuery });
  };

  return (
    <div className="usermanagement-container">
      <div className="usermanagement-top">
        <p className="usermanagement-top-title">사용자 관리</p>
      </div>

      <div className="usermanagement-a-box">
        <div className="usermanagement-b-box">
          <div className="usermanagement-d-box">
            <button className="user-management-registration" onClick={handleUserRegistration}>
              사용자 등록
            </button>
          </div>

          <div className="usermanagement-e-box">
            <select
              className="select"
              value={searchField}
              onChange={(e) => setSearchField(e.target.value)}
            >
              <option value="department">부서</option>
              <option value="name">이름</option>
              <option value="id">사번</option>
              <option value="phone_number">연락처</option>
              <option value="is_admin">권한</option>
              <option value="date">등록일</option>
            </select>
            <input
              type="text"
              className="search-box"
              placeholder="검색..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button className="user-check" onClick={handleSearch}>조회</button>
          </div>
        </div>

        <div className="usermanagement-c-box">
          <table className="usermanegement-table">
            <thead>
              <tr>
                <th><input type="checkbox" /></th>
                <th>부서</th>
                <th>이름</th>
                <th>등록번호</th>
                <th>연락처</th>
                <th>권한</th> 
                <th>등록일</th>
              </tr>
            </thead>
            <tbody>
              {currentRows.map((user) => (
                <tr key={user.id} onClick={() => handleRowClick(user)} className="user-click-td">
                  <td><input type="checkbox" /></td>
                  <td>{user.department}</td>
                  <td>{user.name}</td>
                  <td>{user.id}</td>
                  <td>{user.phone_number}</td>
                  <td>{user.is_admin ? '관리자' : '사용자'}</td>
                  <td>{user.date}</td>
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

      {isModalOpen && (
        <div className="user-management-modal-overlay">
          <div className="user-management-modal">
            <h2>사용자 정보</h2>
            <div className="user-management-modal-content">
              <div className="user-label-box">
                <label className="user-label-text">부서:</label>
                <input type="text" className="user-label-input_two" value={selectedRow.department} readOnly />
              </div>
              <div className="user-label-box">
                <label className="user-label-text">이름:</label>
                <input type="text" className="user-label-input_two" value={selectedRow.name} readOnly />
              </div>
              <div className="user-label-box">
                <label className="user-label-text">등록번호:</label>
                <input type="text" className="user-label-input-four" value={selectedRow.id} readOnly />
              </div>
              <div className="user-label-box">
                <label className="user-label-text">연락처:</label>
                <input type="text" className="user-label-input-three" value={selectedRow.phone_number} readOnly />
              </div>
              <div className="user-label-box">
                <label className="user-label-text">권한:</label>
                <input type="text" className="user-label-input_two" value={selectedRow.is_admin ? '관리자' : '사용자'} readOnly />
              </div>
              <div className="user-label-box">
                <label className="user-label-text">등록일:</label>
                <input type="text" className="user-label-input-three" value={selectedRow.date} readOnly />
              </div>
            </div>
            <button className="user-management-update-btn" onClick={updateModal}>업데이트</button>
            <button className="user-management-close-btn" onClick={closeModal}>닫기</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;
