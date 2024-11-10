import React, { useState } from 'react';
import '../CSS/CarManagement.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useAuth } from "../Component/AuthContext";
import VehicleList from "./VehicleList";
import MaintenanceHistory from "./MaintenanceHistory";

const TABS = {
    VEHICLE_LIST: '차량목록',
    MAINTENANCE_HISTORY: '정비이력',
};

const CarManagement = () => {
    const { authState, refreshAccessToken } = useAuth();
    const [activeTab, setActiveTab] = useState(TABS.VEHICLE_LIST);

    const renderActiveTabContent = () => {
        switch (activeTab) {
            case TABS.VEHICLE_LIST:
                return <VehicleList authState={authState} refreshAccessToken={refreshAccessToken} />;
            case TABS.MAINTENANCE_HISTORY:
                return <MaintenanceHistory authState={authState} refreshAccessToken={refreshAccessToken} />;
            default:
                return null;
        }
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
                            {Object.values(TABS).map((tab) => (
                                <span
                                    key={tab}
                                    className={`tab ${activeTab === tab ? 'active' : ''}`}
                                    onClick={() => setActiveTab(tab)}
                                >
                                    {tab}
                                </span>
                            ))}
                        </div>
                    </div>
                    {renderActiveTabContent()}
                </div>
            </div>
        </div>
    );
};

export default CarManagement;
