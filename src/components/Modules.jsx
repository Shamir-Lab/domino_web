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
     /*
     const customFile = "clusters@dip@1626609835997"; //"Active_genes_file@dip@1626447515852";

     const geneSets = {
        "C1": 2,
        "C2": 3
    };
    const fileNames = {
        "active_genes": "active_genes_file.txt",
        "network": "network_file.txt"
    };
     const zipURL = customFile+".zip";
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
        <Container style={{padding: "0"}} fluid>
        <Row style={{width: "100vw", height: "100vh", margin: "0px"}}>
        <ProSidebar collapsed={collapse}>
        <SidebarHeader>
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
            <Col xs={8} style={{marginTop: "12px"}}>DOMINO Web Executor</Col>
            </>
        }
        </Row>
        </SidebarHeader>
        <SidebarContent>
        <Menu iconShape="square">
        <MenuItem>
        <Row>{collapse ? 
            <>
            <Col><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-bezier" viewBox="0 0 16 16">
            <path fill-rule="evenodd" d="M0 10.5A1.5 1.5 0 0 1 1.5 9h1A1.5 1.5 0 0 1 4 10.5v1A1.5 1.5 0 0 1 2.5 13h-1A1.5 1.5 0 0 1 0 11.5v-1zm1.5-.5a.5.5 0 0 0-.5.5v1a.5.5 0 0 0 .5.5h1a.5.5 0 0 0 .5-.5v-1a.5.5 0 0 0-.5-.5h-1zm10.5.5A1.5 1.5 0 0 1 13.5 9h1a1.5 1.5 0 0 1 1.5 1.5v1a1.5 1.5 0 0 1-1.5 1.5h-1a1.5 1.5 0 0 1-1.5-1.5v-1zm1.5-.5a.5.5 0 0 0-.5.5v1a.5.5 0 0 0 .5.5h1a.5.5 0 0 0 .5-.5v-1a.5.5 0 0 0-.5-.5h-1zM6 4.5A1.5 1.5 0 0 1 7.5 3h1A1.5 1.5 0 0 1 10 4.5v1A1.5 1.5 0 0 1 8.5 7h-1A1.5 1.5 0 0 1 6 5.5v-1zM7.5 4a.5.5 0 0 0-.5.5v1a.5.5 0 0 0 .5.5h1a.5.5 0 0 0 .5-.5v-1a.5.5 0 0 0-.5-.5h-1z"/>
            <path d="M6 4.5H1.866a1 1 0 1 0 0 1h2.668A6.517 6.517 0 0 0 1.814 9H2.5c.123 0 .244.015.358.043a5.517 5.517 0 0 1 3.185-3.185A1.503 1.503 0 0 1 6 5.5v-1zm3.957 1.358A1.5 1.5 0 0 0 10 5.5v-1h4.134a1 1 0 1 1 0 1h-2.668a6.517 6.517 0 0 1 2.72 3.5H13.5c-.123 0-.243.015-.358.043a5.517 5.517 0 0 0-3.185-3.185z"/>
            </svg></Col>
            </> : 
            <>
            <Col xs={2}><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-bezier" viewBox="0 0 16 16">
            <path fill-rule="evenodd" d="M0 10.5A1.5 1.5 0 0 1 1.5 9h1A1.5 1.5 0 0 1 4 10.5v1A1.5 1.5 0 0 1 2.5 13h-1A1.5 1.5 0 0 1 0 11.5v-1zm1.5-.5a.5.5 0 0 0-.5.5v1a.5.5 0 0 0 .5.5h1a.5.5 0 0 0 .5-.5v-1a.5.5 0 0 0-.5-.5h-1zm10.5.5A1.5 1.5 0 0 1 13.5 9h1a1.5 1.5 0 0 1 1.5 1.5v1a1.5 1.5 0 0 1-1.5 1.5h-1a1.5 1.5 0 0 1-1.5-1.5v-1zm1.5-.5a.5.5 0 0 0-.5.5v1a.5.5 0 0 0 .5.5h1a.5.5 0 0 0 .5-.5v-1a.5.5 0 0 0-.5-.5h-1zM6 4.5A1.5 1.5 0 0 1 7.5 3h1A1.5 1.5 0 0 1 10 4.5v1A1.5 1.5 0 0 1 8.5 7h-1A1.5 1.5 0 0 1 6 5.5v-1zM7.5 4a.5.5 0 0 0-.5.5v1a.5.5 0 0 0 .5.5h1a.5.5 0 0 0 .5-.5v-1a.5.5 0 0 0-.5-.5h-1z"/>
            <path d="M6 4.5H1.866a1 1 0 1 0 0 1h2.668A6.517 6.517 0 0 0 1.814 9H2.5c.123 0 .244.015.358.043a5.517 5.517 0 0 1 3.185-3.185A1.503 1.503 0 0 1 6 5.5v-1zm3.957 1.358A1.5 1.5 0 0 0 10 5.5v-1h4.134a1 1 0 1 1 0 1h-2.668a6.517 6.517 0 0 1 2.72 3.5H13.5c-.123 0-.243.015-.358.043a5.517 5.517 0 0 0-3.185-3.185z"/>
            </svg></Col><Col xs={8}>Modules</Col>
            </>}
            </Row>
            </MenuItem>
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
            <iframe style={{width: (collapse? "95%": "84.5%"), height: "100%"}} src = {
                moduleDirectory(selectedModuleFeatures.setName, selectedModuleFeatures.moduleNum)
            }

            ></iframe>

            </Row>
            </Container>

            </>

            );

};

/*



*/

export default Modules;
