//npm install axios, npm install react-toastify

import React, { useState } from "react";
import classes from "./UploadBox.module.css";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";

function UploadBox({ onSubmitSuccess, markerPosition }) {
    const [enteredText, setEnteredText] = useState("");
    function changeTextHandler(event) {
        setEnteredText(event.target.value);
    }


    function handleSubmit(event) {
        event.preventDefault();
        const formdata = new FormData();

        const currentDate = new Date();
        const month = String(currentDate.getMonth() + 1).padStart(2, "0");
        const day = String(currentDate.getDate()).padStart(2, "0");
        const hours = String(currentDate.getHours()).padStart(2, "0");
        const minutes = String(currentDate.getMinutes()).padStart(2, "0");



        formdata.append("month", month);
        formdata.append("day", day);
        formdata.append("hour", hours);
        formdata.append("min", minutes);
        formdata.append("comment", enteredText);
        formdata.append("image", event.target["image"].files[0], "20vt87.jpg");
        if (markerPosition) {
            formdata.append("lat", markerPosition.lng);
            formdata.append("lon", markerPosition.lat);
        }
        console.log("SSol data:");
        formdata.forEach((value, key) => {
            console.log(key + ": " + value);
        });

        axios
            .post("http://cbnu-cat-mom.koreacentral.cloudapp.azure.com/content-create", formdata)
            .then((response) => {
                if (response.data.status_code === 201) {
                    toast.success("업로드 성공! 새로고침을 해주세요!");
                } else {
                    toast.error("파일이 업로드가 되지 않았습니다.");
                }
            })
            .catch((error) => {
                console.log("error", error);
            })
            .finally(() => {
                onSubmitSuccess();
            });
    }

    const buttonStyle = {
        position: "absolute",
        top: "77%",
        width: "40px",
        height: "40px",
        border: "none",
        backgroundColor: "transparent",
        fontSize: "30px",
        lineHeight: "1",
        textAlign: "center",
        cursor: "pointer",
        marginLeft : "38%"
    };

    return (
        <>
            <form className={classes.form} onSubmit={handleSubmit}>
                <p>
                    <label htmlFor="name">Upload Cat Image</label>
                    <input type="file" name="image" accept=".jpg,.jpeg,.png"/>
                </p>
                <p>
                    <label htmlFor="name">This Cat Is</label>
                    <input
                        type="text"
                        id="body"
                        required
                        rows="1"
                        placeholder="Explain your Cat"
                        onChange={changeTextHandler}
                    />
                </p>
                <button type="submit" className="image-button" style={buttonStyle}>
                    <img  src="/pet_button1.png" style={{ width: "100%", height: "auto" }} />
                </button>
            </form>
        </>
    );
}

export default UploadBox;

