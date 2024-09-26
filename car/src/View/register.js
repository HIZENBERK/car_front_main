import React, { useState } from 'react';
import axios from 'axios';

const Register = () => {


    const [email, setEmail] = useState('');
    const [phoneNO , setPhoneNo] = useState('');
    const [password, setPassword] = useState('');
    const [password2, setPassword2] = useState('');
    const [deviceUUID , setDeviceUUID] = useState('');
    const [companyName, setCompanyName] = useState('');
    const [businessRegistrationNo, setBusinessRegistrationNo] = useState('');
    const [department, setDepartment] = useState('');
    const [position, setPosition] = useState('');
    const [name, setName] = useState('');
    const [error, setError] = useState('');

    const handleRegister = async (e) => {
        e.preventDefault(); // 기본 폼 제출 이벤트 방지
        setError(''); // 이전 에러 메시지 초기화

        try {
            const response = await axios.post('http://127.0.0.1:8000/api/register/', {
                email: email,
                phone_number: phoneNO,
                password: password,
                password2 : password2,
                device_uuid : deviceUUID,
                company_name : companyName,
                business_registration_number : businessRegistrationNo,
                department : department,
                position : position,
                name : name
            });
            console.log('회원가입 성공:', response.data);
        } catch (err) {
            console.error('로그인 실패:', err.response?.data);
            setError('회원가입에 실패했습니다.  입려된 정보를 확인하세요.');
        }
    };
    return (
        <div>
            <h2>회원가입</h2>
            <form onSubmit={handleRegister}>

                <div>
                    <label>이메일 :</label>
                    <input
                        type="text"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>

                <div>
                    <label>전화번호 :</label>
                    <input
                        type="text"
                        value={phoneNO}
                        onChange={(e) => setPhoneNo(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>비밀번호:</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>비밀번호 확인:</label>
                    <input
                        type="password"
                        value={password2}
                        onChange={(e) => setPassword2(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>기기 uid:</label>
                    <input
                        type="text"
                        value={deviceUUID}
                        onChange={(e) => setDeviceUUID(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>회사명:</label>
                    <input
                        type="text"
                        value={companyName}
                        onChange={(e) => setCompanyName(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>사업자 등록 번호 :</label>
                    <input
                        type="text"
                        value={businessRegistrationNo}
                        onChange={(e) => setBusinessRegistrationNo(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>소속 부서:</label>
                    <input
                        type="text"
                        value={department}
                        onChange={(e) => setDepartment(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>직급:</label>
                    <input
                        type="text"
                        value={position}
                        onChange={(e) => setPosition(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>성명:</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                </div>
                <button type="submit">회원가입</button>
            </form>
            {error && <p style={{color: 'red'}}>{error}</p>}
        </div>
    );
};

export default Register;
