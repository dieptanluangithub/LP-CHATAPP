import React, { useState, useEffect } from "react";
import { Modal, InputGroup, FormControl } from "react-bootstrap";
import { useSelector } from "react-redux";
import { validateUTF8Name } from "configs/Validate";
import { findFriendToAddGroup } from "configs/firebase/ServiceFirebase/ServiceFind";
import { CardAddMember } from "components";
function AddMember({ show, setShow, keyId, uid }) {
    const localTheme = useSelector((state) => state.LocalTheme.theme);
    const [search, setSearch] = useState("");
    const [listToInvite, setListToInvite] = useState([]);

    const handleChangeSearchInvite = (e) => {
        setSearch(e.target.value);
    };
    const handleClose = () => {
        setSearch("");
    };

    useEffect(() => {
        const GetResult = async () => {
            if (search && validateUTF8Name(search)) {
                const result = await findFriendToAddGroup(search, uid, keyId);
                setListToInvite(result);
            } else {
                setListToInvite([]);
            }
        };
        GetResult();
    }, [uid, search, keyId]);

    return (
        <Modal
            show={show}
            centered
            onHide={() => {
                setShow(false);
                handleClose();
            }}
            data-layout-mode={localTheme}
        >
            <Modal.Header closeButton className="modal__bg-fix">
                <h5>Add Member</h5>
            </Modal.Header>
            <Modal.Body className="modal__bg-fix">
                <InputGroup className="mb-4 rounded-3">
                    <InputGroup.Text
                        className="bg-light ps-3 pe-1 text-muted-bg border-0"
                        id="basic-addon1"
                    >
                        <i
                            className="bi bi-search cur-pointer"
                            style={{ lineHeight: 2 }}
                        ></i>
                    </InputGroup.Text>
                    <FormControl
                        className="bg-light border-0 seach__text-color"
                        placeholder="Search users..."
                        aria-label="Search users..."
                        aria-describedby="basic-addon1"
                        value={search}
                        onChange={handleChangeSearchInvite}
                    />
                </InputGroup>
                <h6>List to add</h6>
                {listToInvite.map((value) => (
                    <CardAddMember
                        key={value.key}
                        keyId={value.key}
                        value={value.val}
                        keyM={keyId}
                    />
                ))}
            </Modal.Body>
        </Modal>
    );
}

export default React.memo(AddMember);
