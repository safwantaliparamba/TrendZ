import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import styled from "styled-components";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import axios from "../../config/axiosConfig";
import profile from "../../assets/images/blank-profile.webp";
import save from "../../assets/icons/blank-bookmark.svg";
import saved from "../../assets/icons/bookmark.svg";
import dots from "../../assets/icons/3dots.png";
import comment from "../../assets/icons/comment.png";
import share from "../../assets/icons/share.png";
import like from "../../assets/icons/love.png";
import liked from "../../assets/icons/heart.png";
import { useSelector } from "react-redux";

const Post = ({ post }) => {
    const navigate = useNavigate();

    const [isLiked, setIsLiked] = useState(post.isLiked);
    const [likeCount, setLikeCount] = useState(post.likes);
    const [isSaved, setIsSaved] = useState(post.isSaved);

    const access = useSelector((state) => state.auth.token.access);

    const config = {
        headers: {
            authorization: `Bearer ${access}`,
        },
    };

    const likeHandler = (e) => {
        axios
            .get(`posts/${post.id}/like/`, config)
            .then((res) => {
                console.log(res.data);
                setIsLiked(res.data.liked);
                setLikeCount(res.data.count);
            })
            .catch((e) => {
                console.log(e.message);
            });
    };
    const savePostHandler = (e) => {
        axios
            .get(`posts/${post.id}/save-post/`, config)
            .then((res) => {
                console.log(res.data);
                setIsSaved(res.data.saved);
            })
            .catch((e) => {
                console.log(e.message);
            });
    };

    const settings = {
        arrows: true,
        fade: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        adaptiveHeight: true,
        dots: true,
    };

    return (
        <>
            <MainWrapper>
                <TopWrapper>
                    <div>
                        <Link to={`/${post.author.username}/`}>
                            <img
                                loading="lazy"
                                src={
                                    post.author.image
                                        ? post.author.image
                                        : profile
                                }
                                alt=""
                            />
                        </Link>
                        <Link to={`/${post.author.username}/`}>
                            {post.author.username}
                        </Link>
                    </div>
                    <div>
                        <img src={dots} alt="" />
                    </div>
                </TopWrapper>
                <CarouselWrapper>
                    <Slider {...settings}>
                        {post.images.map((image) => (
                            <div className="slider" key={image.id}>
                                <img
                                    onDoubleClick={likeHandler}
                                    src={image.image}
                                    alt=""
                                />
                            </div>
                        ))}
                    </Slider>
                </CarouselWrapper>
                <Actions>
                    <div className="actions">
                        <img
                            src={isLiked ? liked : like}
                            alt=""
                            onClick={likeHandler}
                        />
                        <img
                            src={comment}
                            onClick={(e) => navigate(`/p/${post.id}/`)}
                            alt=""
                        />
                        <img src={share} alt="" />
                    </div>
                    <div className="bookmark">
                        <img
                            src={isSaved ? saved : save}
                            alt=""
                            onClick={savePostHandler}
                        />
                    </div>
                </Actions>
                <LikeCount>
                    {likeCount} <span>{likeCount <= 1 ? "like" : "likes"}</span>
                </LikeCount>
                <p>
                    <Link to={`/${post.author.username}/`}>
                        {post.author.username}
                    </Link>
                    {post.description}
                </p>
            </MainWrapper>
        </>
    );
};

export default Post;

const MainWrapper = styled.div`
    background: #fff;
    padding: 14px 0;
    height: auto;
    border: 1px solid #8080809c;
    border-radius: 8px;
    margin-bottom: 24px;

    p {
        padding: 0 14px;
        a {
            color: #111;
            font-weight: 600;
            margin-right: 10px;
        }
    }
`;
const TopWrapper = styled.div`
    display: flex;
    justify-content: space-between;
    margin-bottom: 14px;
    padding: 0 14px;

    div {
        display: flex;
        align-items: center;
        a {
            &:first-child {
                width: 35px;
                display: block;
                margin-right: 10px;
            }
            &:last-child {
                color: #8f8f8f;
                font-weight: 600;
            }
            img {
                width: 100%;
                border-radius: 50%;
            }
        }
        &:last-child {
            img {
                width: 25px;
                height: auto;
                cursor: pointer;
            }
        }
    }
`;
const CarouselWrapper = styled.div`
    height: auto;
    .slider {
        height: auto;
        /* margin-bottom: 32px; */
        img {
            width: 100%;
            cursor: pointer;
        }
    }
`;

const Actions = styled.div`
    display: flex;
    justify-content: space-between;
    margin-top: 20px;
    padding: 10px 14px;

    img {
        cursor: pointer;
    }
    .actions {
        display: flex;
        img {
            width: 20px;
            margin-right: 10px;
        }
    }
    .bookmark {
        img {
            /* width:20px; */
        }
    }
`;
const LikeCount = styled.span`
    padding: 10px 14px;
    font-weight: 600;
    span {
        font-weight: 400;
    }
`;
