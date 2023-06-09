import React from "react";
import styled from "./LoadingPage.module.css";
function LoadingPage() {
    return (
        <div className={styled.loader}>
            <div className={styled.bezel}></div>
            <div className={styled.screen}></div>
            <div className={styled.button}></div>
            <div className={styled["content1-logo"]}></div>
            <div className={styled["content2-nav"]}></div>
            <div className={styled["content3-slider"]}></div>
            <div className={styled["content4-row1"]}></div>
            <div className={styled["content5-row2"]}></div>
            <div className={styled["content6-row3"]}></div>
        </div>
    );
}

export default LoadingPage;
