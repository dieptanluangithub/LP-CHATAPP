import React from "react";
import { ref, onValue, query, get } from "firebase/database";
import { useDispatch } from "react-redux";
import { GetAll, clear } from "configs/redux/Slice/ListFriendWaitSlice";
import { db } from "configs/firebase/config";

const useFriendRequest = (key, uid) => {
    const dispatch = useDispatch();
    React.useEffect(() => {
        let dbRef = query(ref(db, `users/${key}/listInvite`));
        const unsubscribe = onValue(
            dbRef,
            (snapshot) => {
                console.log("Request: ", snapshot.exists());
                if (snapshot.exists()) {
                    dispatch(GetAll(uid));
                } else {
                    get(dbRef).then((snapshot) => {
                        if (!snapshot.exists()) {
                            dispatch(clear());
                        }
                    });
                }
            },
            {
                onlyOnce: false,
            }
        );

        return unsubscribe;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [key]);
    return [true];
};

export default useFriendRequest;
