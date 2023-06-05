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
                    toast.success("파일 업로드가 성공적으로 되었습니다!");
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
        right: "47%",
        width: "40px",
        height: "40px",
        border: "none",
        backgroundColor: "transparent",
        fontSize: "30px",
        lineHeight: "1",
        textAlign: "center",
        cursor: "pointer",
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
                <button type="submit" className="material-icons" style={buttonStyle}>
                    pets
                </button>
            </form>
        </>
    );
}

export default UploadBox;
