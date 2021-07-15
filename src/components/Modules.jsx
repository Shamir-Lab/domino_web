import React, { useState } from "react";
import { NavLink } from 'react-router-dom';
import { Container, Row, Col, Dropdown } from "react-bootstrap";

import {
    CDBSidebar,
    CDBSidebarHeader,
    CDBSidebarContent,
    CDBSidebarMenu,
    CDBSidebarMenuItem,
    CDBSidebarFooter
} from "cdbreact";

import axios from "axios";

import "bootstrap/dist/css/bootstrap.css";
import "react-combo-select/style.css";

const Modules = (props) => {


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

    const Sidebar = () => {
        return (
            <div
                style={{ display: 'flex', height: '100vh', overflow: 'scroll initial' }}
            >
                <CDBSidebar textColor="#fff" backgroundColor="#333">
                    <CDBSidebarHeader prefix={<i className="fa fa-bars fa-large"></i>}>
                        <a
                            href="/"
                            className="text-decoration-none"
                            style={{ color: 'inherit' }}
                        >
                            Sidebar
                        </a>
                    </CDBSidebarHeader>

                    <CDBSidebarContent className="sidebar-content">
                        <Dropdown>
                            <Dropdown.Toggle variant="success" id="dropdown-basic" style={{margin:"auto", backgroundColor: "rgb(51 51 51)"}}>
                                Modules
                            </Dropdown.Toggle>

                            <Dropdown.Menu>
                                <Dropdown.Item href="#/action-1">Action</Dropdown.Item>
                                {[...Array(numModules).keys()].map(index => (
                                    <Dropdown.Item>
                                        <CDBSidebarMenuItem>
                                            <a className={isActive(index)}
                                               moduleId={index}
                                               onClick={t => fetchHtml(t)}
                                            >module {index}</a>
                                        </CDBSidebarMenuItem>
                                    </Dropdown.Item>
                                ))}
                            </Dropdown.Menu>
                        </Dropdown>

                        <h4>Parameters:</h4>
                        <div className="col-md-4"><label className="col-form-label"> Network:</label></div>
                        <div className="col-md-8"></div>
                        <Row>
                            <Col>
                                <label className="col-form-label">Active gene file:</label>
                            </Col>
                            <Col>
                                <input type="text" className="form-control" value={fileNames.active_genes} disabled/>
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <label className="col-form-label">Network file:</label>
                            </Col>
                            <Col>
                                <input type="text" className="form-control" value={fileNames.network} disabled/>
                            </Col>
                        </Row>
                    </CDBSidebarContent>

                    <CDBSidebarFooter style={{ textAlign: 'center' }}>
                        <div
                            style={{
                                padding: '20px 5px',
                            }}
                        >
                            Sidebar Footer
                        </div>
                    </CDBSidebarFooter>
                </CDBSidebar>
            </div>
        );
    };

    return (
        <Container fluid>
            <Row style={{width: "100vw", height: "100vh", margin: "0px"}}>

                <Col xs={2} >
                    <Sidebar/>
                </Col>
                <Col xs={10} id="page-content-wrapper">
                    <iframe src = {selectedModuleURL} style={{width: "100%", height: "100%"}}></iframe>
                </Col>
            </Row>
        </Container>
    );

};

export default Modules;
