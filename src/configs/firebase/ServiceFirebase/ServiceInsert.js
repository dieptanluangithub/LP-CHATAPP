import {
    addRecord,
    findExactRecord,
    deleteRecord,
    updateSpecialChildRecord,
} from "./service";
import { update, ref, set } from "firebase/database";
import {
    findMessageByKey,
    findUserByUid,
    findUserKeyByUid,
} from "./ServiceFind";
import { db } from "../config";

export const addUser = async (user) => {
    await addRecord("users/", {
        displayName: user.displayName,
        email: user.email,
        photoURL: user.photoURL,
        uid: user.uid,
        listFriend: null,
        listGroup: null,
        listChat: null,
        listInvite: null,
        IsOnline: true,
    });
};

export const inviteFriend = async (KeyId, friendUid, currentUserId) => {
    await addRecord(`users/${KeyId}/listInvite`, {
        uid: currentUserId,
    });
    const value = await findExactRecord("users", "uid", currentUserId);
    if (value && Array.isArray(value))
        await addRecord(`users/${value[0].key}/listWait`, {
            uid: friendUid,
        });
};

export const AddFriend = async (friendUid, currentUserId) => {
    const friend = await findExactRecord("users", "uid", friendUid);
    const value = await findExactRecord("users", "uid", currentUserId);
    if (value && friend && Array.isArray(value) && Array.isArray(friend)) {
        await addRecord(`users/${value[0].key}/listFriend`, {
            uid: friendUid,
        });
        await addRecord(`users/${friend[0].key}/listFriend`, {
            uid: currentUserId,
        });
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

export const addMessage = async (
    type,
    name,
    describe,
    url,
    listUser,
    createdBy
) => {
    var date = new Date();
    var utc = date.getTime() + date.getTimezoneOffset() * 60000;
    var cdate = new Date(utc + 3600000 * 7);
    const keyMessage = await addRecord("messages", {
        type: type,
        describe: describe,
        name: name,
        photoURL: url,
        listUser: [...listUser],
        listMessage: [],
        timeUpdate: cdate.getTime(),
        createdBy: createdBy,
    });
    listUser.forEach(async (uid) => {
        const key = await findUserKeyByUid(uid);
        await addRecord(`users/${key}/listMessage`, {
            messageId: keyMessage,
            type: type,
        });
    });
    return keyMessage;
};

export const addChildMessage = async (key, type, uid, title, url, fileName) => {
    var date = new Date();
    var utc = date.getTime() + date.getTimezoneOffset() * 60000;
    var cdate = new Date(utc + 3600000 * 7);

    await addRecord(`messages/${key}/listChildMessage`, {
        type: type,
        uidSend: uid,
        title: title,
        urls: url,
        fileName: fileName,
        listSeen: [uid],
        timeSend: cdate.getTime(),
    });
    await updateSpecialChildRecord(
        "messages",
        key,
        "timeUpdate",
        cdate.getTime()
    );
};

export const AddMember = async (keyF, keyM, uidF) => {
    if (keyF && keyM) {
        await addRecord(`users/${keyF}/listMessage`, {
            messageId: keyM,
            type: 2,
        });
        const value = await findMessageByKey(keyM);
        await update(ref(db, `messages/${keyM}`), {
            ...value.val,
            listUser: [...value.val.listUser, uidF],
        });
        const user = await findUserByUid(uidF);
        console.log(user);

        await addChildMessage(
            keyM,
            5,
            uidF,
            `${user.displayName} is added to group`,
            "",
            ""
        );
    }
};

export const ReInitMessage = async (keyM, keyU) => {
    await addRecord(`users/${keyU}/listMessage`, {
        messageId: keyM,
        type: 1,
    });
};

export const UpdateSerialId = async (id, keyU) => {
    await set(ref(db, `users/${keyU}/serialId`), id);
};
