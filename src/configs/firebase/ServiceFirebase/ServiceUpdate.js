import { update, ref, set } from "firebase/database";
import { findExactRecord, updateRecord } from "./service";
import { getAllChildMessage } from "./ServiceFind";
import { db } from "../config";

export const updateStatus = async (user) => {
    await updateRecord("users", "uid", user.uid, {
        IsOnline: true,
    });
};

export const updateLogOut = async (userId) => {
    await updateRecord("users", "uid", userId, {
        IsOnline: false,
    });
};

export const updateListSeen = async (userId, key) => {
    const message = await getAllChildMessage(key);
    message.forEach(async (value) => {
        if (value.val.listSeen && value.val.listSeen.indexOf(userId) === -1) {
            await update(
                ref(db, `messages/${key}/listChildMessage/${value.key}`),
                {
                    ...value.val,
                    listSeen: [...value.val.listSeen, userId],
                }
            );
        }
    });
};

export const updateInfoUser = async (keyId, displayName, photoURL) => {
    if (keyId) {
        if (displayName && displayName !== "")
            await set(ref(db, `users/${keyId}/displayName`), displayName);
        if (photoURL && photoURL !== "")
            await set(ref(db, `users/${keyId}/photoURL`), photoURL);
    }
};

export const updateSoundMessage = async (keyU, keyM) => {
    if (keyU && keyM) {
        const message = await findExactRecord(
            `users/${keyU}/listMessage`,
            "messageId",
            keyM
        );
        if (message && message.length > 0 && message[0].key) {
            var status =
                message[0].val.status === undefined ||
                message[0].val.status === true
                    ? false
                    : true;
            await set(
                ref(db, `users/${keyU}/listMessage/${message[0].key}/status`),
                status
            );
        }
    }
};
