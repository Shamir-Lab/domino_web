import React, { useState } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.css";
import "react-combo-select/style.css";

const Modules = (props) => {
    console.log(props);

    /* Unpack props. */
    const numModules = props.location.state["numModules"];
    const fileNames = {
        "active_genes": props.location.state["Active gene file name"],
        "network": props.location.state["Network file name"]
    };
    const zipURL = props.location.state["zipURL"];

    /** Returns the directory (with respect to the public folder) to the
    * ith static html file to display the ith module. */
    const moduleDirectory = (i) =>
        `${props.location.state.moduleDir}/module_${i}.html`;

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
                <div className="col-md-2" style={{position: "relative"}}>
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
                        {[...Array(numModules).keys()].map(pr => (
                            <li className="nav-item"><a className={isActive(pr)} moduleId={pr} onClick={(t) => {fetchHtml(t);}}>module {pr} </a></li>
                        ))}
                    </ul>
                    <a className="btn btn-primary"
                       style={{position:"absolute", bottom:"10px", color:"white"}}
                       href={zipURL}
                       download
                    >Download Visualization</a>
                </div>
                <div className="col-md-10">
                    <iframe src = {selectedModuleURL} style={{width: "100%", height: "100%"}}></iframe>
                </div>
            </div>
        </>
    );

};

export default Modules;