import React from "react";
import { FormControl } from "react-bootstrap";
import InputGroup from "react-bootstrap/InputGroup";
import "./seach.css";
function Search({ setFilter, filter }) {
    const handleChange = (e) => {
        var text = String(e.target.value);
        setFilter(text);
    };
    return (
        <div className="pt-4 px-3">
            <h4 className="mb-4">Chats</h4>
            <InputGroup className="mb-3 rounded-3">
                <InputGroup.Text
                    className="bg-light ps-3 pe-1 text-muted-bg border-0"
                    id="basic-addon1"
                >
                    <i className="bi bi-search" style={{ lineHeight: 2 }}></i>
                </InputGroup.Text>
                <FormControl
                    className="bg-light border-0 seach__text-color"
                    placeholder="Search messages or users"
                    aria-label="Search messages or users"
                    aria-describedby="basic-addon1"
                    value={filter}
                    onChange={handleChange}
                />
            </InputGroup>
        </div>
    );
}

export default Search;
