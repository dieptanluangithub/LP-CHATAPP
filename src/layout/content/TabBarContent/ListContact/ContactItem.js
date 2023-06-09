import React from "react";
import { Avatar } from "components";
import { Dropdown, Col } from "react-bootstrap";
import { deleteFriend } from "configs/firebase/ServiceFirebase/ServiceDelete";
import { GetCurrentMessage } from "configs/redux/Slice/CurrentMessageSlide";
import { useSelector, useDispatch } from "react-redux";
import { show } from "configs/redux/Slice/ShowMessageSlice";
import { getMessageByFriendUid } from "configs/firebase/ServiceFirebase/ServiceFind";

function ContactItem(props) {
    const { friend, keyId, filter } = props;
    const currentUser = useSelector((state) => state.UserInfo.user);
    const dispatch = useDispatch();

    const check = (value) => {
        var tmp = String(value).trim().toUpperCase();
        var tmp2 = String(filter).trim().toUpperCase();
        if (tmp.indexOf(tmp2) !== -1) return true;
        return false;
    };
    const handleDropdown = (e) => {
        e.stopPropagation();
    };
    const handleShow = async () => {
        var key = await getMessageByFriendUid(friend.uid, currentUser.uid);

        dispatch(
            GetCurrentMessage({
                key: key,
                typeMessage: 1,
                friend: { ...friend, key: keyId },
                keyUid: currentUser.key,
            })
        );
        dispatch(show());
    };
    const handleDelete = async () => {
        await deleteFriend(friend.uid, currentUser.uid);
    };
    if (friend && check(friend.displayName))
        return (
            <div
                className="p-2 d-flex cur-pointer listChatContent__child"
                onClick={handleShow}
            >
                <Col lg={2} xs={2} className="align-self-center">
                    <Avatar
                        width="70%"
                        url={(friend?.photoURL && friend.photoURL) || null}
                    />
                </Col>
                <Col lg={8} xs={8} className="align-self-center flex-grow-1">
                    <h5 className="fz-15 text-truncate">
                        {friend.displayName}
                    </h5>
                </Col>
                <Col lg="auto" xs="auto" className="align-self-center">
                    <Dropdown onClick={handleDropdown}>
                        <Dropdown.Toggle
                            as="div"
                            bsPrefix="listContact__dropdownToggle"
                        >
                            <i className="bi bi-three-dots-vertical"></i>
                        </Dropdown.Toggle>
                        <Dropdown.Menu align="end" className="text-muted">
                            <Dropdown.Item
                                className="listContact__dropdownItem"
                                onClick={handleDelete}
                            >
                                Remove
                                <i className="bi bi-trash3-fill float-end text-muted"></i>
                            </Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>
                </Col>
            </div>
        );
    else return <></>;
}

export default React.memo(ContactItem);
