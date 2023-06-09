import React from "react";
import { ref, onValue, query, get } from "firebase/database";
import { db } from "configs/firebase/config";
import {
    findUserAndKeyByUid,
    getAllChildMessage,
} from "configs/firebase/ServiceFirebase/ServiceFind";
const sortTime = (a, b) => {
    a = a.val;
    b = b.val;
    if (a.createAt < b.createAt) return 1;
    else if (a.createAt > b.createAt) return -1;
    else return 0;
};

const useInfoMessage = (key, uid) => {
    const [info, setInfo] = React.useState({ key: key });
    React.useEffect(() => {
        let dbRef = query(ref(db, `messages/${key}`));
        const unsubscribe = onValue(
            dbRef,
            async (snapshot) => {
                console.log("UseInfo: ", snapshot.exists());
                if (snapshot.exists()) {
                    var val = snapshot.val();
                    var listChildMessage = await getAllChildMessage(
                        snapshot.key
                    );
                    var NewMessage = 0;
                    var LastMessage = "";
                    var type = val.type;
                    var photoURL = val.photoURL;
                    var name = val.name;
                    var timeUpdate = val.timeUpdate;
                    var date = new Date(timeUpdate);
                    var friend = null;
                    var isOnline = true;
                    var friendKey = null;
                    var time = date.toLocaleTimeString("en-US", {
                        hour12: true,
                        hour: "numeric",
                        minute: "numeric",
                    });
                    if (
                        date.toLocaleDateString() !==
                        new Date().toLocaleDateString()
                    ) {
                        time = date.toLocaleDateString("en-US", {
                            day: "numeric",
                            month: "long",
                        });
                    }
                    if (type === 1) {
                        const friendUid = val.listUser.filter(
                            (value) => value !== uid
                        )[0];
                        friend = await findUserAndKeyByUid(friendUid);
                        friendKey = friend.key;
                        friend = friend.val;
                        friend.key = friendKey;
                        name = friend.displayName;
                        photoURL = friend.photoURL;
                    }
                    if (listChildMessage && listChildMessage.length > 0) {
                        listChildMessage.sort(sortTime);
                        for (
                            var i = 0;
                            i < 10 && i < listChildMessage.length;
                            i++
                        ) {
                            if (
                                listChildMessage[i].val.listSeen.indexOf(
                                    uid
                                ) === -1
                            ) {
                                NewMessage++;
                            }
                        }
                        LastMessage = listChildMessage[0].val.title;
                    }
                    setInfo((prev) => ({
                        ...prev,
                        NewMessage: NewMessage,
                        LastMessage: LastMessage,
                        photoURL: photoURL,
                        name: name,
                        time: time,
                        timeUpdate: timeUpdate,
                        key: snapshot.key,
                        isOnline: isOnline,
                        friend: friend,
                        friendKey: friendKey,
                    }));
                } else {
                    get(dbRef).then((snapshot) => {
                        if (!snapshot.exists()) {
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
    return [info];
};

export default useInfoMessage;
