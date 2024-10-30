import React, {useCallback, useEffect, useState} from 'react';

const { Tmapv2 } = window;

function UseMap({ onClose, coord }) {

    //const [currentMarker, setCurrentMarker] = useState(null);
    //const [mapInstance, setMapInstance] = useState(null);
    //let markers = [];

    // 평균 좌표 계산 함수
    const calculateAverageCoordinate = (coords) => {
        const total = coords.reduce(
            (acc, { longitude, latitude }) => {
                acc.longitude += longitude;
                acc.latitude += latitude;
                return acc;
            },
            { longitude: 0, latitude: 0 }
        );

        const count = coords.length;
        return {
            longitude: total.longitude / count,
            latitude: total.latitude / count,
        };
    };
    const initTmap = () => {
        const mapDiv = document.getElementById('map_div');
        if (!mapDiv.firstChild) {
            //console.log("맵 객체 초기화 진행");
            const avgCoord = calculateAverageCoordinate(coord);
            //console.log(avgCoord)
            const map = new Tmapv2.Map("map_div", {
                center: new Tmapv2.LatLng(avgCoord.latitude, avgCoord.longitude),
                //center: new Tmapv2.LatLng(coord[1].latitude, coord[1].longitude),
                width: "100%",
                height: "550px",
                zoom: 15,
            });
            //setMapInstance(map);
            // 지도 객체 생성 후 마커를 등록하는 함수를 수행합니다.
            addMarkersTooMuch(map, coord);

            // const marker = new Tmapv2.Marker({
            //     position: new Tmapv2.LatLng(avgCoord.latitude, avgCoord.longitude), //Marker의 중심좌표 설정.
            //     map: map
            // });
        }
        // else {
        //     console.log("초기화 필요없음")
        // }
    };

    // 100개의 마커를 추가하는 함수입니다.
    const addMarkersTooMuch = (mapInst, coord) => {
        //removeMarkers(coord);
        for (let i = 0; i < coord.length; i++) {
            //console.log(i)
            const marker = new Tmapv2.Marker({
                position: new Tmapv2.LatLng(coord[i].latitude, coord[i].longitude), //Marker의 중심좌표 설정.
                map: mapInst
            });
        }
    }

    // 모든 마커를 제거하는 함수입니다.
    const removeMarkers = (coord) => {
        // for (let i = 0; i < coord.length; i++) {
        //     markers[i].set(null);
        // }
        //markers = [];
    }


    useEffect(() => {
        initTmap();
    }, []);

    return (
        <div className="map-container" id="map-container">
            <button onClick={onClose} className="close-button">
                닫기
            </button>
            <div id='map_div' style={{width: '100%', height: '100%'}}/>
        </div>
    );
}

export default UseMap;
