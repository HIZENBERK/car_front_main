import React from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom'; // useLocation 추가
import Login from './login';
import Register from './register';
import ExpenseManagement from './ExpenseManagement';
import Sidebar from './Sidebar';
import '../CSS/App.css'; // 스타일 파일

const AppLayout = () => {
  const location = useLocation();
  
  // 로그인과 회원가입 페이지에서는 사이드바 숨김
  const hideSidebar = location.pathname === '/' || location.pathname === '/register';

  return (
    <div className="app-container">
      {!hideSidebar && <Sidebar />} {/* 로그인/회원가입 외 페이지에서만 사이드바 표시 */}
      <div className="content">
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/expensemanagement" element={<ExpenseManagement />} />
        </Routes>
      </div>
    </div>
  );
};

const App = () => {
    return (
        <Router>
            <AppLayout />
        </Router>
    );
};

export default App;
