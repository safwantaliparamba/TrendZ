import React, { useEffect } from "react";
import styled from "styled-components";

const ActionsModal = ({ onClose, children }) => {
    useEffect(() => {
        document.body.style.overflow = "hidden";

        return () => {
            document.body.style.overflow = "unset";
        };
    }, []);
    return (
        <MainWrapper
            onClick={(e) => {
                onClose();
            }}
        >
            <ContentWrapper onClick={(e) => e.stopPropagation()}>
                <ul>
                    {children}
                    <li
                        onClick={(e) => {
                            onClose();
                        }}
                    >
                        cancel
                    </li>
                </ul>
            </ContentWrapper>
        </MainWrapper>
    );
};

export default ActionsModal;

const MainWrapper = styled.div`
    z-index: 150;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100vh;
    background: #5757576b;
    display: flex;
    justify-content: center;
    align-items: center;
`;
const ContentWrapper = styled.div`
    background: #fff;
    border-radius: 10px;
    /* padding: 20px; */

    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.25);
    animation: slide-down 300ms cubic-bezier(0.46, -0.06, 0.39, 1.15) forwards;

    @keyframes slide-down {
        from {
            opacity: 0;
            transform: scale(2);
        }
        to {
            opacity: 1;
            transform: scale(1);
        }
    }

    ul {
        width: 400px;
        li,
        a {
            display: block;
            text-align: center;
            padding: 13px 0;
            border-bottom: 1px solid #cdcccc4e;
            cursor: pointer;
            font-size: 15px;
            color: #111;

            &:last-child {
                border-bottom: none;
            }
            &.danger {
                font-weight: 600;
                color: red;
            }
        }
    }
`;
