import React from "react";
import {
    left_inner_block,
    right_inner_block,
    blue_background,
    small_text,
    medium_text,
    btn_margin,
    domino_logo
} from "./landing_page.module.css";
import "bootstrap/dist/css/bootstrap.css";
import "react-combo-select/style.css";
import logo from "./DOMINO_logo.png";

const LandingPage = ({ history }) => {

    return (
        <>
            <div className="jumbotron">
                <div style = {{margin: "auto", textAlign: "center"}}>
                    <span style={{fontSize: "45px"}}>Welcome to</span>
                    <img src = {logo} className = {domino_logo}></img>
                    <span style={{fontSize: "45px"}}>Web Executor</span>
                </div>

                <p className="small_text"
                   style={{color: "#707070", textAlign: "center"}}>
                    DOMINO is an algorithm for detecting active network <br></br>
                    modules with a low rate of false GO term calls.
                </p>
            </div>

            <div className="container"
                 style={{width: "65%", height: "500px", margin: "auto"}}>
                <div className={["text-center", left_inner_block].join(" ")}>
                    <p className={medium_text}>How would you like to proceed?</p>
                    <button
                        className={["btn", btn_margin, "btn-primary", small_text].join(" ")}
                        onClick={() => history.push({pathname: "/file-upload"})}
                    >
                        Run DOMINO
                    </button>
                    <div className={blue_background}
                         style={{padding: "10px", width: "70%", margin: "5px auto 5px auto"}}>
                        <p className={small_text}>Visit the GitHub Page for</p>
                        <a
                            className={["btn", btn_margin, "btn-primary", small_text].join(" ")}
                            href={"https://github.com/Shamir-Lab/DOMINO"}
                        >
                            DOMINO
                        </a>
                        <a
                            className={["btn", btn_margin, "btn-primary", small_text].join(" ")}
                            href={"https://github.com/hag007/domino_web"}
                        >
                            DOMINO's <br></br> Web Executor
                        </a>
                    </div>
                    <a
                        className={["btn", btn_margin, "btn-primary", small_text].join(" ")}
                        href={"https://github.com/hag007/domino_web/issues"}
                    > Report a problem via Git Issues
                    </a>
                </div>
                <div className={right_inner_block}>
                    <div className={blue_background}
                         style={{height: "350px", margin: "auto", padding: "20px", width: "90%"}}>
                        <p className={medium_text}
                           style={{textAlign: "center"}}>DOMINO's Popularity</p>
                        <div style={{margin: "auto", width: "70%"}}>
                            <p className={small_text}>
                                # of DOMINO web runs: 24 <br></br>
                                # of DOMINO git clones: 26 <br></br>
                                # of DOMINO git visits: 52
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <footer className="text-center text-lg-start" style={{backgroundColor: "#e9ecef"}}>
                <p>Developed by Kobe Bryant.</p>
            </footer>
        </>
    );
};

export default LandingPage;