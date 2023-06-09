import React, { createContext, useState, useRef, useEffect } from "react";
import { io } from "socket.io-client";
import Peer from "simple-peer";
import { useSelector } from "react-redux";
import { UpdateSerialId } from "configs/firebase/ServiceFirebase/ServiceInsert";

const SocketContext = createContext();

//const socket = io('http://localhost:5000');
const socket = io("https://tlcn.azurewebsites.net/");
const ContextProvider = ({ children }) => {
    const user = useSelector((state) => state.UserInfo.user);

    const [callAccepted, setCallAccepted] = useState(false);
    const [callEnded, setCallEnded] = useState(false);
    const [stream, setStream] = useState();
    const [name, setName] = useState("");
    const [call, setCall] = useState({});
    const [me, setMe] = useState("");
    const [isCalling, setIsCalling] = useState(false);

    const [userName, setUserName] = useState("");
    const [otherUser, setOtherUser] = useState("");
    const [myVdoStatus, setMyVdoStatus] = useState(true);
    const [userVdoStatus, setUserVdoStatus] = useState();
    const [myMicStatus, setMyMicStatus] = useState(true);
    const [userMicStatus, setUserMicStatus] = useState();

    const myVideo = useRef();
    const userVideo = useRef();
    const connectionRef = useRef();

    useEffect(() => {
        socket.on("me", (id) => setMe(id));
        socket.on("callUser", ({ from, name: callerName, signal }) => {
            setIsCalling(true);
            setName(callerName);
            setCall({
                isReceivingCall: true,
                from,
                name: callerName,
                signal,
            });
        });
        socket.on("endCall", () => {
            window.location.reload();
        });

        socket.on("updateUserMedia", ({ type, currentMediaStatus }) => {
            if (currentMediaStatus !== null || currentMediaStatus !== []) {
                switch (type) {
                    case "video":
                        setUserVdoStatus(currentMediaStatus);
                        break;
                    case "mic":
                        setUserMicStatus(currentMediaStatus);
                        break;
                    default:
                        setUserMicStatus(currentMediaStatus[0]);
                        setUserVdoStatus(currentMediaStatus[1]);
                        break;
                }
            }
        });
    }, [user]);
    useEffect(() => {
        const update = async () => {
            await UpdateSerialId(me, user.key);
        };
        if (user && user.key) update();
        return () => {};
    }, [me, user]);

    const updateVideo = () => {
        if (stream)
            setMyVdoStatus((currentStatus) => {
                socket.emit("updateMyMedia", {
                    type: "video",
                    currentMediaStatus: !currentStatus,
                });
                stream.getVideoTracks()[0].enabled = !currentStatus;
                return !currentStatus;
            });
    };

    const updateMic = () => {
        if (stream)
            setMyMicStatus((currentStatus) => {
                socket.emit("updateMyMedia", {
                    type: "mic",
                    currentMediaStatus: !currentStatus,
                });
                stream.getAudioTracks()[0].enabled = !currentStatus;
                return !currentStatus;
            });
    };

    const answerCall = () => {
        setCallAccepted(true);
        setIsCalling(true);
        setOtherUser(call.from);
        navigator.mediaDevices
            .getUserMedia({ video: true, audio: true })
            .then((currentStream) => {
                console.log(currentStream);
                setStream(currentStream);
                myVideo.current.srcObject = currentStream;
                const peer = new Peer({
                    initiator: false,
                    trickle: false,
                    stream: currentStream,
                    config: {
                        iceServers: [
                            { urls: ["stun:ss-turn2.xirsys.com"] },
                            {
                                username:
                                    "GIOP-iozOi546kx6umb8j6Jz6tk5MlD9GDGuRdmrYh4tr2Cv7CuIYC_VregYftCjAAAAAGJ2qMRrb2tvcm81NTU=",
                                credential:
                                    "0a694714-ce29-11ec-b50b-0242ac140004",
                                urls: [
                                    "turn:ss-turn2.xirsys.com:80?transport=udp",
                                    "turn:ss-turn2.xirsys.com:3478?transport=udp",
                                    "turn:ss-turn2.xirsys.com:80?transport=tcp",
                                    "turn:ss-turn2.xirsys.com:3478?transport=tcp",
                                    "turns:ss-turn2.xirsys.com:443?transport=tcp",
                                    "turns:ss-turn2.xirsys.com:5349?transport=tcp",
                                ],
                            },
                        ],
                    },
                });

                peer.on("signal", (data) => {
                    socket.emit("answerCall", {
                        signal: data,
                        to: call.from,
                        userName: name,
                        type: "both",
                        myMediaStatus: [myMicStatus, myVdoStatus],
                    });
                });

                peer.on("stream", (currentStream) => {
                    userVideo.current.srcObject = currentStream;
                });
                peer.signal(call.signal);
                connectionRef.current = peer;
            })
            .catch((e) => {
                const peer = new Peer({
                    initiator: false,
                    trickle: false,
                    config: {
                        iceServers: [
                            { urls: ["stun:ss-turn2.xirsys.com"] },
                            {
                                username:
                                    "GIOP-iozOi546kx6umb8j6Jz6tk5MlD9GDGuRdmrYh4tr2Cv7CuIYC_VregYftCjAAAAAGJ2qMRrb2tvcm81NTU=",
                                credential:
                                    "0a694714-ce29-11ec-b50b-0242ac140004",
                                urls: [
                                    "turn:ss-turn2.xirsys.com:80?transport=udp",
                                    "turn:ss-turn2.xirsys.com:3478?transport=udp",
                                    "turn:ss-turn2.xirsys.com:80?transport=tcp",
                                    "turn:ss-turn2.xirsys.com:3478?transport=tcp",
                                    "turns:ss-turn2.xirsys.com:443?transport=tcp",
                                    "turns:ss-turn2.xirsys.com:5349?transport=tcp",
                                ],
                            },
                        ],
                    },
                });

                peer.on("signal", (data) => {
                    socket.emit("answerCall", {
                        signal: data,
                        to: call.from,
                        userName: name,
                        type: "both",
                        myMediaStatus: [myMicStatus, myVdoStatus],
                    });
                });

                peer.on("stream", (currentStream) => {
                    userVideo.current.srcObject = currentStream;
                });
                peer.signal(call.signal);
                connectionRef.current = peer;
            });
    };

    const callUser = (id, name) => {
        setName(name);
        setOtherUser(id);
        setIsCalling(true);
        navigator.mediaDevices
            .getUserMedia({ video: true, audio: true })
            .then((currentStream) => {
                setStream(currentStream);
                myVideo.current.srcObject = currentStream;
                const peer = new Peer({
                    initiator: true,
                    trickle: false,
                    stream: currentStream,
                    config: {
                        iceServers: [
                            { urls: ["stun:ss-turn2.xirsys.com"] },
                            {
                                username:
                                    "GIOP-iozOi546kx6umb8j6Jz6tk5MlD9GDGuRdmrYh4tr2Cv7CuIYC_VregYftCjAAAAAGJ2qMRrb2tvcm81NTU=",
                                credential:
                                    "0a694714-ce29-11ec-b50b-0242ac140004",
                                urls: [
                                    "turn:ss-turn2.xirsys.com:80?transport=udp",
                                    "turn:ss-turn2.xirsys.com:3478?transport=udp",
                                    "turn:ss-turn2.xirsys.com:80?transport=tcp",
                                    "turn:ss-turn2.xirsys.com:3478?transport=tcp",
                                    "turns:ss-turn2.xirsys.com:443?transport=tcp",
                                    "turns:ss-turn2.xirsys.com:5349?transport=tcp",
                                ],
                            },
                        ],
                    },
                });
                peer.on("signal", (data) => {
                    socket.emit("callUser", {
                        userToCall: id,
                        signalData: data,
                        from: me,
                        name,
                    });
                });
                peer.on("stream", (currentStream) => {
                    userVideo.current.srcObject = currentStream;
                });

                socket.on("callAccepted", ({ signal, userName }) => {
                    setCallAccepted(true);
                    setUserName(userName);
                    peer.signal(signal);
                    socket.emit("updateMyMedia", {
                        type: "both",
                        currentMediaStatus: [myMicStatus, myVdoStatus],
                    });
                });

                connectionRef.current = peer;
            });
    };

    const leaveCall = () => {
        setCallEnded(true);
        setIsCalling(false);
        setStream((stream) => {
            if (stream) {
                var tmpStream = stream;
                tmpStream.getAudioTracks().forEach(function (track) {
                    track.stop();
                });
                tmpStream.getVideoTracks().forEach(function (track) {
                    track.stop();
                });
                return tmpStream;
            } else return null;
        });
        connectionRef.current.destroy();
        socket.emit("endCall", { id: otherUser });
        window.location.reload();
    };

    const leaveCall1 = () => {
        setIsCalling(false);
        socket.emit("endCall", { id: otherUser || call.from });
    };

    return (
        <SocketContext.Provider
            value={{
                call,
                callAccepted,
                myVideo,
                userVideo,
                stream,
                name,
                setName,
                callEnded,
                me,
                callUser,
                leaveCall,
                answerCall,
                setOtherUser,
                leaveCall1,
                userName,
                myVdoStatus,
                setMyVdoStatus,
                userVdoStatus,
                setUserVdoStatus,
                updateVideo,
                myMicStatus,
                userMicStatus,
                updateMic,
                isCalling,
            }}
        >
            {children}
        </SocketContext.Provider>
    );
};

export { ContextProvider, SocketContext };
