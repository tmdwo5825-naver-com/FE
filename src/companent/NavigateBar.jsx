import React from "react";
import classes from "./NavigateBar.module.css";
import { useNavigate } from "react-router-dom";
import Modal from "./Modal";
import UploadBox from "./UploadBox";
import {ToastContainer} from "react-toastify";

function NavigateBar({ position }) {
    const navigate = useNavigate();

    const to24 = () => {
        navigate("/24hours");
    };

    const to3 = () => {
        navigate("/3hours");
    };

    //Overlay on/off 구현
    const [isOverlayOpen, setIsOverlayOpen] = React.useState(false);

    const handleButtonClick = () => {
        setIsOverlayOpen(true);
        console.log(position);
    };

    const handleOverlayClose = () => {
        setIsOverlayOpen(false);
    };

    return (
        <div className={classes.bottomBar}>
            <ToastContainer />
            <button className={classes.bottomButton} onClick={to3}>
                <img  src="/3hour.png" style={{ width: "35px", height: "auto" }} />
                <div>3시간</div>
            </button>
            <button className={classes.bottomButton} onClick={handleButtonClick}>
                <span className="material-icons">add</span>
                <div>사진 추가</div>
            </button>
            {isOverlayOpen && (
                <Modal onClose={handleOverlayClose}>
                    <UploadBox onSubmitSuccess={handleOverlayClose} markerPosition={position}/>
                </Modal>
            )}
            <button className={classes.bottomButton} onClick={to24}>
                <img  src="/24hour.png" style={{ width: "40px", height: "auto" }} />
                <div>24시간</div>
            </button>
        </div>
    );
}

export default NavigateBar;
