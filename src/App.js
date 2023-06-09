import "./App.css";
import { Routes, Route } from "react-router-dom";
import MainPage from "layout/Page/MainPage/MainPage";
import LoginPage from "layout/Page/LoginPage/LoginPage";
import SignUp from "layout/Page/SignUpPage/SignUp";
import ResetPassword from "layout/Page/ResetPage/ResetPassword";
import { Navigate } from "react-router-dom";
import AuthProvider from "layout/Provider/AuthProvider";
import AppProvider from "layout/Provider/AppProvider";
import { ContextProvider } from "layout/Provider/Context";

function App() {
    return (
        <ContextProvider>
            <AuthProvider>
                <AppProvider>
                    <Routes>
                        <Route path="/SignUp" element={<SignUp />}></Route>
                        <Route
                            path="/ResetPassword"
                            element={<ResetPassword />}
                        ></Route>
                        <Route path="/Login" element={<LoginPage />}></Route>
                        <Route path="/MainPage" element={<MainPage />}></Route>
                        <Route path="*" element={<Navigate to="/Login" />} />
                    </Routes>
                </AppProvider>
            </AuthProvider>
        </ContextProvider>
    );
}

export default App;
