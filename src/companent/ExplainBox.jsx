import React, { useRef, useEffect } from "react";
import classes from "./ExplainBox.module.css";

function ExplainBox({ marker, onCloseExplainBox }) {
    const imageRef = useRef(null);

    useEffect(() => {
        const resizeImage = () => {
            const image = imageRef.current;
            const container = image.parentNode;
            const containerWidth = container.offsetWidth;
            const containerHeight = container.offsetHeight;
            const imageRatio = image.naturalWidth / image.naturalHeight;

            if (containerWidth / containerHeight > imageRatio) {
                image.style.width = "100%";
                image.style.height = "auto";
            } else {
                image.style.width = "auto";
                image.style.height = "100%";
            }
        };

        window.addEventListener("resize", resizeImage);
        resizeImage();

        return () => {
            window.removeEventListener("resize", resizeImage);
        };
    }, []);


    return (
        <div className={classes.container}>
            <div className={classes.form}>
                    <img ref={imageRef} src={marker.imageUrl} alt="Cat Image" className={classes.image}/>
                <div className={classes.form2}>
                    <p><label>Upload Time: {marker.uploadTime}</label></p>
                    <textarea>{marker.description}</textarea>
                </div>
            </div>

        </div>

    );
}

export default ExplainBox;
