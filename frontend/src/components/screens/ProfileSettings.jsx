import React, { useRef, useState, useEffect, memo } from "react";
import styled from "styled-components";
import { useNavigate, useParams } from "react-router-dom";
import Cropper from "react-cropper";
import "cropperjs/dist/cropper.css";
import { useSelector, useDispatch } from "react-redux";

import axios from "../../config/axiosConfig";
import arrow from "../../assets/icons/arrow.svg";
import MainLoader from "../UI/MainLoader";
import profile from "../../assets/images/blank-profile.webp";
import { authActions } from "../../store/authSlice";
import { alertActions } from "../../store/alertSlice";
import { Helmet } from "react-helmet";

const ProfileSettings = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const cropperRef = useRef();
    const imageUploadRef = useRef();
    const { username } = useParams();

    const access = useSelector((state) => state.auth.token.access);
    const profileImage = useSelector((state) => state.auth.userData.image);

    const [isLoading, setIsLoading] = useState(false);
    const [image, setImage] = useState(profileImage ? profileImage : profile);
    const [demoImage, setDemoimage] = useState(
        profileImage ? profileImage : profile
    );
    const [isImageSelected, setisImageSelected] = useState(false);
    const [userName, setUsername] = useState("");
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [bio, setBio] = useState("");

    useEffect(() => {
        setIsLoading(true);
        const config = {
            headers: {
                authorization: `Bearer ${access}`,
            },
        };

        axios
            .get("users/update/", config)
            .then((res) => {
                const data = res.data;
                console.log(data);
                if (res.status === 200) {
                    setUsername(data.userData.username);
                    setName(data.author_data.name);
                    setEmail(data.userData.email);
                    setBio(data.author_data.bio);
                    setImage(data.author_data.image);
                }
                setIsLoading(false);
            })
            .catch((err) => {
                console.log(err);
                setIsLoading(false);
            });
    }, []);

    const onCrop = () => {
        const imageElement = cropperRef?.current;
        const cropper = imageElement?.cropper;
        setImage(cropper.getCroppedCanvas().toDataURL());
    };

    const submitHandler = (e) => {
        const formData = new FormData();
        formData.append("image", image);
        formData.append("email", email);
        formData.append("name", name);
        formData.append("bio", bio);
        const config = {
            headers: {
                authorization: `Bearer ${access}`,
            },
        };
        axios
            .patch("users/update/", formData, config)
            .then((res) => {
                console.log(res);
                dispatch(
                    authActions.updateUserData({
                        userData: res.data.userData,
                    })
                );
                navigate(`/${res.data.userData.username}/`);
                dispatch(
                    alertActions.addAlert({
                        message: "Profile Updated Successfully",
                        type: "success",
                    })
                );
            })
            .catch((err) => console.log(err));
    };

    return (
        <>
            <Helmet>
                <title>Settings</title>
            </Helmet>
            {isLoading ? (
                <MainLoader />
            ) : (
                <MainWrapper>
                    <ContentWrapper>
                        <TopWrapper>
                            <img
                                src={arrow}
                                onClick={(e) => navigate(-1)}
                                alt="arrow"
                            />
                            <h1>Settings</h1>
                        </TopWrapper>
                        <FormWrapper>
                            <div className="left">
                                {/* <div className="input-container">
                                    <label htmlFor="username">Username</label>
                                    <input
                                        type="text"
                                        id="username"
                                        onChange={(e) =>
                                            setUsername(e.target.value)
                                        }
                                        value={userName}
                                    />
                                </div> */}
                                <div className="input-container">
                                    <label htmlFor="name">Name</label>
                                    <input
                                        type="text"
                                        id="name"
                                        onChange={(e) =>
                                            setName(e.target.value)
                                        }
                                        value={name}
                                    />
                                </div>
                                <div className="input-container">
                                    <label htmlFor="email">Email</label>
                                    <input
                                        type="email"
                                        id="email"
                                        value={email}
                                        onChange={(e) => {
                                            setEmail(e.target.value);
                                        }}
                                    />
                                </div>
                                <div className="input-container">
                                    <label htmlFor="bio">Bio</label>
                                    <textarea
                                        onChange={(e) => {
                                            setBio(e.target.value);
                                        }}
                                        value={bio}
                                        id="bio"
                                        cols="30"
                                        rows="10"
                                    ></textarea>
                                </div>
                                <button onClick={submitHandler}>
                                    Update Profile
                                </button>
                            </div>
                            <div className="right">
                                <img
                                    src={image ? image : profile}
                                    onClick={(e) => {
                                        imageUploadRef.current.click();
                                    }}
                                    alt=""
                                    title="Click to change profile picture"
                                />
                                <input
                                    style={{ display: "none" }}
                                    type="file"
                                    ref={imageUploadRef}
                                    accept="image/*"
                                    onChange={(e) => {
                                        let file = e.target.files[0];
                                        let reader = new FileReader();
                                        let url = reader.readAsDataURL(file);

                                        reader.onloadend = function (e) {
                                            setDemoimage(reader.result);
                                        };
                                        console.log(url);
                                        setisImageSelected(true);
                                    }}
                                />
                            </div>
                        </FormWrapper>

                        {isImageSelected && (
                            <CropperWrapper>
                                <Cropper
                                    src={demoImage}
                                    style={{ height: 400 }}
                                    aspectRatio={1 / 1}
                                    crop={onCrop}
                                    ref={cropperRef}
                                />
                                <button
                                    onClick={(e) => setisImageSelected(false)}
                                >
                                    Select
                                </button>
                            </CropperWrapper>
                        )}
                    </ContentWrapper>
                </MainWrapper>
            )}
        </>
    );
};

