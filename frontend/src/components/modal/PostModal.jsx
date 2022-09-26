import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import Slider from "react-slick";
import styled from "styled-components";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Link, useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";

import axios from "../../config/axiosConfig";
import InnerLoader from "../UI/InnerLoader";
import dots from "../../assets/icons/3dots.png";
import save from "../../assets/icons/blank-bookmark.svg";
import saved from "../../assets/icons/bookmark.svg";
import comment from "../../assets/icons/comment.png";
import share from "../../assets/icons/share.png";
import like from "../../assets/icons/love.png";
import liked from "../../assets/icons/heart.png";
import smile from "../../assets/icons/smile.png";
import ActionsModal from "./ActionsModal";
import Header from "../includes/Header";
import { postActions } from "../../store/postSlice";
import EditPostModal from "./EditPostModal";

const PostModal = ({
    id,
    onClose = () => {
        console.log("default");
    },
    url,
    deletePost = false,
    editPost = false,
}) => {
    const { postId } = useParams();
    const navigate = useNavigate();

    const dispatch = useDispatch();

    const [post, setPost] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [isSaved, setIsSaved] = useState(false);
    const [isLiked, setIsLiked] = useState(false);
    const [likeCount, setLikeCount] = useState(false);
    const [showActions, setShowActions] = useState(false);
    const [showEditPost, setShowEditPost] = useState(editPost);

    const access = useSelector((state) => state.auth.token.access);
    const username = useSelector((state) => state.auth.userData.username);

    const config = {
        headers: {
            authorization: `Bearer ${access}`,
        },
    };

    const LinkHandler = (e) => {
        onClose();
        window.history.replaceState(null, "", url);
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
                            onClose();
                            deletePost(post.id);
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

    useEffect(() => {
        if (postId && !id) {
            id = postId;
        }
        window.history.replaceState(null, "", `/p/${id}/`);
        if (Object.keys(post).length === 0) {
            setIsLoading(true);
            axios
                .get(`posts/${id}/`, config)
                .then((res) => {
                    console.log(res.data);
                    setPost(res.data.data);
                    setIsLoading(false);
                    setIsSaved(res.data.data.isSaved);
                    setIsLiked(res.data.data.isLiked);
                    setLikeCount(res.data.data.likes);
                })
                .catch((e) => {
                    console.log(e);
                    setIsLoading(false);
                });
        }
    }, []);

    const settings = {
        arrows: false,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
    };

    return (
        <>
            {showEditPost && (
                <EditPostModal
                    post={post}
                    onClose={(e) => {
                        setShowEditPost(false);
                    }}
                />
            )}
            {showActions && (
                <ActionsModal onClose={(e) => setShowActions(false)}>
                    <>
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
                                <li
                                    onClick={(e) => {
                                        setShowActions(false);
                                        setShowEditPost(true);
                                    }}
                                >
                                    Edit post
                                </li>
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
            <MainWrapper
                onClick={(e) => onClose()}
                className={`${postId && "postId"}`}
            >
                {postId && <Header />}
                <ContentWrapper
                    onClick={(e) => e.stopPropagation()}
                    className={`${postId && "content-wrapper"}`}
                >
                    {!isLoading ? (
                        <>
                            <div className="left">
                                <Slider {...settings}>
                                    {post.images?.map((image) => (
                                        <div className="slider" key={image.id}>
                                            <img src={image?.image} alt="" />
                                        </div>
                                    ))}
                                </Slider>
                            </div>
                            <div className="right">
                                <div className="top">
                                    <div className="left">
                                        <Link
                                            to={`/${post?.author?.username}/`}
                                            onClick={LinkHandler}
                                        >
                                            <img
                                                src={post?.author?.image}
                                                alt=""
                                            />
                                        </Link>
                                        <Link
                                            to={`/${post?.author?.username}/`}
                                            onClick={LinkHandler}
                                        >
                                            {post?.author?.username}
                                        </Link>
                                    </div>
                                    <div className="right">
                                        <img
                                            src={dots}
                                            alt=""
                                            onClick={(e) =>
                                                setShowActions(true)
                                            }
                                        />
                                    </div>
                                </div>
                                <div className="comments">
                                    <p>some comments</p>
                                </div>
                                <div className="bottom">
                                    <div className="actions">
                                        <div className="left">
                                            <img
                                                src={isLiked ? liked : like}
                                                alt=""
                                                onClick={likeHandler}
                                            />
                                            <img src={comment} alt="" />
                                            <img src={share} alt="" />
                                        </div>
                                        <div className="right">
                                            <img
                                                src={isSaved ? saved : save}
                                                alt=""
                                                onClick={savePostHandler}
                                            />
                                        </div>
                                    </div>
                                    <p className="likesCount">
                                        <span>{likeCount}</span>likes
                                    </p>
                                    <div className="add-comment">
                                        <img src={smile} alt="" />
                                        <input
                                            type="text"
                                            placeholder="Add a Comment..."
                                        />
                                        <button>Post</button>
                                    </div>
                                </div>
                            </div>
                        </>
                    ) : (
                        <LoaderWrapper>
                            <InnerLoader />
                        </LoaderWrapper>
                    )}
                </ContentWrapper>
            </MainWrapper>
        </>
    );
};

export default PostModal;

const MainWrapper = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 100;
    background: #8080804e;

    &.postId {
        background: #f0f0f0;
        .content-wrapper {
            margin-top: 100px;
            width: 50%;
            height: 80vh;
            border: 1px solid #808080;
            border-radius: 10px;
            overflow: hidden;

            .comments {
                height: 75%;
            }
        }
    }
`;

const ContentWrapper = styled.div`
    width: 70%;
    height: 93vh;
    background: #fff;
    display: flex;

    & > .left {
        width: 60%;
        display: flex;
        justify-content: center;
        align-items: center;
        background-color: #010101;
        padding: 10px 0;
        overflow: hidden;
        * {
            width: 100%;
            display: flex;
            justify-content: center;
            align-items: center;
        }

        .slider {
            z-index: 100;
            display: block;

            img {
                width: 100%;
                max-height: 100%;
            }
        }
    }
    .right {
        width: 40%;

        .top {
            display: flex;
            justify-content: space-between;
            align-items: center;
            width: 100%;
            padding: 3% 20px;
            border-bottom: 1px solid #8080804e;

            .left {
                display: flex;
                align-items: center;
                a {
                    color: #646464;
                    font-weight: 600;
                    font-size: 15px;
                    img {
                        width: 30px;
                        border-radius: 50%;
                    }
                }

                a:first-child {
                    margin-right: 10px;
                }
            }
            .right {
                width: max-content;
                img {
                    width: 20px;
                    cursor: pointer;
                }
            }
        }
        .comments {
            width: 100%;
            height: 78%;
            max-height: 78%;
            overflow: hidden;
            /* background: #8888; */
        }
        .bottom {
            width: 100%;
            border-top: 1px solid #8080804e;

            .actions {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 8px 10px;
                img {
                    cursor: pointer;
                }

                .left {
                    display: flex;
                    align-items: center;

                    img {
                        width: 20px;
                        margin-right: 10px;
                        &:last-child {
                            margin-right: 0;
                        }
                    }
                }
                .right {
                    width: max-content;

                    img {
                        width: 20px;
                    }
                }
            }
            p.likesCount {
                padding: 0 10px;
                margin-bottom: 6px;
                span {
                    font-weight: 600;
                    margin-right: 7px;
                }
            }
            .add-comment {
                padding: 15px;
                display: flex;
                align-items: center;
                gap: 10px;
                border-top: 1px solid #8080804e;

                img {
                    width: 30px;
                }
                input {
                    width: 80%;
                    font-size: 16px;
                }
                button {
                    font-size: 16px;
                    font-weight: 600;
                    color: #0095f6;
                    cursor: pointer;
                }
            }
        }
    }
`;

const LoaderWrapper = styled.div`
    width: 100%;
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
`;
