import Picker from "emoji-picker-react";
import {BsEmojiSmileFill } from "react-icons/bs";
import { Avatar, Confirm } from "components";
import React, { useState, useContext } from "react";
import BackGround from "image/robot.gif";
import {
    Col,
    Row,
    Dropdown,
    InputGroup,
    FormControl,
    Button,
    Image,
    Alert,
    Modal,
    Form,
    Toast,
} from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { invisible } from "configs/redux/Slice/ShowMessageSlice";
import { ListMessage, UserInfo } from "./Component";
import "./chatContent.css";
import {
    addChildMessage,
    addMessage,
    ReInitMessage,
} from "configs/firebase/ServiceFirebase/ServiceInsert";
import {
    findUserByUid,
    getMessageByFriendUid,
    findMessageOfUser,
} from "configs/firebase/ServiceFirebase/ServiceFind";
import { updateSoundMessage } from "configs/firebase/ServiceFirebase/ServiceUpdate";
import { deleteMessage } from "configs/firebase/ServiceFirebase/ServiceDelete";
import useIsOnline from "configs/customHook/useIsOnline";
import {
    GetCurrentMessage,
    clear,
} from "configs/redux/Slice/CurrentMessageSlide";

import { leaveGroup } from "configs/firebase/ServiceFirebase/ServiceDelete";
import {
    uploadFile,
    uploadImage,
    uploadVideo,
} from "configs/firebase/StorageFirebase";
import { add, remove } from "configs/redux/Slice/SendingSlice";
import AddMember from "./Component/AddMember/AddMember";
import { findAllChildOfRecord } from "configs/firebase/ServiceFirebase/service";
import { SocketContext } from "layout/Provider/Context";
import useSoundMessage from "configs/customHook/useSoundMessage";
import { set } from "firebase/database";
import VoiceRecorder from "./VoiceRecorder";
import { useEffect } from "react";

