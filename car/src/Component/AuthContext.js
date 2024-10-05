import React, { createContext, useContext, useState } from 'react';

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
    };

    const logout = () => {
        setAuthState({
            refresh: null,
            access: null,
            company_name: null,
            department: null,
            name: null,
        });
    };

    const [LogoutSuccess, setLogoutSuccess] = useState('');

    return (
        <AuthContext.Provider value={{ authState, login, logout, LogoutSuccess, setLogoutSuccess }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
