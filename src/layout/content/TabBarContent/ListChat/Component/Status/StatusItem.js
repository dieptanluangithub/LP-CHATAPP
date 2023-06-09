import React from "react";
import { Col } from "react-bootstrap";
import Avatar from "components/Avatar";
import useIsOnline from "configs/customHook/useIsOnline";
import { show } from "configs/redux/Slice/ShowMessageSlice";
import { GetCurrentMessage } from "configs/redux/Slice/CurrentMessageSlide";
import { useDispatch, useSelector } from "react-redux";
import { getMessageByFriendUid } from "configs/firebase/ServiceFirebase/ServiceFind";

function StatusItem(props) {
    const currentUser = useSelector((state) => state.UserInfo.user);
    const { keyId, friend } = props;
    const [isOnline] = useIsOnline(keyId);
    const dispatch = useDispatch();
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
    if (friend)
        return (
            <Col
                className="text-center"
                style={{
                    textAlign: "center",
                }}
                onClick={handleShow}
            >
                <Avatar
                    width="3.3rem"
                    url={friend?.photoURL && friend.photoURL}
                    status={isOnline}
                />
                <h5
                    style={{ fontSize: 13 }}
                    className="mb-1 mt-2 text-truncate"
                >
                    {friend.displayName}
                </h5>
            </Col>
        );
    else return <></>;
}

export default StatusItem;
