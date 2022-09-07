import React from "react";
import { Routes, Route } from "react-router-dom";

import Header from "../includes/Header";
import Home from "../screens/Home";
import NotFound from "../screens/NotFound";
import Profile from "../screens/Profile";
import ProfileSettings from "../screens/ProfileSettings";

function MainRouter() {
    return (
        <>
            <Header />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path=":username/*" element={<Profile />} >
                    <Route path="settings/" element={<ProfileSettings />} />
                </Route>
                <Route path="*" element={<NotFound />} />
            </Routes>
        </>
    );
}

export default MainRouter;
