import React, { Suspense, useState, useEffect } from "react";
import { Avatar } from "components";
import { Spinner, ProgressBar } from "react-bootstrap";

function MessageSending({ user, value }) {
    const WIDTH = 100 / Math.ceil(Math.sqrt(value.val.length));
    const type = value.type;
    const [process, setPrecess] = useState(0);
    useEffect(() => {
        var a = null;
        if (process < 100) {
            if (type === 1) {
                a = setTimeout(() => {
                    setPrecess((prev) => prev + 25);
                }, 500);
            } else {
                a = setTimeout(() => {
                    setPrecess((prev) => prev + 10);
                }, 1000);
            }
        }
        return () => {
            if (a) clearTimeout(a);
        };
    }, [process, type]);
    return (
        <div className="Message__Parent flex-row-reverse">
            <div className="d-flex flex-column-reverse">
                <Avatar width="2rem" url={user.photoURL} />
            </div>
            <div className="Message__Content-Right">
                <div className="nodeChildMessage-Right">
                    <div className="childMessage nobackground">
                        <Suspense
                            fallback={
                                <Spinner animation="border" variant="primary" />
                            }
                        >
                            <div className="childMessage__listImg">
                                {value.val.map((value, index) => {
                                    if (type === 1) {
                                        return (
                                            <img
                                                className="messageImage__fit"
                                                key={index}
                                                src={value.url}
                                                alt=""
                                                width={`${WIDTH}%`}
                                                height={`${WIDTH}%`}
                                            />
                                        );
                                    } else if (type === 2) {
                                        return (
                                            <video
                                                controls
                                                key={index}
                                                src={value.url}
                                                alt=""
                                                width={`${WIDTH}%`}
                                                height={`${WIDTH}%`}
                                            />
                                        );
                                    } else
                                        return (
                                            <div
                                                className="childMessage nobackground messageFile"
                                                key={index}
                                            >
                                                <i className="bi bi-file-earmark-text-fill file-icon d-sm-inline d-none"></i>
                                                <span>{value.fileName}</span>
                                            </div>
                                        );
                                })}
                                <ProgressBar
                                    variant="success"
                                    animated
                                    label="Uploading"
                                    now={process}
                                />
                            </div>
                        </Suspense>
                    </div>
                </div>

                <div className="userName">{user.displayName}</div>
            </div>
        </div>
    );
}

export default MessageSending;
