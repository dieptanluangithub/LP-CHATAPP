import React from "react";
import { Image } from "react-bootstrap";
import "./avatar.css";
import image from "image/user.png";
function Avatar(props) {
    const { width, status, url } = props;
    return (
        <div style={{ position: "relative" }} className="cur-pointer">
            <Image
                src={url ? url : image}
                alt="Avatar"
                roundedCircle
                style={{
                    width: `${width}`,
                }}
                className="mx-auto image-square"
            ></Image>
            {status != null ? (
                <span
                    style={{
                        left: `calc(${width} - 10px)`,
                    }}
                    className={`${
                        status ? "avatar_span_isActive" : "avatar_span"
                    } mx-auto`}
                ></span>
            ) : null}
        </div>
    );
}

export default Avatar;
