import {
    ref,
    push,
    update,
    query,
    orderByChild,
    equalTo,
    get,
    remove,
} from "firebase/database";
import { db } from "configs/firebase/config";

export const addRecord = async (colect, data) => {
    try {
        const key = push(ref(db, colect), {
            ...data,
            createAt: new Date().getTime(),
        }).then((e) => e.key);
        return key;
    } catch (error) {
        console.log(error);
    }
};

export const findAllChildOfSpecialCollect = async (
    colect,
    child,
    value,
    childGet
) => {
    const result = [];
    const listResult = await findExactRecord(colect, child, value);
    const tmp = [];
    listResult.forEach((value) => {
        tmp.push(value.key);
    });
    for (var i = 0; i < tmp.length; ) {
        const key = tmp[i];
        const wait = await (async (keyId) => {
            const resultchild = await findAll(`${colect}/${key}`, childGet);
            result.push(...resultchild);
            return 1;
        })();
        i = i + wait;
    }

    return result;
};

export const findAllChildOfRecord = async (colect, key) => {
    let listResult = {};
    const queryGet = query(ref(db, `${colect}/${key}`));
    await get(queryGet)
        .then((snapshot) => {
            let key = snapshot.key;
            let val = snapshot.val();
            listResult = { key, val };
        })
        .catch((e) => console.log(e));
    return listResult;
};

export const findAll = async (colect, child) => {
    let listResult = [];
    const queryGet = query(ref(db, `${colect}/${child}`));
    await get(queryGet)
        .then((snapshot) => {
            snapshot.forEach((snapshotChild) => {
                let key = snapshotChild.key;
                let val = snapshotChild.val();
                listResult.push({ key, val });
            });
        })
        .catch((e) => console.log(e));
    return listResult;
};

export const findRecordString = async (colect, child, value) => {
    let listResult = [];

    const queryGet = query(ref(db, colect), orderByChild(child));
    await get(queryGet)
        .then((snapshot) => {
            snapshot.forEach((snapshotChild) => {
                let key = snapshotChild.key;
                let val = snapshotChild.val();
                if (val && val[child] && val[child].includes(value))
                    listResult.push({ key, val });
            });
        })
        .catch((e) => {
            console.log(e);
        });
    return listResult;
};

export const findExactRecord = async (colect, child, value) => {
    let listResult = [];

    const queryGet = query(
        ref(db, colect),
        orderByChild(child)
        // equalTo(value)
    );
    await get(queryGet)
        .then((snapshot) => {
            snapshot.forEach((snapshotChild) => {
                let key = snapshotChild.key;
                let val = snapshotChild.val();
                if (val[child] === value) listResult.push({ key, val });
            });
        })
        .catch((e) => {
            console.log(e);
        });
    return listResult;
};

export const updateRecord = async (colect, child, value, data) => {
    try {
        const queryGet = query(
            ref(db, colect),
            orderByChild(child),
            equalTo(value)
        );

        await get(queryGet)
            .then((snapshot) => {
                snapshot.forEach((snapshotChild) => {
                    let key = snapshotChild.key;
                    // let val = snapshotChild.val();
                    update(ref(db, `${colect}/${key}`), {
                        ...data,
                    });
                });
            })
            .catch((e) => console.log(e));
    } catch (error) {
        console.log(error);
    }
};

export const updateSpecialChildRecord = async (colect, key, child, data) => {
    try {
        const queryGet = query(ref(db, `${colect}/${key}`));

        await get(queryGet)
            .then(async (snapshot) => {
                var val = snapshot.val();
                await update(ref(db, `${colect}/${key}`), {
                    ...val,
                    [child]: data,
                });
            })
            .catch((e) => console.log(e));
    } catch (error) {
        console.log(error);
    }
};

export const deleteRecord = async (colect, child, value) => {
    try {
        const queryGet = query(
            ref(db, colect),
            orderByChild(child),
            equalTo(value)
        );

        await get(queryGet)
            .then((snapshot) => {
                snapshot.forEach((snapshotChild) => {
                    let key = snapshotChild.key;
                    // let val = snapshotChild.val();
                    remove(ref(db, `${colect}/${key}`));
                });
            })
            .catch((e) => console.log(e));
    } catch (error) {
        console.log(error);
    }
};
