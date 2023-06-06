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

function Map3Hour() {
    const [selectedMarker, setSelectedMarker] = useState(null);
    const [countData, setcountData] = useState([]);
    const [IsOverlayOpen, SetIsOverlayOpen] = useState(false);
    const [renderCount, setRenderCount] = useState(0);
    const [fetchCount, setFetchCount] = useState(0);
    const [marker2Position, setMarker2] = useState({ lat: 0, lng: 0 });

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
        if (renderCount >= 1) {
            return;
        }
        const container = document.getElementById("kakao-map");

        const options = {
            center: new kakao.maps.LatLng(36.628113354779614, 127.45698538088607),
            level: 4,
        };

        const map = new kakao.maps.Map(container, options);
        map.setMaxLevel(4);
        map.setMinLevel(2);

        async function fetchData() {
            const response = await fetch("http://cbnu-cat-mom.koreacentral.cloudapp.azure.com/3hours"); // FastAPI의 엔드포인트를 입력해야 합니다.
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
            fetchedData.forEach((item) => {
                createMarker(item);
            });
        });
        var markerPosition = new kakao.maps.LatLng(36.628113354779614, 127.45698588607);
        var marker2 = new kakao.maps.Marker({
            position: markerPosition
        });

        marker2.setMap(map);
        marker2.setDraggable(true);

        // marker2의 위치 변경 이벤트에 대한 핸들러를 추가.
        kakao.maps.event.addListener(marker2, 'dragend', function () {
            // marker2의 변경된 위치를 가져옵니다.
            var newPosition = marker2.getPosition();
            marker2.setZIndex(3);

            // 상태 변수에 위치를 저장합니다.
            setMarker2({
                lat: newPosition.La,
                lng: newPosition.Ma,
            });
            console.log(newPosition);
            console.log(marker2Position); // 수정된 부분
        });

        async function fetchCountData() {
            try {
                const response = await fetch("http://cbnu-cat-mom.koreacentral.cloudapp.azure.com/count");
                const fetchedData = await response.json(); // "data2" 대신 fetchedData 변수명 변경
                const newData = fetchedData["data2"].map(item => { // "data2"에 접근하여 변환
                    return { id: item.id, count: item.count };
                });
                setcountData(newData);
            } catch (err) {
            }
        }

        if (fetchCount < 1) {
            fetchCountData();
            setFetchCount(fetchCount + 1);
        }

        //캣타워 범위(원)
        const circles = [
            { lat: 36.62819021028072, lng: 127.45361612914417, strokeColor: "orange", fillColor: "orange", radius : 200, countLat: 36.62983005033518, countLon : 127.45367325655802 , name : "양성재 출몰횟수"},//양성재 좌측하단 36.62656935117971, 127.4515271608071  /우측상단 36.62981656325492, 127.45543688761717
            { lat: 36.63094320061501, lng: 127.45714296470376, strokeColor: "red",fillColor: "red", radius : 90,countLat: 36.631679814841675, countLon :127.4571584963843, name : "N14 출몰횟수"},//개성재 좌측하단 36.63013839671825, 127.45610960893917  /우측상단 36.631698348276466, 127.458198409401
            { lat: 36.629052242081166, lng: 127.4567740263603, strokeColor: "blue", fillColor: "blue", radius : 100, countLat:36.62986317675151, countLon :127.45679558279242, name : "솔못 출몰횟수"},//솔못 좌측하단 36.62842402748002, 127.45551254530146  /우측상단 36.62989716070364, 127.45791941588986
            { lat: 36.625140843044164, lng: 127.45807574430857, strokeColor: "green", fillColor: "green", radius : 150, countLat:36.62645870618996, countLon :127.45808633792647, name : "양진재 출몰횟수"}//양진재  좌측하단 36.623792267078755, 127.45667591155414  /우측상단 36.62624935703808, 127.45979841801855
        ];
        circles.forEach((circleData, index) => {
            const circle = new kakao.maps.Circle({
                center: new kakao.maps.LatLng(circleData.lat, circleData.lng),
                radius: circleData.radius,
                strokeWeight: 2,
                strokeColor: circleData.strokeColor,
                strokeOpacity: 0.125,
                strokeStyle: "line",
                fillColor: circleData.fillColor,
                fillOpacity: 0.2,
            });
            circle.setMap(map);
            //카운트
            const count = countData[index];
            if (count) {
                const countMarker = new kakao.maps.CustomOverlay({
                    position: new kakao.maps.LatLng(circleData.countLat, circleData.countLon),
                    content: `<div class="${classes.countMarker}">${count.count} <br/> ${circleData.name}</div>`,
                    zIndex: 1,
                });
                countMarker.setMap(map);
            }
        });

        function panTo() {
            var moveLatLon = new kakao.maps.LatLng(
                36.628113354779614,
                127.45698538088607
            );
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

        if (renderCount >= 1) {
            return;
        }

        if (JSON.stringify(countData) === JSON.stringify([])) {
            setRenderCount(renderCount + 1);
        }



        setRenderCount(renderCount + 1);
    }, [countData, renderCount, fetchCount]);

    return (
        <>
            <button className={classes.infoButton} onClick={handleButtonInfoClick}>
                <span className="material-icons">help</span></button>
            {IsOverlayOpen && <Modal onClose={handleOverlayClose}><InfoBox /></Modal>}
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

export default Map3Hour;