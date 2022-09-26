import { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

import "./App.css";
import { authActions } from "./store/authSlice";
import axios from "./config/axiosConfig";
import AuthRouter from "./components/routes/AuthRouter";
import MainRouter from "./components/routes/MainRouter";
import PrivateRoute from "./components/includes/PrivateRoute";
import Alert from "./components/UI/Alert";

function App() {
    const [error, setError] = useState(false);
    const dispatch = useDispatch();
    const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
    const refreshToken = useSelector((state) => state.auth.token);
    const alert = useSelector((state) => state.alert);

    useEffect(() => {
        console.log(alert);
        if (isAuthenticated === true) {
            const config = {
                headers: {
                    authorization: `Bearer ${refreshToken.access}`,
                },
            };
            axios
                .post("auth/token/refresh/", { refresh: refreshToken.refresh })
                .then((response) => {
                    console.log(response.data);
                    dispatch(
                        authActions.updateAccess({
                            access: response.data.access,
                        })
                    );
                })
                .catch((error) => {
                    if (
                        error.response.status === 400 ||
                        error.response.status === 401
                    ) {
                        dispatch(authActions.logout());
                    }
                });

            axios
                .get("users/get-user-data/", config)
                .then((res) => {
                    console.log(res.data);
                    dispatch(
                        authActions.updateUserData({ userData: res.data })
                    );
                })
                .catch((err) => {
                    console.log(err);
                });
        }
    }, []);

    return (
        <>
            {alert.alert && (
                <Alert
                    onClick={(e) => setError(false)}
                    message={alert.message}
                    type={alert.type}
                />
            )}
            <Routes>
                <Route path="/auth/*" element={<AuthRouter />} />
                <Route
                    path="/*"
                    element={
                        <PrivateRoute>
                            <MainRouter />
                        </PrivateRoute>
                    }
                />
            </Routes>
        </>
    );
}

export default App;
