import { createSlice } from "@reduxjs/toolkit";
import jwt_decode from "jwt-decode";
const initialState = {
    socialData: localStorage.getItem("socialData")
        ? JSON.parse(localStorage.getItem("socialData"))
        : null,
    authData: localStorage.getItem("authData")
        ? JSON.parse(localStorage.getItem("authData"))
        : null,
    token: localStorage.getItem("token")
        ? JSON.parse(localStorage.getItem("token"))
        : null,
    isAuthenticated:
        localStorage.getItem("token") || localStorage.getItem("socialData")
            ? true
            : false,
    userData: localStorage.getItem("userData")
        ? JSON.parse(localStorage.getItem("userData"))
        : null,
};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        googleLogin(state, action) {
            state.socialData = action.payload.authData;
            state.isAuthenticated = true;
            state.userData = action.payload.profileData;
            localStorage.setItem(
                "socialData",
                JSON.stringify(state.socialData)
            );
            localStorage.setItem(
                "userData",
                JSON.stringify(action.payload.profileData)
            );
        },
        loginUser(state, action) {
            const data = jwt_decode(action.payload.token.access);
            state.authData = data;
            state.token = action.payload.token;
            state.isAuthenticated = true;
            state.userData = action.payload.profileData;
            localStorage.setItem("authData", JSON.stringify(data));
            localStorage.setItem("token", JSON.stringify(action.payload.token));
            localStorage.setItem(
                "userData",
                JSON.stringify(action.payload.profileData)
            );
        },
        logout(state) {
            localStorage.clear();
            state.isAuthenticated = false;
        },
        updateAccess(state, action) {
            state.token.access = action.payload.access;
            const token = JSON.parse(localStorage.getItem("token"));
            token.access = action.payload.access;
            localStorage.setItem("token", JSON.stringify(token));
        },
        updateUserData(state, { payload }) {
            state.userData = {}
            localStorage.setItem("userData", JSON.stringify(payload.userData));
            state.userData = payload.userData;
        },
    },
});

export const authActions = authSlice.actions;

export default authSlice.reducer;
