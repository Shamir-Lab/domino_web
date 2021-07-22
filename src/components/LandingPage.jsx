import React, {useState} from "react";
import Collapsible from 'react-collapsible';

import {
    DOMINOExecutions,
    gitClones
} from './public/plotting.js';

import "bootstrap/dist/css/bootstrap.css";
import "react-combo-select/style.css";
import 'font-awesome/css/font-awesome.min.css';

import dominoLogo from "./resources/DOMINO_logo.png";
import elkonLogo from "./resources/ElkonLogo.png";
import shamirLogo from "./resources/ShamirLogo.jpg";

import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faGithub, faLinkedin} from '@fortawesome/free-brands-svg-icons';

import {
    left_inner_block,
    right_inner_block,
    blue_background,
    small_text,
    medium_text,
    btn_margin,
    domino_logo,
    hover_shadow,
    card,
    circle
} from "./css/landing_page.module.css";
import "./css/collapsible.scss";

import {
    Jumbotron,
    Container,
    Row,
    Col,
    Button,
    Card,
    Navbar,
    Nav
} from "react-bootstrap";

import {
    BarChart,
    Label,
    CartesianGrid,
    XAxis,
    YAxis,
    Tooltip,
    Legend,
    Bar
} from "recharts";

const LandingPage = ({history}) => {

    const [details, setDetails] = useState("");  

    const showDetails = (newDetails) => {
        details==newDetails ? setDetails("") : setDetails(newDetails)
    }

    // DOMINO Executions
    const FeatureUsage = (attr, data) => {
        return (
            <Row style={{margin: "25px 0px 25px 50px"}}>
                <Col xs={8}>
                    <p
                        style={{textAlign: "center", fontSize: "18px"}}
                    >
                        Weekly {attr}
                    </p>
                    <BarChart
                        width={800}
                        height={300}
                        margin={{left: 10, bottom: 30}}
                        data={data.weekly}
                    >
                        <Label value="Weekly DOMINO Executions" position="top"/>
                        <CartesianGrid strokeDasharray="3 3"/>
                        <XAxis
                            dataKey="date"
                            label={{value: 'Date', position: 'bottom'}}
                        ></XAxis>
                        <YAxis
                            label={{value: 'Frequency', angle: -90, position: 'left'}}
                        />
                        <Tooltip/>
                        <Bar dataKey="freq" fill="#007bff"/> {/*80bdff*/}
                    </BarChart>
                </Col>
                <Col>
                    <div className={circle}>{data.total}</div>
                    <p style={{fontSize: '22px'}}>{attr} this year</p>
                </Col>
            </Row>
        );
    };

    return (
        <>
             <Navbar bg="primary" variant="dark">
                  <Container style={{marginRight: "15px"}}>
                        <Nav className="me-auto">
                        <Nav.Link onClick={()=>showDetails("developerCredits")} >Developer Credits</Nav.Link>
                        <Nav.Link onClick={()=>showDetails("researchGroups")}>Research Groups</Nav.Link>
                        <Nav.Link onClick={()=>showDetails("citation")}>Citation</Nav.Link>
                        <Nav.Link onClick={()=>showDetails("repositories")}>Repositories</Nav.Link>
                        <Nav.Link onClick={()=>showDetails("contact")}>Contacts us!</Nav.Link>
                        </Nav>
                   </Container>
            </Navbar>
            
            <Row><Col xs={12}>
            <Jumbotron style={{backgroundColor: "white", padding: "10px", marginTop: "20px"}}>
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
  
            <Button size="lg" style={{margin: "0px auto 40px auto", display: "block", height: '83px', width: '200px'}}
                    onClick={() => history.push({pathname: "/file-upload"})}>Run DOMINO</Button>

            </Col></Row>
     
            <div style={{position: 'absolute', right: '110px', top: '85px'}}>
                <Row style={{marginBottom: "100px"}}>
                    {details=="developerCredits" ? ( 
                    // Developer Credits 
                    <Col xs={3}>
                        <Card
                            className={[hover_shadow, card].join(" ")}
                        >
                            <Card.Body>
                                <Card.Title>Developer Credits</Card.Title>
                                <Card.Text>
                                    <div>
                                        <p className={small_text}>
                                            Nima Rahmanian
                                        </p>
                                        
                                        <Row
                                            style={{
                                                marginLeft: "5px",
                                                marginRight: "5px"
                                            }}
                                        >
                                            <Col>
                                                <a
                                                    href={"https://github.com/Nimsi123"}
                                                    target="_blank" rel="noopener noreferrer"
                                                >
                                                    <FontAwesomeIcon
                                                        style={{
                                                            height: "50px",
                                                            width: "50px",
                                                            color: "black"
                                                        }}
                                                        className={hover_shadow}
                                                        icon={faGithub}
                                                    />
                                                </a>
                                            </Col>
                                            <Col>
                                                <a
                                                    href={"https://www.linkedin.com/in/nima-rahmanian-367b871aa"}
                                                    target="_blank" rel="noopener noreferrer"
                                                >
                                                    <FontAwesomeIcon
                                                        style={{
                                                            height: "50px",
                                                            width: "50px",
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
                                            Hagai Levi
                                        </p>
                                      
                                        <Row
                                            style={{
                                                marginLeft: "5px",
                                                marginRight: "5px"
                                            }}
                                        >
                                            <Col>
                                                <a href={"https://github.com/hag007"}>
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
                                                <a href={"https://www.linkedin.com/in/hagai-levi-4aba62112/"}>
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
                                </Card.Text>
                            </Card.Body>
                        </Card>
                    </Col> )
                   : ( <></> )
                   }
                   {details=="researchGroups" ? (
                   // Research Groups
                    <Col xs={3}>
                        <Card
                            className={[hover_shadow, card].join(" ")}
                        >
                            <Card.Body>
                                <Card.Title>Research groups</Card.Title>
                                <Card.Text>
                                    <p>Ron Shamir</p>
                                    <a href="http://acgt.cs.tau.ac.il/"><img 
                                        src={shamirLogo}
                                        style={{width: "220px", height: "30px"}}
                                    /></a>
                                    <br/><br/><br/>
                                    <p> Ran Elkon</p>
                                    <a href="http://www.elkonlab.tau.ac.il/"><img 
                                        src={elkonLogo}
                                        style={{width: "220px", height: "45px"}}
                                    /></a>
                                </Card.Text>
                            </Card.Body>
                        </Card>
                    </Col> )
                    :( <></>) 
                    }
                    {details=="citation" ? (
                    // Citation 
                    <Col xs={3}>
                        <Card
                            className={[hover_shadow, card].join(" ")}
                        >
                            <Card.Body>
                                <Card.Title>Cite DOMINO</Card.Title>
                                <Card.Text>
                                <p>DOMINO: a network-based active module identification algorithm with reduced rate of false calls. <i> Syst Biol.</i>  <b>17</b>:e9593</p>
                                    <a
                                        className={["btn", btn_margin, "btn-primary", small_text].join(" ")}
                                        href={"https://www.embopress.org/doi/full/10.15252/msb.20209593"}
                                    >
                                        Visit the DOMINO paper
                                    </a>
                                </Card.Text>
                            </Card.Body>
                        </Card>
                    </Col> )
                    : ( <></> )
                    }
                    {details=="repositories" ? (
                    // Repositories
                    <Col xs={3}>
                        <Card
                            className={[hover_shadow, card].join(" ")}
                        >
                            <Card.Body>
                                <Card.Title>Repositories</Card.Title>
                                <Card.Text>
                                    <p>Visit our Github repositories</p>
                                            <a
                                                className={["btn", btn_margin, "btn-primary", small_text].join(" ")}
                                                href={"https://github.com/Shamir-Lab/DOMINO"}
                                            >
                                                DOMINO
                                            </a>
                                            <br/>
                                            <a
                                                className={["btn", btn_margin, "btn-primary", small_text].join(" ")}
                                                href={"https://github.com/hag007/domino_web"}
                                            >
                                                DOMINO's Web Executor
                                            </a><br/>
                                            <a
                                                className={["btn", btn_margin, "btn-primary", small_text].join(" ")}
                                                href={"https://github.com/Shamir-Lab/EMP"}
                                            >
                                                EMP
                                            </a><br/>
                                           <a
                                                className={["btn", btn_margin, "btn-primary", small_text].join(" ")}
                                                href={"https://github.com/Shamir-Lab/EMP-benchmark"}
                                            >
                                                EMP-benchmark
                                            </a>
                                </Card.Text>
                            </Card.Body>
                        </Card>
                    </Col> )
                    : ( <></> )
                    }
                   { details=="contact" ? (
                    // Contact and Issues 
                    <Col xs={3}>
                        <Card
                            className={[hover_shadow, card].join(" ")}
                        >
                            <Card.Body>
                                <Card.Title
                                    style={{textAlign: "center"}}
                                >Contact info</Card.Title>
                                <Card.Text>
                                    <a
                                        className={["btn", btn_margin, "btn-primary", small_text].join(" ")}
                                        href={"https://github.com/hag007/domino_web/issues"}
                                        target="_blank" rel="noopener noreferrer"
                                    > Report a problem via Git Issues
                                    </a>
                                    <a
                                        className={["btn", btn_margin, "btn-primary", small_text].join(" ")}
                                        href={"mailto:hagai.levi.007@gmail.com"}
                                    > Send us an email
                                    </a>
                                </Card.Text>
                            </Card.Body>
                        </Card>
                    </Col> )
                   : ( <></> )
                  }
                </Row>
            </div>
            <hr
                style={{width: "80%"}}
            ></hr>

            <div
                style={{
                    padding: "10px",
                    margin: "40px 20px 20px 20px"
                }}
            >

    <Collapsible trigger="More about DOMINO">
      <p>The incentive to develop <a href="">DOMINO</a> came from an phenomenon obsered on active module identification (AMI) algorithms</p>
      <p>AMI algorithms receive a gene network and nodes' activity scores as input and report sub-networks (modules) that are putatively biologically active. the biological meaningful of such module usually explored via functional/enrichment analysis, commonly done against well established resource souch as the Gene Ontology (GO)</p>
      <p> We observed that typically GO terms enriched in modules detected AMI methods are often also enriched after randomly permuting the input data. </p>
      <p>To tackle this bias, we designed the <a href="https://github.com/Shamir-Lab/EMP"> EMpirical pipeline (EMP)</a>, a method that evaluates the empirical significance of GO terms reported as enriched in modules.</p>
      <p>We then used EMP to <a href="https://github.com/Shamir-Lab/EMP-benchmark">systematically evaluate popular AMI algorithms on a wide-range of criteria</a>. The activity scores were two types of omics - gene expression and GWAS.</p>
      <p> Following this benchmark, we turned to develop DOMINO, an AMI algorithm that has high rate of empirically validated calls. It recieves a set of active genes (i.e. binary activity scores) and reports subnetwork that has high signal of active genes in it </p>
      <p> We then used the same benchmark framework to test  DOMINO, and found that DOMINO outperformed the other AMI algorithms.  </p>
    </Collapsible>

     <Collapsible trigger="API spec for external calls">
      <p>
        This spec defines how to make and automated API call to the website (e.g. via a script).
      </p>
      <p>
        Write it here...
      </p>
    </Collapsible>



                <h1 style={{textAlign: "center", margin: '40px 0px 40px 0px'}}>DOMINO statistics</h1>
                  
                {/* DOMINO Web Executions */}
                {FeatureUsage("DOMINO Executions", DOMINOExecutions)}
                {/* Git clone Executions*/}
                {FeatureUsage("Git Clone Executions", gitCloneExecutions)}

{/**
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
*/}
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
