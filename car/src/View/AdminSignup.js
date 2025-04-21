import React, { useState } from 'react';
import '../CSS/AdminSignup.css';
import axios from "axios";
import {useNavigate} from "react-router-dom";

function Signup() {
  const [password, setPassword] = useState('');
  const [password2, setPassword2] = useState('');
  const [businessNumber, setBusinessNumber] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [companyAddress, setCompanyAddress] = useState('');
  const [managerName, setManagerName] = useState('');
  const [managerContact, setManagerContact] = useState('');
  const [email, setEmail] = useState('');
  const [department, setDepartment] = useState('');
  const [position, setPosition] = useState('');

  const [error, setError] = useState('');
  const navigate = useNavigate();

  const navigateToLogin = () => {
    navigate("/");
  };
  const handRegister = async (e) => {
    e.preventDefault(); // 기본 폼 제출 이벤트 방지
    setError(''); // 이전 에러 메시지 초기화
    console.log('회원가입 정보:', "email :",email,"\n",
        "email : " ,email,
        "phone_number : " ,managerContact,
        "password : " ,password,
        "password2 : " ,password2,
        "company_name : " ,companyName,
        "company_address : " ,companyAddress,
        "business_registration_number : " ,businessNumber,
        "department : " , department,
        "position : " ,position,
        "name : " , managerName
    )
    try {
      const response = await axios.post('https://hizenberk.pythonanywhere.com/api/admin/register/', {
        "email":email,
        "phone_number": managerContact,
        "password": password,
        "password2": password2,
        "company_name": companyName,
        "company_address": companyAddress,
        "business_registration_number": businessNumber,
        "department": department,
        "position": position,
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
    <div className="admin-signup-container">
      <div className="admin-signup-a-box">

        <div className="admin-signup-b-box">

          <div className="admin-signup-d-box">
            <div className="signup-return-box" onClick={() => navigate(-1)}>
            <i className="bi bi-arrow-return-left"></i>
            <span>뒤로 가기</span>
            </div>
          </div>

          <div className="admin-signup-e-box">
            <div className="pass1-form-group">
            <input type="password"
                  className="pass-input-field"
                  id="password"
                  name="password"
                  placeholder="비밀번호"
                  onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div className="pass-form-group">
              <input type="password"
                    className="pass-input-field"
                    id="password"
                    name="password"
                    placeholder="비밀번호 확인"
                    onChange={(e) => setPassword2(e.target.value)}
              />
              <p className="password-info">영문, 숫자 6자리 이상</p>
            </div>
          </div>

        </div>

        <div className="admin-signup-c-box">

          <div className="admin-signup-f-box">
            <label className="company-info-label">회사정보</label>
          </div>

          <div className="form-group">
          <input type="text"
                 className="input-field"
                 id="businessNumber"
                 name="businessNumber"
                 placeholder="사업자번호" onChange={(e) => setBusinessNumber(e.target.value)}
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
                  id="companyAddress"
                  name="companyAddress"
                  placeholder="업체주소"
                  onChange={(e) => setCompanyAddress(e.target.value)}
            />
          </div>
          <div className="form-group">
            <input type="text"
                  className="input-field"
                  id="managerName"
                  name="managerName"
                  placeholder="담당자명"
                  onChange={(e) => setManagerName(e.target.value)}
            />
          </div>
          <div className="form-group">
            <input type="text"
                  className="input-field"
                  id="position"
                  name="position"
                  placeholder="담당자 직급"
                  onChange={(e) => setPosition(e.target.value)}
            />
          </div>
          <div className="form-group">
            <input type="text"
                  className="input-field"
                  id="department"
                  name="department"
                  placeholder="담당자 연락처"
                  onChange={(e) => setManagerContact(e.target.value)}
            />
          </div>
          <div className="form-group">
            <input type="text"
                  className="input-field"
                  id="managerDepartment"
                  name="managerDepartment"
                  placeholder="담당자 소속 부서"
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

        </div>

      </div>
    </div>
  );
}

export default Signup;
