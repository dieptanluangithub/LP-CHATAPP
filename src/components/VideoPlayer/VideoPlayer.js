import React, { useContext, useEffect } from "react";
import { SocketContext } from "layout/Provider/Context";
import { Modal, Button } from "react-bootstrap";
import HangUp from "image/hangup.svg";
import "./videoPlayer.css";
import useSound from "use-sound";
import CallSound from "sound/calling.mp3";

const VideoPlayer = () => {
    const [play, { stop, duration }] = useSound(CallSound);
    const {
        call,
        callAccepted,
        myVideo,
        userVideo,
        stream,
        name,
        callEnded,
        leaveCall,
        answerCall,
        myVdoStatus,
        userVdoStatus,
        updateVideo,
        myMicStatus,
        userMicStatus,
        updateMic,
        leaveCall1,
        isCalling,
    } = useContext(SocketContext);

    useEffect(() => {
        var tmp = null;
        var tmp2 = null;

        if (isCalling && callAccepted) {
        } else if (isCalling) {
            tmp = setInterval(() => {
                stop();
                play();
            }, duration);
            tmp2 = setTimeout(() => {
                clearInterval(tmp);
                stop();
                leaveCall();
            }, 60000);
        }
        return () => {
            if (tmp) clearInterval(tmp);
            if (tmp2) clearTimeout(tmp2);
            stop();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isCalling, callAccepted]);

    return (
        <Modal size="xl" centered show={isCalling} className="videoCall__modal">
            <Modal.Body className="videoCall__modal-body">
                <div className="videoCall__parent">
                    <div className="friend__video">
                        {(callAccepted && !callEnded && userVideo && (
                            <>
                                <video
                                    playsInline
                                    ref={userVideo}
                                    autoPlay
                                    className="video_f"
                                    style={{
                                        opacity: `${userVdoStatus ? "1" : "0"}`,
                                    }}
                                />
                                {!userMicStatus && (
                                    <i
                                        style={{
                                            position: "absolute",
                                            top: "0",
                                            left: "0",
                                            padding: "0.3rem",
                                            backgroundColor: "#fefefebf",
                                        }}
                                        className="bi bi-mic-mute-fill"
                                        aria-hidden="true"
                                        aria-label="microphone muted"
                                    ></i>
                                )}
                            </>
                        )) || <div className="videoCall__userName">{name}</div>}
                    </div>
                    <div className="my__video">
                        {stream && (
                            <video
                                playsInline
                                muted
                                ref={myVideo}
                                autoPlay
                                className="video_m"
                            />
                        )}
                    </div>
                </div>
            </Modal.Body>
            <Modal.Footer className="callVideo__modal-footer">
                <div className="callVideo__parent-btn">
                    {(call.isReceivingCall && !callAccepted && (
                        <>
                            <Button
                                variant="danger"
                                onClick={leaveCall1}
                                className="callVideo__btn"
                            >
                                <img src={HangUp} alt="Hang Up" />
                            </Button>
                            <Button
                                variant="success"
                                onClick={answerCall}
                                className="callVideo__btn"
                            >
                                <i className="bi bi-telephone-fill"></i>
                            </Button>
                        </>
                    )) || (
                        <>
                            <Button
                                className="callVideo__btn"
                                onClick={updateMic}
                            >
                                {myMicStatus ? (
                                    <i className="bi bi-mic-fill"></i>
                                ) : (
                                    <i className="bi bi-mic-mute-fill"></i>
                                )}
                            </Button>
                            <Button
                                className="callVideo__btn"
                                onClick={updateVideo}
                            >
                                {myVdoStatus ? (
                                    <i className="bi bi-camera-video-fill"></i>
                                ) : (
                                    <i className="bi bi-camera-video-off-fill"></i>
                                )}
                            </Button>

                            <Button
                                variant="danger"
                                onClick={leaveCall}
                                className="callVideo__btn"
                            >
                                <img src={HangUp} alt="Hang Up" />
                            </Button>
                        </>
                    )}
                </div>
            </Modal.Footer>
        </Modal>
    );
};

export default VideoPlayer;
