import React from "react";
import { FormControl,
        OverlayTrigger,
        Tooltip,
    Col,Row } from "react-bootstrap";
import InputGroup from "react-bootstrap/InputGroup";
import "./seach.css";

const handleOpenZoom = async (url, windowName) => {
    url = `https://lp-zoom.vercel.app`;

    windowName = window.location.hostname;
    var ratio = 0.75;
    var height = window.innerHeight * ratio;
    var width = window.innerWidth * ratio;
    var config = `directories=no,titlebar=no,toolbar=no,location=no,status=no,menubar=no,scrollbars=no,resizable=no,height=${height},width=${width}`;
    var newwindow=window.open(url,windowName,config);
    if (window.focus) {newwindow.focus()}
    return false;
}
function Search({ setFilter, filter }) {
    const handleChange = (e) => {
        var text = String(e.target.value);
        setFilter(text);
    };
    return (
        <div className="pt-4 px-3">
            
           
           <Row>
                <Col>
                    <h4 className="mb-4">Chats</h4>
                </Col>
                <Col>
                    <OverlayTrigger
                        placement="bottom"
                        overlay={<Tooltip>Create Meeting</Tooltip>}
                    >
                        <i
                            className="bi bi-camera-video-fill fz-20 float-end me-2 cur-pointer"
                            onClick={handleOpenZoom}
                        ></i>
                    </OverlayTrigger>
                </Col>
            </Row>
            <InputGroup className="mb-3 rounded-3">
                <InputGroup.Text
                    className="bg-light ps-3 pe-1 text-muted-bg border-0"
                    id="basic-addon1"
                >
                    <i className="bi bi-search" style={{ lineHeight: 2 }}></i>
                </InputGroup.Text>
                <FormControl
                    className="bg-light border-0 seach__text-color"
                    placeholder="Search messages or users"
                    aria-label="Search messages or users"
                    aria-describedby="basic-addon1"
                    value={filter}
                    onChange={handleChange}
                />
            </InputGroup>
        </div>
    );
}

export default Search;
