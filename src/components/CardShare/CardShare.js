import React, { useState } from "react";
import Avatar from "components/Avatar";
import useInfoMessage from "configs/customHook/useInfoMessage";
import { addChildMessage } from "configs/firebase/ServiceFirebase/ServiceInsert";

function CardShare({ keyM, message, filter, uid }) {
    const [info] = useInfoMessage(keyM, uid);
    const [share, setShare] = useState(false);
    const handleShare = async () => {
        setShare("pending");
        await addChildMessage(
            keyM,
            message.val.type,
            uid,
            message.val.title || "",
            message.val.urls || "",
            message.val.fileName || ""
        );
        setShare(true);
    };
    const check = (value) => {
        var tmp = String(value).trim().toUpperCase();
        var tmp2 = String(filter).trim().toUpperCase();
        if (tmp.indexOf(tmp2) !== -1) return true;
        return false;
    };
    if (info && check(info.name))
        return (
            <div className="CardInvite__body">
                <div className="CardInvite__Image">
                    <Avatar
                        width="3rem"
                        url={info?.photoURL && info.photoURL}
                    />
                </div>
                <div className="CardInvite__Name">{info.name}</div>
                <div className="CardInvite__btn" onClick={handleShare}>
                    {share === false ? (
                        <i className="bi bi-share"></i>
                    ) : share === "pending" ? (
                        <div className="rotate CardInvite__btn-border">
                            <i className="bi bi-arrow-repeat "></i>
                        </div>
                    ) : (
                        <i className="bi bi-check-lg"></i>
                    )}
                </div>
            </div>
        );
    else return <></>;
}

export default CardShare;
