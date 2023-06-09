import React from "react";
import ListChat from "./ListChat";
import ListGroup from "./ListGroup";
import ListContact from "./ListContact";
import UserInfo from "./UserInfo";
import Setting from "./Setting";
import { Col, Tab } from "react-bootstrap";
function TabBarContent() {
    return (
        <Col
            xs={12}
            lg={4}
            style={{
                height: "100vh",
                backgroundColor: "var(--bs-sidebar-sub-bg)",
            }}
        >
            <Tab.Content className="position-relative">
                <Tab.Pane eventKey="profile">
                    <UserInfo />
                </Tab.Pane>
                <Tab.Pane eventKey="chats">
                    <ListChat />
                </Tab.Pane>
                <Tab.Pane eventKey="group">
                    <ListGroup />
                </Tab.Pane>
                <Tab.Pane eventKey="contact">
                    <ListContact />
                </Tab.Pane>
                <Tab.Pane eventKey="setting">
                    <Setting />
                </Tab.Pane>
            </Tab.Content>
        </Col>
    );
}

export default TabBarContent;
