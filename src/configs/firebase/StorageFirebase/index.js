import { storage } from "configs/firebase/config";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
const imageRef = ref(storage, "images");
const videoRef = ref(storage, "videos");
const fileRef = ref(storage, "files");

export const uploadImage = async (file) => {
    var childRef = ref(
        imageRef,
        `${Date.now()}${Math.floor(Math.random() * 10000)}${Math.floor(
            Math.random() * 10000
        )}${Math.floor(Math.random() * 10000)}${Math.floor(
            Math.random() * 10000
        )}${Math.floor(Math.random() * 10000)}${Math.floor(
            Math.random() * 10000
        )}`
    );

    var result = "";

    try {
        const snapshot = await uploadBytes(childRef, file);
        result = await getDownloadURL(snapshot.ref);
        return result;
    } catch (e) {
        console.log(e);
        return "";
    }
};

export const uploadVideo = async (file) => {
    var childRef = ref(
        videoRef,
        `${Date.now()}${Math.floor(Math.random() * 10000)}${Math.floor(
            Math.random() * 10000
        )}${Math.floor(Math.random() * 10000)}${Math.floor(
            Math.random() * 10000
        )}${Math.floor(Math.random() * 10000)}${Math.floor(
            Math.random() * 10000
        )}`
    );

    var result = "";

    try {
        const snapshot = await uploadBytes(childRef, file);
        result = await getDownloadURL(snapshot.ref);
        return result;
    } catch (e) {
        console.log(e);
        return "";
    }
};

export const uploadFile = async (file) => {
    var childRef = ref(
        fileRef,
        `${Date.now()}${Math.floor(Math.random() * 10000)}${Math.floor(
            Math.random() * 10000
        )}${Math.floor(Math.random() * 10000)}${Math.floor(
            Math.random() * 10000
        )}${Math.floor(Math.random() * 10000)}${Math.floor(
            Math.random() * 10000
        )}`
    );

    var result = "";

    try {
        const snapshot = await uploadBytes(childRef, file);
        result = await getDownloadURL(snapshot.ref);
        return result;
    } catch (e) {
        console.log(e);
        return "";
    }
};
