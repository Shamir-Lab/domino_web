import React, { Component, useState } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.css";
import ComboSelect from "react-combo-select";
import "react-combo-select/style.css";
import { Spinner } from "@chevtek/react-spinners";
import { spinnerService } from "@chevtek/react-spinners";
import { conf } from "./config.js";

const Modules = (props) => {
    /* Initialize component states. */
    const startingModuleURL = "";
    const startingModuleId = "";
    if (Object.keys(modules).length > 0){
        startingModuleURL = moduleDirectory(0);
        startingModuleId = "0";
    }
    const [selectedModuleURL, setSelectedModuleURL] = setState(startingModuleURL);
    const [selectedModuleId, setSelectedModuleId] = setState(startingModuleId);

    const modules = props.location.state["modules"];
    const moduleDirectory = (index) =>
        "/"+fileNames["active_genes"].split(".").slice(0, -1).join(".") +`/module_${i}.html`;
    const fileNames = {
        "active_genes": props.location.state["active_gene_file_name"],
        "network": props.location.state["network_file_name"]
    };

    /* Determines the className for the left module navbar.
    * Returns 'nav-link active' for the module tab that's being rendered.
    * Returns 'nav-link otherwise. */
    const isActive = (moduleId) =>
        "nav-link "+ (selectedModuleId==moduleId ? 'active' : '');

    /* Determines the static html file to render on the visualization page. */
    const fetchHtml = (t) => {
        const pr = t.target.getAttribute("moduleId");
        setSelectedModuleURL(moduleDirectory(pr));
        setSelectedModuleId(t.target.getAttribute("moduleId"));
    };

    return (
        <>
            <div className="row"  style={{width: "100vw", height: "100vh", margin: "0px"}}>
                <div className="col-md-2">
                    <h4 className='display-6'>Parameters:</h4>
                    <div className="row">
                        <div className="col-md-4"><label className="col-form-label"> Active genes:</label></div>
                        <div className="col-md-8"><input type="text" className="form-control" value={fileNames.active_genes} disabled/></div>
                    </div>
                    <div className="row">
                        <div className="col-md-4"><label className="col-form-label"> Network:</label></div>
                        <div className="col-md-8"><input type="text" className="form-control" value={fileNames.network} disabled/></div>
                    </div>
                    <h4 className='display-6'>Modules:</h4>
                    <ul className="nav nav-pills flex-column">
                        {Object.keys(modules).map(pr => (
                            <li className="nav-item"><a className={isActive(pr)} moduleId={pr} onClick={(t) => {fetchHtml(t);}}>module {pr} </a></li>
                        ))}
                    </ul>
                </div>
                <div className="col-md-10">
                    <iframe src = {selectedModuleURL} style={{width: "100%", height: "100%"}}></iframe>
                </div>
            </div>
        </>
    );

};

export default Modules;