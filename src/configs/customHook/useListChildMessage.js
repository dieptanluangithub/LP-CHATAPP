import React from "react";
import { ref, onValue } from "firebase/database";
import { db } from "configs/firebase/config";
import { updateListSeen } from "configs/firebase/ServiceFirebase/ServiceUpdate";
const sortTime = (a, b) => {
    if (a.val.createAt < b.val.createAt) return 1;
    else if (a.val.createAt > b.val.createAt) return -1;
    else return 0;
};
const useListChildMessage = (key, uid, createAt) => {
    const [listChild, setListChild] = React.useState([]);
    React.useEffect(() => {
        let dbRef = ref(db, `messages/${key}/listChildMessage`);
        const unsubscribe = onValue(
            dbRef,
            async (snapshot) => {
                await updateListSeen(uid, key);
                const list = [];
                snapshot.forEach((dataSnapshot) => {
                    var val = dataSnapshot.val();
                    if (val.createAt >= createAt)
                        if (
                            (val.listDeny &&
                                Array.isArray(val.listDeny) &&
                                val.listDeny.indexOf(uid) === -1) ||
                            (!val.listDeny && true)
                        )
                            list.push({
                                key: dataSnapshot.key,
                                val: dataSnapshot.val(),
                                showSend: 0,
                            });
                });
                if (list.length > 0) {
                    list.sort(sortTime);
                    var test = list[0].val;
                    if (test.uidSend === uid && test.listSeen.length === 1)
                        list[0].showSend = 1;
                    else if (test.uidSend === uid && test.listSeen.length > 1)
                        list[0].showSend = 2;
                }
                setListChild(list);
            },
            {
                onlyOnce: false,
            }
        );
        return unsubscribe;
    }, [createAt, key, uid]);
    return [listChild];
};

export default useListChildMessage;
