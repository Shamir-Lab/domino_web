import React, { Component } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.css";
import ComboSelect from "react-combo-select";
import "react-combo-select/style.css";
import { Spinner } from "@chevtek/react-spinners";
import { spinnerService } from "@chevtek/react-spinners";
import { conf } from "./config.js";

export default class Modules extends Component {
  constructor(props) {
    super(props);
    console.log(props)
    this.state = {
      uploadStatus: false,
      active_gene_file_name: props.location.state["active_gene_file_name"],
      network_file_name: props.location.state["network_file_name"],
      modules: props.location.state["modules"],
      selectedModuleURL: "",
      selectedModuleId: ""
    };

  if (Object.keys(this.state.modules).length > 0){
    this.state.selectedModuleURL="/"+this.state.active_gene_file_name.split(".").slice(0, -1).join(".") +"/module_0.html"
    this.state.selectedModuleId="0"
    this.fetchHtml = this.fetchHtml.bind(this);
    this.isActive = this.isActive.bind(this);
  }
}

isActive(that, moduleId) {
    return "nav-link "+ (that.state.selectedModuleId==moduleId ? 'active' : '')
}

fetchHtml(that, t) {
    let pr=t.target.getAttribute("moduleId")
    const data = new FormData();
    let selectedModuleURL="/"+that.state.active_gene_file_name.split(".").slice(0, -1).join(".") +"/module_"+pr+".html"
    that.setState({selectedModuleURL: selectedModuleURL }); 
    that.setState({'selectedModuleId': t.target.getAttribute("moduleId")})
}

  render() {
    return (
      <React.Fragment>
      <div className="row"  style={{width: "100vw", height: "100vh", margin: "0px"}}>
      <div className="col-md-2">
          <h4 className='display-6'>Parameters:</h4>
          <div className="row">
          <div className="col-md-4"><label className="col-form-label"> Active genes:</label></div>
          <div className="col-md-8"><input type="text" className="form-control" value={this.state.active_gene_file_name} disabled/></div>
          </div>
          <div className="row">
          <div className="col-md-4"><label className="col-form-label"> Network:</label></div>
          <div className="col-md-8"><input type="text" className="form-control" value={this.state.network_file_name} disabled/></div>
          </div>
          <h4 className='display-6'>Modules:</h4>
          <ul className="nav nav-pills flex-column"> 
          {Object.keys(this.state.modules).map(pr => (
          <li className="nav-item"><a className={ this.isActive(this, pr)} moduleId={pr} onClick={(t) => {this.fetchHtml(this, t);}}>module {pr} </a></li>
          ))}          
          </ul>
      </div>  
          <div className="col-md-10">
             <iframe src = {this.state.selectedModuleURL} style={{width: "100%", height: "100%"}}>
         
             </iframe>
          </div>
        </div>
      </React.Fragment>
    );
  }
};
