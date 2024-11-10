import React, { useState, useEffect } from 'react';
import '../CSS/CarManagement.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import { useAuth } from "../Component/AuthContext";
import VehicleList from "./VehicleList";
import MaintenanceHistory from "./MaintenanceHistory";

const CarManagement = () => {
    const { authState, refreshAccessToken } = useAuth();
    const [activeTab, setActiveTab] = useState('차량목록');

    const handleTabClick = (tab) => {
        setActiveTab(tab);
    };

    return (
        <div className="car-management">
            <div className="car-management-background">
            <div className="car-management-top">
                <p className="car-management-top-text">차량 관리</p>
            </div>

            <div className="car-management-a-box">
                <div className="car-management-b-box">
                    <div className="tab-menu">
                        <span
                            className={`tab ${activeTab === '차량목록' ? 'active' : ''}`}
                            onClick={() => handleTabClick('차량목록')}
                        >
                            차량목록
                        </span>
                        <span
                            className={`tab ${activeTab === '정비이력' ? 'active' : ''}`}
                            onClick={() => handleTabClick('정비이력')}
                        >
                            정비이력
                        </span>
                    </div>
                </div>

                {activeTab === '차량목록' && (
                    <VehicleList authState={authState} refreshAccessToken={refreshAccessToken} />
                )}

                {activeTab === '정비이력' && (
                    <MaintenanceHistory authState={authState} refreshAccessToken={refreshAccessToken} />
                )}
            </div>
            </div>
        </div>
    );
};

export default CarManagement;
