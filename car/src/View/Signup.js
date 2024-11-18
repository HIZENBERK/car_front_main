import React, { useState } from 'react';
import '../CSS/Signup.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../Component/AuthContext';
import 'bootstrap-icons/font/bootstrap-icons.css';

function Signup() {
  const { authState, setAuthState } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phonenumber, setPhonenumber] = useState('');
  const [department, setDepartment] = useState('');
  const [position, setPosition] = useState('');
  const [userName, setUserName] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const navigateToLogin = () => {
    navigate('/usermanagement');
  };

  // 토큰 만료 여부 확인
  const tokenHasExpired = (token) => {
    try {
    const decodedToken = JSON.parse(atob(token.split('.')[1]));
    const currentTime = Date.now() / 1000;
    return decodedToken.exp < currentTime;
    } catch (error) {
      return true;
    }
  };

  // 토큰 갱신
  const refreshAccessToken = async () => {
    try {
      const response = await axios.post(
        'https://hizenberk.pythonanywhere.com/api/token/refresh/',
        { refresh: authState.refresh }
      );
      setAuthState((prevState) => ({
        ...prevState,
        access: response.data.access,
      }));
    } catch (error) {
      console.error('토큰 갱신 실패:', error);
      navigate('/login');
    }
  };

  // 회원가입 요청
  const handRegister = async (e) => {
    e.preventDefault();
    setError('');
  
    // Check password criteria
    if (password.length < 8) {
      setError('비밀번호는 최소 8자리 이상이어야 합니다.');
      return;
    }
    if (/^\d+$/.test(password)) {
      setError('비밀번호는 숫자만으로 구성될 수 없습니다.');
      return;
    }
  
    // Token refresh logic (if applicable)
    if (tokenHasExpired(authState.access)) {
      await refreshAccessToken();
    }
  
    // Backend API request
    try {
      const response = await axios.post(
        'https://hizenberk.pythonanywhere.com/api/admin/register-user/',
        {
          email: email,
          phone_number: phonenumber,
          password: password,
          password2: password,
          department: department,
          position: position,
          name: userName,
        },
        {
          headers: {
            Authorization: `Bearer ${authState.access}`,
          },
        }
      );
  
      console.log('회원가입 성공:', response.data);
      alert('회원가입이 성공적으로 완료되었습니다.');
      navigateToLogin();
    } catch (err) {
      if (err.response?.status === 403) {
        setError('관리자 권한이 없습니다.');
      } else if (err.response?.status === 400) {
        setError(err.response?.data?.message || '회원가입에 실패했습니다.');
      } else {
        setError('서버에 문제가 발생했습니다. 다시 시도해주세요.');
      }
      console.error('회원가입 실패:', err.response?.data);
    }
  };
  

  return (
    <div className="signup-container">
      <div className="signup-a-box">
        <div className="signup-b-box">
          <div className="signup-return-box" onClick={() => navigate(-1)}>
          <i className="bi bi-arrow-return-left"></i>
          <span>뒤로 가기</span>
          </div>
        </div>

        <div className="signup-c-box">
          <form className="signup-form">
            <div className="form-group">
              <input
                type="email"
                    className="input-field"
                    id="email"
                    name="email"
                    placeholder="이메일"
                    onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <input
              type="password"
              className="input-field"
              id="password"
              name="password"
              placeholder="비밀번호 (영문, 숫자 포함 최소 8자)"
              onChange={(e) => setPassword(e.target.value)}
            />
            <div className="form-group">
              <label className="company-info-label">회사정보</label>
            </div>
            <div className="form-group">
              <input
                type="text"
                    className="input-field"
                    id="managerName"
                    name="managerName"
                    placeholder="사용자명"
                    onChange={(e) => setUserName(e.target.value)}
              />
            </div>
            <div className="form-group">
              <input
                type="phonenumber"
                    className="input-field"
                    id="phonenumber"
                    name="phonenumber"
                    placeholder="전화번호"
                    onChange={(e) => setPhonenumber(e.target.value)}
              />
            </div>
            <div className="form-group">
              <input
                type="text"
                    className="input-field"
                    id="department"
                    name="department"
                    placeholder="사용자 소속 부서"
                    onChange={(e) => setDepartment(e.target.value)}
              />
            </div>
            <div className="form-group">
              <input
                type="text"
                    className="input-field"
                    id="position"
                    name="position"
                    placeholder="사용자 직급"
                    onChange={(e) => setPosition(e.target.value)}
              />
            </div>
            
            {error && <p className="error-message">{error}</p>}

            <button type="submit" className="signup-button" onClick={handRegister}>
              가입하기
            </button>
            <p className="terms">
              가입하기 버튼을 누르면,{' '}
              <span className="blue-text">서비스 이용약관</span>,{' '}
              <span className="blue-text">위치정보 이용약관</span>,{' '}
              <span className="blue-text">개인정보 수집 및 이용</span>에 동의한 것으로
              간주합니다.
            </p>
          </form>
        </div>

      </div>
    </div>
  );
}

export default Signup;
