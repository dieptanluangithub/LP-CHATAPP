import React, { useState } from "react";
import Avatar from "components/Avatar";
import User from "image/user.png";
import { inviteFriend } from "configs/firebase/ServiceFirebase/ServiceInsert";
import { deleteInvite } from "configs/firebase/ServiceFirebase/ServiceDelete";
import { useSelector } from "react-redux";
import "./cardInvite.css";
function CardInvite(props) {
    const [invite, setInvite] = useState(false);
    const currentUser = useSelector((state) => state.UserInfo.user);

    const { keyId, value } = props;

    const handleInvite = async () => {
        if (invite === false) {
            setInvite("pending");
            inviteFriend(keyId, value.uid, currentUser.uid)
                .then(() => {
                    setInvite(true);
                })
                .catch((e) => {
                    console.log(e);
                    setInvite(false);
                });
        } else if (invite === true) {
            setInvite("pending");
            await deleteInvite(keyId, value.uid, currentUser.uid);
            setInvite(false);
        }
    };

    return (
        <div className="CardInvite__body">
            <div className="CardInvite__Image">
                <Avatar
                    width="3rem"
                    url={value?.photoURL ? value.photoURL : User}
                />
            </div>
            <div className="CardInvite__Name">{value.displayName}</div>
            <div className="CardInvite__btn" onClick={handleInvite}>
                {invite === false ? (
                    <i className="bi bi-plus-circle"></i>
                ) : invite === "pending" ? (
                    <div className="rotate CardInvite__btn-border">
                        <i className="bi bi-arrow-repeat "></i>
                    </div>
                ) : (
                    <i className="bi bi-check-lg"></i>
                )}
            </div>
        </div>
    );
}

export default CardInvite;
