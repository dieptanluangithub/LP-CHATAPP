import React from "react";
import Tab from "react-bootstrap/Tab";
import logo from "image/logo.png";
import Avatar from "components/Avatar";
import { Col, Nav, Dropdown } from "react-bootstrap";
import { TabBarContent } from "layout/content";
import { change } from "configs/redux/Slice/ThemeSlice";
import { useDispatch, useSelector } from "react-redux";
import { auth } from "configs/firebase/config";
import { SetIsPending } from "configs/redux/Slice/UserSlice";
import { useNavigate } from "react-router-dom";
import { updateLogOut } from "configs/firebase/ServiceFirebase/ServiceUpdate";
import "./TabBar.css";
import { changeSound } from "configs/redux/Slice/SoundSlice";

function TabBar() {
    const theme = useSelector((state) => state.LocalTheme.theme);
    const user = useSelector((state) => state.UserInfo.user);
    const sound = useSelector((state) => state.Sound.sound);
    const dispatch = useDispatch();
    const navigate = useNavigate();
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
        <Tab.Container defaultActiveKey="chats">
            <Col sm={1} className="col-sm-1_custom">
                <Nav
                    fill
                    variant="pills"
                    className="flex-column-sm"
                    style={{
                        backgroundColor: `var(--bs-sidebar-bg)`,
                    }}
                >
                    <Nav.Item className="nav_item_hide">
                        <img
                            className="logo"
                            src={logo}
                            alt="Chats"
                            onClick={() => {
                                navigate("/");
                            }}
                        />
                    </Nav.Item>
                    <Nav.Item>
                        <Nav.Link eventKey="profile">
                            <i className="bi bi-person-circle" />
                        </Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                        <Nav.Link eventKey="chats">
                            <i className="bi bi-chat-dots" />
                        </Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                        <Nav.Link eventKey="group">
                            <i className="bi bi-people-fill" />
                        </Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                        <Nav.Link eventKey="contact">
                            <i className="bi bi-person-lines-fill" />
                        </Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                        <Nav.Link eventKey="setting">
                            <i className="bi bi-gear-fill" />
                        </Nav.Link>
                    </Nav.Item>
                    <Nav.Item className="nav_item_hide">
                        <button
                            onClick={() => dispatch(change())}
                            className="w-100 btn-theme"
                            style={{
                                textAlign: "center",
                            }}
                        >
                            {theme === "dark" ? (
                                <i className="bi bi-sun" />
                            ) : (
                                <i className="bi bi-moon" />
                            )}
                        </button>
                    </Nav.Item>
                    <Nav.Item className="nav_item_hide">
                        <Dropdown>
                            <Dropdown.Toggle
                                as="div"
                                bsPrefix="listContact__dropdownToggle"
                            >
                                <Avatar
                                    width="3.5rem"
                                    url={user?.photoURL && user.photoURL}
                                />
                            </Dropdown.Toggle>
                            <Dropdown.Menu
                                align="end"
                                className="text-muted ChatContent__dropdown-background"
                            >
                                <Dropdown.Item
                                    className="listContact__dropdownItem ChatContent__dropdownLink"
                                    onClick={() => dispatch(changeSound())}
                                >
                                    {sound ? (
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
                                    onClick={() => handleSignOut()}
                                >
                                    Log out
                                    <i className="bi bi-box-arrow-left float-end"></i>
                                </Dropdown.Item>
                            </Dropdown.Menu>
                        </Dropdown>
                    </Nav.Item>
                </Nav>
            </Col>
            <TabBarContent />
        </Tab.Container>
    );
}

export default TabBar;
