import React from "react";
import { Avatar } from "components";
import { Col } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { show } from "configs/redux/Slice/ShowMessageSlice";
import { GetCurrentMessage } from "configs/redux/Slice/CurrentMessageSlide";
function GroupItem(props) {
    const { keyId, val, filter } = props;
    const dispatch = useDispatch();
    const currentUser = useSelector((state) => state.UserInfo.user);

    const check = (value) => {
        var tmp = String(value).trim().toUpperCase();
        var tmp2 = String(filter).trim().toUpperCase();
        if (tmp.indexOf(tmp2) !== -1) return true;
        return false;
    };
    const handleShow = () => {
        dispatch(
            GetCurrentMessage({
                key: keyId,
                typeMessage: 2,
                keyUid: currentUser.key,
            })
        );
        dispatch(show());
    };
    if (check(val.name))
        return (
            <div
                className="p-2 d-flex cur-pointer listChatContent__child"
                onClick={handleShow}
            >
                <Col lg={2} xs={2} className="align-self-center">
                    <Avatar width="80%" url={val.photoURL} />
                </Col>
                <Col lg={8} xs={8} className="align-self-center flex-grow-1">
                    <h5 className="fz-15 ps-2 text-truncate">{val.name}</h5>
                </Col>
            </div>
        );
    else return <></>;
}

export default React.memo(GroupItem);
// <Col lg="auto" xs="auto" className="align-self-center">
// <Badge className="float-end" pill bg="danger">
//     9+
// </Badge>
// </Col>
