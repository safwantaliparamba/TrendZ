import React from "react";
import "./mainloader.css";
import styled from "styled-components";

function MainLoader() {
    return (
        <Wrapper>
            <div className="loadingio-spinner-spinner-6iqerj14ek2">
                <div className="ldio-g8hqv04367m">
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                </div>
            </div>
        </Wrapper>
    );
}

export default MainLoader;

const Wrapper = styled.div`
    position: absolute;
    width: 100%;
    height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
`;
