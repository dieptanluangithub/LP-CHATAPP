import React, { memo } from "react";
import { Avatar } from "components";
import { Accordion } from "react-bootstrap";
import useListMember from "configs/customHook/useListMember";
import useListFile from "configs/customHook/useListFile";
import CardMember from "./CardMember";
import CardFile from "./CardFile";

function UserInfo({ showInfo, setShowInfo, info, uid }) {
    const [listMember] = useListMember(info.key);
    const [listFile] = useListFile(info.key);
    return (
        <div className={`ChatContent__userInfo ${showInfo ? "show" : ""}`}>
            <div
                className="ChatContent__userInfo-buttonClose"
                onClick={() => setShowInfo(false)}
            >
                <i className="bi bi-x-circle-fill"></i>
            </div>
            <div className="ChatContent__userInfo-avatar">
                <Avatar width="5rem" url={info.photoURL} />
                <div>{info.name}</div>
            </div>
            <div className="ChatContent__userInfo-body  fix_scroll p-4">
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
                                        {info.name}
                                    </h6>
                                </div>
                                {info.describe ? (
                                    <div className="mt-4">
                                        <p className="text-muted mb-1">
                                            Description
                                        </p>
                                        <h6 className="font-size-14">
                                            {info.describe}
                                        </h6>
                                    </div>
                                ) : (
                                    <div className="mt-4">
                                        <p className="text-muted mb-1">Email</p>
                                        <h6 className="font-size-14">
                                            {info.email}
                                        </h6>
                                    </div>
                                )}
                            </div>
                        </Accordion.Body>
                    </Accordion.Item>
                    {info.type === 2 && (
                        <Accordion.Item
                            className="userInfo__AccordionItem"
                            eventKey="2"
                        >
                            <Accordion.Header className="header__AccordionItem">
                                <h6>
                                    <i className="bi bi-people-fill pe-2 fz-20"></i>
                                    List Member
                                </h6>
                            </Accordion.Header>
                            <Accordion.Body>
                                {listMember &&
                                    listMember.length > 0 &&
                                    listMember.map((value, index) => (
                                        <CardMember
                                            key={index}
                                            uid={value}
                                            isDelete={uid === info.createdBy}
                                            currentUid={uid}
                                            keyMessage={info.key}
                                        />
                                    ))}
                            </Accordion.Body>
                        </Accordion.Item>
                    )}
                    <Accordion.Item
                        className="userInfo__AccordionItem"
                        eventKey="1"
                    >
                        <Accordion.Header className="header__AccordionItem">
                            <h6>
                                <i className="bi bi-paperclip pe-2 fz-20"></i>
                                Attached Files
                            </h6>
                        </Accordion.Header>
                        <Accordion.Body className="accordion-body">
                            <div className="ChatContent__userInfo-listFile">
                                {listFile &&
                                    listFile.length > 0 &&
                                    listFile.map((value, index) => (
                                        <CardFile key={index} url={value.url} />
                                    ))}
                            </div>
                        </Accordion.Body>
                    </Accordion.Item>
                </Accordion>
            </div>
        </div>
    );
}

export default memo(UserInfo);
