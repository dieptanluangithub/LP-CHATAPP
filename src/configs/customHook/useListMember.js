import React from "react";
import { ref, onValue } from "firebase/database";
import { db } from "configs/firebase/config";

const useListMember = (key) => {
    const [listMember, setlistMember] = React.useState([]);
    React.useEffect(() => {
        let dbRef = ref(db, `messages/${key}/listUser`);
        const unsubscribe = onValue(
            dbRef,
            (snapshot) => {
                var list = [];
                snapshot.forEach((child) => {
                    list.push(child.val());
                });
                setlistMember(list);
            },
            {
                onlyOnce: false,
            }
        );
        return unsubscribe;
    }, [key]);
    return [listMember];
};

export default useListMember;
