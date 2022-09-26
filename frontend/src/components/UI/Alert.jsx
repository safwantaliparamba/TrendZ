import React from "react";
import styled, { css } from "styled-components";
import { useDispatch } from "react-redux";

import close_image from "../../assets/icons/close.svg";
import { alertActions } from "../../store/alertSlice";

function Alert(props) {
    const dispatch = useDispatch();
    const close = (e) => {
        dispatch(alertActions.close());
    };

    return (
        <AlertWrapper onClick={(e) => close()}>
            <MainWrapper onClick={(e) => e.stopPropagation()} type={props.type}>
                <TopWrapper>
                    <img onClick={(e) => close()} src={close_image} alt="" />
                </TopWrapper>
                <p>{props.message}</p>
            </MainWrapper>
        </AlertWrapper>
    );
}

export default Alert;

const AlertWrapper = styled.div`
    z-index: 300;
    background-color: #ffffff79;
    position: fixed;
    top: 0;
    width: 100%;
    height: 100vh;
    margin: 0 auto;
    cursor: pointer;
`;
const MainWrapper = styled.div`
    text-align: center;
    width: 40%;
    margin: 0 auto;
    margin-top: 50px;
    border-radius: 10px;
    padding: 20px;
    cursor: auto;

    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.25);
    animation: slide-down 300ms cubic-bezier(0.46, -0.06, 0.39, 1.15) forwards;

    @keyframes slide-down {
    from {
      opacity: 0;
      transform: translateY(-3rem);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  } 

    ${(props) =>
        props.type === "err" &&
        css`
            background-color: #f8d7da;
            border: 1px solid #ff0404;
            color: #842029;
        `};
    ${(props) =>
        props.type === "success" &&
        css`
            background-color: #a3ffb9;
            border: 1px solid #00ff11;
            color: #0f5132;
        `};

    p {
        font-weight: 600;
        font-size: 18px;
        margin-bottom: 24px;
    }
`;
const TopWrapper = styled.div`
    width: 100%;
    display: flex;
    justify-content: flex-end;
    img {
        width: 20px;
        cursor: pointer;
    }
`;