export default memo(ProfileSettings);

const CropperWrapper = styled.div`
    /* width: 70%;
    display: flex;
    flex-wrap: wrap;
    justify-content: center; */
    background: #fff;
    border: 2px solid #808080;
    border-radius: 10px;
    position: absolute;
    top: 96px;
    /* left: 454px; */
    padding: 50px;

    button {
        display: block;
        margin: 20px auto;
        border-radius: 10px;
        padding: 8px 18px;
        font-size: 17px;
        font-weight: 600;
        background: #00f2ff;
        cursor: pointer;
    }
`;
const MainWrapper = styled.div`
    position: absolute;
    width: 100%;
    height: 100vh;
    top: 0;
    z-index: 20;
    background: #ffffff52;
`;

const ContentWrapper = styled.div`
    border: 1px solid #8080809c;
    border-radius: 10px;
    width: 70%;
    margin: 100px auto;
    padding: 40px;
    background: #fff;
`;

const TopWrapper = styled.div`
    display: flex;
    justify-content: center;

    img {
        margin-right: auto;
        width: 30px;
        cursor: pointer;
    }
    h1 {
        margin-right: auto;
    }
`;

const FormWrapper = styled.div`
    display: flex;
    justify-content: space-between;
    width: 60%;
    margin: 0 auto;
    margin-top: 50px;
    padding: 18px;
    .left {
        width: 60%;

        .input-container {
            label {
                font-size: 18px;
                display: block;
                margin-bottom: 10px;
                cursor: pointer;
                /* color: #111; */
                /* font-weight: 600; */
            }
            input,
            textarea {
                font-size: 17px;
                border-radius: 5px;
                display: block;
                border: 1px solid #808080b9;
                color: #808080;
                padding: 6px;
                width: 95%;
                margin: 0 auto;
                margin-bottom: 20px;
            }
        }
        button {
            border: 1px solid #0c5300;
            background: #238636;
            /* background: #42ff36fa; */
            padding: 10px 20px;
            margin-left: 10px;
            margin-top: 24px;
            border-radius: 10px;
            font-size: 16px;
            font-weight: 600;
            cursor: pointer;
            color: #fff;
        }
    }
    .right {
        width: 40%;

        img {
            width: 200px;
            border-radius: 50%;
            cursor: pointer;
            display: block;
            margin: 0 auto;
        }
    }
`;
