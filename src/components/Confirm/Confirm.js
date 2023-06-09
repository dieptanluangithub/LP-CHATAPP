import React from "react";
import { Modal, Button } from "react-bootstrap";
import { useSelector } from "react-redux";

function Confirm({ show, handleDeny, handleAccept, setShow, title, text }) {
    const localTheme = useSelector((state) => state.LocalTheme.theme);

    const accept = () => {
        handleAccept();
        setShow(false);
    };
    const deny = () => {
        handleDeny();
    };
    return (
        <Modal show={show} centered data-layout-mode={localTheme} onHide={deny}>
            <Modal.Header closeButton className="confirm__header modal__bg-fix">
                <Modal.Title>{title}</Modal.Title>
            </Modal.Header>
            <Modal.Body className="confirm__body modal__bg-fix">
                <p>{text}</p>
            </Modal.Body>
            <Modal.Footer className="confirm__footer modal__bg-fix">
                <Button variant="secondary" onClick={deny} bsPrefix="btn_color">
                    No
                </Button>
                <Button variant="primary" onClick={accept} bsPrefix="btn_color">
                    Yes
                </Button>
            </Modal.Footer>
        </Modal>
    );
}

export default Confirm;
