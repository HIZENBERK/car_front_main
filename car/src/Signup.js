import React, { useState } from 'react';
import './CSS/Signup.css';
import axios from "axios";

function Signup() {
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');
  const [businessNumber, setBusinessNumber] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [managerName, setManagerName] = useState('');
  const [managerContact, setManagerContact] = useState('');
  const [email, setEmail] = useState('');
  const [department, setDepartment] = useState('');

  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault(); // 기본 폼 제출 이벤트 방지
    setError(''); // 이전 에러 메시지 초기화

    try {
      const response = await axios.post('http://hizenberk.pythonanywhere.com/api/register/', {
        "email" : id,
        "phone_number": managerContact,
        "password2": password,
        "device_uuid": password ,
        "company_name": companyName,
        "business_registration_number": businessNumber,
        "department": department,
        "position": password,
        "name": username
      });
      // 로그인 성공 시 처리 (예: 토큰 저장, 리다이렉트 등)
      console.log('로그인 성공:', response.data);
    } catch (err) {
      console.error('로그인 실패:', err.response?.data);
      setError('로그인에 실패했습니다. 이메일 또는 비밀번호를 확인하세요.');
    }
  };



  return (
    <div className="signup-container">
      <form className="signup-form">
        <div className="form-group">
          <input type="text"
                 id="username"
                 name="username"
                 placeholder="아이디"
                 onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div className="form-group">
          <input type="password" id="password" name="password" placeholder="비밀번호"/>
          <p className="password-info">영문, 숫자 6자리 이상</p>
        </div>
        <div className="form-group">
          <label className="company-info-label">회사정보</label>
        </div>
        <div className="form-group">
          <input type="text" id="businessNumber" name="businessNumber" placeholder="사업자번호"/>
        </div>
        <div className="form-group">
          <input type="text" id="companyName" name="companyName" placeholder="업체명"/>
        </div>
        <div className="form-group">
          <input type="text" id="managerName" name="managerName" placeholder="담당자명"/>
        </div>
        <div className="form-group">
          <input type="text" id="department" name="department" placeholder="담당자 연락처"/>
        </div>
        <div className="form-group">
          <input type="text" id="managerName" name="managerName" placeholder="담당자 소속 부서"/>
        </div>
        <div className="form-group">
          <input type="email" id="email" name="email" placeholder="이메일"/>
        </div>
        <button type="submit" className="signup-button">가입하기</button>
        <p className="terms">
          가입하기 버튼을 누르면, <span className="blue-text">서비스 이용약관</span>, <span className="blue-text">위치정보 이용약관</span>, <span
            className="blue-text">개인정보 수집 및 이용</span>에 동의한 것으로 간주합니다.
        </p>
      </form>
    </div>
  );
}

export default Signup;
