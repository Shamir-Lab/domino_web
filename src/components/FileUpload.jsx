import React, { Component } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.css";
import ComboSelect from "react-combo-select";
import "react-combo-select/style.css";
import { Spinner } from "@chevtek/react-spinners";
import { spinnerService } from "@chevtek/react-spinners";
import { conf } from "./config.js";
import { Link, Route, useHistory, BrowserRouter as Router} from 'react-router-dom'
import Modules from "./Modules"
import MyRouter from "./MyRouter"

export default class FileUpload extends Component {
  constructor(props) {
    super(props);
    this.state = {
      uploadStatus: false,
      filename: "",
      parameters: ["active_genes", "network"],
      comboValue: "bionet",
      gene_expression_file_name: "",
      score_file_name: "",
      network_file_name: "",
      is_full_report: ""
    };
    this.handleUploadImage = this.handleUploadImage.bind(this);

}
  redirectToTarget() {
    this.props.history.push(`/modules`)
  }

  handleFileChange(that, key, files) {
    let name = "";
    if (files[0] != undefined) name = files[0].name;

    that.setState({ [key]: name });
  }


  handleUploadImage(that) {
    console.log("prepare for uploading...");
    spinnerService.show("mySpinner");
    const data = new FormData();
    let filesContent = [];
    let filesNames = [];

    this.state.parameters.map(cur => {
      data.append(cur + "_file_name", that.state[cur + "_file_name"]);
      data.append(cur + "_file_content", that[cur + "_file_content"].files[0]);
    });
    axios
      .post("http://" + conf.IP_ADDRESS  + ":8000/upload", data) //conf.IP_ADDRESS 
      .then(function(response) {
        console.log(
          "successfully uploaded: " + response.data.files_names.join(", ")
        );
        that.setState({ report_link: response.data.report_link });
        that.setState({ active_gene_file_name: response.data.active_gene_file_name });
        that.setState({ network_file_name: response.data.network_file_name });
        that.setState({ modules: response.data.modules });
        // history.push({pathname: '/modules', state:{
        //         active_gene_file_name: this.state.active_gene_file_name,
        //         modules: this.state.modules
        //       }});
        spinnerService.hide("mySpinner");
        that.props.history.push({pathname : '/modules', state: {
    active_gene_file_name: that.state.active_gene_file_name,
    network_file_name: that.state.network_file_name,
    modules: that.state.modules
  }});   
        console.log({
   active_gene_file_name: response.data.active_gene_file_name,
   modules: response.data.modules
});
      })
      .catch(function(error) {
        spinnerService.hide("mySpinner");
        console.log(error);
      });
  }


  render() {
    return (
      <React.Fragment>
        <div className="container">
          {this.state.parameters.map(pr => (
            <React.Fragment key={"0" + pr}>
              <h4 key={"1" + pr}> Choose {pr.split("_").join(" ")} file </h4>
              <div key={"2" + pr} className="custom-file">
                <input
                  key={"3" + pr}
                  className="form-control input-sm custom-file-input"
                  ref={ref => {
                    this[pr + "_file_content"] = ref;
                  }}
                  type="file"
                  onChange={e =>
                    this.handleFileChange(
                      this,
                      pr + "_file_name",
                      e.target.files
                    )
                  }
                />
                <label key={"4" + pr} className="custom-file-label">
                  Choose file...
                </label>
              </div>

              <div key={"5" + pr} className="form-group">
                <input
                  key={"6" + pr}
                  className="form-control"
                  ref={ref => {
                    this.fileName = ref;
                  }}
                  type="text"
                  value={this.state[pr + "_file_name"]}
                  readOnly={true}
                />
              </div>
            </React.Fragment>
          ))}
          <button
            className="btn btn-success m-3"
            onClick={() => {
              this.handleUploadImage(this);
            }}
          >
            Upload
          </button>

          <Spinner name="mySpinner">
            <img
              src="https://i.gifer.com/7plX.gif"
              style={{ height: "20px", width: "20px" }}
            />
          </Spinner>
          <div>
            


            {this.state.report_link ? (
              <Link to={{pathname: '/modules', state:{
                active_gene_file_name: this.state.active_gene_file_name,
                modules: this.state.modules
              }}} >full report</Link>
            ) : null}
          </div>
        </div>
      </React.Fragment>
    );
  }
}
