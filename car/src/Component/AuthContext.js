import React, { createContext, useContext, useState } from 'react';
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
        setAuthState({
            refresh,
            access,
            company_name,
            department,
            name,
        });
        localStorage.setItem('accessToken', access);
        localStorage.setItem('refreshToken', refresh);
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
            logout(); // Log out user if refresh token is invalid
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
