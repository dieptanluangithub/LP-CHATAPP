import React, { useState } from "react";
import "./SignIn.css";
import Logo from "image/logo.webp";
import {
    Col,
    Row,
    Card,
    Form,
    InputGroup,
    FormControl,
    FormLabel,
    FormCheck,
    FormGroup,
    Button,
    Alert,
} from "react-bootstrap";
import { GoogleAuthProvider, FacebookAuthProvider } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { change } from "configs/redux/Slice/CurrentPageSlice";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "configs/firebase/config";
import { validateEmail, validatePassword } from "configs/Validate";

const providers = {
    google: new GoogleAuthProvider(),
    facebook: new FacebookAuthProvider(),
};

const SignIn = (props) => {
    const { handleSignIn } = props;
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [notify, setNotify] = useState(false);

    const [account, setAccount] = useState({
        email: "",
        password: "",
    });
    const handleResetPass = () => {
        dispatch(change(3));
        navigate("/ResetPassword");
    };
    const handleSignUp = () => {
        dispatch(change(2));
        navigate("/SignUp");
    };

    const handleChangeEmail = (e) => {
        setAccount((prev) => ({ ...prev, email: e.target.value }));
    };
    const handleChangePass = (e) => {
        setAccount((prev) => ({ ...prev, password: e.target.value }));
    };

    const handleLoginWithEmailPassword = (e) => {
        e.preventDefault();
        if (account.email.trim() !== "" && account.password.trim() !== "") {
            if (
                validateEmail(account.email) &&
                validatePassword(account.password)
            ) {
                signInWithEmailAndPassword(
                    auth,
                    account.email.trim(),
                    account.password.trim()
                )
                    .then(async (userCredential) => {
                        navigate("/");
                    })
                    .catch((error) => {
                        setNotify(true);
                    });
            } else {
                setNotify(true);
            }
        }
    };

    return (
        <div className="SignIn__account-pages pt-3">
            <Row className="justify-content-center">
                <Col lg={4} xs={11}>
                    <div className="text-center mb-4">
                        <img
                            src={Logo}
                            alt="Logo"
                            style={{ width: 100, height: 100 }}
                        />

                        <h4 className="SignIn__title">Sign in</h4>
                        <p className="text-muted mb-4">
                            Sign in to continue to Chat.
                        </p>
                    </div>

                    <Card className="SignIn__card">
                        {notify === true ? (
                            <Alert
                                variant="danger"
                                dismissible
                                onClose={() => setNotify(false)}
                            >
                                Wrong email or password
                            </Alert>
                        ) : (
                            <></>
                        )}
                        <Card.Body className="p-4">
                            <Form onSubmit={handleLoginWithEmailPassword}>
                                <FormGroup className="mb-3">
                                    <FormLabel className="SignIn__form-label">
                                        Email
                                    </FormLabel>
                                    <InputGroup className="mb-3">
                                        <InputGroup.Text className="SignIn__input-text">
                                            <i className="bi bi-person" />
                                        </InputGroup.Text>

                                        <FormControl
                                            className="SignIn__form-control SignIn__form-control-lg SignIn__form SignIn__bg-soft-light"
                                            placeholder="Enter Email"
                                            aria-label="Enter Email"
                                            onChange={handleChangeEmail}
                                            value={account.email}
                                            required
                                        />
                                    </InputGroup>
                                </FormGroup>
                                <FormGroup className="mb-3">
                                    <div className="float-end">
                                        <div
                                            className="text-muted font-size-13 cur-pointer"
                                            onClick={handleResetPass}
                                        >
                                            Forgot password?
                                        </div>
                                    </div>
                                    <FormLabel className="SignIn__form-label">
                                        Password
                                    </FormLabel>
                                    <InputGroup className="mb-3">
                                        <InputGroup.Text className="SignIn__input-text">
                                            <i className="bi bi-lock-fill"></i>
                                        </InputGroup.Text>

                                        <FormControl
                                            className="SignIn__form-control SignIn__form-control-lg SignIn__form SignIn__bg-soft-light"
                                            placeholder="Enter Password"
                                            aria-label="Enter Password"
                                            type="password"
                                            autoComplete="true"
                                            value={account.password}
                                            onChange={handleChangePass}
                                            required
                                        />
                                    </InputGroup>
                                </FormGroup>
                                <Form.Group
                                    className="mb-3"
                                    controlId="formBasicCheckbox"
                                >
                                    <FormCheck
                                        className="SignIn__form-check"
                                        type="checkbox"
                                        label="Remember Me"
                                    />
                                </Form.Group>

                                <Button
                                    variant="primary"
                                    type="submit"
                                    className="SignIn__btn-signin w-100"
                                >
                                    Sign in
                                </Button>
                            </Form>

                            <div className="or text-center">
                                <p>or</p>
                            </div>

                            <div className="other-signin">
                                <div className="d-grid">
                                    <Button
                                        className="SignIn__btn-signin-fb"
                                        onClick={() =>
                                            handleSignIn(providers["facebook"])
                                        }
                                    >
                                        <i className="bi bi-facebook SignIn__btn-icon" />
                                        <span className="SignIn__btn-text">
                                            Sign in with Facebook
                                        </span>
                                    </Button>
                                </div>

                                <div className="d-grid">
                                    <Button
                                        className="SignIn__btn-signin-gg"
                                        onClick={() =>
                                            handleSignIn(providers["google"])
                                        }
                                    >
                                        <i className="bi bi-google SignIn__btn-icon" />
                                        <span className="SignIn__btn-text">
                                            Sign in with Google
                                        </span>
                                    </Button>
                                </div>
                            </div>
                        </Card.Body>
                    </Card>

                    <div className="SignIn__sign-up mt-3 text-center">
                        <p>
                            Don't have an account ?
                            <span
                                className="ms-1 text-primary cur-pointer"
                                onClick={handleSignUp}
                            >
                                Signup now
                            </span>
                        </p>
                    </div>
                </Col>
            </Row>
        </div>
    );
};

export default SignIn;
