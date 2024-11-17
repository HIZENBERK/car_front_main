import React, { useState, useEffect } from 'react';  // useState 추가
import '../CSS/App.css';
import { BrowserRouter as Router, Route, Routes, Link, useLocation, useNavigate } from 'react-router-dom';
import Signup from './Signup';
import Admin from './Admin';
import axios from 'axios';
import Sidebar from './Sidebar';
import ExpenseManagement from './ExpenseManagement';
import CarHistory from './CarHistory';
import UserManagement from './UserManagement';
import CarManagement from './CarManagement';
import Notice from './Notice';
import AdminSignup from './AdminSignup';
import { useAuth, AuthProvider } from '../Component/AuthContext';
import Settings from './Settings';

function App() {
    const location = useLocation();
    const navigate = useNavigate();
    const { authState, login } = useAuth();

    const showSidebar = location.pathname !== '/' && location.pathname !== '/adminsignup'; 

    useEffect(() => {
        // 페이지가 새로 고침될 때 로그인 상태 유지
        if (authState.access && authState.refresh) {
            // 이미 로그인 상태라면 필요한 데이터 로드 후, 페이지 이동
            console.log('로그인 상태 유지');
        } else {
            console.log('로그인 상태가 아닙니다.');
        }
    }, [authState]);

    return (
        <div className="App">
            {showSidebar && <Sidebar />}
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/admin" element={<Admin />} />
                <Route path="/expensemanagement" element={<ExpenseManagement />} />
                <Route path="/carhistory" element={<CarHistory />} />
                <Route path="/usermanagement" element={<UserManagement />} />
                <Route path="/carmanagement" element={<CarManagement />} />
                <Route path="/notice" element={<Notice />} />
                <Route path="/adminsignup" element={<AdminSignup />} />
                <Route path="/settings" element={<Settings />} />
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
        {/*<div>*/}
        {/*  <p>프론트 버전 0.2.6 / 24.11.07</p>*/}
        {/*  <p>서버 버전 0.1.7 / 24.11.07</p>*/}
        {/*</div>*/}
        <div className="login-form-group">
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
        <div className="login-form-group">
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