function ChatContent() {
    const show = useSelector((state) => state.ShowMessage.value);
    const currentUser = useSelector((state) => state.UserInfo.user);
    const MessageData = useSelector((state) => state.CurrentMessage.data);
    const [IsOnline] = useIsOnline(MessageData && MessageData.keyUser);
    const [showInfo, setShowInfo] = useState(false);
    const [showAddMember, setShowAddMember] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [actionConfirm, setActionConfirm] = useState({});
    const dispatch = useDispatch();
    const { callUser } = useContext(SocketContext);
    const [isActive] = useSoundMessage(
        currentUser.key,
        MessageData && MessageData.key
    );
    const [Message, setMessage] = useState({
        message: "",
        file: [],
        ListNameFile: [],
    });

    const [showmic, setShow] = useState(false);
    const handleClose = () => {
        setShow(false);
    };
    const localTheme = useSelector((state) => state.LocalTheme.theme);

    //Set emoji
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const handleEmojiPickerhideShow = () => {
        setShowEmojiPicker(!showEmojiPicker);
      };

    const handleChangeStatus = async () => {
        await updateSoundMessage(currentUser.key, MessageData.key);
    };

    const className_chat = show
        ? "chatContent__body chatContent__body-show"
        : "chatContent__body";
   

    //Show dialog
    const handleShowConfirm = (actionType) => {
        if (actionType === 1) {
            setActionConfirm({
                handleAccept: handleLeaveGroup,
                setShow: setShowConfirm,
                handleDeny: () => setShowConfirm(false),
                title: "Leave group",
                text: "Do you want to leave this group ?",
            });
        } else if (actionType === 2) {
            setActionConfirm({
                handleAccept: handleDeleteMessage,
                setShow: setShowConfirm,
                handleDeny: () => setShowConfirm(false),
                title: "Delete message",
                text: "Do you want to delete this message ?",
            });
        }
        setShowConfirm(true);
    };

    //Rời Group
    const handleLeaveGroup = async () => {
        await leaveGroup(currentUser.key, MessageData.key, currentUser.uid);
        dispatch(invisible());
        dispatch(clear());
    };

    //Gọi
    const handleCall = async () => {
        const serial = await findAllChildOfRecord(
            `users/${MessageData.keyUser}/`,
            "serialId"
        );
        if (serial.val) {
            callUser(serial.val, MessageData.name);
        }
    };

    const [showZoomModal, setShowZoomModal] = useState(false);

    const handleCloseZoomModal = () => setShowZoomModal(false);
    const handleShowZoomModal = () => setShowZoomModal(true);

    const ZoomComponent = () => {
        var zoomUrl = `https://lp-zoom.vercel.app/join/${MessageData.zoomUrl}`
        return (
            <Modal show={showZoomModal} onHide={handleCloseZoomModal} size="lg" centered autoFocus fullscreen={false}>
                <Modal.Header closeButton>
                    <span>LP ZOOM MEETING</span>
                </Modal.Header>

                <Modal.Body>
                    <iframe src={zoomUrl}
                        width={'100%'} height={'100%'}
                        allow="camera; microphone; display-capture; autoplay; clipboard-write; allow-popups;">
                    
                    </iframe>
                </Modal.Body>

                {/* <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseZoomModal}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={handleCloseZoomModal}>
                        Save Changes
                    </Button>
                </Modal.Footer> */}
            </Modal>
        )
    }

    const [showVoiceModal, setShowVoiceModal] = useState(false);
    const [linkFileVoice, setLinkFileVoice] = useState(null);

    const handleCloseVoiceModal = () => setShowVoiceModal(false);
    const handleShowVoiceModal = () => setShowVoiceModal(true);
    useEffect(() => {
        console.log('link file voice: ', linkFileVoice);
        const newVoiceMessage = async () => {
            var listVoice = [linkFileVoice]
            await addChildMessage(
                MessageData.key,
                2,
                currentUser.uid,
                "@attach",
                listVoice,
                null
            );

            handleCloseVoiceModal();
        }

        if (linkFileVoice) newVoiceMessage();

    }, [linkFileVoice])

    const VoiceComponent = () => {
        return (
            <Modal show={showVoiceModal} onHide={handleCloseVoiceModal} size="lg" centered autoFocus fullscreen={false}>
                <Modal.Header closeButton>
                    <span>LP VOICE</span>
                </Modal.Header>

                <Modal.Body>
                    <VoiceRecorder setLinkFileVoice={setLinkFileVoice}></VoiceRecorder>
                </Modal.Body>

                <Modal.Footer>
                    {/* <button onClick={() => setRecord(true)} type="button" className='btn_modal'
                variant="outline-secondary"
                name="btn_send"
                >
                    Start
                </button>
                <button onClick={() => setRecord(false)} type="button" className='btn_modal'
                variant="outline-secondary"
                name="btn_send">
                    Stop
                </button> */}
                </Modal.Footer>
            </Modal>
        )
    }

    // Open Zoom meeting room
    const handleOpenZoom = async (url, windowName) => {
        url = `https://lp-zoom.vercel.app/join/${MessageData.zoomUrl}`;

        await addChildMessage(
            MessageData.key,
            5,
            currentUser.uid,
            `${currentUser.displayName} is joining meeting`,
            url,
            null
        );
        // await addChildMessage(
        //     MessageData.key,
        //     1,
        //     currentUser.uid,
        //     `${url}`,
        //     url,
        //     null
        // );

        windowName = window.location.hostname;
        var ratio = 0.75;
        var height = window.innerHeight * ratio;
        var width = window.innerWidth * ratio;
        var config = `directories=no,titlebar=no,toolbar=no,location=no,status=no,menubar=no,scrollbars=no,resizable=no,height=${height},width=${width}`;
        var newwindow=window.open(url,windowName,config);
        if (window.focus) {newwindow.focus()}
        return false;
    }

    //Xoá tin nhắn
    const handleDeleteMessage = async () => {
        var key = MessageData.key;
        var keyUid = currentUser.key;
        if (key && keyUid) {
            await deleteMessage(key, keyUid);
            dispatch(invisible());
            dispatch(clear());
        } else {
            dispatch(invisible());
            dispatch(clear());
        }
    };

    //Lấy đuôi file
    const getExtension = (filename) => {
        var parts = filename.split(".");
        return parts[parts.length - 1];
    };

    //Kiểm tra loại file gửi lên
    const checkTypeFile = (filename) => {
        var ext = getExtension(filename);
        switch (ext.toLowerCase()) {
            case "jpg":
            case "gif":
            case "bmp":
            case "png":
            case "jpeg":
                return 1;
            case "m4v":
            case "avi":
            case "mpg":
            case "mp4":
            case "mov":   
            case "mp3":
                return 2;
            default:
                return 0;
        }
    };
    //Send message
    const handleSend = async () => {
        const message = Message.message;
        const file = Message.file;
        var key = MessageData.key;
        var listImageVideo = [];
        var listFile = [];
        if (message.trim() === "" && file.length <= 0) return;
        if (MessageData.type === 1) {
            setMessage({ message: "", file: [], ListNameFile: [] });
            //Tìm key hoặc Tạo message khi chưa có
            if (!MessageData.key) {
                key = await getMessageByFriendUid(
                    MessageData.UidFriend,
                    currentUser.uid
                );

                if (!key)
                    key = await addMessage(
                        1,
                        null,
                        null,
                        null,
                        [MessageData.UidFriend, currentUser.uid],
                        currentUser.uid
                    );

                dispatch(
                    GetCurrentMessage({
                        key: key,
                        typeMessage: 1,
                        friend: await findUserByUid(MessageData.UidFriend),
                        keyUid: currentUser.key,
                    })
                );
            }
            //Check trường hợp bạn xoá tin nhắn
            const checkM = await findMessageOfUser(key, MessageData.keyUser);
            if (!checkM) await ReInitMessage(key, MessageData.keyUser);

            const checkC = await findMessageOfUser(key, currentUser.key);
            if (!checkC) await ReInitMessage(key, currentUser.key);

            if (file.length > 0) {
                //Gửi message đối với bạn
                for (var i = 0; i < file.length; i++) {
                    var check = checkTypeFile(file[i].name);
                    var url = "";
                    var fileName = file[i].name;
                    var waitUrl = URL.createObjectURL(file[i]);
                    if (check === 1) {
                        dispatch(add({ key: key, url: waitUrl, type: 1 }));
                        url = await uploadImage(file[i]);
                        listImageVideo.push(url);
                        dispatch(remove({ key: key, url: waitUrl, type: 1 }));
                    } else if (check === 2) {
                        dispatch(add({ key: key, url: waitUrl, type: 2 }));
                        url = await uploadVideo(file[i]);
                        listImageVideo.push(url);
                        dispatch(remove({ key: key, url: waitUrl, type: 2 }));
                    } else {
                        dispatch(
                            add({
                                key: key,
                                url: waitUrl,
                                type: 3,
                                fileName: fileName,
                            })
                        );
                        url = await uploadFile(file[i]);
                        listFile.push({ url: url, name: file[i].name });
                        dispatch(
                            remove({
                                key: key,
                                url: waitUrl,
                                type: 3,
                                fileName: fileName,
                            })
                        );
                    }
                }
                if (listImageVideo.length > 0) {
                    await addChildMessage(
                        key,
                        2,
                        currentUser.uid,
                        "@attach",
                        listImageVideo,
                        null
                    );
                }
                if (listFile.length > 0) {
                    for (var i = 0; i < listFile.length; i++) {
                        await addChildMessage(
                            key,
                            3,
                            currentUser.uid,
                            "@attach",
                            listFile[i].url,
                            listFile[i].name
                        );
                    }
                }
            } else if (message.trim() !== "") {
                await addChildMessage(
                    key,
                    1,
                    currentUser.uid,
                    message,
                    null,
                    null
                );
            }
        } else {
            setMessage({ message: "", file: [], ListNameFile: [] });
            //Gửi message đối với nhóm
            if (file.length > 0) {
                for (var i = 0; i < file.length; i++) {
                    var check = checkTypeFile(file[i].name);
                    var url = "";
                    var fileName = file[i].name;
                    var waitUrl = URL.createObjectURL(file[i]);
                    if (check === 1) {
                        dispatch(
                            add({
                                key: key,
                                url: waitUrl,
                                type: 1,
                                fileName: fileName,
                            })
                        );
                        url = await uploadImage(file[i]);
                        listImageVideo.push(url);
                        dispatch(
                            remove({
                                key: key,
                                url: waitUrl,
                                type: 1,
                            })
                        );
                    } else if (check === 2) {
                        dispatch(
                            add({
                                key: key,
                                url: waitUrl,
                                type: 2,
                                fileName: fileName,
                            })
                        );
                        url = await uploadVideo(file[i]);
                        listImageVideo.push(url);
                        dispatch(remove({ key: key, url: waitUrl, type: 2 }));
                    } else {
                        dispatch(
                            add({
                                key: key,
                                url: waitUrl,
                                type: 3,
                                fileName: fileName,
                            })
                        );
                        url = await uploadFile(file[i]);
                        listFile.push({ url: url, name: file[i].name });
                        dispatch(
                            remove({
                                key: key,
                                url: waitUrl,
                                type: 3,
                            })
                        );
                    }
                }

                if (listImageVideo.length > 0) {
                    await addChildMessage(
                        key,
                        2,
                        currentUser.uid,
                        "@attach",
                        listImageVideo,
                        null
                    );
                }
                if (listFile.length > 0) {
                    for (var i = 0; i < listFile.length; i++) {
                        await addChildMessage(
                            key,
                            3,
                            currentUser.uid,
                            "@attach",
                            listFile[i].url,
                            listFile[i].name
                        );
                    }
                }
                setMessage({ message: "", file: [], ListNameFile: [] });
            } else if (message.trim() !== "") {
                await addChildMessage(
                    key,
                    1,
                    currentUser.uid,
                    message,
                    null,
                    null
                );
            }
        }
    };
    const handleDeleteFile = (name) => {
        var ListNameFile = Message.ListNameFile;
        ListNameFile = ListNameFile.filter((value) => value !== name);
        const listfile = Message.file;
        const dt = new DataTransfer();

        for (let i = 0; i < listfile.length; i++) {
            const file = listfile[i];
            if (name !== file.name) dt.items.add(file);
        }
        setMessage((prev) => ({
            ...prev,
            file: dt.files,
            ListNameFile: ListNameFile,
        }));
    };

    //Bắt sự kiện đổi message
    const handleChangeMessage = (e) => {
        const message = e.target.value;
        setMessage((prev) => ({ ...prev, message: message }));
    };
    
    const onEnterPress = (e) => {
        if(e.keyCode === 13 && e.shiftKey === false) {
          e.preventDefault();
          handleSend();
        }
      };

    //Bắt sự kiện đổi file
    const handleChangeFile = (e) => {
        const listFile = e.target.files;
        var ListNameFile = [];
        for (var i = 0; i < listFile.length; i++) {
            const a = listFile[i].name;
            ListNameFile.push(a);
        }
        setMessage((prev) => ({
            ...prev,
            file: listFile,
            ListNameFile: ListNameFile,
        }));
    };

    if (MessageData && MessageData.type === 1) {
        //Tin nhắn với bạn bè
        return (
            <Col lg className={className_chat}>
                {/* Body message*/}
                <Row className="bottom_border">
                    <Col lg={4} xs={8}>
                        <div className="p-2 p-lg-3 align-content-center flex-grow-0 d-inline-flex">
                            <div className="d-flex align-items-center">
                                <div
                                    className="d-block d-lg-none me-3 ms-0 cur-pointer"
                                    onClick={() => {
                                        dispatch(invisible());
                                        dispatch(clear());
                                    }}
                                >
                                    <i className="bi bi-chevron-left"></i>
                                </div>
                                <div className="me-3 ms-0">
                                    <Avatar
                                        width="3.5rem"
                                        url={MessageData.photoURL}
                                        status={
                                            MessageData.type === 1 && IsOnline
                                        }
                                    />
                                </div>
                                <div className="flex-grow-1 overflow-hidden">
                                    <h5 className="fz-16 mb-0 text-truncate">
                                        {MessageData.name}
                                    </h5>
                                </div>
                            </div>
                        </div>
                    </Col>
                    <Col>
                        <div className="d-flex h-100 align-items-center float-end pe-3">
                            <div className="ChatContent__icon d-none d-lg-flex">
                                <i
                                    className="bi bi-camera-video-fill"
                                    onClick={handleCall}
                                ></i>
                            </div>
                        
                            <div
                                className="ChatContent__icon d-none d-lg-flex"
                                onClick={() => setShowInfo(true)}
                            >
                                <i className="bi bi-person"></i>
                            </div>
                            <div className="ChatContent__icon d-flex">
                                <Dropdown>
                                    <Dropdown.Toggle
                                        as="div"
                                        bsPrefix="listContact__dropdownToggle"
                                    >
                                        <i className="bi bi-three-dots"></i>
                                    </Dropdown.Toggle>
                                    <Dropdown.Menu
                                        align="end"
                                        className="text-muted ChatContent__dropdown-background"
                                    >
                                        <Dropdown.Item
                                            className="listContact__dropdownItem d-lg-none d-block ChatContent__dropdownLink"
                                            onClick={handleCall}
                                        >
                                            Call
                                            <i className="bi bi-camera-video-fill float-end"></i>
                                        </Dropdown.Item>
                                        <Dropdown.Item
                                            className="listContact__dropdownItem d-lg-none d-block ChatContent__dropdownLink"
                                            onClick={() => {
                                                setShowInfo(true);
                                            }}
                                        >
                                            Info
                                            <i className="bi bi-person float-end"></i>
                                        </Dropdown.Item>
                                        <Dropdown.Item
                                            className="listContact__dropdownItem ChatContent__dropdownLink"
                                            onClick={handleChangeStatus}
                                        >
                                            {isActive ? (
                                                <>
                                                    Muted
                                                    <i className="bi bi-bell-slash float-end"></i>
                                                </>
                                            ) : (
                                                <>
                                                    Active Sound
                                                    <i className="bi bi-bell-fill float-end"></i>
                                                </>
                                            )}
                                        </Dropdown.Item>
                                        <Dropdown.Item
                                            className="listContact__dropdownItem ChatContent__dropdownLink"
                                            onClick={() => handleShowConfirm(2)}
                                        >
                                            Delete
                                            <i className="bi bi-trash3-fill float-end"></i>
                                        </Dropdown.Item>
                                    </Dropdown.Menu>
                                </Dropdown>
                            </div>
                        </div>
                    </Col>
                </Row>
                <Row className="flex-grow-1 position-relative p-3">
                    <ListMessage
                        keyId={MessageData.key}
                        uid={currentUser.uid}
                        createAt={MessageData.createAt}
                        isActive={isActive}
                    />
                </Row>
                <Row className="top_border p-2 p-lg-3 chatContent__input-parent">
                    <InputGroup>
                        <FormControl
                            className="bg-light border-0 seach__text-color chatContent__input fix_scroll"
                            placeholder="Enter Message..."
                            aria-label="Message"
                            as={
                                Message.ListNameFile &&
                                Message.ListNameFile.length > 0
                                    ? "div"
                                    : "textarea"
                            }
                            name="message"
                            value={Message.message}
                            onChange={handleChangeMessage}
                            onKeyDown={onEnterPress}
                        >
                            {Message.ListNameFile &&
                            Message.ListNameFile.length > 0 ? (
                                Message.ListNameFile.map((value, index) => (
                                    <Toast
                                        key={index}
                                        className="chatContent__body-toast"
                                        onClose={() => handleDeleteFile(value)}
                                    >
                                        <Toast.Header className="chatContent__body-toast">
                                            {value}
                                        </Toast.Header>
                                    </Toast>
                                ))
                            ) : (
                                <></>
                            )}
                        </FormControl>
                        <Button
                            className="chatContent__button"
                            variant="outline-secondary"
                            htmlFor="file_send"
                            as="label"
                        >
                            <i className="bi bi-paperclip"></i>
                        </Button>
                        
                        <InputGroup className="rounded-3 d-none">
                            <FormControl
                                id="file_send"
                                type="file"
                                multiple={true}
                                files={Message.file}
                                onChange={handleChangeFile}
                                
                            ></FormControl>
                        </InputGroup>
                        <Button
                            className="chatContent__buttonemoji"
                            variant="outline-secondary"
                            name="btn_emj"
                            // onClick={handleEmojiPickerhideShow}
                        >
                            <BsEmojiSmileFill onClick={handleEmojiPickerhideShow} />
                            {showEmojiPicker && <Picker onEmojiClick={(emojiObject)=> setMessage((prev) => ({ ...prev, message: Message.message + emojiObject.emoji}))}/>}
                            {/* <i className="bi bi-emoji-laughing"></i> */}
                        </Button>
                        <Button
                            className="chatContent__button"
                            variant="outline-secondary"
                            onClick={handleShowVoiceModal}
                            // onChange={handleChangeFile}
                        
                        >
                            <i className="bi bi-mic-fill"></i>
                        </Button>
                        <VoiceComponent></VoiceComponent>
                        <Button
                            className="chatContent__buttonSend"
                            variant="outline-secondary"
                            name="btn_send"
                            onClick={handleSend}
                        >
                            <i className="bi bi-play-fill"></i>
                        </Button>
                    </InputGroup>
                </Row>
                
                {/*Tab info */}
                <UserInfo
                    showInfo={showInfo}
                    setShowInfo={setShowInfo}
                    info={MessageData}
                    uid={currentUser.uid}
                />
                <Confirm
                    show={showConfirm}
                    handleAccept={actionConfirm.handleAccept}
                    setShow={actionConfirm.setShow}
                    handleDeny={actionConfirm.handleDeny}
                    title={actionConfirm.title}
                    text={actionConfirm.text}
                />
            </Col>
            
        );
    }

    // Chat nhóm
    else if (MessageData && MessageData.type === 2) {
        //Tin nhắn với group
        return (
            <Col lg className={className_chat}>
                {/* Body message*/}
                <Row className="bottom_border">
                    <Col lg={4} xs={8}>
                        <div className="p-2 p-lg-3 align-content-center flex-grow-0 d-inline-flex">
                            <div className="d-flex align-items-center">
                                <div
                                    className="d-block d-lg-none me-3 ms-0 cur-pointer"
                                    onClick={() => dispatch(invisible())}
                                >
                                    <i className="bi bi-chevron-left"></i>
                                </div>
                                <div className="me-3 ms-0">
                                    <Avatar
                                        width="3.5rem"
                                        url={MessageData.photoURL}
                                        status={
                                            MessageData.type === 1
                                                ? IsOnline
                                                : MessageData.isOnline
                                        }
                                    />
                                </div>
                                <div className="flex-grow-1 overflow-hidden">
                                    <h5 className="fz-16 mb-0 text-truncate">
                                        {MessageData.name}
                                    </h5>
                                </div>
                            </div>
                        </div>
                    </Col>
                    <Col>
                        <div className="d-flex h-100 align-items-center float-end pe-3">
                            <div className="ChatContent__icon d-none d-lg-flex">
                                <button type="button" className="btn btn-primary" data-bs-toggle="modal" data-bs-target="#zoomMeeting">
                                <i
                                    className="bi bi-camera-video-fill"
                                    onClick={handleOpenZoom}
                                ></i>
                                </button>

                                {/* <Button variant="primary" onClick={handleShowZoomModal}>
                                    <i
                                        className="bi bi-camera-video-fill"
                                    ></i>
                                </Button>
                                <ZoomComponent></ZoomComponent> */}
                            </div>
                            <div
                                className="ChatContent__icon d-none d-lg-flex"
                                onClick={() => setShowInfo(true)}
                            >
                                <i className="bi bi-person"></i>
                            </div>
                            <div className="ChatContent__icon d-flex">
                                <Dropdown>
                                    <Dropdown.Toggle
                                        as="div"
                                        bsPrefix="listContact__dropdownToggle"
                                    >
                                        <i className="bi bi-three-dots"></i>
                                    </Dropdown.Toggle>
                                    <Dropdown.Menu
                                        align="end"
                                        className="text-muted ChatContent__dropdown-background"
                                    >
                                        <Dropdown.Item
                                            className="listContact__dropdownItem d-lg-none d-block ChatContent__dropdownLink"
                                            onClick={() => {
                                                setShowInfo(true);
                                            }}
                                        >
                                            Info
                                            <i className="bi bi-person float-end"></i>
                                        </Dropdown.Item>
                                        <Dropdown.Item
                                            className="listContact__dropdownItem d-lg-none d-block ChatContent__dropdownLink"
                                            onClick={handleOpenZoom}
                                        >
                                            Meeting
                                            <i className="bi bi-camera-video-fill float-end"></i>
                                        </Dropdown.Item>
                                        <Dropdown.Item
                                            className="listContact__dropdownItem ChatContent__dropdownLink"
                                            onClick={handleChangeStatus}
                                        >
                                            {isActive ? (
                                                <>
                                                    Muted
                                                    <i className="bi bi-bell-slash float-end"></i>
                                                </>
                                            ) : (
                                                <>
                                                    Active Sound
                                                    <i className="bi bi-bell-fill float-end"></i>
                                                </>
                                            )}
                                        </Dropdown.Item>
                                        <Dropdown.Item
                                            className="listContact__dropdownItem ChatContent__dropdownLink"
                                            onClick={() =>
                                                setShowAddMember(true)
                                            }
                                        >
                                            Add Member
                                            <i className="bi bi-person-plus-fill float-end"></i>
                                        </Dropdown.Item>
                                        <Dropdown.Item
                                            className="listContact__dropdownItem ChatContent__dropdownLink"
                                            onClick={() => handleShowConfirm(1)}
                                        >
                                            Leave Group
                                            <i className="bi bi-trash3-fill float-end"></i>
                                        </Dropdown.Item>
                                    </Dropdown.Menu>
                                </Dropdown>
                            </div>
                        </div>
                    </Col>
                </Row>
                <Row className="flex-grow-1 position-relative p-3">
                    <ListMessage
                        keyId={MessageData.key}
                        uid={currentUser.uid}
                        createAt={MessageData.createAt}
                        isActive={isActive}
                    />
                </Row>
                <Row className="top_border p-2 p-lg-3 chatContent__input-parent">
                    <InputGroup>
                        <FormControl
                            className="bg-light border-0 seach__text-color chatContent__input fix_scroll"
                            placeholder="Enter Message..."
                            aria-label="Message"
                            as={
                                Message.ListNameFile &&
                                Message.ListNameFile.length > 0
                                    ? "div"
                                    : "textarea"
                            }
                            name="message"
                            value={Message.message}
                            onChange={handleChangeMessage}
                            onKeyDown={onEnterPress}
                        >
                            {Message.ListNameFile &&
                            Message.ListNameFile.length > 0 ? (
                                Message.ListNameFile.map((value, index) => (
                                    <Toast
                                        key={index}
                                        className="chatContent__body-toast"
                                        onClose={() => handleDeleteFile(value)}
                                    >
                                        <Toast.Header className="chatContent__body-toast">
                                            {value}
                                        </Toast.Header>
                                    </Toast>
                                ))
                            ) : (
                                <></>
                            )}
                        </FormControl>
                        <Button
                            className="chatContent__button"
                            variant="outline-secondary"
                            htmlFor="file_send"
                            as="label"
                        >
                            <i className="bi bi-paperclip"></i>
                        </Button>
                        <InputGroup className="rounded-3 d-none">
                            <FormControl
                                id="file_send"
                                type="file"
                                multiple={true}
                                files={Message.file}
                                onChange={handleChangeFile}
                            ></FormControl>
                        </InputGroup>
                        <Button
                            className="chatContent__buttonemoji"
                            variant="outline-secondary"
                            name="btn_emj"
                            // onClick={handleEmojiPickerhideShow}
                        >
                            <BsEmojiSmileFill onClick={handleEmojiPickerhideShow} />
                            {showEmojiPicker && <Picker onEmojiClick={(emojiObject)=> setMessage((prev) => ({ ...prev, message: Message.message + emojiObject.emoji}))}/>}
                            {/* <i className="bi bi-emoji-laughing"></i> */}
                        </Button>
                        <Button
                            className="chatContent__buttonSend"
                            variant="outline-secondary"
                            name="btn_send"
                            onClick={handleSend}
                        >
                            <i className="bi bi-play-fill"></i>
                        </Button>
                    </InputGroup>
                </Row>
                {/*Tab info */}
                <UserInfo
                    showInfo={showInfo}
                    setShowInfo={setShowInfo}
                    info={MessageData}
                    uid={currentUser.uid}
                />
                <AddMember
                    show={showAddMember}
                    setShow={setShowAddMember}
                    keyId={MessageData.key}
                    uid={currentUser.uid}
                />
                <Confirm
                    show={showConfirm}
                    handleAccept={actionConfirm.handleAccept}
                    setShow={actionConfirm.setShow}
                    handleDeny={actionConfirm.handleDeny}
                    title={actionConfirm.title}
                    text={actionConfirm.text}
                />
            </Col>
        );
    }
    //Chưa có tin nhắn
    else{
        return (
            <Col lg className={className_chat}>
                <Image
                    src={BackGround}
                    width="100%"
                    height="100%"
                    className="chatContent__body-background"
                />
                <h1 className="chatContent__body-title">Welcome, <span>{currentUser.displayName}!</span></h1>
                <h3 className="chatContent__body-title1">Please select a chat to Start messaging.</h3>
            </Col>
        );
    }
}

export default ChatContent;
