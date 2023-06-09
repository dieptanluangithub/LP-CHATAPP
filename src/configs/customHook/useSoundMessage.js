import React from "react";
import { ref, onValue } from "firebase/database";
import { db } from "configs/firebase/config";
import { findExactRecord } from "configs/firebase/ServiceFirebase/service";

const useSoundMessage = (keyU, keyM) => {
    const [isActive, setIsActive] = React.useState(false);
    const [keyCM, setKeyCM] = React.useState("");

    React.useEffect(() => {
        let unsubscribe = true;
        const getKey = async () => {
            const message = await findExactRecord(
                `users/${keyU}/listMessage`,
                "messageId",
                keyM
            );
            if (
                message &&
                message.length > 0 &&
                message[0].key &&
                unsubscribe
            ) {
                setKeyCM(message[0].key);
            }
        };
        getKey();
        return () => {
            unsubscribe = false;
        };
    }, [keyM, keyU]);

    React.useEffect(() => {
        let dbRef = ref(db, `users/${keyU}/listMessage/${keyCM}/status`);
        const unsubscribe = onValue(
            dbRef,
            (snapshot) => {
                setIsActive(
                    snapshot.val() === null ||
                        snapshot.val() === undefined ||
                        snapshot.val() === true
                        ? true
                        : false
                );
            },
            {
                onlyOnce: false,
            }
        );
        return unsubscribe;
    }, [keyCM, keyU]);
    return [isActive];
};

export default useSoundMessage;
