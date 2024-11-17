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
    // noticeId가 유효한지 확인하고, 유효하지 않으면 API 요청을 하지 않음
    if (!noticeId) {
      console.error('Invalid noticeId');
      return; // noticeId가 없으면 API 요청을 하지 않음
    }

    // API 요청 함수 정의
    const fetchNoticeDetail = async () => {
      try {
        const response = await axios.get(
          `https://hizenberk.pythonanywhere.com/api/notices/${noticeId}/`,
          {
            headers: {
              Authorization: `Bearer ${authState.access}`, // 인증 헤더 추가
            },
          }
        );
        setNotice(response.data.notice); // notice 데이터를 상태에 저장
      } catch (error) {
        console.error('공지사항 상세 조회 실패:', error.response?.data);
      }
    };

    // authState와 noticeId가 모두 유효한 경우에만 API 호출
    if (authState?.access && noticeId) {
      fetchNoticeDetail();
    } else {
      console.error('Authentication or noticeId is missing');
    }
  }, [authState, noticeId]); // authState나 noticeId가 바뀔 때마다 useEffect 실행

  // notice가 로딩 중일 때 표시할 내용
  if (!notice) {
    return <div>Loading...</div>;
  }

  // notice 상세 내용 표시
  return (
    <div className="notice-detail-container">
      <div className="notice-detail-header">
        <button
          className="back-btn"
          onClick={() => navigate(-1)} // 뒤로가기 버튼
        >
          &larr; 뒤로가기
        </button>
        <h1>{notice.title}</h1> {/* 제목 표시 */}
      </div>
      <div className="notice-detail-content">
        <div className="notice-detail-body">
          <p>{notice.content}</p> {/* 공지 내용 표시 */}
        </div>
      </div>
    </div>
  );
};

export default NoticeDetail;
