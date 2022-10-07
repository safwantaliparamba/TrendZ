import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import styled from "styled-components";

import axios from "../../config/axiosConfig";
import closeBtn from "../../assets/icons/close.svg";
import InnerLoader from "../UI/InnerLoader";
import { useSelector } from "react-redux";

const Followers = () => {
    const { username } = useParams();
    const location = useLocation();
    const navigate = useNavigate();

    const access = useSelector((state) => state.auth.token.access);

    const [pageTitle, setPageTitle] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [users, setUsers] = useState([]);

    const config = {
        headers: {
            authorization: `Bearer ${access}`,
        },
    };

    useEffect(() => {
        let var_;
        if (location.pathname.endsWith("/following/")) {
            var_ = "Following";
        } else if (location.pathname.endsWith("/followers/")) {
            var_ = "Followers";
        }
        setPageTitle(var_);
        setIsLoading(true);
        axios
            .get(`users/${username}/${var_.toLowerCase()}/`, config)
            .then((res) => {
                console.log(res.data);
                setUsers(res.data.data);
            })
            .catch((err) => {
                console.log(err);
            });
        setIsLoading(false);
    }, []);

    const closeHandler = (e) => {
        navigate(`/${username}/`);
    };

    return (
        <MainWrapper onClick={closeHandler}>
            <ContentWrapper onClick={(e) => e.stopPropagation()}>
                <div className="top">
                    <h3>{pageTitle}</h3>
                    <img onClick={closeHandler} src={closeBtn} alt="" />
                </div>
                <div className="content">
                    {isLoading ? (
                        <LoaderWrapper>
                            <InnerLoader />
                        </LoaderWrapper>
                    ) : (
                        <>
                            <ul>
                                {users?.map((user) => (
                                    <li key={user.id}>
                                        <Link to={`/${user.username}/`}>
                                            <img
                                                src={user.image}
                                                alt={user.username}
                                            />
                                        </Link>
                                        <Link to={`/${user.username}/`}>
                                            {user.username}{" "}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                            {users.length === 0 && (
                                <LoaderWrapper>
                                    <h1>No {pageTitle}</h1>
                                </LoaderWrapper>
                            )}
                        </>
                    )}
                </div>
            </ContentWrapper>
        </MainWrapper>
    );
};

export default Followers;

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
`;

const ContentWrapper = styled.div`
    width: 400px;
    height: 500px;
    max-height: 500px;
    border-radius: 10px;
    background: #fff;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.25);
    .top {
        display: flex;
        justify-content: space-between;
        padding: 14px;
        border-bottom: 1px solid #b7b7b79c;

        h3 {
            width: 95%;
            text-align: center;
            color: #565454;
            font-size: 16px;
            font-weight: 600;
        }
        img {
            width: 20px;
            cursor: pointer;
        }
    }
    .content {
        height: 450px;

        ul {
            li {
                padding: 8px 14px;
                display: flex;
                align-items: center;
                a {
                    display: flex;
                    align-items: center;
                    margin-right: 18px;
                    font-weight: 600;
                    color: #808080;
                    img {
                        width: 50px;
                        border-radius: 50%;
                    }
                }
            }
        }
    }
`;

const LoaderWrapper = styled.div`
    width: 100%;
    height: 450px;
    display: flex;
    justify-content: center;
    align-items: center;
    h1 {
        font-size: 25px;
    }
`;
