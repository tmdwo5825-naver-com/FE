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
    const [marker2Position, setMarker2] = useState({
        lat: 36.628113354779614,
        lng: 127.45698538088607,
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
            const response = await fetch("http://cbnu-cat-mom.koreacentral.cloudapp.azure.com/3hours", { mode: "cors" }); // FastAPI의 엔드포인트를 입력해야 합니다.
            const fetchedData = await response.json();
            console.log("Fetched data:", fetchedData);
            return fetchedData.data;
        }

        async function createMarker(item) {
            const position = new kakao.maps.LatLng(item.y, item.x);
            const markerImageUrl = await convertImageToCircle(item.image_url);

            const markerImage = new kakao.maps.MarkerImage(markerImageUrl, new kakao.maps.Size(60, 60), {
                offset: new kakao.maps.Point(30, 30),
            });

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
            position: markerPosition,
        });

        marker2.setMap(map);
        marker2.setDraggable(true);
        marker2.setZIndex(99999);

        kakao.maps.event.addListener(marker2, "dragend", function () {
            var newPosition = marker2.getPosition();
            marker2.setZIndex(3);

            setMarker2({
                lat: newPosition.getLat(),
                lng: newPosition.getLng(),
            });
            console.log(newPosition);
            console.log(marker2Position);
        });

        async function fetchCountData() {
            try {
                const response = await fetch("http://cbnu-cat-mom.koreacentral.cloudapp.azure.com/count", { mode: "cors" });
                const fetchedData = await response.json();
                const newData = fetchedData["data2"].map((item) => {
                    return { id: item.id, count: item.count };
                });
                setcountData(newData);
            } catch (err) {}
        }

        if (fetchCount < 1) {
            fetchCountData();
            setFetchCount(fetchCount + 1);
        }

        const circles = [
            { lat: 36.62819021028072, lng: 127.45361612914417, strokeColor: "orange", fillColor: "orange", radius: 200, countLat: 36.62983005033518, countLon: 127.45367325655802, name: "양성재 출몰횟수" },
            { lat: 36.63094320061501, lng: 127.45714296470376, strokeColor: "red", fillColor: "red", radius: 90, countLat: 36.631679814841675, countLon: 127.4571584963843, name: "N14 출몰횟수" },
            { lat: 36.629052242081166, lng: 127.4567740263603, strokeColor: "blue", fillColor: "blue", radius: 100, countLat: 36.62986317675151, countLon: 127.45679558279242, name: "솔못 출몰횟수" },
            { lat: 36.625140843044164, lng: 127.45807574430857, strokeColor: "green", fillColor: "green", radius: 150, countLat: 36.62645870618996, countLon: 127.45808633792647, name: "양진재 출몰횟수" }
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
            var moveLatLon = new kakao.maps.LatLng(36.628113354779614, 127.45698538088607);
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
    }, [countData, renderCount, fetchCount]);

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
            <div id="kakao-map" className={classes.map}></div>
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
