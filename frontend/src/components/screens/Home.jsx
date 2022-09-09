import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import styled from "styled-components";

import axios from "../../config/axiosConfig";
import { authActions } from "../../store/authSlice";
import Post from "../includes/Post";
import { Helmet } from "react-helmet";
import MainLoader from "../UI/MainLoader";

function Home() {
    const access = useSelector((state) => state.auth.token.access);
    const dispatch = useDispatch();
    const user = useSelector((state) => state.auth);

    const [posts, setPosts] = useState([]);

    const config = {
        headers: {
            authorization: `Bearer ${access}`,
        },
    };
    useEffect(() => {
        axios
            .get("posts/all/", config)
            .then((response) => {
                const data = response.data;
                console.log(data[0]);
                setPosts(data);
            })
            .catch((error) => {
                console.log(error);
            });
    }, []);

    return (
        <>
            <Helmet>
                <title>TrendZ</title>
            </Helmet>
            {posts ? (
                <MainWrapper>
                    {posts.map((post) => (
                        <Post post={post} key={post.id} />
                    ))}
                </MainWrapper>
            ) : (
                <MainLoader />
            )}
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
