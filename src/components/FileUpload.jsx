import React, { useState } from "react";
import axios from "axios";
import { Spinner } from "@chevtek/react-spinners";
import { spinnerService } from "@chevtek/react-spinners";
import fileStructure from "./public/files";
import { conf } from "./config.js";
import {file_header, file_desc, file_block} from "./style.module.css";

const FileUpload = (props) => {
    console.log("here", fileStructure);
    const emptyDict = fileStructure.files.reduce((obj, val) => ({
        ...obj,
        [val]: ""
    }), {});
    const [inputFileNames, setInputFileNames] = useState(emptyDict);
    const [inputFileContents, setInputFileContents] = useState(emptyDict);

    const uploadFiles = () => {
        console.log("prepare for uploading...");
        spinnerService.show("mySpinner");

        const data = new FormData();
        for (const file in fileStructure.files) {
            data.append(`${file.name}_file_name`, inputFileNames[file.name]);
            data.append(`${file.name}_file_contents`, inputFileContents[file.name].files[0]);
        }

        axios
            .post("http://" + conf.IP_ADDRESS  + ":8000/upload", data)
            .then(response => {
                spinnerService.hide("mySpinner");
                console.log(
                    "successfully uploaded: " + fileStructure.files.map(file => file.name).join(", ")
                );

                // redirect to module component
                props.history.push({
                    pathname : '/modules',
                    state: {
                        active_gene_file_name: inputFileNames["Active genes file"],
                        network_file_name: inputFileNames["Network file"],
                        modules: response.data.modules,
                        zipURL: "/test.zip",
                    }
                });
                console.log({
                    active_gene_file_name: inputFileNames["Active genes file"],
                    modules: response.data.modules
                });
            })
            .catch(error => {
                spinnerService.hide("mySpinner");
                console.log(error);
            });
    }
    console.log("here2", fileStructure);

    const fileUploadList = (
        fileStructure.files.map(file =>
            <div className = {file_block} key = {file.name}>
                {/* File information */}
                <div style = {{textAlign: "left"}}>
                    <p className={file_header}>{file.name}</p>
                    <p className={file_desc}>
                        {(file.maxSize === 0) ?
                            <></>:
                            <>
                                <span>Maximum file size: {file.maxSize}MB</span><br></br>
                            </>
                        }
                        Recommended file type(s): {file.type} <br></br>
                        {file.description}
                    </p>
                </div>

                {/* Form */}
                <div className="custom-file">
                    <input
                        className="form-control input-sm custom-file-input"
                        type="file"
                        onChange={e => {
                            let name = "";
                            if (e.target.files[0] !== undefined) {
                                name = e.target.files[0].name;
                            }
                            setInputFileNames(prev => ({
                                ...prev,
                                [file.name]: name
                            }))
                        }}
                        ref={ref => {
                            setInputFileContents(prev => ({
                            ...prev,
                            [file.name]: ref
                            }))
                        }}
                    />
                    <label className="custom-file-label">
                        Choose file...
                    </label>

                    <div className="form-group">
                        <input
                            className="form-control"
                            type="text"
                            value={inputFileNames[file.name]}
                            readOnly={true}
                        />
                    </div>
                </div>
            </div>
        )
    );

    return (
        <>
            <div className="jumbotron">
                <p style={{fontSize: "45px", textAlign: "center"}}>
                    File Upload
                </p>
            </div>
            {fileUploadList}
            <div style = {{textAlign: "right", margin: "auto", width: "80%"}}>
                <button className="btn btn-primary"
                        onClick={uploadFiles}
                >Upload</button>
                <Spinner name="mySpinner">
                    <img
                        src="https://i.gifer.com/7plX.gif"
                        style={{ height: "20px", width: "20px" }}
                    />
                </Spinner>
            </div>
            <footer className="text-center text-lg-start" style = {{backgroundColor: "#e9ecef"}}>
                Footer
            </footer>
        </>
    );
};

export default FileUpload;

/*
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

        spinnerService.hide("mySpinner");
        // redirect to module component
        that.props.history.push({
            pathname : '/modules',
            state: {
                active_gene_file_name: that.state.active_gene_file_name,
                network_file_name: that.state.network_file_name,
                modules: that.state.modules,
                zipURL: "/test.zip",
            }
        });
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
 */
