import '../CSS/App.css';
import {BrowserRouter as Router, Route, Routes, Link, useLocation, useNavigate} from 'react-router-dom';
import Signup from './Signup';
import Admin from './Admin';
import React, { useState } from 'react';
import axios from 'axios';
import Sidebar from './Sidebar';
import ExpenseManagement from './ExpenseManagement';
import CarHistory from './CarHistory';
import UserManagement from './UserManagement';
import CarManagement from './CarManagement';
<<<<<<< HEAD
import Notice from './Notice';
=======
<<<<<<< Updated upstream
=======
import Notice from './Notice';
import AdminSignup from './AdminSignup';
>>>>>>> Stashed changes
>>>>>>> feather/login
import { useAuth ,AuthProvider } from '../Component/AuthContext';

function App() {
  const location = useLocation(); // 현재 경로 확인

  const showSidebar = location.pathname !== '/' && location.pathname !== '/adminsignup'; // '/'와 '/signup'에서 사이드바 숨김

  return (
    <div className="App">
      {showSidebar && <Sidebar />} {/* 조건부로 Sidebar 렌더링 */}
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/expensemanagement" element={<ExpenseManagement />} />
        <Route path="/carhistory" element={<CarHistory />} />
        <Route path="/usermanagement" element={<UserManagement />} />
        <Route path="/carmanagement" element={<CarManagement />} />
<<<<<<< HEAD
        <Route path="/notice" element={<Notice />} />
=======
<<<<<<< Updated upstream
=======
        <Route path="/notice" element={<Notice />} />
        <Route path="/adminsignup" element={<AdminSignup />} />
>>>>>>> Stashed changes
>>>>>>> feather/login
      </Routes>
    </div>
  );
}

function Login() {
  const [emailOrPhone, setEmailOrPhone] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();
  const {setLogoutSuccess} = useAuth();
  const navigateToAdmin = () => {
    navigate("/admin");
  };
  const handleLogin = async (e) => {
    e.preventDefault(); // 기본 폼 제출 이벤트 방지
    setError(''); // 이전 에러 메시지 초기화
    //console.log('로그인 정보:', "email_or_phone:" ,emailOrPhone,"\n", "password:", password);
    try {
      const response = await axios.post('https://hizenberk.pythonanywhere.com/api/admin/login/', {
        "email_or_phone": emailOrPhone,
        "password": password
      });
      setLogoutSuccess('');
      // 로그인 성공 시 처리 (예: 토큰 저장, 리다이렉트 등)
      console.log('데이터 체크:', response.data.refresh, "\n",
          response.data.access,"\n",
          response.data.user_info.company.name,"\n",
          response.data.user_info.department,"\n",
          response.data.user_info.name);
      login(
          response.data.refresh,
          response.data.access,
          response.data.user_info.company.name,
          response.data.user_info.department,
          response.data.user_info.name,
      )
      console.log('로그인 성공:', response.data);
      navigateToAdmin();
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
        <Link to="/adminsignup" className="adminSignup-label">관리자 회원가입</Link>
          <div className="auto-login">
            <input type="checkbox" id="autoLogin" name="autoLogin" />
            <label htmlFor="autoLogin">자동로그인</label>
          </div>
          <button type="submit" className="login-button">로그인</button>
        </div>
      </form>
    </div>
  );
}

export default function Root() {
  return (
      <AuthProvider> {/* AuthProvider로 App을 감쌈 */}
        <Router>
          <App />
        </Router>
      </AuthProvider>
  );
}
