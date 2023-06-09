import React, { useEffect, useState } from "react";
import "./message.css";
import { findUserByUid } from "configs/firebase/ServiceFirebase/ServiceFind";
import RightMessage from "./RightMessage";
import LeftMessage from "./LeftMessage";

function Message(props) {
    const { value, currentUid } = props;
    const [user, setUser] = useState(null);
    useEffect(() => {
        let umount = true;
        const handleUserInfo = async () => {
            const result = await findUserByUid(value.sendUid);
            if (umount && result) {
                setUser(result);
            }
        };
        handleUserInfo();
        return () => {
            umount = false;
        };
    }, [value.sendUid]);

    if (value.sendUid !== currentUid && user) {
        return <LeftMessage user={user} value={value} />;
    } else if (user) {
        return <RightMessage user={user} value={value} />;
    } else return <></>;
}

export default React.memo(Message);
