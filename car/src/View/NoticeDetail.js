import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../CSS/Notice.css'; // Updated CSS file
import { useAuth } from '../Component/AuthContext';
import 'bootstrap-icons/font/bootstrap-icons.css';

const NoticeDetail = () => {
  const { authState } = useAuth();
  const { noticeId } = useParams(); // Get noticeId from URL
  const navigate = useNavigate();
  const [notice, setNotice] = useState(null);

  useEffect(() => {
    if (!noticeId) {
      console.error('Invalid noticeId');
      return;
    }

    const fetchNoticeDetail = async () => {
      try {
        const response = await axios.get(
          `https://hizenberk.pythonanywhere.com/api/notices/${noticeId}/`,
          {
            headers: {
              Authorization: `Bearer ${authState.access}`, // Auth headers
            },
          }
        );
        setNotice(response.data.notice);
      } catch (error) {
        console.error('Failed to fetch notice detail:', error.response?.data);
      }
    };

    if (authState?.access && noticeId) {
      fetchNoticeDetail();
    } else {
      console.error('Authentication or noticeId is missing');
    }
  }, [authState, noticeId]);

  if (!notice) {
    return <div className="notice-management">Loading...</div>;
  }

  return (
    <div className="notice-management">
      <div className="notice-background">
        <div className="notice-modal-header">
          <p className="notice-model-header-title">공지사항 상세</p>
          <button onClick={() => navigate(-1)} className="notice-close-btn"><i className="bi bi-arrow-return-left"></i>뒤로 가기</button>
        </div>
        <div className="notice-modal-body">
          <div className="notice-modal-body-box">
          <div className="notice-modal-title-box">
          <div className="notice-modal-title-box-box">
          <label>제목:</label></div>
          <label
            type="text"
            className="notice-modal-input"
          >{notice.title}</label></div>
          </div>
          <div className="notice-modal-textarea-box">
          <p
            className="notice-detail-content"
          >{notice.content}</p></div>
        </div>
      </div>
    </div>
  );
};

export default NoticeDetail;
