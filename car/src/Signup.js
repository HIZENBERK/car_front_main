import './CSS/Signup.css';

function Signup() {
  return (
    <div className="signup-container">
      <form className="signup-form">
        <div className="form-group">
          <input type="text" id="username" name="username" placeholder="아이디" />
        </div>
        <div className="form-group">
          <input type="password" id="password" name="password" placeholder="비밀번호" />
          <p className="password-info">영문, 숫자 6자리 이상</p>
        </div>
        <div className="form-group">
          <label className="company-info-label">회사정보</label>
        </div>
        <div className="form-group">
          <input type="text" id="businessNumber" name="businessNumber" placeholder="사업자번호" />
        </div>
        <div className="form-group">
          <input type="text" id="companyName" name="companyName" placeholder="업체명" />
        </div>
        <div className="form-group">
          <input type="text" id="managerName" name="managerName" placeholder="담당자명" />
        </div>
        <div className="form-group">
          <input type="text" id="managerContact" name="managerContact" placeholder="담당자 연락처" />
        </div>
        <div className="form-group">
          <input type="email" id="email" name="email" placeholder="이메일" />
        </div>
        <button type="submit" className="signup-button">가입하기</button>
        <p className="terms">
          가입하기 버튼을 누르면, <span className="blue-text">서비스 이용약관</span>, <span className="blue-text">위치정보 이용약관</span>, <span className="blue-text">개인정보 수집 및 이용</span>에 동의한 것으로 간주합니다.
        </p>
      </form>
    </div>
  );
}

export default Signup;
