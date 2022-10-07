import React from "react";
import { Routes, Route} from "react-router-dom";

import Header from "../includes/Header";
import Followers from "../modal/Followers";
import PostModal from "../modal/PostModal";
import Explore from "../screens/Explore";
import Home from "../screens/Home";
import NotFound from "../screens/NotFound";
import Profile from "../screens/Profile";
import ProfileSettings from "../screens/ProfileSettings";
import SavedPosts from "../screens/SavedPosts";

function MainRouter() {
    return (
        <>
            <Header />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/p/:postId/" element={<PostModal />} />
                <Route path="/saved-posts/" element={<SavedPosts />} />
                <Route path="/explore/" element={<Explore />} />
                <Route path=":username/*" element={<Profile />}>
                    <Route path="settings/" element={<ProfileSettings />} />
                    <Route path="followers/" element={<Followers />} />
                    <Route path="following/" element={<Followers />} />
                </Route>
                <Route path="*" element={<NotFound />} />
            </Routes>
        </>
    );
}

export default MainRouter;
