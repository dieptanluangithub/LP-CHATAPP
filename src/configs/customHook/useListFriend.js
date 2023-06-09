import React from "react";
import { ref, onValue, get, query } from "firebase/database";
import { useDispatch } from "react-redux";
import { GetAll, clear } from "configs/redux/Slice/AllFriendSlice";
import { db } from "configs/firebase/config";
const useListFriend = (key, uid) => {
    const dispatch = useDispatch();
    React.useEffect(() => {
        let dbRef = ref(db, `users/${key}/listFriend`);
        const unsubscribe = onValue(
            dbRef,
            (snapshot) => {
                console.log("Friend: ", snapshot.exists());
                if (snapshot.exists()) {
                    dispatch(GetAll(uid));
                } else {
                    get(query(dbRef)).then((snapshot) => {
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
        return () => unsubscribe();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [key]);
    return [true];
};

export default useListFriend;
