import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { authActions } from "../../store/authSlice";
import styles from "./header.module.css";
import search from "../../assets/icons/search.svg";
import home from "../../assets/icons/home.svg";
import add from "../../assets/icons/add.svg";
import discover from "../../assets/icons/discover.svg";
import notification from "../../assets/icons/notification.svg";
import profileUser from "../../assets/icons/profile-user.svg";
import bookmark from "../../assets/icons/bookmark.svg";
import settings from "../../assets/icons/settings.svg";
import logout from "../../assets/icons/logout.svg";
import profile from "../../assets/images/blank-profile.webp";
import { alertActions } from "../../store/alertSlice";

function Header() {
    const userData = useSelector((state) => state.auth.userData);
    const dispatch = useDispatch();
    const [viewMenu, setViewMenu] = useState(false);

    useEffect(() => {
        console.log(userData);
    });

    return (
        <>
            <header id={styles.header}>
                <div className={styles.wrapper}>
                    <h1>
                        <Link to="/">
                            <img
                                src={require("../../assets/icons/logo.png")}
                                alt=""
                            />
                        </Link>
                    </h1>
                    <form className={styles.search} action="">
                        <label htmlFor="search">
                            <img src={search} alt="" />
                        </label>
                        <input placeholder="Search" type="search" id="search" />
                    </form>
                    <nav className={styles.nav}>
                        <ul>
                            <li>
                                <Link to="/">
                                    <img src={home} alt="" />
                                </Link>
                            </li>
                            <li>
                                <Link to="/">
                                    <img src={add} alt="" />
                                </Link>
                            </li>
                            <li>
                                <Link to="/">
                                    <img src={discover} alt="" />
                                </Link>
                            </li>
                            <li>
                                <Link to="/">
                                    <img src={notification} alt="" />
                                </Link>
                            </li>
                            <li>
                                <img
                                    onClick={(e) => setViewMenu(true)}
                                    className={styles.profile}
                                    // src={profile}
                                    src={
                                        userData?.image
                                            ? userData?.image
                                            : profile
                                    }
                                    alt="profile_image"
                                />
                            </li>
                        </ul>
                    </nav>
                </div>
            </header>
            {viewMenu && (
                <div
                    id={styles["profile-container"]}
                    onClick={(e) => setViewMenu(false)}
                >
                    <div className={styles["menu-container"]}>
                        <ul>
                            <li>
                                <Link to={`/${userData?.username}`}>
                                    <img src={profileUser} alt="" />
                                    <span>Profile</span>
                                </Link>
                            </li>
                            <li>
                                <Link to="/saved">
                                    <img src={bookmark} alt="" />
                                    <span>Saved</span>
                                </Link>
                            </li>
                            <li>
                                <Link to="/settings">
                                    <img src={settings} alt="" />
                                    <span>Settings</span>
                                </Link>
                            </li>
                            <li onClick={(e) => dispatch(authActions.logout())}>
                                <img src={logout} onClick={(e) => e} alt="" />
                                <span>Logout</span>
                            </li>
                        </ul>
                    </div>
                </div>
            )}
        </>
    );
}

export default Header;
