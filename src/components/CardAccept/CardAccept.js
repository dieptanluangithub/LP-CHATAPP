import React, { useState } from "react";
import { Avatar } from "components";
import { AddFriend } from "configs/firebase/ServiceFirebase/ServiceInsert";
import { denyFriend } from "configs/firebase/ServiceFirebase/ServiceDelete";
import { useSelector } from "react-redux";

import User from "image/user.png";
import "./cardAccept.css";

function CardAccept(props) {
    const { friendWait, filter } = props;
    const [action, setAction] = useState(false);
    const currentUser = useSelector((state) => state.UserInfo.user);
    const check = (value) => {
        var tmp = String(value).trim().toUpperCase();
        var tmp2 = String(filter).trim().toUpperCase();
        if (tmp.indexOf(tmp2) !== -1) return true;
        return false;
    };
    const handleAccept = async () => {
        if (action === false) {
            AddFriend(friendWait.uid, currentUser.uid)
                .then(() => {})
                .catch((e) => {
                    console.log(e);
                    setAction(false);
                });
        }
    };

    const handleDeny = async () => {
        if (action === false) {
            try {
                await denyFriend(friendWait.uid, currentUser.uid);
            } catch (e) {
                console.log(e);
                setAction(false);
            }
        }
    };
    if (friendWait && check(friendWait.displayName))
        return (
            <>
                {friendWait && (
                    <div className="CardAccept__body">
                        <div className="CardAccept__Image">
                            <Avatar
                                width="3rem"
                                url={
                                    friendWait?.photoURL
                                        ? friendWait.photoURL
                                        : User
                                }
                            />
                        </div>
                        <div className="CardAccept__Name">
                            {friendWait.displayName}
                        </div>
                        {action === false ? (
                            <>
                                <div
                                    className="CardAccept__btn"
                                    onClick={handleAccept}
                                >
                                    <i className="bi bi-check-circle-fill"></i>
                                </div>
                                <div
                                    className="CardAccept__btn"
                                    onClick={handleDeny}
                                >
                                    <i className="bi bi-x-circle-fill"></i>
                                </div>
                            </>
                        ) : action === "pending" ? (
                            <div className="rotate CardAccept__btn-pending">
                                <i className="bi bi-arrow-repeat "></i>
                            </div>
                        ) : (
                            <></>
                        )}
                    </div>
                )}
            </>
        );
    else return <></>;
}

export default React.memo(CardAccept);
