import React, { useState } from "react";
import classes from "./UploadBox.module.css";
import Geolocation from "./GeoLocation";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import ImageResizer from "react-image-file-resizer";

function UploadBox({ onSubmitSuccess }) {
    const [enteredText, setEnteredText] = useState("");
    const [position, setPosition] = useState(null);

    function changeTextHandler(event) {
        setEnteredText(event.target.value);
    }

    function handleGeolocationSuccess(pos) {
        setPosition(pos);
    }

    function handleSubmit(event) {
        event.preventDefault();
        const file = event.target["image"].files[0];

        if (file && file.name.endsWith(".heic")) {
            convertImage(file, (convertedFile) => {
                uploadImage(convertedFile);
            });
        } else {
            uploadImage(file);
        }
    }

    function convertImage(file, callback) {
        const MAX_WIDTH = 3000; // 최대 가로 크기 설정
        const MAX_HEIGHT = 3000; // 최대 세로 크기 설정
        const quality = 100; // 이미지 품질 설정 (0~100)

        const img = new Image();
        img.src = URL.createObjectURL(file);

        img.onload = function () {
            let width = img.width;
            let height = img.height;

            if (width > MAX_WIDTH || height > MAX_HEIGHT) {
                const ratio = Math.min(MAX_WIDTH / width, MAX_HEIGHT / height);
                width = Math.round(width * ratio);
                height = Math.round(height * ratio);
            }

            ImageResizer.imageFileResizer(
                file,
                width,
                height,
                "JPEG",
                quality,
                0,
                (outputFile) => {
                    callback(outputFile);
                },
                "blob"
            );
        };
    }

    function uploadImage(file) {
        const formData = new FormData();
        formData.append("comment", enteredText);

        if (file instanceof Blob) {
            formData.append("image", file, "image.jpg");
        } else {
            formData.append("image", file);
        }

        if (position) {
            formData.append("lat", position.coords.latitude);
            formData.append("lon", position.coords.longitude);
        }

        axios
            .post("http://127.0.0.1:8000/content-create", formData)
            .then((response) => {
                if (response.data.status_code === 201) {
                    toast.success("파일 업로드가 성공적으로 되었습니다!");
                } else {
                    toast.error("파일이 업로드되지 않았습니다.");
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
                <Geolocation onSuccess={handleGeolocationSuccess} />
                <p>
                    <label htmlFor="name">Upload Cat Image</label>
                    <input type="file" name="image" accept=".jpg,.jpeg,.heic,.png" />
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
