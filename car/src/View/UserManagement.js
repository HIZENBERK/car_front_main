import React, { useState, useEffect } from 'react';
import axios from 'axios'; // axios 추가
import { useNavigate } from 'react-router-dom'; // useNavigate 훅 임포트
import '../CSS/UserManagement.css';
import { useAuth } from "../Component/AuthContext";
import 'bootstrap-icons/font/bootstrap-icons.css';

const UserManagement = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]); // 사용자 목록을 저장할 상태
  const { authState } = useAuth(); 
  
  const [searchField, setSearchField] = useState("Department"); // 검색 필드
  const [searchQuery, setSearchQuery] = useState(""); // 검색어
  const [isLoading, setIsLoading] = useState(false);

  

  const getUserInfo = async (filter = {}) => {
    try {
      const response = await axios.get('https://hizenberk.pythonanywhere.com/api/users/', {
        headers: {
          Authorization: `Bearer ${authState.access}`,
        },
      });
      console.log('서버 응답 데이터:', response.data);
  
      if (Array.isArray(response.data.users)) {
        let processedUsers = response.data.users.map((user) => ({
          ...user,
          created_at: new Date(user.created_at).toISOString().split('T')[0], // 생성일시 (YYYY-MM-DD)
          updated_at: user.updated_at
            ? new Date(user.updated_at).toISOString().split('T')[0] // 수정일시 (YYYY-MM-DD)
            : null, // 수정일시 없을 경우 null
        }));
  
        // 필터링 적용
        if (filter.field && filter.query) {
          processedUsers = processedUsers.filter((user) => {
            const userValue = user[filter.field]?.toString().toLowerCase(); // 사용자의 필드 값 (예: 부서, 이름 등)
            return userValue && userValue.includes(filter.query.toLowerCase()); // 대소문자 구분 없이 검색
          });
        }
  
        setUsers(processedUsers);
      } else {
        console.error('Unexpected response data format:', response.data);
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

  const handleInputChange = (field, value) => {
    setSelectedRow((prevState) => ({
      ...prevState,
      [field]: value,
    }));
  };

  const handleUpdateUser = async () => {
    if (!selectedRow || !selectedRow.id) return;
  
    try {
      setIsLoading(true);
      const response = await axios.patch(
        `https://hizenberk.pythonanywhere.com/api/users/${selectedRow.id}/`,
        {
          email: selectedRow.email,
          phone_number: selectedRow.phone_number,
          department: selectedRow.department,
          position: selectedRow.position,
          name: selectedRow.name,
          is_banned: selectedRow.is_banned,
        },
        {
          headers: {
            Authorization: `Bearer ${authState.access}`,
          },
        }
      );
      console.log('수정 성공:', response.data);
  
      getUserInfo(); 
      setIsModalOpen(false);
    } catch (err) {
      console.error('수정 실패:', err.response?.status, err.response?.data);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!userId) return;
  
    try {
      const confirmation = window.confirm('정말로 이 사용자를 삭제하시겠습니까?');
      if (!confirmation) return;
  
      await axios.delete(
        `https://hizenberk.pythonanywhere.com/api/users/${userId}/`,
        {
          headers: {
            Authorization: `Bearer ${authState.access}`,
          },
        }
      );
      console.log(`사용자 ${userId} 삭제 성공`);
      
      getUserInfo(); // 삭제 후 사용자 목록 새로고침
    } catch (err) {
      console.error('사용자 삭제 실패:', err.response?.status, err.response?.data);
    }
  };

  const handleToggleUserBan = async (user) => {
    if (!user || !user.id) return;
  
    try {
      const confirmation = window.confirm(
        user.is_banned
          ? "이 사용자를 활성화하시겠습니까?"
          : "이 사용자를 사용 중지하시겠습니까?"
      );
      if (!confirmation) return;
  
      const response = await axios.patch(
        `https://hizenberk.pythonanywhere.com/api/users/${user.id}/`,
        {
          is_banned: !user.is_banned, // 현재 상태를 반전시켜 전달
        },
        {
          headers: {
            Authorization: `Bearer ${authState.access}`,
          },
        }
      );
      console.log(`사용자 ${user.id} 상태 변경 성공:`, response.data);
  
      getUserInfo(); // 상태 변경 후 사용자 목록 새로고침
    } catch (err) {
      console.error("사용자 상태 변경 실패:", err.response?.status, err.response?.data);
    }
  };
  
  

  return (
    <div className="usermanagement-container">
      <div className="usermanagement-background">
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
              <option value="created_at">생성일시</option>
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
                {/* <th><input type="checkbox" /></th> */}
                <th>부서</th>
                <th>이름</th>
                {/* <th>등록번호</th> */}
                <th>연락처</th>
                <th>권한</th> 
                <th>생성일시</th>
                <th>작업</th>
                <th>삭제</th>
              </tr>
            </thead>
            <tbody>
              {currentRows.map((user) => (
              <tr key={user.id} className="user-click-td">
                  {/* <td><input type="checkbox" /></td> */}
                  <td>{user.department}</td>
                  <td>{user.name}</td>
                  {/* <td>{user.id}</td> */}
                  <td>{user.phone_number}</td>
                  <td>{user.is_admin ? '관리자' : '사용자'}</td>
                  <td>{user.created_at}</td>
                <td>
                  <button
                    className="user-edit-btn"
                    onClick={() => handleRowClick(user)}
                  >
                    수정
                  </button>
                </td>
                <td>
                <button
                  className="user-edit-btn"
                  onClick={() => handleDeleteUser(user.id)}
                >
                  삭제
                </button>
                </td>
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
            <div className="user-management-modal-top-box">
                <button
                  className="user-delete-btn"
                  onClick={() => {
                    handleDeleteUser(selectedRow.id);
                    closeModal();
                  }}
                >
                  <i class="bi bi-trash"></i>
                </button>
              <h2>사용자 정보 관리</h2> </div>
            <div className="user-management-modal-content">
              <div className="user-label-box">
                <label className="user-label-text">부서:</label>
                  <input
                    type="text"
                    className="user-label-input_two"
                    value={selectedRow.department}
                    onChange={(e) => handleInputChange('department', e.target.value)}
                  />
              </div>
              <div className="user-label-box">
                <label className="user-label-text">이름:</label>
                  <input
                    type="text"
                    className="user-label-input_two"
                    value={selectedRow.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                  />
              </div>
              <div className="user-label-box">
                <label className="user-label-text">연락처:</label>
                  <input
                    type="text"
                    className="user-label-input-three"
                    value={selectedRow.phone_number}
                    onChange={(e) => handleInputChange('phone_number', e.target.value)}
                  />
              </div>
              {/* <div className="user-label-box">
                <label className="user-label-text">권한:</label>
                  <select
                    className="user-select-option"
                    value={selectedRow.is_admin}
                    onChange={(e) => handleInputChange('is_admin', e.target.value === 'true')}
                  >
                    <option value="true">관리자</option>
                    <option value="false">사용자</option>
                  </select>
                </div> */}
                <div className="user-label-box">
                  <label className="user-label-text">상태:</label>
                  <span className="user-is-banned-span">{selectedRow.is_banned ? '중지됨' : '활성'}</span>
                  <button
                  className="user-ban-btn"
                  onClick={() => handleToggleUserBan(selectedRow)}
                >
                  {selectedRow.is_banned ? '활성화' : '사용 중지'}
                </button>
                </div>
              </div>
              <div className="modal-buttons">
                <button
                  className="user-management-update-btn"
                  onClick={handleUpdateUser}
                  disabled={isLoading}
                >
                  {isLoading ? '수정 중...' : '수정'}
                </button>
                
                <button
                  className="user-management-close-btn"
                  onClick={closeModal}
                >
                  닫기
                </button>
              </div>
          </div>
        </div>
      )}
      </div>
    </div>
  );
};

export default UserManagement;
