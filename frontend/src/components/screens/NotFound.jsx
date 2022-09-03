import React from "react";
import { useDispatch,useSelector } from 'react-redux'
import { authActions } from '../../store/authSlice'

import Header from "../includes/Header";

function NotFound() {
    const dispatch = useDispatch();
    const isAuthenticated = useSelector(state => state.auth.isAuthenticated)

    if (!isAuthenticated){
        dispatch(authActions.logout())
    }

    return (
        <>
            <Header />
            <div>NotFound</div>
        </>
    );
}

export default NotFound;
