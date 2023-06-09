import React from "react";
import {
    ref,
    onValue,
    query,
    orderByChild,
    equalTo,
    get,
} from "firebase/database";
import { useDispatch } from "react-redux";
import { GetAll, clear } from "configs/redux/Slice/AllGroupSlice";
import { db } from "configs/firebase/config";

const useListGroup = (key, uid) => {
    const dispatch = useDispatch();
    React.useEffect(() => {
        let dbRef = query(
            ref(db, `users/${key}/listMessage`),
            orderByChild("type"),
            equalTo(2)
        );
        const unsubscribe = onValue(
            dbRef,
            (snapshot) => {
                console.log("Group: ", snapshot.exists());
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

export default useListGroup;
