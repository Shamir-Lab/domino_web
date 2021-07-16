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

const Modules = (props) => {
    /* Unpack props. */
    /*

    console.log(props);
    const geneSets = props.location.state["geneSets"];
    const fileNames = {
        "active_genes": props.location.state["Active gene file"],
        "network": props.location.state["Network file"]
    };
    console.log("fileNames", fileNames);
    const zipURL = props.location.state["zipURL"];
    */

    // for testing purposes
    const sessionDirectory = "active_genes_file@dip@1626447515852";
    const geneSets = {
        "DefaultSet": 1
    };
    const fileNames = {
        "active_genes": "active_genes_file.txt",
        "network": "network_file.txt"
    };
    const zipURL = "active_genes_file@dip@1626296233416.zip";



    /** Returns the directory (with respect to the public folder) to the
    * proper static html file. */
    const moduleDirectory = (setName, moduleNum) =>
        `${sessionDirectory}/${setName}/modules/module_${moduleNum}.html`;


    /* Initialize component states. */
    // Being on the visualization page, we guarantee that we have modules to display
    const firstSetName = Object.keys(geneSets)[0]; // assumption: this set has modules to display. might lead to bugs
    const [selectedModuleFeatures, setSelectedModuleFeatures] = useState({
            setName: firstSetName,
            moduleNum: 0
    });
    const [collapse, setCollapse] = useState(false);

    /* Determines the button is displaying the corresponding static html. */
    const isActive = (setName, moduleNum) =>
        (selectedModuleFeatures.setName == setName && selectedModuleFeatures.moduleNum == moduleNum);

    // <iframe src = {selectedModuleURL} style={{width: "100%", height: "100%"}}></iframe>
    // style={{width: (collapse? "7%": "20%")}}
    return (
        <>
            <Container fluid>
                <Row style={{width: "100vw", height: "100vh", margin: "0px"}}>
                    <div>
                        <ProSidebar collapsed={collapse} style={{height: "100%"}}>
                            <SidebarHeader>

                            </SidebarHeader>
                            <SidebarContent>
                                <Menu iconShape="square">
                                    <MenuItem>DOMINO Web Executor</MenuItem>

                                    {Object.keys(geneSets).map(setName => {
                                        const numModules = geneSets[setName];
                                        return (<SubMenu title={setName}>
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
                                        </SubMenu>);
                                    })}
                                </Menu>
                            </SidebarContent>
                            <SidebarFooter>

                                <div style={collapse? {display:"none"}: {}}>
                                    <h4>Parameters</h4>
                                    <hr></hr>
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
                                </div>


                            </SidebarFooter>
                        </ProSidebar>
                    </div>
                    <div style={{width: (collapse? "93%": "80%")}}>
                        <Button
                            onClick = {() => setCollapse(!collapse)}
                        >Toggle</Button>
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
