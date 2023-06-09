import React, { useState, useEffect } from "react";
import {
    Row,
    Col,
    InputGroup,
    FormControl,
    OverlayTrigger,
    Tooltip,
    Modal,
    Badge,
} from "react-bootstrap";
import { CardInvite, CardAccept } from "components";
import { useSelector } from "react-redux";
import { validateUTF8Name } from "configs/Validate";
import { findFriendToInvite } from "configs/firebase/ServiceFirebase/ServiceFind";
import ContactItem from "./ContactItem";
import "./listContact.css";

function ListContact() {
    const localTheme = useSelector((state) => state.LocalTheme.theme);
    const currentUser = useSelector((state) => state.UserInfo.user);
    const listFriendWait = useSelector((state) => state.ListFriendWait);
    const listFriend = useSelector((state) => state.AllFriend.listFriend);

    const [listFriendInfo, setListFriendInfo] = useState(listFriend);
    const [show, setShow] = useState(false);
    const [showRequset, setShowRequset] = useState(false);
    const [searchInvite, setSearchInvite] = useState("");
    const [listToInvite, setListToInvite] = useState([]);
    const [filter, setFilter] = useState("");
    const [filterWait, setFilterWait] = useState("");
    const handleChange = (e) => {
        var text = String(e.target.value);
        setFilter(text);
    };

    const handleChangeWait = (e) => {
        var text = String(e.target.value);
        setFilterWait(text);
    };
    const sortName = (a, b) => {
        if (a.val.displayName < b.val.displayName) {
            return -1;
        }
        if (a.val.displayName > b.val.displayName) {
            return 1;
        }
        return 0;
    };

    useEffect(() => {
        setListFriendInfo([...listFriend]);
        return () => {};
    }, [listFriend]);

    const handleChangeSearchInvite = (e) => {
        setSearchInvite(e.target.value);
    };

    useEffect(() => {
        const GetResult = async () => {
            if (searchInvite && validateUTF8Name(searchInvite)) {
                const result = await findFriendToInvite(
                    searchInvite,
                    currentUser.uid
                );
                setListToInvite(result);
            } else {
                setListToInvite([]);
            }
        };
        GetResult();
    }, [currentUser.uid, searchInvite]);

    return (
        <div className="pt-4 px-3 ListContact__Parent">
            <Row>
                <Col>
                    <h4 className="mb-4">Contacts</h4>
                </Col>
                <Col>
                    {/* Show add contact */}
                    <Modal
                        show={show}
                        centered
                        onHide={() => {
                            setShow(false);
                            setSearchInvite("");
                        }}
                        data-layout-mode={localTheme}
                    >
                        <Modal.Header closeButton className="modal__bg-fix">
                            <h5>Add contact</h5>
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
                                    onChange={handleChangeSearchInvite}
                                    className="bg-light border-0 seach__text-color"
                                    placeholder="Search users..."
                                    aria-label="Search users..."
                                    aria-describedby="basic-addon1"
                                    value={searchInvite}
                                />
                            </InputGroup>
                            <h6>List contact</h6>
                            {listToInvite.map((value) => (
                                <CardInvite
                                    key={value.key}
                                    keyId={value.key}
                                    value={value.val}
                                />
                            ))}
                        </Modal.Body>
                    </Modal>
                    <OverlayTrigger
                        placement="bottom"
                        overlay={<Tooltip>Add Contact</Tooltip>}
                    >
                        <i
                            className="bi bi-person-plus-fill fz-20 float-end me-2 cur-pointer"
                            onClick={() => setShow(true)}
                        ></i>
                    </OverlayTrigger>
                </Col>
            </Row>
            <InputGroup className="mb-4 rounded-3">
                <InputGroup.Text
                    className="bg-light ps-3 pe-1 text-muted-bg border-0"
                    id="basic-addon1"
                >
                    <i className="bi bi-search cur-pointer lh-2"></i>
                </InputGroup.Text>
                <FormControl
                    className="bg-light border-0 seach__text-color"
                    placeholder="Search users..."
                    aria-label="Search users..."
                    aria-describedby="basic-addon1"
                    value={filter}
                    onChange={handleChange}
                />
            </InputGroup>
            {/* Show friend invite */}
            <Modal
                show={showRequset}
                centered
                onHide={() => {
                    setShowRequset(false);
                    setFilterWait("");
                }}
                data-layout-mode={localTheme}
            >
                <Modal.Header closeButton className="modal__bg-fix">
                    <h5>Friend Request</h5>
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
                            className="bg-light border-0 seach__text-color"
                            placeholder="Search users..."
                            aria-label="Search users..."
                            aria-describedby="basic-addon1"
                            value={filterWait}
                            onChange={handleChangeWait}
                        />
                    </InputGroup>
                    <h6>List request</h6>
                    {listFriendWait.listUser &&
                        listFriendWait.listUser.map((value) => (
                            <CardAccept
                                filter={filterWait}
                                friendWait={value.val}
                                key={value.key}
                            />
                        ))}
                </Modal.Body>
            </Modal>
            <h6
                className="friend_request_parent"
                onClick={() => setShowRequset(true)}
            >
                <div className="friend_request_parent-image">
                    <i className="bi bi-envelope-plus-fill"></i>
                </div>
                <div className="friend_request_parent-text">Friend Request</div>
                <div className="friend_request_parent-length">
                    <Badge
                        className="friend_request_parent-lengthContent"
                        bg="danger"
                    >
                        {(listFriendWait &&
                            listFriendWait?.listUser &&
                            listFriendWait.listUser.length) ||
                            0}
                    </Badge>
                </div>
            </h6>

            <div className="ListContact__Child">
                <div className="ListContact__NodeChild fix_scroll">
                    {listFriendInfo &&
                        listFriendInfo.length > 0 &&
                        listFriendInfo.sort(sortName) &&
                        listFriendInfo.map((value, index) => (
                            <ContactItem
                                filter={filter}
                                key={index}
                                friend={value.val}
                                keyId={value.key}
                            />
                        ))}
                </div>
            </div>
        </div>
    );
}

export default React.memo(ListContact);
