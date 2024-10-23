import React, { useState } from 'react';
import '../CSS/Signup.css';
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../Component/AuthContext"; // 이 부분은 프로젝트 구조에 맞게 조정하세요.

function Signup() {
  const { authState, setAuthState } = useAuth(); // authState와 setAuthState 사용
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phonenumber, setPhonenumber] = useState('');
  const [department, setDepartment] = useState('');
  const [position, setPosition] = useState('');
  const [userName, setUserName] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // 로그인 페이지로 이동
  const navigateToLogin = () => {
    navigate("/usermanagement");
  };

  // 토큰이 만료되었는지 확인하는 함수
  const tokenHasExpired = (token) => {
    const decodedToken = JSON.parse(atob(token.split('.')[1]));
    const currentTime = Date.now() / 1000;
    return decodedToken.exp < currentTime; // 현재 시간보다 만료 시간이 이르면 true 반환
  };

  // 토큰을 갱신하는 함수
  const refreshAccessToken = async () => {
    try {
      const response = await axios.post('https://hizenberk.pythonanywhere.com/api/token/refresh/', {
        refresh: authState.refresh
      });
      // 새로운 access token을 authState에 저장
      setAuthState((prevState) => ({
        ...prevState,
        access: response.data.access
      }));
    } catch (error) {
      console.error('토큰 갱신 실패', error);
      // 리프레시 토큰도 만료되었을 경우, 로그인 페이지로 리디렉션
      navigate('/login');
    }
  };

  // 회원가입 처리 함수
  const handRegister = async (e) => {
    e.preventDefault();
    setError('');

    // 토큰이 만료되었으면 갱신 시도
    if (tokenHasExpired(authState.access)) {
      await refreshAccessToken();
    }

    try {
      const response = await axios.post('https://hizenberk.pythonanywhere.com/api/admin/register-user/', {
        email: email,
        phone_number: phonenumber,
        password: password,
        password2: password,
        department: department,
        position: position,
        name: userName
      }, {
        headers: {
          Authorization: `Bearer ${authState.access}` // 갱신된 토큰 사용
        }
      });
      console.log('회원가입 성공:', response.data);
      navigateToLogin();
    } catch (err) {
      console.error('회원가입 실패:', err.response?.data);
      setError('회원가입 실패했습니다. 입력된 정보를 확인하세요.');
    }
  };

  return (
    <div className="signup-container">
      <form className="signup-form">
        <div className="form-group">
          <input type="email"
                 className="input-field"
                 id="email"
                 name="email"
                 placeholder="이메일"
                 onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="form-group">
          <input type="password"
                 className="input-field"
                 id="password"
                 name="password"
                 placeholder="비밀번호"
                 onChange={(e) => setPassword(e.target.value)}
          />
          <p className="password-info">영문, 숫자 6자리 이상</p>
        </div>
        <div className="form-group">
          <label className="company-info-label">회사정보</label>
        </div>
        <div className="form-group">
          <input type="text"
                 className="input-field"
                 id="managerName"
                 name="managerName"
                 placeholder="사용자명"
                 onChange={(e) => setUserName(e.target.value)}
          />
        </div>
        <div className="form-group">
          <input type="phonenumber"
                 className="input-field"
                 id="phonenumber"
                 name="phonenumber"
                 placeholder="전화번호"
                 onChange={(e) => setPhonenumber(e.target.value)}
          />
        </div>
        <div className="form-group">
          <input type="text"
                 className="input-field"
                 id="department"
                 name="department"
                 placeholder="사용자 소속 부서"
                 onChange={(e) => setDepartment(e.target.value)}
          />
        </div>
        <div className="form-group">
          <input type="text"
                 className="input-field"
                 id="position"
                 name="position"
                 placeholder="사용자 직급"
                 onChange={(e) => setPosition(e.target.value)}
          />
        </div>
        
        <button type="submit" className="signup-button" onClick={handRegister}>가입하기</button>
        <p className="terms">
          가입하기 버튼을 누르면, <span className="blue-text">서비스 이용약관</span>, <span className="blue-text">위치정보 이용약관</span>, <span
            className="blue-text">개인정보 수집 및 이용</span>에 동의한 것으로 간주합니다.
        </p>
      </form>
    </div>
  );
}

export default Signup;
