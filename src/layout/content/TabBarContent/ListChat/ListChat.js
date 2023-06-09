import React, { useState } from "react";
import { Search, Status, ListChatContent } from "./Component";

function ListChat() {
    const [filter, setFilter] = useState("");
    return (
        <div className="vh-100 position-relative d-flex flex-column align-items-stretch">
            <Search setFilter={setFilter} filter={filter} />
            <Status />
            <ListChatContent filter={filter} />
        </div>
    );
}
export default ListChat;
