import React, { useState } from 'react';
import axios from 'axios';
import {useNavigate} from "react-router-dom";

const Login = () => {
    const [emailOrPhone, setEmailOrPhone] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const registerNavigate = async (e) => {
      navigate("./register",  { replace: false})
    };
    const handleLogin = async (e) => {
        e.preventDefault(); // 기본 폼 제출 이벤트 방지
        setError(''); // 이전 에러 메시지 초기화

        try {
            const response = await axios.post('http://127.0.0.1:8000/api/login/', {
                email_or_phone: emailOrPhone,
                password: password,
            });
            // 로그인 성공 시 처리 (예: 토큰 저장, 리다이렉트 등)
            console.log('로그인 성공:', response.data);
        } catch (err) {
            console.error('로그인 실패:', err.response?.data);
            setError('로그인에 실패했습니다. 이메일 또는 비밀번호를 확인하세요.');
        }
    };

    return (
        <div>
            <h2>로그인</h2>
            <form onSubmit={handleLogin}>
                <div>
                    <label>이메일 또는 전화번호:</label>
                    <input
                        type="text"
                        value={emailOrPhone}
                        onChange={(e) => setEmailOrPhone(e.target.value)}
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
                <button type="submit">로그인</button>
                <button onClick={registerNavigate} >회원가입</button>
            </form>
            {error && <p style={{ color: 'red' }}>{error}</p>}
        </div>
    );
};

export default Login;
