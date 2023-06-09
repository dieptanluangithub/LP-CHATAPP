import React from "react";
import Container from "react-bootstrap/Container";
import { Row } from "react-bootstrap";
import { useSelector } from "react-redux";
import "./body.css";
function Body({ children }) {
    // @ts-ignore
    const localTheme = useSelector((state) => state.LocalTheme.theme);

    return (
        <Container fluid data-layout-mode={localTheme} className="body__custom">
            <Row>{children}</Row>
        </Container>
    );
}

export default React.memo(Body);
