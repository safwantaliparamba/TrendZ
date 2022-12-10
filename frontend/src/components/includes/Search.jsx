import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";

import axios from "../../config/axiosConfig";
import profile from "../../assets/images/demo-profile.jpg";
import InnerLoader from "../UI/InnerLoader";
import { useSelector } from "react-redux";

const Search = ({ onClose, searchKeyword }) => {
    const [isLoading, setIsLoading] = useState(true);
    const [users, setUsers] = useState([]);

    const access = useSelector((state) => state.auth.token.access);

    const config = {
        headers: {
            authorization: `Bearer ${access}`,
        },
    };

    useEffect(() => {
        setUsers([]);
        if (searchKeyword && searchKeyword.trim().length !== 0) {
            setIsLoading(true);
            axios
                .get(`users/search/?q=${searchKeyword}`, config)
                .then((response) => {
                    console.log(response.data);
                    if (response.data.statusCode === 6000) {
                        setUsers(response.data.users);
                    }
                    setIsLoading(false);
                })
                .catch((error) => {
                    console.log(error);
                    setIsLoading(false);
                });
        }
    }, [searchKeyword]);

    return (
        <>
            <ScreenWrapper
                onClick={(e) => {
                    // window.history.replaceState(null, "", "/");
                    onClose();
                }}
            >
                <MainWrapper
                    onClick={(e) => {
                        e.stopPropagation();
                    }}
                >
                    {isLoading ? (
                        <LoaderWrapper>
                            <InnerLoader />
                        </LoaderWrapper>
                    ) : (
                        <Content>
                            <ul>
                                {users &&
                                    users?.map((user) => (
                                        <Link
                                            to={user.username}
                                            key={user.id}
                                            onClick={(e) => onClose()}
                                        >
                                            <li className="users">
                                                <img
                                                    src={
                                                        user.image
                                                            ? user.image
                                                            : profile
                                                    }
                                                    alt=""
                                                />
                                                <span>{user.username}</span>
                                            </li>
                                        </Link>
                                    ))}
                            </ul>
                        </Content>
                    )}
                </MainWrapper>
            </ScreenWrapper>
        </>
    );
};

export default Search;

const LoaderWrapper = styled.div`
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
`;

const ScreenWrapper = styled.div`
    position: fixed;
    /* top: 0; */
    width: 100%;
    height: 100vh;
    display: flex;
    justify-content: center;
    z-index: 50;
`;

const MainWrapper = styled.div`
    position: relative;
    margin-top: -20px;
    width: 400px;
    /* min-height: 350px; */
    max-height: 350px;
    background: #fff;
    overflow-y: scroll;
    /* z-index: 20; */
    border: 1px solid #8080809c;
    border-radius: 5px;

    &::-webkit-scrollbar {
        display: none;
    }
`;

const Content = styled.div`
    ul li.users {
        padding: 10px 20px;
        display: flex;
        align-items: center;

        &:hover {
            background: #dfdfdfa9;
        }

        img {
            width: 40px;
            border-radius: 50%;
            margin-right: 10px;
        }
        span {
            font-weight: 600;
            color: #808080;
        }
    }
`;
