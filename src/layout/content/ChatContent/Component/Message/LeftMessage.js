import React, { Suspense, useState } from "react";
import { Avatar } from "components";
import { Dropdown, Spinner } from "react-bootstrap";
import { useSelector } from "react-redux";
import { deleteChileMessage } from "configs/firebase/ServiceFirebase/ServiceDelete";
import axios from "axios";
const ShareMessage = React.lazy(() => import("./ShareMessage"));
const ImageMessage = React.lazy(() => import("./ImageMessage"));

function LeftMessage({ user, value }) {
    const keyM = useSelector((state) => state.CurrentMessage.data.key);
    const keyU = useSelector((state) => state.UserInfo.user.uid);
    const [showShare, setShowShare] = useState(false);
    const [currentMessage, setCurrentMessage] = useState(null);
    const handleDeleteMessage = async (keyC) => {
        await deleteChileMessage(keyM, keyC, keyU);
    };
    const handleShare = (message) => {
        setCurrentMessage(message);
        setShowShare(true);
    };
    const downloadDriect = (url, name) => {
        axios({
            url: url,
            method: "GET",
            responseType: "blob", // important
        })
            .then((response) => {
                const url = window.URL.createObjectURL(
                    new Blob([response.data])
                );
                const link = document.createElement("a");
                link.href = url;
                link.setAttribute("download", name);
                link.style.display = "none";
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            })
            .catch((e) => console.log(e));
    };

    if (value.type === 1)
        return (
            <div className="Message__Parent">
                <div className="d-flex flex-column-reverse">
                    <Avatar width="2rem" url={user.photoURL} />
                </div>
                <div className="Message__Content-Left">
                    {value.val.map((tmp) => (
                        <div className="nodeChildMessage" key={tmp.key}>
                            <div className="childMessage">
                                <span>{tmp.val.title}</span>
                                <div className="childMessage-hour">
                                    {new Date(tmp.val.createAt).getDate() ===
                                    new Date().getDate()
                                        ? new Date(
                                              tmp.val.createAt
                                          ).toLocaleTimeString("en-US", {
                                              hour12: true,
                                              hour: "numeric",
                                              minute: "numeric",
                                          })
                                        : new Date(
                                              tmp.val.createAt
                                          ).toLocaleTimeString("en-US", {
                                              hour12: true,
                                              day: "numeric",
                                              month: "short",
                                              hour: "numeric",
                                              minute: "numeric",
                                          })}
                                </div>
                            </div>
                            <div className="messageAction">
                                <Dropdown>
                                    <Dropdown.Toggle
                                        as="div"
                                        bsPrefix="listContact__dropdownToggle"
                                    >
                                        <i className="bi bi-three-dots-vertical"></i>
                                    </Dropdown.Toggle>
                                    <Dropdown.Menu
                                        align="start"
                                        className="text-muted messageAction__dropdown"
                                    >
                                        <Dropdown.Item
                                            className="messageAction__dropdown-item"
                                            onClick={() => handleShare(tmp)}
                                        >
                                            <i className="bi bi-share"></i>
                                        </Dropdown.Item>
                                        <Dropdown.Item
                                            className="messageAction__dropdown-item"
                                            onClick={() =>
                                                handleDeleteMessage(tmp.key)
                                            }
                                        >
                                            <i className="bi bi-trash3-fill"></i>
                                        </Dropdown.Item>
                                    </Dropdown.Menu>
                                </Dropdown>
                            </div>
                        </div>
                    ))}
                    <div className="userName">{user.displayName}</div>
                </div>
                <React.Suspense
                    fallback={<Spinner animation="border" variant="primary" />}
                >
                    <ShareMessage
                        show={showShare}
                        setShow={setShowShare}
                        message={currentMessage}
                    />
                </React.Suspense>
            </div>
        );
    else if (value.type === 2) {
        return (
            <div className="Message__Parent">
                <div className="d-flex flex-column-reverse">
                    <Avatar width="2rem" url={user.photoURL} />
                </div>
                <div className="Message__Content-Left">
                    {value.val.map((tmp) => (
                        <div className="nodeChildMessage" key={tmp.key}>
                            <div className="childMessage nobackground">
                                <Suspense
                                    fallback={
                                        <Spinner
                                            animation="border"
                                            variant="primary"
                                        />
                                    }
                                >
                                    <ImageMessage list={tmp.val.urls} />
                                </Suspense>
                                <div className="childMessage-hour">
                                    {new Date(tmp.val.createAt).getDate() ===
                                    new Date().getDate()
                                        ? new Date(
                                              tmp.val.createAt
                                          ).toLocaleTimeString("en-US", {
                                              hour12: true,
                                              hour: "numeric",
                                              minute: "numeric",
                                          })
                                        : new Date(
                                              tmp.val.createAt
                                          ).toLocaleTimeString("en-US", {
                                              hour12: true,
                                              day: "numeric",
                                              month: "short",
                                              hour: "numeric",
                                              minute: "numeric",
                                          })}
                                </div>
                            </div>

                            <div className="messageAction">
                                <Dropdown>
                                    <Dropdown.Toggle
                                        as="div"
                                        bsPrefix="listContact__dropdownToggle"
                                    >
                                        <i className="bi bi-three-dots-vertical"></i>
                                    </Dropdown.Toggle>
                                    <Dropdown.Menu
                                        align="start"
                                        className="text-muted messageAction__dropdown"
                                    >
                                        <Dropdown.Item
                                            className="messageAction__dropdown-item"
                                            onClick={() => handleShare(tmp)}
                                        >
                                            <i className="bi bi-share"></i>
                                        </Dropdown.Item>
                                        <Dropdown.Item
                                            className="messageAction__dropdown-item"
                                            onClick={() =>
                                                handleDeleteMessage(tmp.key)
                                            }
                                        >
                                            <i className="bi bi-trash3-fill"></i>
                                        </Dropdown.Item>
                                    </Dropdown.Menu>
                                </Dropdown>
                            </div>
                        </div>
                    ))}
                    <div className="userName">{user.displayName}</div>
                </div>
                <React.Suspense
                    fallback={<Spinner animation="border" variant="primary" />}
                >
                    <ShareMessage
                        show={showShare}
                        setShow={setShowShare}
                        message={currentMessage}
                    />
                </React.Suspense>
            </div>
        );
    } else if (value.type === 3) {
        return (
            <div className="Message__Parent">
                <div className="d-flex flex-column-reverse">
                    <Avatar width="2rem" url={user.photoURL} />
                </div>
                <div className="Message__Content-Left">
                    {value.val.map((tmp) => (
                        <div className="nodeChildMessage" key={tmp.key}>
                            <div className="childMessage nobackground messageFile">
                                <i className="bi bi-file-earmark-text-fill file-icon d-sm-inline d-none"></i>
                                <span>{tmp.val.fileName}</span>
                                <i
                                    className="bi bi-download file-icon-down"
                                    onClick={() =>
                                        downloadDriect(
                                            tmp.val.urls,
                                            tmp.val.fileName
                                        )
                                    }
                                ></i>

                                <div className="childMessage-hour">
                                    {new Date(tmp.val.createAt).getDate() ===
                                    new Date().getDate()
                                        ? new Date(
                                              tmp.val.createAt
                                          ).toLocaleTimeString("en-US", {
                                              hour12: true,
                                              hour: "numeric",
                                              minute: "numeric",
                                          })
                                        : new Date(
                                              tmp.val.createAt
                                          ).toLocaleTimeString("en-US", {
                                              hour12: true,
                                              day: "numeric",
                                              month: "short",
                                              hour: "numeric",
                                              minute: "numeric",
                                          })}
                                </div>
                            </div>
                            <div className="messageAction">
                                <Dropdown>
                                    <Dropdown.Toggle
                                        as="div"
                                        bsPrefix="listContact__dropdownToggle"
                                    >
                                        <i className="bi bi-three-dots-vertical"></i>
                                    </Dropdown.Toggle>
                                    <Dropdown.Menu
                                        align="start"
                                        className="text-muted messageAction__dropdown"
                                    >
                                        <Dropdown.Item
                                            className="messageAction__dropdown-item"
                                            onClick={() => handleShare(tmp)}
                                        >
                                            <i className="bi bi-share"></i>
                                        </Dropdown.Item>
                                        <Dropdown.Item
                                            className="messageAction__dropdown-item"
                                            onClick={() =>
                                                handleDeleteMessage(tmp.key)
                                            }
                                        >
                                            <i className="bi bi-trash3-fill"></i>
                                        </Dropdown.Item>
                                    </Dropdown.Menu>
                                </Dropdown>
                            </div>
                        </div>
                    ))}
                    <div className="userName">{user.displayName}</div>
                </div>
                <React.Suspense
                    fallback={<Spinner animation="border" variant="primary" />}
                >
                    <ShareMessage
                        show={showShare}
                        setShow={setShowShare}
                        message={currentMessage}
                    />
                </React.Suspense>
            </div>
        );
    } else if (value.type === 4) {
        return (
            <div className="Message__Parent">
                <div className="d-flex flex-column-reverse">
                    <Avatar width="2rem" url={user.photoURL} />
                </div>
                <div className="Message__Content-Left">
                    {value.val.map((tmp) => (
                        <div className="nodeChildMessage" key={tmp.key}>
                            <div className="childMessage nobackground messageFile">
                                <span>{tmp.val.title}</span>
                                <div className="d-flex">
                                    <div className="childMessage-hour">
                                        {new Date(
                                            tmp.val.createAt
                                        ).getDate() === new Date().getDate()
                                            ? new Date(
                                                  tmp.val.createAt
                                              ).toLocaleTimeString("en-US", {
                                                  hour12: true,
                                                  hour: "numeric",
                                                  minute: "numeric",
                                              })
                                            : new Date(
                                                  tmp.val.createAt
                                              ).toLocaleTimeString("en-US", {
                                                  hour12: true,
                                                  day: "numeric",
                                                  month: "short",
                                                  hour: "numeric",
                                                  minute: "numeric",
                                              })}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                    <div className="userName">{user.displayName}</div>
                </div>
            </div>
        );
    } else {
        return (
            <div className="Message__Parent">
                <div className="Message__Content-Left fix-width">
                    {value.val.map((tmp) => (
                        <div className="nodeChildMessage" key={tmp.key}>
                            <div className="childMessage__line"></div>
                            <div className="childMessage message__group-add-leave">
                                <span>{tmp.val.title}</span>
                            </div>
                            <div className="childMessage__line line"></div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }
}

export default React.memo(LeftMessage);
