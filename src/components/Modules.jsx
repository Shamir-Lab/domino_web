import React, { useState } from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import { NavLink } from 'react-router-dom';
import axios from "axios";

import "bootstrap/dist/css/bootstrap.css";
import "react-combo-select/style.css";

import {
    ProSidebar,
    SidebarHeader,
    SidebarFooter,
    SidebarContent,
    Menu,
    MenuItem,
    SubMenu
} from 'react-pro-sidebar';
import 'react-pro-sidebar/dist/css/styles.css';

import { BsLightning, BsList } from "react-icons/bs";

const Modules = (props) => {
    /* Unpack props. */
    
    console.log(props);
    const geneSets = props.location.state["geneSets"];
    const customFile = props.location.state["customFile"];
    const fileNames = {
        "active_genes": props.location.state["Active gene file"],
        "network": props.location.state["Network file"]
    };
    const zipURL = props.location.state["zipURL"];
    

    // for testing purposes
    // const customFile = "clusters@dip@1626548832943"; //"Active_genes_file@dip@1626447515852";

    /* const geneSets = {
        "C1": 2,
        "C2": 3
    };
    const fileNames = {
        "active_genes": "active_genes_file.txt",
        "network": "network_file.txt"
    };
    // const zipURL = customFile+".zip";
    */ 

    /* Initialize component states. */
    // Being on the visualization page, we guarantee that we have modules to display
    let firstSetName;
    for (const setName of Object.keys(geneSets)) {
        if (geneSets[setName] != 0) {
            firstSetName = setName;
            break;
        }
    }
    const [selectedModuleFeatures, setSelectedModuleFeatures] = useState({
            setName: firstSetName,
            moduleNum: 0
    });
    const [collapse, setCollapse] = useState(false);

    /** Returns true if the button is displaying the corresponding static html. */
    const isActive = (setName, moduleNum) =>
        (selectedModuleFeatures.setName == setName && selectedModuleFeatures.moduleNum == moduleNum);

    /** Returns the directory (with respect to the public folder) to the
     * proper static html file. */
    const moduleDirectory = (setName, moduleNum) =>
        `${customFile}/${setName}/modules/module_${moduleNum}.html`;


    return (
        <>
            <Container fluid style={{marginLeft:"-15px"}}>
                <Row style={{width: "100vw", height: "100vh", margin: "0px"}}>
                    <div>
                        <ProSidebar collapsed={collapse} style={{height: "100%"}}>
                            <SidebarHeader style={{height:"50px"}}>
                                <Row>
                                    {collapse ?
                                        <>
                                            <Col>
                                                <BsList style={{height: "25px", width: "25px", marginLeft: "20%", marginTop: "12px"}} onClick = {() => setCollapse(!collapse)}/>
                                            </Col>
                                        </> :
                                        <>
                                            <Col xs={2}>
                                                <BsList style={{height: "25px", width: "25px", marginLeft: "60%", marginTop: "12px"}} onClick = {() => setCollapse(!collapse)}/>
                                            </Col>
                                            <Col xs={8}
                                                 style={{marginTop: "12px"}}
                                            >DOMINO Web Executor</Col>

                                            <Col xs={1}
                                                 style={{
                                                    marginRight: "7px",
                                                    marginTop: "7px"
                                                 }}
                                            ><BsLightning style={{height:"15px", width:"15px"}}/></Col>
                                        </>
                                    }
                                </Row>
                            </SidebarHeader>
                            <SidebarContent>
                                <Menu iconShape="square">
                                    <MenuItem>Modules</MenuItem>
                                    {Object.keys(geneSets).map(setName => {
                                        const numModules = geneSets[setName];
                                        return (
                                            <SubMenu
                                                title={setName}
                                            >
                                                {collapse?
                                                    <div>{setName}</div>
                                                    : <></>
                                                }

                                                {[...Array(numModules).keys()].map(index =>
                                                    <MenuItem>
                                                        <a
                                                            onClick={_ =>
                                                                setSelectedModuleFeatures({
                                                                    setName: setName,
                                                                    moduleNum: index
                                                                })
                                                            }
                                                        >
                                                            module {index}
                                                        </a>
                                                    </MenuItem>
                                                )}
                                            </SubMenu>
                                        );
                                    })}
                                </Menu>
                            </SidebarContent>
                            <SidebarFooter
                                style={{
                                    height:"160px",
                                    ...(collapse?
                                            { display:"none" }
                                            : { margin: "15px"}
                                        )
                                }}
                            >
                                <h4>Parameters</h4>
                                <Row>
                                    <Col>
                                        <label className="col-form-label"> Active genes:</label>
                                    </Col>
                                    <Col>
                                        <input type="text" className="form-control" value={fileNames.active_genes} disabled/>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col>
                                        <label className="col-form-label">Networks:</label>
                                    </Col>
                                    <Col>
                                        <input type="text" className="form-control" value={fileNames.network} disabled/>
                                    </Col>
                                </Row>

                                <a className="btn btn-primary"
                                   style={{position:"absolute", bottom:"10px", marginLeft: "20px", color:"white"}}
                                   href={zipURL}
                                   download
                                >Download Visualization</a>
                            </SidebarFooter>
                        </ProSidebar>
                    </div>
                    <div style={{width: (collapse? "93%": "80%")}}>
                        <iframe src = {
                                moduleDirectory(selectedModuleFeatures.setName, selectedModuleFeatures.moduleNum)
                            }
                            style={{width: "100%", height: "100%"}}
                        ></iframe>
                    </div>
                </Row>
            </Container>
        </>

    );

};

/*



*/

export default Modules;
