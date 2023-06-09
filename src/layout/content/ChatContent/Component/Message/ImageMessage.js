import React, { useState } from "react";
import { Modal, Image } from "react-bootstrap";
import axios from "axios";

function ImageMessage({ list }) {
    const WIDTH = 100 / Math.ceil(Math.sqrt(list.length));
    const [show, setShow] = useState(false);
    const [url, setUrl] = useState("");
    const downloadDriect = () => {
        axios({
            url: url,
            method: "GET",
            responseType: "blob", // important
        })
            .then((response) => {
                const url = window.URL.createObjectURL(
                    new Blob([response.data])
                );
                const link = document.createElement("a");
                link.href = url;
                link.setAttribute("download", new Date().getTime() + ".png");
                link.style.display = "none";
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            })
            .catch((e) => console.log(e));
    };
    const handleShowImage = (url) => {
        setUrl(url);
        setShow(true);
    };
    const handleHideImage = () => {
        setUrl("");
        setShow(false);
    };
    return (
        <div className="childMessage__listImg">
            {list.map((value, index) => {
                if (value.indexOf("image") !== -1) {
                    return (
                        <img
                            onClick={() => handleShowImage(value)}
                            className="messageImage__fit"
                            key={index}
                            src={value}
                            alt=""
                            width={`${WIDTH}%`}
                            height={`${WIDTH}%`}
                        />
                    );
                } else {
                    return (
                        <video
                            controls
                            key={index}
                            src={value}
                            alt=""
                            width={`${WIDTH}%`}
                            height={`${WIDTH}%`}
                        />
                    );
                }
            })}
            <Modal
                size="lg"
                centered
                show={show}
                onHide={() => setShow(false)}
                className="ImageMessage__modal-body"
            >
                <Modal.Header className="ImageMessage__modal-header">
                    <div className="flex-grow-1">
                        <i
                            className="bi bi-arrow-down-square ImageMessage__modalbtn-download"
                            onClick={downloadDriect}
                        ></i>
                    </div>
                    <i
                        className="bi bi-x-lg ImageMessage__modalbtn-cancel"
                        onClick={handleHideImage}
                    ></i>
                </Modal.Header>
                <Image src={url} />
            </Modal>
        </div>
    );
}

export default ImageMessage;
