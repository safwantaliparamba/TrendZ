import React, { useEffect, useState } from "react";
import { Outlet, Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import styled, { css } from "styled-components";

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
    const [isEmptyPost, setIsEmptyPost] = useState(false);

    const config = {
        headers: {
            authorization: `Bearer ${access}`,
        },
    };
    useEffect(() => {
        setIsLoading(true);
        const controller = new AbortController();
        axios
            .get("posts/all/", config, {
                signal: controller.signal,
            })
            .then((response) => {
                const data = response.data;
                console.log(data);
                if (data.length === 0) {
                    setIsEmptyPost(true);
                    dispatch(postActions.initialPost([]));
                } else {
                    const sortedArray = data.sort(
                        (a, b) => new Date(a.timestamp) - new Date(b.timestamp)
                    );
                    dispatch(postActions.initialPost(sortedArray.reverse()));
                }
            })
            .then((res) => {
                setIsLoading(false);
            })
            .catch((error) => {
                console.log(error);
                setIsLoading(false);
            });

        return () => {
            controller.abort();
        };
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
            {isEmptyPost && (
                <MainWrapper empty>
                    <div className="emptyPost">
                        <h1>Explore to see posts</h1>
                        <Link to="/explore/">explore</Link>
                    </div>
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

    ${props => props.empty && css`
        background: inherit;
        display: flex;
        justify-content: center;
        align-items: center;
        height: 500px;
    `}

    a {
        color: red;
    }
    .emptyPost {
        text-align: center;
        h1 {
            margin-bottom: 24px;
            font-weight: 600;
            color:#4f4d4d;
        }
        a {
            color: #111;
            background:#0095f6;
            color:#fff;
            padding:10px 20px;
            font-weight: 600;
            border-radius:7px;
        }
    }
`;
