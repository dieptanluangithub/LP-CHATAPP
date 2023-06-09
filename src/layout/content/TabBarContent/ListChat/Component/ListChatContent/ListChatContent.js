import React, { useState, useEffect } from "react";
import "./listChatContent.css";

import { useSelector } from "react-redux";
import ListChatItem from "./ListChatItem";

function ListChatContent({ filter }) {
    const listMessage = useSelector((state) => state.ListMessage.listMessage);
    const [listMessageSort, setListMessageSort] = useState(listMessage);
    const sortTime = (a, b) => {
        if (a.timeUpdate && b.timeUpdate) {
            if (a.timeUpdate < b.timeUpdate) {
                return 1;
            } else if (a.timeUpdate > b.timeUpdate) {
                return -1;
            } else return 0;
        } else return 1;
    };
    useEffect(() => {
        var list = [...listMessage];
        list.sort(sortTime);
        setListMessageSort(list);
        return () => {};
    }, [listMessage]);
    return (
        <div className="pt-3 px-3 listChatContent_parent">
            <h5 className="fz-16 pb-3">Recent</h5>
            <div className="listChatContent_fix_height fix_scroll">
                {listMessageSort &&
                    listMessageSort.length > 0 &&
                    listMessageSort.map((value, index) => (
                        <ListChatItem
                            filter={filter}
                            key={index}
                            keyId={value.messageId}
                            type={value.type}
                        />
                    ))}
            </div>
        </div>
    );
}

export default ListChatContent;
