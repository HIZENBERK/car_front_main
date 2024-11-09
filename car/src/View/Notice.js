import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../CSS/Notice.css';
import { useAuth } from "../Component/AuthContext";

const Modal = ({ isOpen, onClose, onSubmit, selectedNotice, isEdit }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  //console.log("모달에 전단될 값" ,selectedNotice.notice);
  // 수정 모드일 때 공지사항의 제목과 내용을 초기화합니다.
  useEffect(() => {
    if (selectedNotice && isEdit) {
      setTitle(selectedNotice.notice.title);  // 선택된 공지사항의 제목 설정
      setContent(selectedNotice.notice.content);  // 선택된 공지사항의 내용 설정
    }
  }, [selectedNotice, isEdit]);

  if (!isOpen) return null;

  const handleSubmit = () => {
    onSubmit(title, content);
    onClose(); // 모달 창 닫기
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>{isEdit ? "공지사항 수정" : "공지사항 생성"}</h2>
          <button onClick={onClose} className="close-btn">X</button>
        </div>
        <div className="modal-body">
          <label>제목</label>
          <input
            type="text"
            className="modal-input"
            value={title || ''}
            onChange={(e) => setTitle(e.target.value)}
          />
          <label>내용</label>
          <textarea
            className="modal-textarea"
            value={content || ''}
            onChange={(e) => setContent(e.target.value)}
          ></textarea>
        </div>
        <div className="modal-footer">
          <button className="modal-submit-btn" onClick={handleSubmit}>
            {isEdit ? "수정" : "등록"}
          </button>
        </div>
      </div>
    </div>
  );
};

const Notice = () => {
  const { authState } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedNotice, setSelectedNotice] = useState(null);
  const [notices, setNotices] = useState([]);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = notices.slice(indexOfFirstRow, indexOfLastRow);
  const totalPages = Math.ceil(notices.length / rowsPerPage);

  const fetchNotices = async () => {
    try {
      const response = await axios.get(
          'https://hizenberk.pythonanywhere.com/api/notices/all/',
          {
            headers: {
              Authorization: `Bearer ${authState.access}`
            }
          }
      );
      const fetchedNotices = response.data.notices.map((notice) => ({
        id: notice.id,
        // number: index + 1,
        name: notice.title,
        user: notice.created_by__name,
        date: notice.created_at,
        content: notice.content
      }));
      setNotices(fetchedNotices);
      // console.log(notices)
    } catch (error) {
      console.error('공지사항 목록 조회 실패:', error.response?.data);
    }
  };

  useEffect(() => {
    fetchNotices();
  }, []);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleRowClick = async (noticeId) => {
    try {
      const response = await axios.get(
          `https://hizenberk.pythonanywhere.com/api/notices/${noticeId}/`,
          {
            headers: {
              Authorization: `Bearer ${authState.access}`
            }
          }
      );
      setSelectedNotice(response.data);
      setIsEditMode(true);
      setIsModalOpen(true);
    } catch (error) {
      console.error('해당 공지사항 조회 실패:', error.response?.data);
    }
  };

  const handleCreateNotice = async (title, content) => {
    try {
      const response = await axios.post(
        'https://hizenberk.pythonanywhere.com/api/notices/create/',
        { title:title,
                content:content
        },
        {
          headers: {
            Authorization: `Bearer ${authState.access}`
          }
        }
      );
      // console.log(response.data)
      const newNotice = {
        id: response.data.notice.id,
        // number: notices.length + 1,
        name: title,
        user: authState.name,
        date: new Date().toISOString().slice(0, 10),
        content: content,
      };
      setNotices([newNotice, ...notices]);
    } catch (error) {
      console.error('공지사항 생성 실패:', error.response?.data);
    }
  };

  const handleEditNotice = async (title, content) => {
    try {
      await axios.put(
        `https://hizenberk.pythonanywhere.com/api/notices/${selectedNotice.notice.id}/`,
        { title, content },
        {
          headers: {
            Authorization: `Bearer ${authState.access}`
          }
        }
      );
      setNotices(notices.map((notice) =>
        notice.id === selectedNotice.id
          ? { ...notice, name: title, content: content }
          : notice
      ));
      setIsModalOpen(false);
      setSelectedNotice(null);
      fetchNotices();
    } catch (error) {
      console.error('공지사항 수정 실패:', error.response?.data);
    }
  };

  const handleDeleteNotice = async (noticeId) => {
    try {
      await axios.delete(
        `https://hizenberk.pythonanywhere.com/api/notices/${noticeId}/`,
        {
          headers: {
            Authorization: `Bearer ${authState.access}`
          }
        }
      );
      setNotices(notices.filter((notice) => notice.id !== noticeId));
    } catch (error) {
      console.error('공지사항 삭제 실패:', error.response?.data);
    }
  };

  return (
    <div className="notice-management">
      <div className="notice-background">
      <div className="notice-top">
        <p className="notice-top-title">공지사항</p>
        <button
          className="create-notice-btn"
          onClick={() => {
            setIsEditMode(false);
            setIsModalOpen(true);
            setSelectedNotice(null);
          }}
        >
          공지 생성
        </button>
      </div>

      <div className="notice-a-box">

        <div className="notice-b-box">
          <table className="notice-table">
            <thead>
              <tr>
                <th>번호</th>
                <th>제목</th>
                <th>작성자</th>
                <th>등록일</th>
                <th>삭제</th>
              </tr>
            </thead>
            <tbody>
              {currentRows.map((row) => (
                <tr key={row.id} onClick={() => handleRowClick(row.id)}>
                  <td>{row.id}</td>
                  <td>{row.name}</td>
                  <td>{row.user}</td>
                  <td>{row.date}</td>
                  <td>
                    <button
                      className="notice-delete-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteNotice(row.id);
                      }}
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
      {/* 공지 생성 및 수정 모달 */}
      <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSubmit={isEditMode ? handleEditNotice : handleCreateNotice}
          selectedNotice={selectedNotice}
          isEdit={isEditMode}
        />
        </div>
    </div>
  );
};

export default Notice;
