import React from "react";
import { Avatar } from "components";
import { Accordion, Form } from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import { SetIsPending } from "configs/redux/Slice/UserSlice";
import { auth } from "configs/firebase/config";
import { updateLogOut } from "configs/firebase/ServiceFirebase/ServiceUpdate";
import { change } from "configs/redux/Slice/ThemeSlice";
import { changeSound } from "configs/redux/Slice/SoundSlice";
import "./setting.css";

function Setting() {
    const currentUser = useSelector((state) => state.UserInfo.user);
    const localTheme = useSelector((state) => state.LocalTheme.theme);
    const sound = useSelector((state) => state.Sound.sound);

    const dispatch = useDispatch();

    const handleSignOut = async () => {
        const userId = auth.currentUser.uid;
        dispatch(SetIsPending());
        try {
            await updateLogOut(userId);
            await auth.signOut();
        } catch (e) {
            console.log(e);
        }
    };
    return (
        <div className="Setting__body">
            <div className="ChatContent__userInfo-avatar">
                <Avatar width="5rem" url={currentUser.photoURL} />
                <div className="mt-2">{currentUser.displayName}</div>
            </div>
            <div className="ChatContent__userInfo-body fix_scroll p-4">
                <Accordion defaultActiveKey="0">
                    <Accordion.Item
                        className="userInfo__AccordionItem"
                        eventKey="0"
                    >
                        <Accordion.Header className="header__AccordionItem">
                            <h6>
                                <i className="bi bi-menu-button-wide-fill pe-2 fz-20"></i>
                                App
                            </h6>
                        </Accordion.Header>
                        <Accordion.Body className="Setting__accordion-body">
                            <div>
                                <Form>
                                    <Form.Label></Form.Label>
                                    <Form.Check
                                        type="switch"
                                        id="switch_sound"
                                        label="Notification Sound"
                                        checked={sound}
                                        onChange={() => dispatch(changeSound())}
                                    />
                                    <Form.Check
                                        checked={
                                            localTheme === "dark" ? true : false
                                        }
                                        onChange={() => dispatch(change())}
                                        type="switch"
                                        id="switch_theme"
                                        label="Dark Mode"
                                        className="mt-3"
                                    />
                                    <Form.Label />
                                </Form>
                            </div>
                        </Accordion.Body>
                    </Accordion.Item>
                    <Accordion.Item
                        className="userInfo__AccordionItem"
                        eventKey="1"
                    >
                        <Accordion.Header className="header__AccordionItem">
                            <h6>
                                <i className="bi bi-person-lines-fill pe-2 fz-20"></i>
                                Account
                            </h6>
                        </Accordion.Header>
                        <Accordion.Body className="Setting__accordion-body">
                            <div
                                className="Setting__accordion-item"
                                onClick={() => handleSignOut()}
                            >
                                <i className="bi bi-box-arrow-right"></i>
                                <span className="Setting__accordion-itemSignOut">
                                    Sign Out
                                </span>
                            </div>
                        </Accordion.Body>
                    </Accordion.Item>
                </Accordion>
            </div>
        </div>
    );
}

export default Setting;
