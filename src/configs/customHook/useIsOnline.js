import React from "react";
import { ref, onValue } from "firebase/database";
import { db } from "configs/firebase/config";

const useIsOnline = (key) => {
    const [isOnline, setIsOnline] = React.useState(false);

    React.useEffect(() => {
        let dbRef = ref(db, `users/${key}/IsOnline`);
        const unsubscribe = onValue(
            dbRef,
            (snapshot) => {
                setIsOnline(snapshot.val() || false);
            },
            {
                onlyOnce: false,
            }
        );
        return unsubscribe;
    }, [key]);
    return [isOnline];
};

export default useIsOnline;
