import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faGithub, faLinkedin} from '@fortawesome/free-brands-svg-icons';

import elkonLogo from "./resources/ElkonLogo.png";
import shamirLogo from "./resources/ShamirLogo.jpg";

import {
    Jumbotron,
    Container,
    Row,
    Col,
    Button,
    Card,
} from "react-bootstrap";

import {
    small_text,
    btn_margin,
    hover_shadow,
    card_open,
    card_close 
} from "./css/landing_page.module.css";

export const DeveloperCreditsCard = ({cardStatus}) => { return (
    <Card
        className={[hover_shadow].join(" ")+ " " + (cardStatus ? card_open : card_close)}
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
                            <a
                                href={"https://github.com/hag007"}
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
                                href={"https://www.linkedin.com/in/hagai-levi-4aba62112/"}
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
                        Gideon Shaked
                    </p>

                    <Row
                        style={{
                            marginLeft: "5px",
                            marginRight: "5px"
                        }}
                    >
                        <Col>
                            <a
                                href={"https://github.com/gideonshaked"}
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
                                href={"https://www.linkedin.com/in/gideonshaked"}
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
            </Card.Text>
        </Card.Body>
    </Card>
);
}

export const ResearchGroupCard = ({cardStatus}) => { return (
    <Card
        className={[hover_shadow].join(" ")+ " " + (cardStatus ? card_open : card_close)}>
<Card.Body>
            <Card.Title>Research groups</Card.Title>
            <Card.Text>
                <p>Ron Shamir</p>
                <a
                    href="http://acgt.cs.tau.ac.il/"
                    target="_blank" rel="noopener noreferrer"
                ><img
                    src={shamirLogo}
                    style={{width: "220px", height: "30px"}}
                /></a>
                <br/><br/><br/>
                <p>Ran Elkon</p>
                <a
                    href="http://www.elkonlab.tau.ac.il/"
                    target="_blank" rel="noopener noreferrer"
                ><img
                    src={elkonLogo}
                    style={{width: "220px", height: "45px"}}
                /></a>
            </Card.Text>
        </Card.Body>
    </Card>
);
}

export const CitationCard  = ({cardStatus}) => { return (
    <Card
        className={[hover_shadow].join(" ")+ " " + (cardStatus ? card_open : card_close)}>
        <Card.Body>
            <Card.Title>Cite DOMINO</Card.Title>
            <Card.Text>
                <p> DOMINO: a network-based active module identification algorithm with reduced rate of false calls. Hagai Levi, Ran Elkon and Ron Shamir. Mol Syst Biol. 2021 Jan;17(1):e9593 </p>
                    
                <a
                    className={["btn", btn_margin, "btn-primary", small_text].join(" ")}
                    href={"https://www.embopress.org/doi/full/10.15252/msb.20209593"}
                    target="_blank" rel="noopener noreferrer"
                >
                    Visit the DOMINO paper
                </a>
            </Card.Text>
        </Card.Body>
    </Card>
);
}

export const RepositoriesCard = ({cardStatus}) => { return (
    <Card
        className={[hover_shadow].join(" ")+ " " + (cardStatus ? card_open : card_close)}>
        <Card.Body>
            <Card.Title>Repositories</Card.Title>
            <Card.Text>
                <p>Visit our Github repositories</p>
                <a
                    className={["btn", btn_margin, "btn-primary", small_text].join(" ")}
                    href={"https://github.com/Shamir-Lab/DOMINO"}
                    target="_blank" rel="noopener noreferrer"
                >
                    DOMINO
                </a>
                <br/>
                <a
                    className={["btn", btn_margin, "btn-primary", small_text].join(" ")}
                    href={"https://github.com/Shamir-Lab/domino_web"}
                    target="_blank" rel="noopener noreferrer"
                >
                    DOMINO's Web Executor
                </a><br/>
                <a
                    className={["btn", btn_margin, "btn-primary", small_text].join(" ")}
                    href={"https://github.com/Shamir-Lab/EMP"}
                    target="_blank" rel="noopener noreferrer"
                >
                    EMP
                </a><br/>
                <a
                    className={["btn", btn_margin, "btn-primary", small_text].join(" ")}
                    href={"https://github.com/Shamir-Lab/EMP-benchmark"}
                    target="_blank" rel="noopener noreferrer"
                >
                    EMP-benchmark
                </a>
            </Card.Text>
        </Card.Body>
    </Card>
);
}

export const SpecialCreditsCard = ({cardStatus}) => { return (
    <Card
        className={[hover_shadow].join(" ")+ " " + (cardStatus ? card_open : card_close)}>
        <Card.Body>
            <Card.Title>External resources</Card.Title>
            <Card.Text>
                <p>Modules are visualized with <a href="https://js.cytoscape.org/" target="_blank">Cytoscape.js</a></p>
                
                <p>GO enrichment is calculated with <a href="https://github.com/tanghaibao/goatools" target="_blank">goatools</a></p>            
                <p>The core of DOMINO uses an implementation of PCST called <a href="https://github.com/fraenkel-lab/pcst_fast" target="_blank">fast-pcst</a></p>

                <p>The networks in this website (and in DOMINO's paper) are  <a href="https://dip.doe-mbi.ucla.edu/dip/Main.cgi" target="_blank">DIP</a>, <a href="http://www.interactome-atlas.org/" target="_blank">HuRI</a> and <a href="https://string-db.org/" target="_blank">STRING</a> (edges with confidence > 900)</p>
                <p>This website implements the <a href="https://drugst.one/" target="_blank">Drugst.One</a> API for network visualization</p>
            </Card.Text>
        </Card.Body>
    </Card>
);
}

export const ContactAndIssuesCard = ({cardStatus}) => { return (
    <Card
        className={[hover_shadow].join(" ")+ " " + (cardStatus ? card_open : card_close)}>
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
                    target="_blank" rel="noopener noreferrer"
                > Send us an email
                </a>
            </Card.Text>
        </Card.Body>
    </Card>
);
}
