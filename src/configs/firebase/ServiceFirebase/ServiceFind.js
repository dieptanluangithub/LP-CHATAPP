import {
    findRecordString,
    findAllChildOfSpecialCollect,
    findExactRecord,
    findAllChildOfRecord,
    findAll,
} from "./service";

export const findFriendToAddGroup = async (searchInvite, uid, keyMessge) => {
    const listCurrentFriend = await findAllChildOfSpecialCollect(
        "users",
        "uid",
        uid,
        "listFriend"
    );
    const listFriend = await findRecordString(
        "users",
        "displayName",
        searchInvite
    );
    const listMember = await findAllChildOfRecord(
        "messages",
        `${keyMessge}/listUser`
    );
    const listUid = [];

    listUid.push(...listCurrentFriend.map((value) => value.val.uid));

    const result = listFriend.filter((friend) => {
        if (
            friend.val.uid !== uid &&
            listUid.indexOf(friend.val.uid) !== -1 &&
            listMember.val.indexOf(friend.val.uid) === -1
        )
            return true;
        return false;
    });
    return result;
};

export const findFriendToInvite = async (searchInvite, uid) => {
    const listFriend = await findRecordString(
        "users",
        "displayName",
        searchInvite
    );
    const listCurrentFriend = await findAllChildOfSpecialCollect(
        "users",
        "uid",
        uid,
        "listFriend"
    );

    //Danh sach minh gui ket ban
    const listCurrentInvite = await findAllChildOfSpecialCollect(
        "users",
        "uid",
        uid,
        "listWait"
    );

    //Danh sach minh nhan loi moi
    const listCurrentWait = await findAllChildOfSpecialCollect(
        "users",
        "uid",
        uid,
        "listInvite"
    );

    const listUid = [];

    listUid.push(...listCurrentFriend.map((value) => value.val.uid));
    listUid.push(...listCurrentInvite.map((value) => value.val.uid));
    listUid.push(...listCurrentWait.map((value) => value.val.uid));
    const result = listFriend.filter((friend) => {
        if (friend.val.uid !== uid && listUid.indexOf(friend.val.uid) === -1)
            return true;
        return false;
    });
    return result;
};

export const findUserByUid = async (uid) => {
    const result = await findExactRecord("users", "uid", uid);
    if (result && result.length > 0) return result[0].val;
    return result;
};

export const findUserAndKeyByUid = async (uid) => {
    const result = await findExactRecord("users", "uid", uid);
    if (result && result.length > 0)
        return { key: result[0].key, val: result[0].val };
    return null;
};
export const findUserKeyByUid = async (uid) => {
    const result = await findExactRecord("users", "uid", uid);
    if (result && result.length > 0) return result[0].key;
    return result;
};

export const getAllListFriend = async (uid) => {
    const listFriend = await findAllChildOfSpecialCollect(
        "users",
        "uid",
        uid,
        "listFriend"
    );
    const list = listFriend.map(async (value) => {
        const result = await findUserAndKeyByUid(value.val.uid);
        return result;
    });

    return Promise.all(list);
};

export const getAllListMessage = async (uid) => {
    const listMessage = await findAllChildOfSpecialCollect(
        "users",
        "uid",
        uid,
        "listMessage"
    );
    return listMessage;
};

export const getAllListWait = async (uid) => {
    const listFriendWait = await findAllChildOfSpecialCollect(
        "users",
        "uid",
        uid,
        "listInvite"
    );
    const list = listFriendWait.map(async (value) => {
        return await findUserAndKeyByUid(value.val.uid);
    });
    return Promise.all(list);
};

export const getAllGroup = async (uid) => {
    const listMessage = await findAllChildOfSpecialCollect(
        "users",
        "uid",
        uid,
        "listMessage"
    );
    const result = listMessage.filter((value) => value.val.type === 2);
    const list = result.map(async (value) => {
        const result = await findMessageByKey(value.val.messageId);
        return result;
    });
    return Promise.all(list);
};

export const getAllMessage = async (uid) => {
    const listMessage = await findAllChildOfSpecialCollect(
        "users",
        "uid",
        uid,
        "listMessage"
    );
    return listMessage;
};

export const findMessageByKey = async (key) => {
    const result = await findAllChildOfRecord("messages", key);
    if (result) return result;
    return null;
};

export const getAllChildMessage = async (key) => {
    const result = await findAll("messages", `${key}/listChildMessage`);
    if (result) return result;
    return [];
};

export const getMessageByFriendUid = async (uid, currentUid) => {
    const result = await findExactRecord("messages", "type", 1);
    var key = null;
    for (var i = 0; i < result.length; i++) {
        if (result[i].val.listUser.length === 2) {
            if (
                result[i].val.listUser.indexOf(uid) >= 0 &&
                result[i].val.listUser.indexOf(currentUid) >= 0
            ) {
                key = result[i].key;
                break;
            }
        }
    }
    return key;
};
export const findUpdateTimeOfMessage = async (key, type, createAt) => {
    const timeUpdate = await findAllChildOfRecord(
        "messages",
        `${key}/timeUpdate`
    );
    if (timeUpdate)
        return {
            messageId: key,
            timeUpdate: timeUpdate.val,
            type: type,
            createAt: createAt,
        };
    else return null;
};

export const getInitListMessage = async (list) => {
    var tmp = list.map(
        async (value) =>
            await findUpdateTimeOfMessage(
                value.messageId,
                value.type,
                value.createAt
            )
    );
    return Promise.all(tmp);
};

export const getTimeCreatedOfMessage = async (keyM, keyUid) => {
    try {
        var result = await findExactRecord(
            `users/${keyUid}/listMessage`,
            "messageId",
            keyM
        );
        if (result && result.length > 0) return result[0].val.createAt;
        else return new Date().getTime();
    } catch (e) {
        return new Date().getTime();
    }
};

export const findMessageOfUser = async (keyM, keyUid) => {
    var result = await findExactRecord(
        `users/${keyUid}/listMessage`,
        "messageId",
        keyM
    );
    if (result && result.length > 0 && result[0].key) {
        return true;
    } else return false;
};
