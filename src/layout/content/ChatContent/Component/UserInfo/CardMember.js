import React, { useState, useEffect } from "react";
import { Avatar, Confirm } from "components";
import { Spinner } from "react-bootstrap";
import { findUserAndKeyByUid } from "configs/firebase/ServiceFirebase/ServiceFind";
import { leaveGroup } from "configs/firebase/ServiceFirebase/ServiceDelete";
import "./cardMember.css";

function CardMember({ uid, isDelete, currentUid, keyMessage }) {
    const [member, setMember] = useState(null);
    const [showConfirm, setShowConfirm] = useState(false);

    const handleDelete = async () => {
        await leaveGroup(member.key, keyMessage, uid);
    };

    useEffect(() => {
        let unmounted = true;
        const fetch = async () => {
            const re = await findUserAndKeyByUid(uid);
            if (unmounted) setMember(re);
        };
        fetch();
        return () => {
            unmounted = true;
        };
    }, [uid]);

    if (currentUid === uid) return <></>;
    if (member)
        return (
            <div className="CardMember__body">
                <div className="CardMember__Image">
                    <Avatar width="2rem" url={member.val.photoURL} />
                </div>
                <div className="CardMember__Name">{member.val.displayName}</div>
                {isDelete === true && (
                    <>
                        <div
                            className="CardMember__btn"
                            onClick={() => setShowConfirm(true)}
                        >
                            <i className="bi bi-trash3-fill"></i>
                        </div>
                    </>
                )}
                <Confirm
                    show={showConfirm}
                    handleAccept={handleDelete}
                    setShow={setShowConfirm}
                    handleDeny={() => setShowConfirm(false)}
                    title="Delete member"
                    text={`Do you want to delete ${member.val.displayName} out of this group ?`}
                />
            </div>
        );
    else return <Spinner />;
}

export default React.memo(CardMember);
