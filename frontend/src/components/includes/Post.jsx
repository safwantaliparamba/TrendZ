import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import styled from "styled-components";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Swal from "sweetalert2";

import axios from "../../config/axiosConfig";
import profile from "../../assets/images/blank-profile.webp";
import save from "../../assets/icons/blank-bookmark.svg";
import saved from "../../assets/icons/bookmark.svg";
import dots from "../../assets/icons/3dots.png";
import comment from "../../assets/icons/comment.png";
import share from "../../assets/icons/share.png";
import like from "../../assets/icons/love.png";
import liked from "../../assets/icons/heart.png";
import { useDispatch, useSelector } from "react-redux";
import PostModal from "../modal/PostModal";
import ActionsModal from "../modal/ActionsModal";
import { postActions } from "../../store/postSlice";

const Post = ({ post }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [isLiked, setIsLiked] = useState(post.isLiked);
    const [likeCount, setLikeCount] = useState(post.likes);
    const [isSaved, setIsSaved] = useState(post.isSaved);
    const [showActions, setShowActions] = useState(false);
    const [showDetailedPost, setShowDetailedPost] = useState(false);

    const access = useSelector((state) => state.auth.token.access);
    const username = useSelector((state) => state.auth.userData.username);

    function formatDate(date) {
        let d = new Date(date),
            month = '' + (d.getMonth() ),
            day = '' + d.getDate(),
            year = d.getFullYear(),
            hour = d.getHours(),
            minute = d.getMinutes()
    
        if (month.length < 2) 
            month = '0' + month;
        if (day.length < 2) 
            day = '0' + day;
        if(hour > 12){
            hour -= 12
        }
        const months = ['January','February','March','April','May','June','July','August','September','October','November','December']

        // console.log(`${[day,month,year].join('-')}  ${[hour,minute].join(':')}`)
        return months[+month]+" " + day
    

    }


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
    const DeletePostHandler = (e) => {
        Swal.fire({
            title: "Confirm!",
            text: "Are you sure you want to delete this post?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Delete it",
        }).then((result) => {
            if (result.isConfirmed) {
                axios
                    .delete(`posts/${post.id}/delete/`, config)
                    .then((response) => {
                        console.log(response.data);
                        if (response.data.statusCode === 6000) {
                            dispatch(
                                postActions.deletePost({ postId: post.id })
                            );
                            navigate(`/${username}/`);
                        }
                    })
                    .catch((e) => {
                        console.log(e);
                    });
            }
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
            {showActions && (
                <ActionsModal onClose={(e) => setShowActions(false)}>
                    <>
                        <li className="danger">Report</li>
                        <li
                            onClick={(e) => {
                                setShowDetailedPost(true);
                                setShowActions(false);
                            }}
                        >
                            Go to post
                        </li>
                        <li
                            onClick={(e) => {
                                const host =
                                    window.location.protocol +
                                    "//" +
                                    window.location.host;
                                navigator.clipboard.writeText(
                                    `${host}/p/${post.id}/`
                                );
                            }}
                        >
                            Copy link
                        </li>
                        {post.isAuthor && (
                            <>
                                <li>Edit post</li>
                                <li
                                    className="danger"
                                    onClick={DeletePostHandler}
                                >
                                    Delete post
                                </li>
                            </>
                        )}
                    </>
                </ActionsModal>
            )}
            {showDetailedPost && (
                <PostModal
                    id={post.id}
                    url="/"
                    onClose={(e) => {
                        setShowDetailedPost(false);
                        window.history.replaceState(null, "", "/");
                    }}
                />
            )}
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
                        <img
                            src={dots}
                            alt=""
                            onClick={(e) => setShowActions(true)}
                        />
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
                            onClick={(e) => setShowDetailedPost(true)}
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
                <span className="time">{formatDate(post.timestamp)}</span>
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
    span.time{
        padding: 0 14px;
        font-size: 12px;
        font-weight: 600;
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
                max-width: 500px;
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
