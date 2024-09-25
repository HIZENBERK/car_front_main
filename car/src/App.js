import './CSS/App.css';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Signup from './Signup';
import Admin from './Admin';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/admin" element={<Admin />} />
        </Routes>
      </div>
    </Router>
  );
}

function Login() {
  return (
    <div className="login-container">
      <form className="login-form">
        <div className="form-group">
          <input type="text" id="username" name="username" placeholder="아이디" />
        </div>
        <div className="form-group">
          <input type="password" id="password" name="password" placeholder="비밀번호" />
        </div>
        <div className="form-footer">
          <Link to="/signup" className="signup-label">회원가입</Link>
          <div className="auto-login">
            <input type="checkbox" id="autoLogin" name="autoLogin" />
            <label htmlFor="autoLogin">자동로그인</label>
          </div>
        </div>
      </form>
    </div>
  );
}

export default App;
