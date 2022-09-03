import React from "react";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import styled from "styled-components";

import { authActions } from "../../store/authSlice";

function Home() {
    const dispatch = useDispatch();
    const user = useSelector((state) => state.auth);
    // const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
    return (
        <>
            <LinkWrapper>
                <h1>Home</h1>
                <button onClick={(e) => dispatch(authActions.logout())}>
                    Logout
                </button>
                <Link to="/protected">protected</Link>
                <Link to="/auth/login">login</Link>
            </LinkWrapper>

            <p>{JSON.stringify(user)}</p>
        </>
    );
}

export default Home;

const LinkWrapper = styled.div`
    margin-top: 100px;
    background: #f0f0f0;
    a {
        color: red;
    }
`;
