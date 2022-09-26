import React, { useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";

import styles from "./login.module.css";
import axios from "../../config/axiosConfig";
import auth from "../../config/firebase";
import { authActions } from "../../store/authSlice";
import { alertActions } from "../../store/alertSlice";
import google from "../../assets/images/google-psd.png";
import user from "../../assets/icons/user.svg";
import lock from "../../assets/icons/lock.svg";
import logo from "../../assets/icons/logo.png";
import Loader from "../UI/Loader";
import facebook from "../../assets/images/facebook-psd.png";
import twitter from "../../assets/images/twitter-psd.png";
import { Helmet } from "react-helmet";

function Login() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const usernameRef = useRef();
    const passwordRef = useRef();
    const [loader, setLoader] = useState(false);

    const submitHandler = (e) => {
        setLoader(true);
        e.preventDefault();
        const data = {
            username: usernameRef.current.value,
            password: passwordRef.current.value,
        };
        axios
            .post("auth/login-user/", data)
            .then((response) => {
                console.log(response.data);
                if (response.data.statusCode === 6001) {
                    console.log("user not found");
                    setLoader(false);
                    dispatch(
                        alertActions.addAlert({
                            type: "err",
                            message: "username or password is incorrect",
                        })
                    );
                } else {
                    dispatch(
                        authActions.loginUser({
                            token: response.data.token,
                            profileData: response.data.userData,
                        })
                    );
                    setLoader(false);
                    navigate("/");
                }
            })
            .catch((error) => {
                console.log(error);
                setLoader(false);
                if (error.response.status === 404) {
                    dispatch(
                        alertActions.addAlert({
                            type: "err",
                            message: "User not found",
                        })
                    );
                }
            });
    };

    const googleLoginHandler = () => {
        const provider = new GoogleAuthProvider();
        signInWithPopup(auth, provider)
            .then((res) => {
                setLoader(true);
                console.log(res.user);
                const user = res.user;
                const data = {
                    name: user.displayName,
                    username: user.email,
                    email: user.email,
                    photo_url: user.photoURL,
                    uid: user.uid,
                    provider: user.providerData[0].providerId,
                };
                axios
                    .post("auth/social-auth/", data)
                    .then((response) => {
                        console.log(response);
                        if (response.data.message === "success") {
                            dispatch(
                                authActions.loginUser({
                                    token: response.data.data,
                                    profileData: response.data.userData,
                                })
                            );
                            setLoader(false);
                            dispatch(
                                authActions.googleLogin({
                                    userData: data,
                                    profileData: response.data.userData,
                                })
                            );
                            navigate("/");
                        }
                    })
                    .catch((err) => {
                        setLoader(false);
                        console.log(err);
                    });
            })
            .catch((err) => {
                console.log(err);
            });
    };

    return (
        <>
            <Helmet>
                <title>Login</title>
            </Helmet>
            {loader && <Loader />}
            <section id={styles.login}>
                <div className={styles.left}>
                    <img src={logo} alt="logo" className={styles.logo} />
                    <div className={styles.wrapper}>
                        <div className={styles.content}>
                            <h1>
                                Hello, Friend!
                            </h1>
                            <p>
                                Enter your personal details and start your
                                journey with us
                            </p>
                            <Link to="/auth/register" className={styles.btn}>
                                SIGN UP
                            </Link>
                        </div>
                    </div>
                </div>
                <div className={styles.right}>
                    <h1>Sign in to TrendZ</h1>
                    <div className={styles.wrapp}>
                        <ul className={styles.social}>
                            <li>
                                <img
                                    src={google}
                                    onClick={googleLoginHandler}
                                    alt=""
                                />
                            </li>
                            <li>
                                <img src={facebook} alt="" />
                            </li>
                            <li>
                                <img src={twitter} alt="" />
                            </li>
                        </ul>
                    </div>
                    <p>or use your email account</p>
                    <div className={styles.wrapp}>
                        <form action="" onSubmit={submitHandler}>
                            <div className={styles["input-container"]}>
                                <label htmlFor="username">
                                    <img src={user} alt="" />
                                </label>
                                <input
                                    type="text"
                                    placeholder="username"
                                    id="username"
                                    ref={usernameRef}
                                />
                            </div>
                            <div className={styles["input-container"]}>
                                <label htmlFor="password">
                                    <img src={lock} alt="" />
                                </label>
                                <input
                                    type="password"
                                    placeholder="password"
                                    id="password"
                                    ref={passwordRef}
                                />
                            </div>
                            <div className={styles.wrapp}>
                                <button type="submit">SIGN IN</button>
                            </div>
                        </form>
                    </div>
                </div>
                {/* </div> */}
            </section>
        </>
    );
}

export default Login;
