//지도 사용 api
import { useEffect, useState } from 'react';


const { Tmapv2 } = window;

export const useMap = (mapRef: React.RefObject<HTMLDivElement>) => {
    //mapRef: React.RefObject<HTMLDivElement>
    // const [mapInstance, setMapInstance] = useState<TMap | null>(null);
    //
    // useEffect(() => {
    //     if (mapRef.current?.firstChild || mapInstance) {
    //         return;
    //     }
    //
    //     const map = new Tmapv2.Map('map', {
    //         zoom: DEFAULT_ZOOM_LEVEL,
    //         zoomControl: false,
    //         center: new Tmapv2.LatLng(INITIAL_LATITUDE, INITIAL_LONGITUDE),
    //     });
    //
    //     map.setZoomLimit(MIN_ZOOM_LEVEL, MAX_ZOOM_LEVEL);
    //     setMapInstance(map);
    // }, [mapRef, mapInstance]);
    const map = new window.Tmapv2.Map("map_div",
        {
            center: new Tmapv2.LatLng(37.566481622437934,126.98502302169841), // 지도 초기 좌표
            width: "890px",
            height: "400px",
            zoom: 15
        });
};