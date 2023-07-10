import React, { memo, useState } from "react";
import { Avatar } from "components";
import {
    Accordion,
    Alert,
    Modal,
    Button,
    Form,
    InputGroup,
    FormControl,
    Badge,
} from "react-bootstrap";
import { useSelector } from "react-redux";
import { uploadImage } from "configs/firebase/StorageFirebase";
import { updateInfoUser } from "configs/firebase/ServiceFirebase/ServiceUpdate";
import { useDispatch } from "react-redux";
import { Update } from "configs/redux/Slice/UserSlice";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
function UserInfo() {
    const listFriendWait = useSelector((state) => state.ListFriendWait);
    const listFriend = useSelector((state) => state.listFriend);
    const [showRequset, setShowRequset] = useState(false);
    const currentUser = useSelector((state) => state.UserInfo.user);
    const localTheme = useSelector((state) => state.LocalTheme.theme);
    const [show, setShow] = useState(false);
    const [newInfo, setNewInfo] = useState({
        displayName: currentUser.displayName,
        photoURL: currentUser.photoURL,
        file: null,
    });
    const dispatch = useDispatch();
    const [showDialog, setShowDialog] = useState(null);
    const [alert, setAlert] = useState(false);
    const handleClose = () => {
        setShow(false);
        setNewInfo({
            displayName: currentUser.displayName,
            photoURL: currentUser.photoURL,
            file: null,
        });
    };

    const handleChangeName = (e) => {
        var text = e.target.value;
        setNewInfo((prev) => {
            return { ...prev, displayName: text };
        });
    };

    const handleChangeImage = (e) => {
        if (e.target.files.length > 0) {
            setNewInfo((prev) => {
                const url = URL.createObjectURL(e.target.files[0]);
                return {
                    ...prev,
                    file: e.target.files[0],
                    photoURL: url,
                };
            });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        var name = String(newInfo.displayName).trim();
        var file = newInfo.file;
        if (name === ""
            || name === null
        ) {
            setAlert(false);
            setShowDialog(true);
            toast.error('Oh snap! An error has occurred', {
                position: "top-right",
                autoClose: 1000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "colored",
                });
        } else {
            var url = currentUser.photoURL;
            if (file !== null && file) url = await uploadImage(file);
            if (url === undefined) url = currentUser.photoURL;
            updateInfoUser(currentUser.key, name, url)
                .then(() => {
                    setAlert(true);
                    setShowDialog(true);
                    dispatch(Update({ displayName: name, photoURL: url }));
                    toast.success('🦄 Update information successfully!', {
                        position: "top-right",
                        autoClose: 1000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                        theme: "light",
                    });
                })
                .catch((e) => {
                    console.log(e);
                });
                
                setShow(false);
        }
    };

    return (
        <div>
            <div
                className="float-end m-1 fz-25 cur-pointer"
                onClick={() => setShow(true)}
            >
                <i className="bi bi-pencil-square"></i>
            </div>
            <div className="ChatContent__userInfo-avatar">
                <Avatar width="5rem" url={currentUser.photoURL} />
                <div>{currentUser.displayName}</div>
            </div>
            <div className="ChatContent__userInfo-body fix_scroll p-4">
                <Accordion defaultActiveKey="0">
                    <Accordion.Item
                        className="userInfo__AccordionItem"
                        eventKey="0"
                    >
                        <Accordion.Header className="header__AccordionItem">
                            <h6>
                                <i className="bi bi-person-lines-fill pe-2 fz-20"></i>
                                About
                            </h6>
                        </Accordion.Header>
                        <Accordion.Body>
                            <div className="accordion-body">
                                <div>
                                    <p className="text-muted mb-1">Name</p>
                                    <h6 className="font-size-14">
                                        {currentUser.displayName}
                                    </h6>
                                </div>
                                <div className="mt-4">
                                    <p className="text-muted mb-1">Email</p>
                                    <h6 className="font-size-14">
                                        {currentUser.email}
                                    </h6>
                                </div>
                            </div>
                            <h6
                                className="friend_request_parent"
                            >
                                <div className="friend_request_parent-text">Friend Request</div>
                                <div className="friend_request_parent-length">
                                    <Badge
                                        className="friend_request_parent-lengthContent"
                                        bg="primary"
                                    >
                                        {(listFriendWait &&
                                            listFriendWait?.listUser &&
                                            listFriendWait.listUser.length) ||
                                            0}
                                    </Badge>
                                </div>
                            </h6>
                            <h6
                                className="friend_request_parent"
                            >
                                <div className="friend_request_parent-text">Friends</div>
                                <div className="friend_request_parent-length">
                                    <Badge
                                        className="friend_request_parent-lengthContent"
                                        bg="primary"
                                    >
                                        {(listFriend &&
                                            listFriend?.listUser &&
                                            listFriend.listUser.length) ||
                                            0}
                                    </Badge>
                                </div>
                            </h6>
                            <h6
                                className="friend_request_parent"
                            >
                                <div className="friend_request_parent-text">Groups</div>
                                <div className="friend_request_parent-length">
                                    <Badge
                                        className="friend_request_parent-lengthContent"
                                        bg="primary"
                                    >
                                        {(listFriendWait &&
                                            listFriendWait?.listUser &&
                                            listFriendWait.listUser.length) ||
                                            0}
                                    </Badge>
                                </div>
                            </h6>
                        </Accordion.Body>
                    </Accordion.Item>
                </Accordion>
            </div>
            
            <Modal
                show={show}
                centered
                onHide={() => {
                    handleClose();
                }}
                data-layout-mode={localTheme}
                dialogClassName="listGroup__dialog"
            >
                <Modal.Header closeButton className="modal__bg-fix">
                    <h5>Update Infomation</h5>
                </Modal.Header>
                <Form onSubmit={handleSubmit}>
                    <Modal.Body className="modal__bg-fix">
                        <div className="mb-4 d-flex flex-column">
                            <Form.Label htmlFor="imageGroup" className="m-auto">
                                <Avatar width="6rem" url={newInfo.photoURL} />
                            </Form.Label>
                            <InputGroup className="rounded-3">
                                <FormControl
                                    id="imageGroup"
                                    type="file"
                                    className="input__fileImage"
                                    onChange={handleChangeImage}
                                ></FormControl>
                            </InputGroup>
                        </div>
                        <div className="mb-4">
                            <Form.Label htmlFor="group_name">
                                Display Name
                            </Form.Label>
                            <InputGroup className="mb-4 rounded-3">
                                <FormControl
                                    className="bg-light border-0 seach__text-color lh-2"
                                    placeholder="Set name for group"
                                    value={newInfo.displayName}
                                    onChange={handleChangeName}
                                    minLength={8}
                                />
                            </InputGroup>
                        </div>
                    </Modal.Body>
                    <Modal.Footer className="modal__bg-fix">
                        <Button
                            bsPrefix="btn_color"
                            onClick={() => {
                                handleClose();
                            }}
                        >
                            Close
                        </Button>
                        <Button type="submit" bsPrefix="btn_color">
                            Update now
                        </Button>
                    </Modal.Footer>
                </Form>
            </Modal>
            <ToastContainer
        position="top-right"
        autoClose={1000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
        />
        </div>
        
    );
}

export default memo(UserInfo);
