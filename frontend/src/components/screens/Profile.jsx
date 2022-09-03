import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useSelector, useDispatch } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";

import axios from "../../config/axiosConfig";
import profile from "../../assets/images/blank-profile.webp";
import settings from "../../assets/icons/settings.svg";
import MainLoader from "../UI/MainLoader";
import { authActions } from "../../store/authSlice";
import { alertActions } from "../../store/alertSlice";

function Profile() {
    const access = useSelector((state) => state.auth.token.access);
    const [userObject, setUserObject] = useState({});
    const [isAuthor, setIsAuthor] = useState(false);
    // const [isFollowing, setIsFollowing] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const { username } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        console.log(username);
        const config = {
            headers: {
                authorization: `Bearer ${access}`,
            },
        };
        axios
            .get(`users/${username}/`, config)
            .then((res) => {
                console.log(res.data);
                setIsLoading(false);
                if (res.data.statusCode !== 6001) {
                    setUserObject(res.data.data);
                    setIsAuthor(res.data.is_author);
                } else {
                    navigate("/");
                    dispatch(
                        alertActions.addAlert({
                            type: "err",
                            message: "user not found",
                        })
                    );
                }
            })
            .catch((err) => {
                console.log(err);
                if (err.response.status === 401){
                    dispatch(authActions.logout())
                }
            });
    }, [username]);

    return (
        <>
            {isLoading ? (
                <MainLoader />
            ) : (
                <TopWrapper>
                    <TopLeft className="left">
                        <img
                            src={
                                userObject?.image ? userObject?.image : profile
                            }
                            alt=""
                        />
                    </TopLeft>
                    <TopRight className="right">
                        <NameContainer>
                            <h3>{userObject?.user?.username}</h3>
                            {isAuthor ? (
                                <img src={settings} alt="" />
                            ) : (
                                <span
                                    className="btn"
                                    onClick={(e) =>
                                        dispatch(
                                            alertActions.addAlert({
                                                type: "success",
                                                message:
                                                    "successfully following this user",
                                            })
                                        )
                                    }
                                >
                                    follow
                                </span>
                            )}
                        </NameContainer>
                        <FollowDetails>
                            <h5>
                                <span>0</span>posts
                            </h5>
                            <h5>
                                <span>28392</span>followers
                            </h5>
                            <h5>
                                <span>2292</span>followings
                            </h5>
                        </FollowDetails>
                        <Bio>
                            <h4>{userObject.name}</h4>
                            {userObject.bio && <p>{userObject.bio}</p>}
                        </Bio>
                    </TopRight>
                </TopWrapper>
            )}
        </>
    );
}

export default Profile;

const TopWrapper = styled.div`
    max-width: 750px;
    margin: 0 auto;
    margin-top: 64px;
    display: flex;
    /* justify-content: space-around; */
    align-items: center;
    padding-top: 40px;
`;

const TopLeft = styled.div`
    width: 50%;
    display: flex;
    align-items: center;
    justify-content: center;

    img {
        width: 130px;
        border-radius: 50%;
        padding: 5px;
        border: 2px solid #99999938;
        cursor: pointer;
    }
`;
const TopRight = styled.div`
    width: 50%;
`;
const NameContainer = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 22px;

    img {
        width: 26px;
        cursor: pointer;
    }
    h3 {
        font-size: 24px;
        color: #676767;
    }
    span.btn {
        padding: 6px 18px;
        border-radius: 5px;
        background: #0095f6;
        font-weight: 600;
        color: #fff;
        cursor: pointer;
        &.unfollow {
            background: none;
            border: 1px solid #9999997e;
            color: #444444;
        }
    }
`;
const FollowDetails = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 24px;

    h5 {
        font-size: 16px;
        margin-right: 20px;
        color: #595959;
        cursor: pointer;

        &:first-child {
            cursor: default;
        }
        span {
            color: #111;
            margin-right: 8px;
            font-weight: 600;
        }
    }
`;
const Bio = styled.div`
    h4 {
        font-size: 17px;
        font-weight: 600;
        margin-bottom: 18px;
    }
    p {
        line-height: 24px;
        font-size: 17px;
        letter-spacing: 0.5px;
    }
`;
