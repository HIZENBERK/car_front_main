import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../CSS/UserManagement.css';
import { useAuth } from "../Component/AuthContext";

const UserManagement = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const { authState } = useAuth();
  
  const [searchField, setSearchField] = useState("Department");
  const [searchQuery, setSearchQuery] = useState("");

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
        
        if (filter.field && filter.query) {
          filteredUsers = filteredUsers.filter((user) => {
            const userValue = user[filter.field]?.toString().toLowerCase();
            return userValue && userValue.includes(filter.query.toLowerCase());
          });
        }
        
        setUsers(filteredUsers);
      } else {
        console.error("Unexpected response data format:", response.data);
        setUsers([]);
      }
    } catch (err) {
      console.error('조회 실패:', err.response?.status, err.response?.data);
    }
  };

  useEffect(() => {
    if (authState?.access) {
      getUserInfo();
    }
  }, [authState]);

  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRow, setSelectedRow] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = users.slice(indexOfFirstRow, indexOfLastRow);
  const totalPages = Math.ceil(users.length / rowsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleRowClick = (user) => {
    setSelectedRow(user);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleUserRegistration = () => {
    navigate('/signup');
  };

  const handleSearch = () => {
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
            <button className="user-registration" onClick={handleUserRegistration}>
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
              <option value="date">날짜</option>
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
          <table className="table">
            <thead>
              <tr>
                <th><input type="checkbox" /></th>
                <th>부서</th>
                <th>이름</th>
                <th>등록번호</th>
                <th>연락처</th>
                <th>권한</th> 
                <th>날짜</th>
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
                  <td>{new Date(user.date).toLocaleDateString()}</td>
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
        <div className="modal-overlay">
          <div className="modal">
            <h2>사용자 정보</h2>
            <div className="modal-content">
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
                <input type="text" className="user-label-input_two" value={selectedRow.id} readOnly />
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
                <label className="user-label-text">날짜:</label>
                <input type="text" className="user-label-input-three" value={new Date(selectedRow.date).toLocaleDateString()} readOnly />
              </div>
            </div>

            <button className="close-btn" onClick={closeModal}>닫기</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;
