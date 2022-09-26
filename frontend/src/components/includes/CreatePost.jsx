import React, { useState, useRef } from "react";
import styled from "styled-components";
import { Helmet } from "react-helmet";

import axios from "../../config/axiosConfig";
import images from "../../assets/icons/images.svg";
import arrow from "../../assets/icons/arrow.svg";
import location from "../../assets/icons/location.svg";
import { useDispatch, useSelector } from "react-redux";
import { postActions } from "../../store/postSlice";
import { useNavigate } from "react-router-dom";

const CreatePost = ({ onClose }) => {
    // local states 
    const [isSelected, setIsSelected] = useState(false);
    const [showNextBtn, setShowNextBtn] = useState(false);
    const [postImages, setPostImages] = useState([]);

    const captionRef = useRef();
    const locationRef = useRef();

    const dispatch = useDispatch();
    const navigate = useNavigate();

    // global states
    const access = useSelector((state) => state.auth.token.access);
    const userData = useSelector((state) => state.auth.userData);

    const config = {
        headers: {
            authorization: `Bearer ${access}`,
        },
    };

    const uploadHandler = () => {
        const formData = new FormData();
        formData.append("description", captionRef.current.value);
        formData.append("location", locationRef.current.value);

        for (let i = 1; i <= postImages.length; i++) {
            formData.append("images", postImages[i - 1]);
            console.log(postImages[i - 1]);
        }
        axios
            .post("posts/create-new/", formData, config)
            .then((res) => {
                if (res.data.statusCode === 6000) {
                    console.log(res.data.data);
                    dispatch(postActions.addToPost(res.data.data));
                    onClose();
                    navigate('/')
                }
            })
            .catch((err) => {
                console.log(err);
            });
    };

    return (
        <>
            <Helmet>
                <title>Create Post</title>
            </Helmet>
            <MainWrapper onClick={onClose}>
                <ContentWrapper onClick={(e) => e.stopPropagation()}>
                    <div className={`top ${isSelected && "selected"}`}>
                        {isSelected && (
                            <img
                                src={arrow}
                                alt=""
                                onClick={(e) => setIsSelected(false)}
                            />
                        )}
                        <h3>Create New Post</h3>
                        {isSelected && (
                            <h3 className="share" onClick={uploadHandler}>
                                share
                            </h3>
                        )}
                    </div>
                    {!isSelected ? (
                        <div className="content">
                            <img src={images} alt="" />
                            <h3>Upload images to create new post</h3>
                            <label htmlFor="upload">
                                Select from your device
                            </label>
                            <form action="" encType="multipart/form-data">
                                <input
                                    type="file"
                                    id="upload"
                                    onChange={(e) => {
                                        // for (let item in e.target.files) {
                                        //     console.log(item);
                                        // }
                                        let newImages = [];
                                        for (
                                            let i = 1;
                                            i <= e.target.files.length;
                                            i++
                                        ) {
                                            console.log(e.target.files[i - 1]);
                                            newImages = newImages.concat(
                                                e.target.files[i - 1]
                                            );

                                            // setPostImages(
                                            //     ...postImages,
                                            //     e.target.files[i - 1]
                                            // );
                                        }
                                        // console.log(newImages);
                                        setPostImages(newImages);
                                        setShowNextBtn(true);
                                    }}
                                    multiple
                                    hidden
                                />
                            </form>
                            {showNextBtn && (
                                <button onClick={(e) => setIsSelected(true)}>
                                    next
                                </button>
                            )}
                        </div>
                    ) : (
                        <>
                            <div className="user-details">
                                <img src={userData.image} alt="" />
                                <h4>{userData.username}</h4>
                            </div>
                            <div className="caption">
                                <textarea
                                    placeholder="Write a caption....."
                                    ref={captionRef}
                                ></textarea>
                                <div className="location-wrapper">
                                    <input
                                        type="text"
                                        placeholder="location"
                                        ref={locationRef}
                                    />
                                    <img src={location} alt="" />
                                </div>
                            </div>
                        </>
                    )}
                </ContentWrapper>
            </MainWrapper>
        </>
    );
};

export default CreatePost;

const MainWrapper = styled.div`
    position: fixed;
    z-index: 30;
    top: 0;
    width: 100%;
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: rgb(0 0 0 / 60%);
`;
const ContentWrapper = styled.div`
    width: 30%;
    background-color: #fff;
    border-radius: 10px;

    .top {
        width: 100%;
        display: flex;
        justify-content: center;
        padding: 15px;
        border-bottom: 1px solid #535353;
        &.selected {
            justify-content: space-between;

            .share,
            img {
                color: #037dcf;
                cursor: pointer;
            }
        }

        h3 {
            font-weight: 600;
            font-size: 16px;
            color: #4f4f4f;
        }
    }
    .content {
        width: 100%;
        display: flex;
        align-items: center;
        flex-direction: column;
        padding-top: 250px;

        img {
            width: 50px;
        }
        h3 {
            margin: 15px 0;
            font-weight: 100;
            color: #808080;
        }
        label {
            background-color: #0095f6;
            color: white;
            padding: 10px;
            font-size: 16px;
            font-weight: 600;
            font-family: sans-serif;
            border-radius: 0.3rem;
            cursor: pointer;
            margin-top: 1rem;
            margin-bottom: 250px;
        }
        button {
            margin: 0 20px 20px auto;
            font-size: 15px;
            font-weight: 600;
            color: #037dcf;
            cursor: pointer;
        }
    }
    .user-details {
        display: flex;
        align-items: center;
        padding: 20px;
        margin-bottom: 16px;

        img {
            width: 15%;
            border-radius: 50%;
            margin-right: 16px;
        }
        h4 {
            font-weight: 600;
        }
    }
    .caption {
        textarea {
            width: 100%;
            min-height: 100px;
            font-size: 17px;
            border-bottom: 1px solid #53535375;
            padding: 0 20px;
        }
        .location-wrapper {
            display: flex;
            align-items: center;
            input {
                font-size: 17px;
                padding: 20px;
                width: 90%;
            }
        }
    }
`;
