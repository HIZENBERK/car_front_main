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

    const login = (refresh, access, company_name, department, name) => {
        if (!localStorage.getItem('accessToken')){
            setAuthState({
                refresh,
                access,
                company_name,
                department,
                name,
            });
            localStorage.setItem('accessToken', access);
            localStorage.setItem('refreshToken', refresh);
            localStorage.setItem('company_name', company_name);
            localStorage.setItem('name', name);
        }else {
            setAuthState({
                localStorage.getItem('refreshToken'),
                localStorage.getItem('accessToken'),
                company_name,
                department,
                name,
            });
        }



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
        localStorage.removeItem('company_name');
        localStorage.removeItem('name');
    };

    const refreshAccessToken = async () => {
        try {
            // const refreshToken = authState.refresh || localStorage.getItem('refreshToken');
            // if (!refreshToken) return null; // Refresh token이 없으면 리턴하지 않음
            //
            // const response = await axios.post('https://hizenberk.pythonanywhere.com/api/token/refresh/', {
            //     refresh: refreshToken,
            // });
            const newAccessToken = localStorage.getItem('accessToken');
            // localStorage.setItem('accessToken', newAccessToken);
            // setAuthState((prevState) => ({ ...prevState, access: newAccessToken }));
            return newAccessToken;
        } catch (error) {
            console.error('Failed to refresh token:', error);
            logout(); // Refresh token이 만료된 경우 로그아웃
            return null;
        }
    };

    const [LogoutSuccess, setLogoutSuccess] = useState('');

    // 페이지가 로드될 때 토큰을 자동으로 갱신합니다.
    useEffect(() => {
        const initializeAuth = async () => {
            const accessToken = localStorage.getItem('accessToken');
            const refreshToken = localStorage.getItem('refreshToken');

            if (accessToken && refreshToken) {
                setAuthState({
                    access: accessToken,
                    refresh: refreshToken,
                });
                //await refreshAccessToken(); // 액세스 토큰 갱신
            }
        };

        initializeAuth(); // 페이지가 로드될 때 실행
    }, []); // 컴포넌트가 처음 마운트될 때 한 번만 실행

    return (
        <AuthContext.Provider value={{ authState, login, logout, LogoutSuccess, setLogoutSuccess, refreshAccessToken }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
