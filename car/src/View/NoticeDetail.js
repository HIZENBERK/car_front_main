import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from "../Component/AuthContext";
import '../CSS/NoticeDetail.css';

function NoticeDetail() {
  const { id } = useParams();
  const { authState } = useAuth();
  const [notice, setNotice] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchNoticeDetail = async () => {
      try {
        const response = await axios.get(`https://hizenberk.pythonanywhere.com/api/notices/${id}/`, {
          headers: {
            Authorization: `Bearer ${authState.access}`,
          },
        });
        console.log("Fetched notice:", response.data.notice);
        setNotice(response.data.notice); // 상태 업데이트
      } catch (error) {
        console.error('공지사항 상세 조회 실패:', error.response?.data || error.message);
      }
    };

    if (authState?.access) {
      fetchNoticeDetail();
    }
  }, [id, authState]);

  if (!authState) {
    return <div>인증 정보가 없습니다. 로그인해주세요.</div>;
  }

  if (!notice) {
    console.log("렌더링 시점의 notice 상태:", notice); // 상태 확인
    return <div>공지사항을 불러오는 중입니다...</div>;
  }

  return (
    <div className="notice-detail-container" key={notice.id}>
      <h1 className="notice-title">{notice.title}</h1>
      <div className="notice-content">{notice.content}</div>
      <button className="back-button" onClick={() => navigate(-1)}>뒤로가기</button>
    </div>
  );
}

export default NoticeDetail;
