import React, { useState, useEffect } from "react";
import {
    Jumbotron,
    Carousel,
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
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    Label,
    CartesianGrid,
    XAxis,
    YAxis,
    Tooltip,
    Legend,
    Bar
} from "recharts";
import Collapsible from 'react-collapsible';
import axios from "axios";

import {
    DOMINOExecutions,
    gitClones
} from './public/plotting.js';

import {
    networkFrequency,
    dominoFrequency
} from "./public/freq.js"

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
    circle,
    card_open,
    card_close
} from "./css/landing_page.module.css";
import "./css/collapsible.scss";
import 'bootstrap/dist/css/bootstrap.min.css';
import "bootstrap/dist/css/bootstrap.css";
import "react-combo-select/style.css";
import 'font-awesome/css/font-awesome.min.css';

import dominoLogo from "./resources/DOMINO_logo.png";

import {
    DeveloperCreditsCard,
    ResearchGroupCard,
    CitationCard,
    RepositoriesCard,
    SpecialCreditsCard,
    ContactAndIssuesCard 
} from "./InfoCards.jsx";

const LandingPage = ({history}) => {

    const [details, setDetails] = useState("");
    const [networkUsage, setNetworkUsage] = useState([]);

    const showDetails = (newDetails) => {
        details == newDetails ? setDetails("") : setDetails(newDetails)
    }

    useEffect(() => {
        axios
            .get("/aggregated-usage")
            .then((res) => {
                setNetworkUsage(res.data.networkUsage);
            });
    }, []);

    const BarTotalFeatureUsage = (attr, data) => {
        return (
            <Row style={{margin: "25px 0px 25px 50px"}}>
                <Col xs={8}>
                    <p
                        style={{textAlign: "center", fontSize: "18px", color: "white"}}
                    >
                        Monthly {attr}
                    </p>
                    <BarChart
                        width={800}
                        height={300}
                        margin={{left: 10, bottom: 30}}
                        data={data.monthly}
                        style={{marginLeft: 'auto', marginRight: 'auto'}}
                    >
                        <CartesianGrid strokeDasharray="3 3" stroke='white'/>
                        <XAxis
                            dataKey="date"
                            label={{value: 'Date', position: 'bottom', fill: 'white'}}
                            tick={{ fill: 'white' }} 
                        ></XAxis>
                        <YAxis
                            label={{value: 'Frequency', angle: -90, position: 'left', fill: 'white'}}
                            tick={{ fill: 'white' }}
                        />
                        <Tooltip/>
                        <Bar dataKey="freq" fill="#007bff"/> {/*80bdff*/}
                    </BarChart>
                </Col>
                <Col>
                    <div className={circle}>{data.total}</div>
                    <p style={{fontSize: '22px', width: '180px', textAlign: 'center', color: 'white'}}>{attr} this year</p>
                </Col>
            </Row>
        );
    };

    const getCard = (cardDetail) => {
        switch (cardDetail) {
            case "developerCredits":
                return (<DeveloperCreditsCard cardStatus={details==="developerCredits"}/>);
            case "researchGroups":
                return (<ResearchGroupCard cardStatus={details=="researchGroups"}/>);
            case "citation":
                return (<CitationCard cardStatus={details=="citation"}/>);
            case "repositories":
                return (<RepositoriesCard cardStatus={details=="repositories"}/>);
            case "contact":
                return (<ContactAndIssuesCard cardStatus={details=="contact"}/>);
        }
    };

    return (
        <>
            <Navbar bg="dark" variant="dark">
                <Container style={{marginRight: "0px"}}>
                    <Nav className="ml-auto">
                        <Nav.Link onClick={() => showDetails("developerCredits")}>Developer Credits</Nav.Link>
                        <Nav.Link onClick={() => showDetails("researchGroups")}>Research Groups</Nav.Link>
                        <Nav.Link onClick={() => showDetails("citation")}>Citation</Nav.Link>
                        <Nav.Link onClick={() => showDetails("repositories")}>Repositories</Nav.Link>
                        <Nav.Link onClick={() => showDetails("specialCredits")}>External Resources</Nav.Link>
                        <Nav.Link onClick={() => showDetails("contact")}>Contacts us!</Nav.Link>
                    </Nav>
                </Container>
            </Navbar>

            <Row>
                <Col xs={12}>
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

                    <Button size="lg"
                            style={{margin: "0px auto 40px auto", display: "block", height: '83px', width: '200px'}}
                            onClick={() => history.push({pathname: "/file-upload"})}>Run DOMINO</Button>
                </Col>
            </Row>

            <div style={{position: 'absolute', right: '110px', top: '85px', marginBottom: "100px"}} >
                <DeveloperCreditsCard cardStatus={details=="developerCredits"}/>
                <ResearchGroupCard cardStatus={details=="researchGroups"}/>
                <CitationCard cardStatus={details=="citation"}/>
                <RepositoriesCard cardStatus={details=="repositories"}/>
                <SpecialCreditsCard cardStatus={details=="specialCredits"}/>
                <ContactAndIssuesCard cardStatus={details=="contact"}/>
            </div>

            <hr
                style={{width: "80%"}}
            ></hr>

            <div
                style={{
                    flex: "auto"
                }}
            >

                <Collapsible
                    trigger="More about DOMINO"
                    triggerStyle={{backgroundColor: "#343a40"}}
                    style={{cursor: "pointer"}}
                >
                    <p>Our motivation to develop <a href="https://github.com/Shamir-Lab/DOMINO" target="_blank">DOMINO</a> came from a phenomenon we observed on multiple active module identification (AMI) algorithms.</p>
                    <p>AMI algorithms receive as input a gene network and nodes' activity scores, and report sub-networks (modules) that are putatively biologically active. The biological meaning of such modules is usually explored via functional/enrichment analysis, commonly done against well-established resources such as the Gene Ontology (GO). </p>
                    <p>We observed that very often GO terms enriched in modules detected by AMI methods are also enriched when the AMI algorithms are ran on randomly permuted  data.</p>
                    <p>To tackle this bias, we designed the <a href="https://github.com/Shamir-Lab/EMP" target="_blank"> EMpirical
                        pipeline (EMP)</a>, a method that evaluates the empirical significance of GO terms reported as
                        enriched in modules.</p>
                    <p>We then used EMP to <a href="https://github.com/Shamir-Lab/EMP-benchmark" target="_blank">systematically evaluate
                        popular AMI algorithms on a wide-range of criteria</a>. We analyzed two types of omics gene scores: gene expression levels and GWAS gene scores.</p>
                    <p>Following this benchmark, we turned to develop DOMINO, an AMI algorithm that has a marked high rate of empirically validated calls of GO terms. DOMINO receives a set of active genes (i.e. binary activity scores) and reports subnetworks that are enriched for active genes.</p>
                    <p>Using the same benchmark framework to test DOMINO, we found that DOMINO outperformed the other AMI algorithms.</p>
                    <p>For more details, see our publication:<br/>
                    <a href="https://www.embopress.org/doi/full/10.15252/msb.20209593" target="_blank">DOMINO: a network-based active module identification algorithm with reduced rate of false calls. Hagai Levi, Ran Elkon and Ron Shamir. Mol Syst Biol. 2021 Jan;17(1):e9593.</a> 
</p>
                </Collapsible>

                <Collapsible
                    trigger="API spec for external calls"
                    triggerStyle={{backgroundColor: "#343a40"}}
                    style={{cursor: "pointer"}}
                >
                    <p>
                        Here you will be able to find a spec that defines how to make and automated API call to the website (e.g. via a script).
                    </p>
                    <p>
                        Coming soon...
                    </p>
                </Collapsible>

                <>
                    <h1 style={{textAlign: "center", margin: '40px 0px 40px 0px'}}>DOMINO statistics</h1>
                    <Carousel className="bg-dark">
                        <Carousel.Item>
                            {BarTotalFeatureUsage("DOMINO Execution Frequency", DOMINOExecutions)}
                        </Carousel.Item>
                        <Carousel.Item>
                            {BarTotalFeatureUsage("Git Clone Execution Frequency", gitClones)}
                        </Carousel.Item>
                        <Carousel.Item>
                            <p
                                style={{textAlign: "center", fontSize: "18px", color: "white"}}
                            >
                                Relative Frequency of Available Network File Usage
                            </p>
                            <div
                                style={{marginLeft: "450px"}}
                            >
                                <PieChart width={400} height={400}>
                                    <Pie
                                        dataKey="freq"
                                        nameKey="network"
                                        isAnimationActive={false}
                                        data={networkUsage}
                                        cx="50%"
                                        cy="50%"
                                        outerRadius={80}
                                        fill="#007bff"
                                        label
                                    />
                                    <Tooltip />
                                </PieChart>
                            </div>
                        </Carousel.Item>
                    </Carousel>
                </>

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
            </div>
        </>
    );
};

export default LandingPage;
