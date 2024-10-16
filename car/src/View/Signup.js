import React, { useState } from 'react';
import '../CSS/Signup.css';
import axios from "axios";
import {useNavigate} from "react-router-dom";

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
  const navigate = useNavigate();

  const navigateToLogin = () => {
    navigate("/");
  };
  const handRegister = async (e) => {
    e.preventDefault(); // 기본 폼 제출 이벤트 방지
    setError(''); // 이전 에러 메시지 초기화
    console.log('로그인 정보:', "email : " , email, "\n",
        "phone_number : ", managerContact,"\n",
        "password2 :", password,"\n",
        "device_uuid :", "abc123-def456-gh789" ,"\n",
        "company_name :", companyName,"\n",
        "business_registration_number :", businessNumber,"\n",
        "department :", department,"\n",
        "position:", "Developer","\n",
        "name :", managerName
    )
    try {
      const response = await axios.post('https://hizenberk.pythonanywhere.com/api/register/', {
        "email" : email,
        "phone_number": managerContact,
        "password": password,
        "password2": password,
        "device_uuid": "abc123-def456-gh789" ,
        "company_name": companyName,
        "business_registration_number": businessNumber,
        "department": department,
        "position": "Developer",
        "name": managerName
      });
      // 로그인 성공 시 처리 (예: 토큰 저장, 리다이렉트 등)
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
          <input type="text"
                 className="input-field"
                 id="username"
                 name="username"
                 placeholder="아이디"
                 onChange={(e) => setId(e.target.value)}
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
                 id="businessNumber"
                 name="businessNumber"
                 placeholder="사업자번호"onChange={(e) => setBusinessNumber(e.target.value)}
          />
        </div>
        <div className="form-group">
          <input type="text"
                 className="input-field"
                 id="companyName"
                 name="companyName"
                 placeholder="업체명"
                 onChange={(e) => setCompanyName(e.target.value)}
          />
        </div>
        <div className="form-group">
          <input type="text"
                 className="input-field"
                 id="managerName"
                 name="managerName"
                 placeholder="사용자명"
                 onChange={(e) => setManagerName(e.target.value)}
          />
        </div>
        <div className="form-group">
          <input type="text"
                 className="input-field"
                 id="department"
                 name="department"
                 placeholder="사용자 연락처"
                 onChange={(e) => setManagerContact(e.target.value)}
          />
        </div>
        <div className="form-group">
          <input type="text"
                 className="input-field"
                 id="managerDepartment"
                 name="managerDepartment"
                 placeholder="시용자 소속 부서"
                 onChange={(e) => setDepartment(e.target.value)}
          />
        </div>
        <div className="form-group">
          <input type="email"
                 className="input-field"
                 id="email"
                 name="email"
                 placeholder="이메일"
                 onChange={(e) => setEmail(e.target.value)}
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
