import React, { useState } from "react";
import {
    Col,
    Row,
    Card,
    Form,
    InputGroup,
    FormControl,
    FormLabel,
    FormGroup,
    Button,
    Alert,
} from "react-bootstrap";
import "./SignUp.css";
import Logo from "image/logo.webp";
import { Body } from "components";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { change } from "configs/redux/Slice/CurrentPageSlice";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth } from "configs/firebase/config";
import { validatePassword, validateEmail } from "configs/Validate";
import { changeMethod } from "configs/redux/Slice/CurrentMethodSlice";
import { addUser } from "configs/firebase/ServiceFirebase/ServiceInsert";
import { findUserAndKeyByUid } from "configs/firebase/ServiceFirebase/ServiceFind";
import { LogIn } from "configs/redux/Slice/UserSlice";
const SignUp = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [notify, setNotify] = useState("null");
    const [account, setAccount] = useState({
        email: "",
        displayName: "",
        password: "",
    });
    const handleChangeEmail = (e) => {
        setAccount((prev) => ({ ...prev, email: e.target.value }));
    };
    const handleChangePass = (e) => {
        setAccount((prev) => ({ ...prev, password: e.target.value }));
    };
    const handleChangeDisplayName = (e) => {
        setAccount((prev) => ({ ...prev, displayName: e.target.value }));
    };

    const handleSignUp = async (e) => {
        e.preventDefault();
        if (
            account.email.trim() !== "" &&
            account.password.trim() !== "" &&
            account.displayName.trim() !== ""
        )
            if (
                validateEmail(account.email) &&
                validatePassword(account.password)
            ) {
                createUserWithEmailAndPassword(
                    auth,
                    account.email,
                    account.password
                )
                    .then(async (userCredential) => {
                        const user = userCredential.user;
                        await updateProfile(user, {
                            displayName: account.displayName,
                        });
                        dispatch(changeMethod("password"));
                        dispatch(change(1));

                        await addUser(user);
                        const users = await findUserAndKeyByUid(user.uid);
                        dispatch(
                            LogIn({
                                key: users.key,
                                uid: users.val.uid,
                                photoURL: users.val.photoURL,
                                email: users.val.email,
                                displayName: users.val.displayName,
                            })
                        );
                        navigate("/");
                        // setNotify(true);
                    })
                    .catch(() => {
                        setNotify(false);
                    });
            } else {
                setNotify(false);
            }
    };

    const handleSignIn = () => {
        dispatch(change(1));
        navigate("/Login");
    };

    return (
        <Body>
            <div className="SignUp__account-pages pt-3">
                <Row className="justify-content-center">
                    <Col lg={4} xs={11}>
                        <div className="text-center mb-4">
                            <img
                                src={Logo}
                                alt="Logo"
                                style={{ width: 100, height: 100 }}
                            />
                            <h4 className="SignUp__title">Sign up</h4>
                            <p className="text-muted mb-4">
                                Get your Chat account now.
                            </p>
                        </div>

                        <Card className="SignUp__card">
                            {notify === true ? (
                                <Alert
                                    variant="success"
                                    dismissible
                                    onClose={() => setNotify("null")}
                                >
                                    You have sign up success
                                </Alert>
                            ) : notify === false ? (
                                <Alert
                                    variant="danger"
                                    dismissible
                                    onClose={() => setNotify("null")}
                                >
                                    Your email is wrong or is in use with
                                    another user or your password is not match
                                </Alert>
                            ) : (
                                <></>
                            )}
                            <Card.Body className="p-4 pb-1">
                                <Form onSubmit={handleSignUp}>
                                    <FormGroup className="mb-3">
                                        <FormLabel className="SignUp__form-label">
                                            Email
                                        </FormLabel>
                                        <InputGroup className="mb-3">
                                            <InputGroup.Text className="bg-light text-muted-bg border-0">
                                                <i className="bi bi-envelope" />
                                            </InputGroup.Text>
                                            <FormControl
                                                type="email"
                                                className="signUp-text-color"
                                                placeholder="Enter Email"
                                                aria-label="Enter Email"
                                                value={account.email}
                                                onChange={handleChangeEmail}
                                                required
                                            />
                                        </InputGroup>
                                    </FormGroup>

                                    <FormGroup className="mb-3">
                                        <FormLabel className="SignUp__form-label">
                                            Display Name
                                        </FormLabel>
                                        <InputGroup className="mb-3">
                                            <InputGroup.Text className="bg-light text-muted-bg border-0">
                                                <i className="bi bi-person" />
                                            </InputGroup.Text>
                                            <FormControl
                                                type="text"
                                                className="signUp-text-color"
                                                placeholder="Enter Username"
                                                aria-label="Enter Username"
                                                value={account.displayName}
                                                onChange={
                                                    handleChangeDisplayName
                                                }
                                                minLength={8}
                                                required
                                            />
                                        </InputGroup>
                                    </FormGroup>

                                    <FormGroup className="mb-4">
                                        <FormLabel className="SignUp__form-label">
                                            Password
                                        </FormLabel>
                                        <InputGroup className="mb-3">
                                            <InputGroup.Text className="bg-light text-muted-bg border-0">
                                                <i className="bi bi-lock" />
                                            </InputGroup.Text>
                                            <FormControl
                                                type="password"
                                                className="signUp-text-color"
                                                placeholder="Enter Password"
                                                aria-label="Enter Password"
                                                value={account.password}
                                                onChange={handleChangePass}
                                                minLength={8}
                                                required
                                            />
                                        </InputGroup>
                                    </FormGroup>

                                    <Button
                                        className="signUp__button w-100"
                                        type="submit"
                                    >
                                        Sign up
                                    </Button>

                                    <div className="SignUp__sign-in text-center mt-1">
                            <p>
                                Already have an account?
                                <span
                                    className="cur-pointer ms-2 signUp__textSignIn"
                                    onClick={handleSignIn}
                                >
                                    Sign in
                                </span>
                            </p>
                        </div>
                                </Form>
                            </Card.Body>
                        </Card>

                        
                    </Col>
                </Row>
            </div>
        </Body>
    );
};

export default React.memo(SignUp);
