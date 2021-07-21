import React from "react";

import {
    DOMINOExecutions,
    gitCloneExecutions
} from './public/plotting.js';

import "bootstrap/dist/css/bootstrap.css";
import "react-combo-select/style.css";
import dominoLogo from "./resources/DOMINO_logo.png";
import githubLogo from "./resources/GitHubLogo.png";
import linkedInLogo from "./resources/LinkedInLogo.png";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGithub, faLinkedin } from '@fortawesome/free-brands-svg-icons';

import {
    left_inner_block,
    right_inner_block,
    blue_background,
    small_text,
    medium_text,
    btn_margin,
    domino_logo,
    hover_shadow,
    card
} from "./css/landing_page.module.css";

import {
    Jumbotron,
    Container,
    Row,
    Col,
    Button,
    Card
} from "react-bootstrap";

import {
    BarChart,
    CartesianGrid,
    XAxis,
    YAxis,
    Tooltip,
    Legend,
    Bar
} from "recharts";

const LandingPage = ({history}) => {

    return (
        <>
            <Jumbotron style={{backgroundColor: "white", padding: "10px", marginTop: "80px"}}>
                <div style={{margin: "auto", textAlign: "center"}}>
                    <span style={{fontSize: "45px"}}>Welcome to</span>
                    <img src={dominoLogo} className={domino_logo}></img>
                    <span style={{fontSize: "45px"}}>Web Executor</span>
                </div>

                <p className="small_text"
                   style={{color: "#707070", textAlign: "center"}}>
                    DOMINO is an algorithm for detecting active network <br></br>
                    modules with a low rate of false GO term calls.
                </p>
            </Jumbotron>

            <Button style={{margin: "0px auto 40px auto", display: "block"}}
                    onClick={() => history.push({pathname: "/file-upload"})}>Run DOMINO</Button>

            <Container>
                <Row style={{marginBottom: "100px"}}>
                    {/* Developer Credits */}
                    <Col>
                        <Card
                            className={[hover_shadow, card].join(" ")}
                        >
                            <Card.Body>
                                <Card.Title>Developer Credits</Card.Title>
                                <Card.Text>
                                    <div>
                                        <p className={small_text}>
                                            Website developed by <br></br> Nima Rahmanian
                                        </p>
                                        {/* GitHub and LinkedIn buttons*/}
                                        <Row
                                            style={{
                                                marginLeft: "5px",
                                                marginRight: "5px"
                                            }}
                                        >
                                            <Col>
                                                <a href={"https://github.com/Nimsi123"}>
                                                    <FontAwesomeIcon
                                                        style={{
                                                            height: "50px",
                                                            width:"50px",
                                                            color: "black"
                                                        }}
                                                        className={hover_shadow}
                                                        icon={faGithub}
                                                    />
                                                </a>
                                            </Col>
                                            <Col>
                                                <a href={"https://www.linkedin.com/in/nima-rahmanian-367b871aa"}>
                                                    <FontAwesomeIcon
                                                        style={{
                                                            height: "50px",
                                                            width:"50px",
                                                            color: "blue"
                                                        }}
                                                        className={hover_shadow}
                                                        icon={faLinkedin}
                                                    />
                                                </a>
                                            </Col>
                                        </Row>
                                    </div>
                                    <hr></hr>
                                    <div>
                                        <p className={small_text}>
                                            DOMINO developed by <br></br> Hagai Levi at TAU
                                        </p>
                                    </div>
                                </Card.Text>
                            </Card.Body>
                        </Card>
                    </Col>

                    {/* References */}
                    <Col>
                        <Card
                            className={[hover_shadow, card].join(" ")}
                        >
                            <Card.Body>
                                <Card.Title>References</Card.Title>
                                <Card.Text>
                                    <a
                                        className={["btn", btn_margin, "btn-primary", small_text].join(" ")}
                                        href={"https://www.embopress.org/doi/full/10.15252/msb.20209593"}
                                    >
                                        Visit the DOMINO paper
                                    </a>
                                    <p>Visit Github Pages for ...</p>
                                    <Row
                                        style={{paddingLeft: "10px"}}
                                    >
                                        <Col xs={4}>
                                            <a
                                                className={["btn", btn_margin, "btn-primary", small_text].join(" ")}
                                                href={"https://github.com/Shamir-Lab/DOMINO"}
                                            >
                                                DOMINO
                                            </a>
                                        </Col>
                                        <Col>
                                            <a
                                                className={["btn", btn_margin, "btn-primary", small_text].join(" ")}
                                                href={"https://github.com/hag007/domino_web"}
                                            >
                                                DOMINO's <br></br> Web Executor
                                            </a>
                                        </Col>
                                    </Row>
                                </Card.Text>
                            </Card.Body>
                        </Card>
                    </Col>

                    {/* Contact and Issues */}
                    <Col>
                        <Card
                            className={[hover_shadow, card].join(" ")}
                        >
                            <Card.Body>
                                <Card.Title
                                    style={{textAlign: "center"}}
                                >Contact Us</Card.Title>
                                <Card.Text>
                                    <a
                                        className={["btn", btn_margin, "btn-primary", small_text].join(" ")}
                                        href={"https://github.com/hag007/domino_web/issues"}
                                    > Report a problem via Git Issues
                                    </a>
                                    <p>Reach us at --add email--</p>
                                </Card.Text>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>

            <hr
                style={{width: "80%"}}
            ></hr>

            <div
                style={{
                    padding: "10px",
                    margin: "75px 20px 75px 20px"
                }}
            >
                <h1 style={{textAlign: "center"}}>DOMINO statistics</h1>

                <div style={{margin: "10px 200px 10px 200px"}}>
                    <p
                        style={{
                            textAlign: "center",
                            marginBottom: "0px"
                        }}
                    >
                        Weekly DOMINO Executions
                    </p>
                    <BarChart
                        width={800}
                        height={300}
                        data={DOMINOExecutions.weekly}
                    >
                        <CartesianGrid strokeDasharray="3 3"/>
                        <XAxis name={"Date"} dataKey="date"/>
                        <YAxis name={"Frequency"}/>
                        <Tooltip/>
                        <Bar dataKey="freq" fill="#82ca9d"/>
                    </BarChart>
                </div>

                <div style={{margin: "10px 200px 10px 200px"}}>
                    <p
                        style={{
                            textAlign: "center",
                            marginBottom: "0px"
                        }}
                    >
                        Weekly DOMINO git clone Executions
                    </p>
                    <BarChart
                        width={800}
                        height={300}
                        data={gitCloneExecutions.weekly}
                    >
                        <CartesianGrid strokeDasharray="3 3"/>
                        <XAxis name={"Date"} dataKey="date"/>
                        <YAxis name={"Frequency"}/>
                        <Tooltip/>
                        <Bar dataKey="freq" fill="#82ca9d"/>
                    </BarChart>
                </div>

            </div>

            <div
                style={{
                    height: "500px",
                    backgroundColor: "grey",
                    padding: "10px",
                    margin: "75px 20px 75px 20px"
                }}
            >
                <h1 style={{textAlign: "center"}}>Documentation</h1>
            </div>

            <div
                style={{
                    height: "500px",
                    backgroundColor: "grey",
                    padding: "10px",
                    margin: "75px 20px 75px 20px"
                }}
            >
                <h1 style={{textAlign: "center"}}>API Specs</h1>
            </div>

            <footer className="text-center text-lg-start"
                    style={{
                        backgroundColor: "white",
                        margin: "100px 0px 50px 0px"
                    }}>
                <p>Developed by Kobe Bryant.</p>
            </footer>
        </>
    );
};

export default LandingPage;
