import React, { useEffect, useState } from "react";
import { Avatar } from "components";
import { Col, Badge } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { show } from "configs/redux/Slice/ShowMessageSlice";
import useInfoMessage from "configs/customHook/useInfoMessage";
import { updateTime } from "configs/redux/Slice/ListMessageSlice";
import { GetCurrentMessage } from "configs/redux/Slice/CurrentMessageSlide";
import useIsOnline from "configs/customHook/useIsOnline";
import useSoundMessage from "configs/customHook/useSoundMessage";
import useSound from "use-sound";
import MessageSound from "sound/message.mp3";

function ListChatItem(props) {
    const { keyId, type, filter } = props;
    const currentUser = useSelector((state) => state.UserInfo.user);
    const dispatch = useDispatch();
    const [info] = useInfoMessage(keyId, currentUser.uid);
    const [IsOnline] = useIsOnline(info && info.friendKey);
    const [numNewMessage, setNumNewMessage] = useState(null);
    const [play] = useSound(MessageSound);
    const [isActive] = useSoundMessage(currentUser.key, keyId);
    const sound = useSelector((state) => state.Sound.sound);
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
                typeMessage: type,
                friend: info.friend,
                keyUid: currentUser.key,
            })
        );
        dispatch(show());
    };
    useEffect(() => {
        if (
            info &&
            info.NewMessage > 0 &&
            numNewMessage &&
            numNewMessage < info.NewMessage &&
            sound &&
            isActive
        )
            play();
        setNumNewMessage(info.NewMessage);
        dispatch(updateTime({ key: info.key, timeUpdate: info.timeUpdate }));
        return () => {};
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dispatch, info]);
    if (type === 1 && check(info.name))
        return (
            <div
                onClick={handleShow}
                className="p-2 d-flex cur-pointer listChatContent__child"
            >
                <Col lg={2} xs={2} className="align-self-center">
                    <Avatar width="85%" status={IsOnline} url={info.photoURL} />
                </Col>
                <Col lg={8} xs={8} className="align-self-center flex-grow-1">
                    <h5 className="fz-15 ps-2 text-truncate">{info.name}</h5>
                    <p className="fz-14 m-0 mt-1 ps-2 listChatContent__text-color text-truncate">
                        {info.LastMessage}
                    </p>
                </Col>
                <Col lg="auto" xs="auto" className="align-self-baseline">
                    <div className="fz-12 listChatContent__text-color">
                        {info.time}
                    </div>
                    {info.NewMessage > 0 && (
                        <Badge className="float-end mt-2" pill bg="danger">
                            {info.NewMessage}
                        </Badge>
                    )}
                </Col>
            </div>
        );
    else if (check(info.name))
        return (
            <div
                className="p-2 d-flex cur-pointer listChatContent__child"
                onClick={handleShow}
            >
                <Col lg={2} xs={2} className="align-self-center">
                    <Avatar
                        width="80%"
                        status={info.isOnline}
                        url={info.photoURL}
                    />
                </Col>
                <Col lg={8} xs={8} className="align-self-center flex-grow-1">
                    <h5 className="fz-15 ps-2 text-truncate">{info.name}</h5>
                    <p className="fz-14 m-0 mt-1 ps-2 listChatContent__text-color text-truncate">
                        {info.LastMessage}
                    </p>
                </Col>
                <Col lg="auto" xs="auto" className="align-self-baseline">
                    <div className="fz-12 listChatContent__text-color">
                        {info.time}
                    </div>
                    {info.NewMessage > 0 && (
                        <Badge className="float-end mt-2" pill bg="danger">
                            {info.NewMessage}
                        </Badge>
                    )}
                </Col>
            </div>
        );
    else return <></>;
}

export default ListChatItem;
