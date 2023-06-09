import React, { useEffect } from "react";
import { auth } from "configs/firebase/config";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import {
    signInWithRedirect,
    getRedirectResult,
    GoogleAuthProvider,
    FacebookAuthProvider,
    fetchSignInMethodsForEmail,
} from "firebase/auth";
import { addUser } from "configs/firebase/ServiceFirebase/ServiceInsert";
import { updateStatus } from "configs/firebase/ServiceFirebase/ServiceUpdate";
import SignIn from "./SignIn";
import { LogIn } from "configs/redux/Slice/UserSlice";
import { useDispatch } from "react-redux";
import { Body } from "components";
import { findUserAndKeyByUid } from "configs/firebase/ServiceFirebase/ServiceFind";

const providers = {
    google: new GoogleAuthProvider(),
    facebook: new FacebookAuthProvider(),
};

function LoginPage() {
    const currentUser = useSelector((state) => state.UserInfo.user);
    const dispatch = useDispatch();

    const handleSignIn = async (provider) => {
        await signInWithRedirect(auth, provider);
    };

    const handleAuthError = async (error) => {
        if (error.code === "auth/account-exists-with-different-credential") {
            var email = error.customData.email;
            const method = await fetchSignInMethodsForEmail(auth, email);
            const providerKey = method[0].split(".")[0];
            const provider = providers[providerKey];
            const accept = window.confirm(
                "You have sign in with another method with this email !!! Do you want to login with old method"
            );
            if (accept) {
                signInWithRedirect(auth, provider);
            }
        }
    };

    const handleResult = async () => {
        try {
            const result = await getRedirectResult(auth);
            if (result) {
                const { _tokenResponse, user } = result;
                if (_tokenResponse?.isNewUser) {
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
                } else {
                    await updateStatus(user);
                }
            }
        } catch (error) {
            await handleAuthError(error);
        }
    };

    useEffect(() => {
        handleResult();
        return () => {};
    });

    if (currentUser === null)
        return (
            <div>
                <Body>
                    <SignIn handleSignIn={handleSignIn} />
                </Body>
            </div>
        );
    else return <Navigate to="/MainPage" />;
}

export default React.memo(LoginPage);
