import './CSS/App.css';
import { BrowserRouter as Router, Route, Routes, Link, useLocation } from 'react-router-dom';
import Signup from './Signup';
import Admin from './Admin';
import React, { useState } from 'react';
import axios from 'axios';
import Sidebar from './View/Sidebar';
import ExpenseManagement from './View/ExpenseManagement';
import CarHistory from './View/CarHistory';

function App() {
  const location = useLocation(); // 현재 경로 확인

  const showSidebar = location.pathname !== '/' && location.pathname !== '/signup'; // '/'와 '/signup'에서 사이드바 숨김

  return (
    <div className="App">
      {showSidebar && <Sidebar />} {/* 조건부로 Sidebar 렌더링 */}
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/expensemanagement" element={<ExpenseManagement />} />
        <Route path="/carhistory" element={<CarHistory />} />
      </Routes>
    </div>
  );
}

function Login() {
  const [emailOrPhone, setEmailOrPhone] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault(); // 기본 폼 제출 이벤트 방지
    setError(''); // 이전 에러 메시지 초기화

    try {
      const response = await axios.post('http://127.0.0.1:8000/api/login/', {
        email_or_phone: emailOrPhone,
        password: password,
      });
      // 로그인 성공 시 처리 (예: 토큰 저장, 리다이렉트 등)
      console.log('로그인 성공:', response.data);
    } catch (err) {
      console.error('로그인 실패:', err.response?.data);
      setError('로그인에 실패했습니다. 이메일 또는 비밀번호를 확인하세요.');
    }
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleLogin}>
        <div className="form-group">
          <input
            type="text"
            id="username"
            name="username"
            placeholder="아이디"
            value={emailOrPhone}
            onChange={(e) => setEmailOrPhone(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <input
            type="password"
            id="password"
            name="password"
            placeholder="비밀번호"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          {error && <p style={{ color: 'red' }}>{error}</p>}
        </div>
        <div className="form-footer">
          <div className="auto-login">
            <input type="checkbox" id="autoLogin" name="autoLogin" />
            <label htmlFor="autoLogin">자동로그인</label>
          </div>
          <Link to="/signup" className="signup-label">회원가입</Link>

          <button type="submit" className="login-button">로그인</button>
        </div>
      </form>
    </div>
  );
}

export default function Root() {
  return (
    <Router>
      <App />
    </Router>
  );
}
