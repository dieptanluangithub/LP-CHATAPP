import React, { useLayoutEffect } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "configs/firebase/config";
import { LogIn, LogOut } from "configs/redux/Slice/UserSlice";
import { useDispatch, useSelector } from "react-redux";
import { findUserAndKeyByUid } from "configs/firebase/ServiceFirebase/ServiceFind";
import LoadingPage from "layout/Page/LoadingPage/LoadingPage";
function AuthProvider({ children }) {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const isLoading = useSelector((state) => state.UserInfo.pending);
    const currentPage = useSelector((state) => state.CurrentPage.page);
    useLayoutEffect(() => {
        const unsubscribed = auth.onAuthStateChanged(async (user) => {
            if (user !== null) {
                const { uid, displayName, photoURL, email } = user;
                findUserAndKeyByUid(uid).then((users) => {
                    if (users)
                        dispatch(
                            LogIn({
                                key: users.key,
                                displayName: users.val.displayName,
                                uid: users.val.uid,
                                email: users.val.email,
                                photoURL: users.val.photoURL,
                            })
                        );
                    else {
                        dispatch(
                            LogIn({
                                displayName: displayName,
                                uid: uid,
                                email: email,
                                photoURL: photoURL,
                            })
                        );
                    }
                });
            } else {
                dispatch(LogOut());
                if (currentPage === 1) navigate("/Login");
                else if (currentPage === 2) navigate("/SignUp");
                else if (currentPage === 3) navigate("/ResetPassword");
                else navigate("/Login");
            }
        });
        return () => {
            unsubscribed();
        };
    }, [currentPage, dispatch, navigate]);
    if (isLoading === true) return <LoadingPage />;
    return <>{children}</>;
}

export default React.memo(AuthProvider);
