import React, { useState } from "react";
import "./cardFile.css";
import { Modal, Image } from "react-bootstrap";
import axios from "axios";

function CardFile({ url }) {
    const [show, setShow] = useState(false);
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
    const handleShowImage = () => {
        setShow(true);
    };
    const handleHideImage = () => {
        setShow(false);
    };

    if (url.indexOf("image") !== -1)
        return (
            <>
                <img
                    src={url}
                    alt=""
                    className="cardFile__img"
                    onClick={handleShowImage}
                />
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
            </>
        );
    else return <video controls src={url} alt="" className="cardFile__video" />;
}

export default CardFile;
