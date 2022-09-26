import React, { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import styled from "styled-components";

import axios from "../../config/axiosConfig";
import Post from "../includes/Post";
import { Helmet } from "react-helmet";
import Loader from "../UI/Loader";
import { postActions } from "../../store/postSlice";

function Home() {
    const access = useSelector((state) => state.auth.token.access);
    const dispatch = useDispatch();
    const posts = useSelector((state) => state.posts);

    const [isLoading, setIsLoading] = useState(false);

    const config = {
        headers: {
            authorization: `Bearer ${access}`,
        },
    };
    useEffect(() => {
        setIsLoading(true);
        axios
            .get("posts/all/", config)
            .then((response) => {
                const data = response.data;
                console.log(data);
                dispatch(postActions.initialPost(data));
            })
            .then((res) => {
                setIsLoading(false);
            })
            .catch((error) => {
                console.log(error);
                setIsLoading(false);
            });
    }, []);

    return (
        <>
            {isLoading && <Loader />}
            <Helmet>
                <title>TrendZ</title>
            </Helmet>
            {posts && (
                <MainWrapper>
                    {posts.map((post) => (
                        <Post post={post} key={post.id} />
                    ))}
                </MainWrapper>
            )}
            <Outlet />
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
