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
import { Jumbotron, Container, Row, Col, Button, Card } from "react-bootstrap";

const LandingPage = ({history}) => {

    return (
        <>
            <Jumbotron style={{backgroundColor: "white", padding: "10px", marginTop: "80px"}}>
                <div style={{margin: "auto", textAlign: "center"}}>
                    <span style={{fontSize: "45px"}}>Welcome to</span>
                    <img src={logo} className={domino_logo}></img>
                    <span style={{fontSize: "45px"}}>Web Executor</span>
                </div>

                <p className="small_text"
                   style={{color: "#707070", textAlign: "center"}}>
                    DOMINO is an algorithm for detecting active network <br></br>
                    modules with a low rate of false GO term calls.
                </p>
            </Jumbotron>

            <Button style={{margin: "0px auto 40px auto", display: "block"}}>Run DOMINO</Button>

            <Container>
                <Row style={{marginBottom: "100px"}}>
                    {[...Array(4).keys()].map(() =>
                        <Col>
                            <Card
                                style={{width: "250px", height: "350px"}}
                            >
                                <Card.Body>
                                    <Card.Title>Card Title</Card.Title>
                                    <Card.Text>
                                        Some quick example text to build on the card title and make up the bulk of
                                        the card's content.
                                    </Card.Text>
                                    <Button variant="primary">Go somewhere</Button>
                                </Card.Body>
                            </Card>
                        </Col>
                    )}
                </Row>
            </Container>

            <hr
                style={{width:"80%"}}
            ></hr>

            <div
                style={{
                    height: "500px",
                    backgroundColor: "grey",
                    padding: "10px",
                    margin: "150px 20px 0px 20px"}}
            >
                <h1 style={{textAlign: "center"}}>DOMINO statistics</h1>
            </div>

            <footer className="text-center text-lg-start" style={{backgroundColor: "white"}}>
                <p>Developed by Kobe Bryant.</p>
            </footer>
        </>
    );
};

export default LandingPage;