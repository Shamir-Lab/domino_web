import React, { useState } from "react";
import { NavLink } from 'react-router-dom';
import { Container, Row, Col, Dropdown } from "react-bootstrap";
import axios from "axios";

import "bootstrap/dist/css/bootstrap.css";
import "react-combo-select/style.css";
import {
    sidebar,
    module_btn,
    closebtn,
    openbtn,
    content
} from "./Sidebar.module.css";

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

    return (
        <>
            <div id={sidebar} style={{width: (collapse? "0px": "250px"), backgroundColor:"grey"}}>
                <a className={closebtn} onClick={() => setCollapse(true)}>×</a>
                <a>About</a>
                <a>Services</a>
                <a>Clients</a>
                <a>Contact</a>
            </div>
            <div id={content} style={{marginLeft: (collapse? "0px": "250px")}}>
                <button className={openbtn} onClick={() => setCollapse(false)}>☰ Open Sidebar</button>
                <h2>Collapsed Sidebar</h2>
                <iframe src = {selectedModuleURL} style={{width: "100%", height: "100%"}}></iframe>
            </div>
        </>
    );

};

export default Modules;
