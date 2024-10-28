import React, { useEffect, useRef, useState } from 'react';

const { Tmapv2 } = window;

const UseMap = ({ onClose , isOpen }) => {
    const mapRef = useRef(null); // 지도를 그릴 div에 대한 ref
    const [map, setMap] = useState(null); // Tmap 인스턴스 저장
    const initTmap = () => {
        if (mapRef.current && !map) {
            console.log("맵 객체 초기화 진행");
            const mapInstance = new Tmapv2.Map(mapRef.current, {
                center: new Tmapv2.LatLng(37.566481622437934, 126.98502302169841),
                width: "100%",
                height: "400px",
                zoom: 15,
            });
            setMap(mapInstance);
        }
    };

    useEffect(() => {
        if (isOpen) {
            initTmap();  // 모달이 열릴 때만 초기화
        } else if (map) {
            console.log("맵 객체 해제");
            mapRef.current.destroy();  // 기존 맵 인스턴스 해제
            mapRef.current = null;
            setMap(null);
        }
    }, [isOpen]);

    return (
        <div className="map-container" id="map-container">
            <div ref={mapRef} style={{ width: '80%', height: '400px' }} />
            <button onClick={onClose} className="close-button">
                닫기
            </button>
        </div>
    );
};

export default UseMap;