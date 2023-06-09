import React from "react";
import { useSelector } from "react-redux";
import useListFriend from "configs/customHook/useListFriend";
import useListGroup from "configs/customHook/useListGroup";
import useFriendRequest from "configs/customHook/useFriendRequest";
import useListMessage from "configs/customHook/useListMessage";
function AppProvider({ children }) {
    const currentUser = useSelector((state) => state.UserInfo.user);
    useListFriend(
        currentUser && currentUser.key,
        currentUser && currentUser.uid
    );
    useListGroup(
        currentUser && currentUser.key,
        currentUser && currentUser.uid
    );
    useFriendRequest(
        currentUser && currentUser.key,
        currentUser && currentUser.uid
    );
    useListMessage(
        currentUser && currentUser.key,
        currentUser && currentUser.uid
    );

    return <>{children}</>;
}

export default React.memo(AppProvider);
