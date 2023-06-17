import React, { useState, useEffect } from "react";
import ExplainBox from "./ExplainBox";
import ClearModal from "./ClearModal";
import NavigateBar from "./NavigateBar";
import { convertImageToCircle } from "./CircleImage";
import Map from "./Map";
import classes from "./Map.module.css";
import Modal from "./Modal";
import InfoBox from "./InfoBox";

/* global kakao */

function Map2() {
    const [selectedMarker, setSelectedMarker] = useState(null);
    const [IsOverlayOpen, SetIsOverlayOpen] = useState(false);
    const [marker2Position, setMarker2] = useState({
        lat: 127.45698538088607,
        lng: 36.628113354779614,
    });

    const handleMarkerClick = (markerData) => {
        setSelectedMarker(markerData);
    };

    const closeExplainBox = () => {
        setSelectedMarker(null);
    };

    const handleButtonInfoClick = () => {
        SetIsOverlayOpen(true);
    };

    const handleOverlayClose = () => {
        SetIsOverlayOpen(false);
    };

    useEffect(() => {
        const container = document.getElementById("kakao-map");

        const options = {
            center: new kakao.maps.LatLng(36.628113354779614, 127.45698538088607),
            // draggable: false,// 맵 드래그 불가
            level: 4,
        };

        const map = new kakao.maps.Map(container, options);
        map.setMaxLevel(4);
        map.setMinLevel(2);

        // 서버에서 JSON 데이터를 가져올 함수
        async function fetchData() {
            const response = await fetch("http://cbnu-cat-mom.koreacentral.cloudapp.azure.com/today", {
                method: "GET",
                mode: "cors", // CORS 모드 설정
            });
            const fetchedData = await response.json();
            console.log("Fetched data:", fetchedData);
            return fetchedData.data; // JSON 객체 배열을 반환하도록 수정
        }

        // 어떤 작업을 할 때마다 마커를 추가
        async function createMarker(item) {
            const position = new kakao.maps.LatLng(item.y, item.x);
            const markerImageUrl = await convertImageToCircle(item.image_url);

            const markerImage = new kakao.maps.MarkerImage(
                markerImageUrl,
                new kakao.maps.Size(60, 60),
                { offset: new kakao.maps.Point(30, 30) }
            );

            const marker = new kakao.maps.Marker({
                position: position,
                image: markerImage,
            });
            marker.setMap(map);

            kakao.maps.event.addListener(marker, "click", () => {
                handleMarkerClick(item);
            });
        }

        fetchData().then((fetchedData) => {
            // 서버에서 가져온 데이터로 마커 생성
            fetchedData.forEach((item) => {
                createMarker(item);
            });
        });

        var markerPosition = new kakao.maps.LatLng(36.628113354779614, 127.45698588607);
        var marker2 = new kakao.maps.Marker({
            position: markerPosition,
        });

        marker2.setMap(map);
        marker2.setDraggable(true);
        marker2.setZIndex(99999);

        // marker2의 위치 변경 이벤트에 대한 핸들러를 추가.
        kakao.maps.event.addListener(marker2, "dragend", function () {
            // marker2의 변경된 위치를 가져옵니다.
            var newPosition = marker2.getPosition();

            // 상태 변수에 위치를 저장합니다.
            setMarker2({
                lat: newPosition.La,
                lng: newPosition.Ma,
            });
            console.log(newPosition);
            console.log(marker2Position); // 수정된 부분
        });

        function panTo() {
            // 이동할 위도 경도 위치를 생성합니다
            var moveLatLon = new kakao.maps.LatLng(36.628113354779614, 127.45698538088607);

            // 지도 중심을 부드럽게 이동시킵니다
            // 만약 이동할 거리가 지도 화면보다 크면 부드러운 효과 없이 이동합니다
            map.panTo(moveLatLon);
        }

        const button = document.createElement("button");
        button.addEventListener("click", panTo);
        button.className = classes.panToButton;
        const icon = document.createElement("i");
        icon.className = "material-icons";
        icon.innerHTML = "my_location";
        button.appendChild(icon);
        container.appendChild(button);

        return () => {
            kakao.maps.event.removeListener(map, "dragend");
        };
    }, []);

    return (
        <>
            <button className={classes.infoButton} onClick={handleButtonInfoClick}>
                <span className="material-icons">help</span>
            </button>
            {IsOverlayOpen && (
                <Modal onClose={handleOverlayClose}>
                    <InfoBox />
                </Modal>
            )}
            <Map onMarkerClick={handleMarkerClick} />
            <NavigateBar position={marker2Position} />
            {selectedMarker && (
                <ClearModal onCloseExplainBox={closeExplainBox}>
                    <ExplainBox marker={selectedMarker} />
                </ClearModal>
            )}
        </>
    );
}

export default Map2;