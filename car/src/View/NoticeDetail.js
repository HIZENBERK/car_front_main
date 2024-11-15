import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../CSS/NoticeDetail.css';
import { useAuth } from "../Component/AuthContext";

const NoticeDetail = () => {
  const { authState } = useAuth();
  const { noticeId } = useParams(); // URL에서 noticeId 가져오기
  const navigate = useNavigate();
  const [notice, setNotice] = useState(null);

  useEffect(() => {
    const fetchNoticeDetail = async () => {
      try {
        const response = await axios.get(
          `https://hizenberk.pythonanywhere.com/api/notices/${noticeId}/`,
          {
            headers: {
              Authorization: `Bearer ${authState.access}`,
            },
          }
        );
        setNotice(response.data.notice);
      } catch (error) {
        console.error('공지사항 상세 조회 실패:', error.response?.data);
      }
    };

    if (authState?.access) {
      fetchNoticeDetail();
    }
  }, [authState, noticeId]);

  if (!notice) {
    return <div>Loading...</div>;
  }

  return (
    <div className="notice-detail-container">
      <div className="notice-detail-header">
        <button
          className="back-btn"
          onClick={() => navigate(-1)} // 뒤로가기
        >
          &larr; 뒤로가기
        </button>
        <h1>{notice.title}</h1>
      </div>
      <div className="notice-detail-content">
        <p className="notice-detail-date">
          작성자: {notice.created_by__name} | 작성일: {notice.created_at}
        </p>
        <div className="notice-detail-body">
          <p>{notice.content}</p>
        </div>
      </div>
    </div>
  );
};

export default NoticeDetail;
