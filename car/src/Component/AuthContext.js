import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [authState, setAuthState] = useState({
        refresh: null,
        access: null,
        company_name: null,
        department: null,
        name: null
    });

    const [logoutSuccess, setLogoutSuccess] = useState('');

    // 로컬스토리지에서 토큰을 불러와서 상태를 초기화합니다.
    useEffect(() => {
        const accessToken = localStorage.getItem('accessToken');
        const refreshToken = localStorage.getItem('refreshToken');
        const companyName = localStorage.getItem('companyName');
        const department = localStorage.getItem('department');
        const name = localStorage.getItem('name');

        if (accessToken && refreshToken) {
            setAuthState({
                access: accessToken,
                refresh: refreshToken,
                company_name: companyName,
                department: department,
                name: name
            });
        }
    }, []);

    // 로그인 처리 함수
    const login = (refresh, access, company_name, department, name) => {
        setAuthState({
            refresh,
            access,
            company_name,
            department,
            name,
        });
        localStorage.setItem('accessToken', access);
        localStorage.setItem('refreshToken', refresh);
        localStorage.setItem('companyName', company_name);
        localStorage.setItem('department', department);
        localStorage.setItem('name', name);
    };

    // 로그아웃 처리 함수
    const logout = () => {
        setAuthState({
            refresh: null,
            access: null,
            company_name: null,
            department: null,
            name: null,
        });
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('companyName');
        localStorage.removeItem('department');
        localStorage.removeItem('name');

        setLogoutSuccess('로그아웃이 성공적으로 완료되었습니다.');
        // 로그아웃 후, 3초 후 메시지 초기화
        setTimeout(() => {
            setLogoutSuccess('');
        }, 3000);
    };

    // Access Token 갱신 함수
    const refreshAccessToken = async () => {
        const refreshToken = authState.refresh || localStorage.getItem('refreshToken');
        
        if (!refreshToken) {
            console.error('No refresh token available');
            return null;
        }

        try {
            const response = await axios.post('https://hizenberk.pythonanywhere.com/api/token/refresh/', {
                refresh: refreshToken,
            });
            const newAccessToken = response.data.access;
            localStorage.setItem('accessToken', newAccessToken);
            setAuthState((prevState) => ({ ...prevState, access: newAccessToken }));
            return newAccessToken;
        } catch (error) {
            console.error('Failed to refresh token:', error);
            logout(); // 토큰 갱신 실패 시 로그아웃 처리
            return null;
        }
    };

    return (
        <AuthContext.Provider value={{
            authState, 
            login, 
            logout, 
            logoutSuccess, 
            setLogoutSuccess, 
            refreshAccessToken
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
