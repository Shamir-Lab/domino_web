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
    const [collapse, setCollapse] = useState(false);

    /* Unpack props. */
    /*
    console.log(props);
    const numModules = props.location.state["numModules"];
    const fileNames = {
        "active_genes": props.location.state["Active gene file"],
        "network": props.location.state["Network file"]
    };
    console.log("fileNames", fileNames);
    const zipURL = props.location.state["zipURL"];
     */

    // for testing purposes
    const numModules = 3;
    const geneSets = {
        "C1": 5,
        "C2": 4
    };
    const fileNames = {
        "active_genes": "active_genes_file.txt",
        "network": "network_file.txt"
    };
    const zipURL = "active_genes_file@dip@1626296233416.zip";

    /** Returns the directory (with respect to the public folder) to the
    * ith static html file to display the ith module. */
    const moduleDirectory = (i) =>
        //`${props.location.state.moduleDir}/module_${i}.html`;
        `active_genes_file@dip@1626296233416/DefaultSet/modules/module_${i}.html`;


    /* Initialize component states. */
    const [selectedModuleURL, setSelectedModuleURL] = useState(
        numModules > 0 ? moduleDirectory(0) : ""
    );
    const [selectedModuleId, setSelectedModuleId] = useState(
        numModules > 0 ? "0" : ""
    );

    /* Determines the className for the left module navbar.
    * Returns 'nav-link active' for the module tab that's being rendered.
    * Returns 'nav-link otherwise. */
    const isActive = (moduleId) =>
        selectedModuleId==moduleId ? 'activeClicked' : '';

    /* Determines the static html file to render on the visualization page. */
    const fetchHtml = (t) => {
        const pr = t.target.getAttribute("moduleId");
        setSelectedModuleURL(moduleDirectory(pr));
        setSelectedModuleId(t.target.getAttribute("moduleId"));
    };

    // <iframe src = {selectedModuleURL} style={{width: "100%", height: "100%"}}></iframe>

    return (
        <>
            <Container fluid>
                <Row style={{width: "100vw", height: "100vh", margin: "0px"}}>
                    <Col xs={collapse? 1: 2}>
                        <ProSidebar collapsed={collapse} style={{height: "100%"}}>
                            <SidebarHeader>

                            </SidebarHeader>
                            <SidebarContent>
                                <Menu iconShape="square">
                                    <MenuItem>DOMINO Web Executor</MenuItem>

                                    {Object.keys(geneSets).map(setName =>
                                        <SubMenu title={setName}>
                                            {[...Array(numModules).keys()].map(index =>
                                                <MenuItem>module {index}</MenuItem>
                                            )}
                                        </SubMenu>
                                    )}
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
                    </Col>
                    <Col xs={collapse? 11: 10}>
                        <Button
                            onClick = {() => setCollapse(!collapse)}
                        >Toggle</Button>
                        <iframe src = {selectedModuleURL} style={{width: "100%", height: "100%"}}></iframe>
                    </Col>
                </Row>
            </Container>
        </>

    );

};

/*



*/

export default Modules;
