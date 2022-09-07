import React from "react";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import styled from "styled-components";

import { authActions } from "../../store/authSlice";
import Post from "../includes/Post";

function Home() {
    const dispatch = useDispatch();
    const user = useSelector((state) => state.auth);
    // const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
    return (
        <>
            <MainWrapper>
                <Post />
            </MainWrapper>
        </>
    );
}

export default Home;

const MainWrapper = styled.div`
    width: 40%;
    margin: 100px auto 0;
    /* margin-top: 63px; */
    background: #f0f0f0;
    a {
        color: red;
    }
`;
