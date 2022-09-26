import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import styled from "styled-components";

import axios from "../../config/axiosConfig";
import PostModal from "../modal/PostModal";

const SavedPosts = () => {
    const access = useSelector((state) => state.auth.token.access);
    const [posts, setPosts] = useState([]);
    const [showPost, setShowPost] = useState(null);

    const config = {
        headers: {
            authorization: `Bearer ${access}`,
        },
    };

    useEffect(() => {
        axios
            .get("posts/saved-posts/", config)
            .then((res) => {
                console.log(res.data);
                setPosts(res.data.data);
            })
            .catch((err) => {
                console.log(err);
            });
    }, []);

    return (
        <>
            <MainWrapper>
                <h1>Saved Posts</h1>
                <BottomWrapper>
                    {posts.map((post) => (
                        <PostWrapper
                            key={post.id}
                            onClick={(e) => setShowPost(post.id)}
                        >
                            <img src={post.images[0].image} alt="" />
                        </PostWrapper>
                    ))}
                </BottomWrapper>
            </MainWrapper>
            {showPost && (
                <PostModal
                    id={showPost}
                    url='/saved-posts/'
                    onClose={(e) => {
                        window.history.replaceState(null, "", '/saved-posts/');
                        setShowPost(null);
                    }}
                />
            )}
        </>
    );
};

export default SavedPosts;

const MainWrapper = styled.div`
    padding-top: 100px;
    width: 70%;
    margin: 0 auto;
    h1 {
        text-align: center;
    }
`;
const BottomWrapper = styled.div`
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    gap: 2%;
    margin: 48px auto 32px;
    padding: 30px;
`;
const PostWrapper = styled.div`
    border: 1px solid #8080809c;
    display: inline-block;
    width: 32%;
    height: 280px;
    overflow: hidden;
    margin-bottom: 20px;
    img {
        width: 500px;
        height: 300px;
        margin-left: -75px;
        cursor: pointer;
    }
`;
