import { deleteRecord, findAllChildOfRecord, findExactRecord } from "./service";
import { findMessageByKey, findUserByUid } from "./ServiceFind";
import { addChildMessage } from "./ServiceInsert";
import { db } from "../config";
import { ref, update } from "firebase/database";

export const deleteInvite = async (KeyId, friendUid, currentUserId) => {
    await deleteRecord(`users/${KeyId}/listInvite`, "uid", currentUserId);
    const value = await findExactRecord("users", "uid", currentUserId);
    if (value && Array.isArray(value))
        await deleteRecord(`users/${value[0].key}/listWait`, "uid", friendUid);
};

export const denyFriend = async (friendUid, currentUserId) => {
    const friend = await findExactRecord("users", "uid", friendUid);
    const value = await findExactRecord("users", "uid", currentUserId);
    if (value && friend && Array.isArray(value) && Array.isArray(friend)) {
        await deleteRecord(
            `users/${friend[0].key}/listWait`,
            "uid",
            currentUserId
        );
        await deleteRecord(
            `users/${value[0].key}/listInvite`,
            "uid",
            friendUid
        );
    }
};

export const deleteFriend = async (friendUid, currentUserId) => {
    const friend = await findExactRecord("users", "uid", friendUid);
    const value = await findExactRecord("users", "uid", currentUserId);
    if (value && friend && Array.isArray(value) && Array.isArray(friend)) {
        await deleteRecord(
            `users/${value[0].key}/listFriend`,
            "uid",
            friendUid
        );
        await deleteRecord(
            `users/${friend[0].key}/listFriend`,
            "uid",
            currentUserId
        );
    }
};

export const leaveGroup = async (keyId, keyMessage, uid) => {
    if (keyId && keyMessage) {
        await deleteRecord(
            `users/${keyId}/listMessage`,
            "messageId",
            keyMessage
        );
        const value = await findMessageByKey(keyMessage);
        const list = value.val.listUser.filter((value) => value !== uid);
        await update(ref(db, `messages/${keyMessage}`), {
            ...value.val,
            listUser: [...list],
        });
        const user = await findUserByUid(uid);
        await addChildMessage(
            keyMessage,
            5,
            uid,
            `${user.displayName} left this group`,
            "",
            ""
        );
    }
};

export const deleteMessage = async (keyM, keyU) => {
    if (keyM && keyU) {
        await deleteRecord(`users/${keyU}/listMessage`, "messageId", keyM);
    }
};

export const deleteChileMessage = async (keyM, keyC, keyU) => {
    try {
        if (keyM && keyC && keyU) {
            const parentMessage = await findMessageByKey(keyM);
            if (parentMessage && parentMessage.val) {
                const message = await findAllChildOfRecord(
                    "messages",
                    `${keyM}/listChildMessage/${keyC}`
                );
                if (
                    message.key &&
                    message.val &&
                    message.val.uidSend === keyU
                ) {
                    await update(
                        ref(db, `messages/${keyM}/listChildMessage/${keyC}`),
                        {
                            ...message.val,
                            type: 4,
                            title: "This message is deleted",
                        }
                    );
                } else if (message.key && message.val) {
                    const listDeny = message.val.listDeny || [];
                    await update(
                        ref(db, `messages/${keyM}/listChildMessage/${keyC}`),
                        {
                            ...message.val,
                            listDeny: [...listDeny, keyU],
                        }
                    );
                }
            }
        }
    } catch (e) {
        console.log(e);
    }
};
