import React from "react";
import { ref, onValue } from "firebase/database";
import { db } from "configs/firebase/config";

const useListFile = (key) => {
    const [listFile, setListFile] = React.useState([]);

    const sortTime = (a, b) => {
        if (a.createAt < b.createAt) return 1;
        else if (a.createAt > b.createAt) return -1;
        else return 0;
    };

    React.useEffect(() => {
        let dbRef = ref(db, `messages/${key}/listChildMessage`);
        const unsubscribe = onValue(
            dbRef,
            (snapshot) => {
                var list = [];
                snapshot.forEach((child) => {
                    var val = child.val();
                    if (val.type === 2) {
                        val.urls.forEach((url) => {
                            list.push({ createAt: val.createAt, url: url });
                        });
                    }
                });
                list.sort(sortTime);
                setListFile(list);
            },
            {
                onlyOnce: false,
            }
        );
        return unsubscribe;
    }, [key]);
    return [listFile];
};

export default useListFile;
