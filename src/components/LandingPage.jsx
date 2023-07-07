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
    network_sum,
    card_open,
    card_close
} from "./css/landing_page.module.css";

import "./css/landing_page.module.css";
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

import Highlight from 'react-highlight'

const LandingPage = ({history}) => {

    const [details, setDetails] = useState("");
    const [networkUsage, setNetworkUsage] = useState([]);
    // TODO: use this variable to plot domino executions.
    // TODO: this will replace the current DOMINOExecutions variable which comes from plotting.js
    const [DOMINOExecutions, setDOMINOExecutions] = useState([]);
    const [gitStatistics, setGitStatistics] = useState([]);
//    const [biocondaStatistics, setBiocondaStatistics] = useState([]);
//    const [pypiStatistics, setPypiStatistics] = useState([]);
    const [packageManagersStatistics, setPackageManagersStatistics] = useState([]);

    const showDetails = (newDetails) => {
        details == newDetails ? setDetails("") : setDetails(newDetails)
    }

    useEffect(() => {
        axios
            .get("/aggregated-usage")
            .then((res) => {
                setNetworkUsage(res.data.networkExecutions);
                setDOMINOExecutions({total: res.data.totalExecutions.total, monthly: res.data.monthlyExecutionsByNetworks.sort((a,b) => {let yearDiff=a._id.year - b._id.year; if (yearDiff !== 0) {return yearDiff}; return a._id.month-b._id.month}).map(a =>{ a["date"]=a._id.month+ "\\"+String(a._id.year).substring(2,4); return a;})});

                setGitStatistics({yearly: [{type: "clones",  name: "Clones", freq : res.data.yearlyGit.clones}, {type: "traffic" , name: "Views", freq : res.data.yearlyGit.traffic}], monthly: res.data.monthlyGit.sort((a,b) => {let yearDiff=a._id.year - b._id.year; if (yearDiff !== 0) {return yearDiff}; return a._id.month-b._id.month}).map(a =>{ a["date"]=a._id.month+ "\\"+String(a._id.year).substring(2,4); return a;})});

                let biocondaStatistics={yearly: [{type: "downloads",  freq : res.data.yearlyBioconda.downloads}], monthly: res.data.monthlyBioconda.sort((a,b) => {let yearDiff=a._id.year - b._id.year; if (yearDiff !== 0) {return yearDiff}; return a._id.month-b._id.month}).map(a =>{ a["date"]=a._id.month+ "\\"+String(a._id.year).substring(2,4); a["type"]="bioconda"; return a;})};
                let pypiStatistics={yearly: [{type: "downloads",  freq : res.data.yearlyPypi.downloads}], monthly: res.data.monthlyPypi.sort((a,b) => {let yearDiff=a._id.year - b._id.year; if (yearDiff !== 0) {return yearDiff}; return a._id.month-b._id.month}).map(a =>{ a["date"]=a._id.month+ "\\"+String(a._id.year).substring(2,4); a["type"]="pypi"; return a;})};

                
                
                let mergedMonthlyPM=biocondaStatistics.monthly.concat(pypiStatistics.monthly).reduce((a,b) => {if (b["date"] in a){a[b["date"]][b["type"]]=b["downloads"]} else {a[b["date"]]={date: b["date"], [b["type"]] : b["downloads"]}}; return a;}, {} )
                let monthlyPMDownloads=[]
                for (var key in mergedMonthlyPM) {
                    monthlyPMDownloads.push(mergedMonthlyPM[key])
                } 

                setPackageManagersStatistics({yearly: [{type: "bioconda", freq: biocondaStatistics.yearly[0].freq}, {type: "pypi", freq: pypiStatistics.yearly[0].freq}], monthly: monthlyPMDownloads })
            });
    }, []);

    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8E44AD'];

    const DOMINOExecutionsViewer = (attr, data, network_dist=[]) => {
        return (
            <Row style={{margin: "25px 0px 25px 50px", height: "33vh"}}>
                <Col xs={8}>
                   <ResponsiveContainer width="90%" height="95%">                    
                     <BarChart
                        margin={{left: 10, bottom: 30, top: 15}}
                        data={data.monthly}
                        style={{marginLeft: 'auto', marginRight: 'auto'}}
                     >
                     <text x="50%" y="2%" fill="white" textAnchor="middle" dominantBaseline="central">
                            <tspan fontSize="0.8em">Monthly {attr}</tspan>
                     </text>
                        <CartesianGrid strokeDasharray="3 3" stroke='white' />
                        <XAxis
                            dataKey="date"
                            label={{value: 'Date', fontSize: "0.7em" , position: 'bottom', fill: 'white'}}
                            tick={{ fill: 'white', fontSize: "0.7em"  }} 
                        ></XAxis>
                        <YAxis
                            label={{value: 'Jobs', fontSize: "0.7em" , angle: -90, position: 'left', fill: 'white'}}
                            tick={{ fill: 'white', fontSize: "0.7em"  }}
                        />
                        <Legend wrapperStyle={{ position: 'relative', fontSize: "0.7em" }}/>
                        <Tooltip wrapperStyle={{fontSize: "0.6em"}}/>
                        {network_dist.map((entry, index) => (
                                    <Bar dataKey={entry.network} stackId="a" fill={COLORS[index % COLORS.length]} /> ))}
                    </BarChart>
                    </ResponsiveContainer>                    
                </Col>
                { network_dist.length ?  
                <Col xs={4}>
                    <ResponsiveContainer width="90%" height="95%">                    
                        <PieChart>
                            <text x="50%" y="5%" fill="white" textAnchor="middle" dominantBaseline="central">
                                <tspan fontSize="0.8em">{attr} this year</tspan>
                            </text>
                                    <Pie
                                        dataKey="freq"
                                        nameKey="network"
                                        isAnimationActive={true}
                                        data={network_dist}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={"60%"}
                                        outerRadius={"80%"}
                                        fill="#007bff"
                                        style={{fontSize: '0.6em'}}
                                        label
                                    >
                                    {network_dist.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} /> ))}
                                    <Label className={network_sum} fontSize="1em" value={data.total} position="center" />
                                    </Pie>
                                    <Tooltip wrapperStyle={{fontSize: "0.6em"}} / >
                                    <Legend wrapperStyle={{fontSize: "0.6em"}} / >
                        </PieChart>
                    </ResponsiveContainer>
                </Col>
                : <></> }
            </Row>
        );
    };

    const gitStatisticsViewer = (attr, data) => {
        return (
            <Row style={{margin: "25px 0px 25px 50px", height: "33vh"}}>
                <Col xs={8}>
                  <ResponsiveContainer width="90%" height="95%">
                    <BarChart
                        margin={{left: 10, bottom: 30, top: 15}}
                        data={data.monthly}
                        style={{marginLeft: 'auto', marginRight: 'auto'}}
                    >
                        <text x="50%" y="2%" fill="white" textAnchor="middle" dominantBaseline="central">
                            <tspan fontSize="0.8em">Monthly {attr}</tspan>
                        </text>
                        <CartesianGrid strokeDasharray="3 3" stroke='white' />
                        <XAxis
                            dataKey="date"
                            label={{value: 'Date', fontSize: "0.7em" , position: 'bottom', fill: 'white'}}
                            tick={{ fill: 'white', fontSize: "0.7em" }} 
                        ></XAxis>
                        <YAxis
                            label={{value: 'Frequency', fontSize: "0.7em" , angle: -90, position: 'left', fill: 'white'}}
                            tick={{ fill: 'white', fontSize: "0.7em"  }}
                        />
                        <Tooltip wrapperStyle={{fontSize: "0.6em"}}/>
                        <Legend wrapperStyle={{ position: 'relative', fontSize: "0.7em" }} />
                        <Bar dataKey="clones" name='Clones' fill={COLORS[0]} />
                        <Bar dataKey="traffic" name='Views' fill={COLORS[1]} />
                   </BarChart>
                   </ResponsiveContainer>
                </Col>  
                <Col xs={4}>
                    <ResponsiveContainer width="90%" height="95%">
                       <PieChart>
                         <text x="50%" y="5%" fill="white" textAnchor="middle" dominantBaseline="central">
                            <tspan fontSize="0.8em">{attr} this year</tspan>
                         </text>
                            <Pie
                                        dataKey="freq"
                                        nameKey="type"
                                        isAnimationActive={true}
                                        data={data.yearly}
                                        cx="50%"
                                        cy="50%"
                                        outerRadius={"80%"}
                                        fill="#007bff"
                                        style={{fontSize: '0.6em'}}
                                        label
                                    >
                                    <Cell key={`cell-0`} fill={COLORS[0]} /> ))}
                                    <Cell key={`cell-1`} fill={COLORS[1]} /> ))}
                                    </Pie>
                                     
                                    <Tooltip wrapperStyle={{fontSize: "0.6em"}} />
                                    <Legend wrapperStyle={{fontSize: "0.7em"}} />
                       </PieChart>
                   </ResponsiveContainer>
                </Col>
            </Row>
        );
    };

    const packageManagersStatisticsViewer = (attr, data) => {
        return (
            <Row style={{margin: "25px 0px 25px 50px", height: "33vh"}}>
                <Col xs={8}>
                   <ResponsiveContainer width="90%" height="95%">
                    <BarChart
                        margin={{left: 10, bottom: 30, top : 15}}
                        data={data.monthly}
                        style={{marginLeft: 'auto', marginRight: 'auto'}}
                    >
                        <text x="50%" y="2%" fill="white" textAnchor="middle" dominantBaseline="central">
                             <tspan fontSize="0.8em">Monthly {attr}</tspan>
                        </text>
                        <CartesianGrid strokeDasharray="3 3" stroke='white' />
                        <XAxis
                            dataKey="date"
                            label={{value: 'Date', fontSize: "0.7em" , position: 'bottom', fill: 'white'}}
                            tick={{ fill: 'white', fontSize: "0.7em"  }} 
                        ></XAxis>
                        <YAxis
                            label={{value: 'Downloads', fontSize: "0.7em" , angle: -90, position: 'left', fill: 'white'}}
                            tick={{ fill: 'white', fontSize: "0.7em"  }}
                        />
                        <Tooltip wrapperStyle={{fontSize: "0.6em"}}/>
                        <Legend wrapperStyle={{ position: 'relative', fontSize: "0.7em" }} />
                        <Bar dataKey="bioconda" fill={COLORS[0]} />
                        <Bar dataKey="pypi" fill={COLORS[1]} />
                   </BarChart>
                   </ResponsiveContainer>
                </Col>  
                <Col xs={4}>
                    <ResponsiveContainer width="90%" height="95%">
                                <PieChart>
                                    <text x="50%" y="5%" fill="white" textAnchor="middle" dominantBaseline="central">
                                        <tspan fontSize="0.8em">{attr} this year</tspan>
                                    </text>
                                    <Pie
                                        dataKey="freq"
                                        nameKey="type"
                                        isAnimationActive={true}
                                        data={data.yearly}
                                        cx="50%"
                                        cy="50%"
                                        outerRadius={"80%"}
                                        fill="#007bff"
                                        style={{fontSize: '0.6em'}}
                                        label
                                    >
                                    <Cell key={`cell-0`} fill={COLORS[0]} /> ))}
                                    <Cell key={`cell-1`} fill={COLORS[1]} /> ))}
                                    </Pie>
                                    <Tooltip wrapperStyle={{fontSize: "0.6em"}} />
                                    <Legend wrapperStyle={{fontSize: "0.7em"}} />
                                </PieChart>
                    </ResponsiveContainer>
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
                            DOMINO receives sets of active genes and reports Active Modules, i.e., connected subnetworks that are enriched for the active genes. <br/><br/>
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
                    <p>We observed that very often GO terms enriched in modules detected by AMI methods are also enriched when the AMI algorithms are run on randomly permuted  data.</p>
                    <p>To tackle this bias, we designed the <a href="https://github.com/Shamir-Lab/EMP" target="_blank"> EMpirical
                        Pipeline (EMP)</a>, a method that evaluates the empirical significance of GO terms reported as
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
                        Here you can see an example for an automated API call to the website (e.g. via a script).
                    </p>
                    <p>
                        <Highlight language="html">{'POST /upload'}</Highlight> 
                            <Highlight language='json'>{'Request payload:\n'+
                            '{\n\t"Network file name": "dip.sif", \n\t"Network file contents": your_file_content, \n\t"Active gene file name": "active_gene_set.txt", \n\t"Active gene file contents": your_file_content\n}'}</Highlight>
                            <Highlight language='json'>{'Response payload:\n'+
                            '{\n\t"algOutput":{\n\t\t"DefaultSet":{\n\t\t\t"modules":{\n\t\t\t\t"1":[ "ENSG00000004487", "ENSG00000100888"],\n\t\t\t\t"2":["ENSG00000164924", "ENSG00000132155"]\n\t\t\t} \n\t\t} \n\t}, \n\t"webDetails":{ \n\t\t"geneSets":{ \n\t\t\t"DefaultSet":2 \n\t\t}, \n\t\t"customFile":"filename@networkname@1234", \n\t\t"zipURL":"filename@networkname@1234.zip" \n\t} \t\n}'}</Highlight>
                    </p>
                </Collapsible>

                <Collapsible
                    trigger="FAQ"
                    triggerStyle={{backgroundColor: "#343a40"}}
                    style={{cursor: "pointer"}}
                >
                    <p>
                        <b>Q:</b> Can I focus only on a subset of a module's module?
                    </p>
                    <p>
                        <b>A:</b> Yes. By selecting particular nodes you can leave only their details shown. Multiple node selection can be done using drag-select with the mouse or by holding the ctrl key while clicking on the nodes. To hide the details of all nodes, click on an empty part of the visulation area. To select all the nodes, click on the button "show details for all genes/nodes".    
                    </p>
                </Collapsible>
               <>
                    <h4 style={{textAlign: "center", margin: '0.75em 0px'}}>DOMINO in numbers</h4>
                    <Carousel className="bg-dark">
                        <Carousel.Item>
                            {DOMINOExecutionsViewer("DOMINO Execution Frequency", DOMINOExecutions, networkUsage)}
                        </Carousel.Item>
                        <Carousel.Item>
                            {gitStatisticsViewer("Git activity", gitStatistics)}
                        </Carousel.Item>
                        <Carousel.Item>
                            {packageManagersStatisticsViewer("Downloads from package managers", packageManagersStatistics)}
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
