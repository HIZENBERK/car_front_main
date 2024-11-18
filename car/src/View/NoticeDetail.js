import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../CSS/NoticeDetail.css'; // Updated CSS file
import { useAuth } from '../Component/AuthContext';

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
        <div className="notice-top">
          <h1 className="notice-top-title">공지사항 상세</h1>
          <button
            className="notice-detail-back-btn"
            onClick={() => navigate(-1)} // Navigate back
          >
            &larr; 뒤로가기
          </button>
        </div>
        <div className="notice-detail-content">
          <h1>{notice.title}</h1>
          <div className="notice-detail-body">
            <p>{notice.content}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NoticeDetail;
