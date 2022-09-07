import React, { useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";

import auth from "../../config/firebase";
import { authActions } from "../../store/authSlice";
import { alertActions } from '../../store/alertSlice'
import styles from "./login.module.css";
import google from "../../assets/images/google-psd.png";
import facebook from "../../assets/images/facebook-psd.png";
import twitter from "../../assets/images/twitter-psd.png";
import email from "../../assets/icons/email.svg";
import lock from "../../assets/icons/lock.svg";
import user from "../../assets/icons/user.svg";
import logo from "../../assets/icons/logo.png";
import Loader from "../UI/Loader";
import axios from "../../config/axiosConfig";

function Register() {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [loader, setLoader] = useState(false);
    const usernameRef = useRef();
    const emailRef = useRef();
    const passwordRef = useRef();
    const nameRef = useRef();
    const submitHandler = (e) => {
        setLoader(true);
        e.preventDefault();
        const data = {
            name: nameRef.current.value,
            username: usernameRef.current.value,
            email: emailRef.current.value,
            password: passwordRef.current.value,
        };

        axios
            .post("auth/register/", data)
            .then((response) => {
                console.log(response.data);
                setLoader(false);
                if (response.data.statusCode === 6000) {
                    const token = response.data.data;
                    dispatch(authActions.loginUser({ token,profileData: response.data.userData }));
                    dispatch(alertActions.addAlert({ message:'Signed up successfully, now complete your profile',type:'success'}))
                    navigate(`/${response.data.userData.username}/settings/`);
                }else if(response.data.statusCode === 6001){
                    dispatch(alertActions.addAlert({
                        type:'err',
                        message:response.data.message
                    }))
                }
            })
            .catch((error) => {
                setLoader(false);
                console.log(error);
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
                                authActions.googleLogin({ userData: data,profileData: response.data.userData })
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
        <section id={styles.login}>
            {loader && <Loader />}
            <div className={styles.right}>
                <h1>Create Account</h1>

                <div className={styles.wrapp}>
                    <ul className={styles.social}>
                        <li>
                            <img
                                onClick={googleLoginHandler}
                                src={google}
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
                            <label htmlFor="name">
                                <img src={user} alt="" />
                            </label>
                            <input
                                type="text"
                                ref={nameRef}
                                placeholder="name"
                                id="name"
                            />
                        </div>
                        <div className={styles["input-container"]}>
                            <label htmlFor="username">
                                <img src={user} alt="" />
                            </label>
                            <input
                                type="text"
                                ref={usernameRef}
                                placeholder="username"
                                id="username"
                            />
                        </div>
                        <div className={styles["input-container"]}>
                            <label htmlFor="email">
                                <img src={email} alt="" />
                            </label>
                            <input
                                type="text"
                                ref={emailRef}
                                placeholder="email"
                                id="email"
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
                            <button type="submit">SIGN UP</button>
                        </div>
                    </form>
                </div>
            </div>
            <div className={`${styles.left} ${styles.signup}`}>
                <img src={logo} alt="logo" className={styles.logo} />
                <div className={styles.wrapper}>
                    <div className={styles.content}>
                        <h1>Welcome Back!</h1>
                        <p>
                            To keep connected with us, please login with your
                            personal info
                        </p>
                        <Link to="/auth/login" className={styles.btn}>
                            SIGN IN
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default Register;
