import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Modal, InputGroup, FormControl } from "react-bootstrap";
import { CardShare } from "components";
function ShareMessage({ show, setShow, message }) {
    const localTheme = useSelector((state) => state.LocalTheme.theme);
    const listMessage = useSelector((state) => state.ListMessage.listMessage);
    const keyU = useSelector((state) => state.UserInfo.user.uid);
    const [listMessageSort, setListMessageSort] = useState(listMessage);
    const MessageData = useSelector((state) => state.CurrentMessage.data);
    const sortTime = (a, b) => {
        if (a.timeUpdate && b.timeUpdate) {
            if (a.timeUpdate < b.timeUpdate) {
                return 1;
            } else if (a.timeUpdate > b.timeUpdate) {
                return -1;
            } else return 0;
        } else return 1;
    };
    useEffect(() => {
        var list = [...listMessage];
        list = list.filter((value) => value.messageId !== MessageData.key);
        list.sort(sortTime);
        setListMessageSort(list);
        return () => {};
    }, [MessageData.key, listMessage]);
    const [search, setSearch] = useState("");
    const handleChangeSearch = (e) => {
        setSearch(e.target.value);
    };
    return (
        <Modal
            show={show}
            centered
            onHide={() => {
                setShow(false);
                setSearch("");
            }}
            data-layout-mode={localTheme}
        >
            <Modal.Header closeButton className="modal__bg-fix">
                <h5>Share Message</h5>
            </Modal.Header>
            <Modal.Body className="modal__bg-fix">
                <InputGroup className="mb-4 rounded-3">
                    <InputGroup.Text
                        className="bg-light ps-3 pe-1 text-muted-bg border-0"
                        id="basic-addon1"
                    >
                        <i
                            className="bi bi-search cur-pointer"
                            style={{ lineHeight: 2 }}
                        ></i>
                    </InputGroup.Text>
                    <FormControl
                        onChange={handleChangeSearch}
                        className="bg-light border-0 seach__text-color"
                        placeholder="Search message..."
                        aria-label="Search message..."
                        aria-describedby="basic-addon1"
                        value={search}
                    />
                </InputGroup>
                <h6>List message</h6>
                {listMessageSort &&
                    listMessageSort.length > 0 &&
                    listMessageSort.map((value, index) => (
                        <CardShare
                            uid={keyU}
                            filter={search}
                            key={index}
                            keyM={value.messageId}
                            message={message}
                        />
                    ))}
            </Modal.Body>
        </Modal>
    );
}

export default React.memo(ShareMessage);
