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

    useEffect(() => {
        // 로컬스토리지에서 토큰을 불러와서 상태를 초기화합니다.
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
    };

    const refreshAccessToken = async () => {
        try {
            const response = await axios.post('https://hizenberk.pythonanywhere.com/api/token/refresh/', {
                refresh: authState.refresh || localStorage.getItem('refreshToken'),
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

    const [LogoutSuccess, setLogoutSuccess] = useState('');

    return (
        <AuthContext.Provider value={{ authState, login, logout, LogoutSuccess, setLogoutSuccess, refreshAccessToken }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
