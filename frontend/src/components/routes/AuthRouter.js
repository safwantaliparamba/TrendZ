import React from "react";
import { Routes, Route } from "react-router-dom";
import Login from "../screens/Login";
import Register from "../screens/Register";

function AuthRouter() {
    return (
        <>
            <Routes>
                <Route path="login/" element={<Login />} />
                <Route path="register/" element={<Register />} />
            </Routes>
        </>
    );
}

export default AuthRouter;
