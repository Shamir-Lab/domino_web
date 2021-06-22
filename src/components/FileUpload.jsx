import React, { useState } from "react";
import axios from "axios";
import { Spinner } from "@chevtek/react-spinners";
import { spinnerService } from "@chevtek/react-spinners";
import fileStructure from "./public/files";
import { conf } from "./config.js";
import {file_header, file_desc, file_block} from "./style.module.css";

/**
 {
    "Active gene file": {
        userFileName: "active_genes.txt",
        ref: ...
    },
    ...
 }
 */

const FileUpload = (props) => {
    const [fileData, setFileData] = useState(
        fileStructure.files.reduce((obj, file) => ({
          ...obj,
          [file.name]: {
              userFileName: "",
              ref: React.createRef()
          }
        }), {})
    );

    const uploadFiles = () => {
        console.log("prepare for uploading...");
        spinnerService.show("mySpinner");

        const data = new FormData();
        for (const file of fileStructure.files) {
            const ref = fileData[file.name].ref;
            data.append(`${file.name} name`, fileData[file.name].userFileName);
            data.append(`${file.name} contents`, ref.current.files[0]);
        }

        axios
            .post("http://" + conf.IP_ADDRESS  + ":8000/upload", data)
            .then(response => {
                spinnerService.hide("mySpinner");
                console.log(
                    "successfully uploaded: " + fileStructure.files.map(file => file.name).join(", ")
                );

                // redirect to module component
                const fileNaming = fileStructure.files.reduce((obj, file) => ({
                    ...obj,
                    [file.name]: fileData[file.name].userFileName
                }), {});

                props.history.push({
                    pathname : '/modules',
                    state: {
                        ...fileNaming,
                        modules: response.data.modules,
                        moduleDir: response.data.moduleDir,
                        zipURL: response.data.zipURL
                    }
                });
            })
            .catch(error => {
                spinnerService.hide("mySpinner");
                console.log(error);
            });
    }

    const fileUploadList = fileStructure.files.map(file => {
        return (
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
                        ref={fileData[file.name].ref}
                        onChange={e => {
                            let name = "";
                            if (e.target.files[0] !== undefined) {
                                name = e.target.files[0].name;
                            }
                            setFileData(prev => ({
                                ...prev,
                                [file.name] : {
                                    ...prev[file.name],
                                    userFileName: name
                                }
                            }));
                        }}
                    />
                    <label className="custom-file-label">
                        Choose file...
                    </label>

                    <div className="form-group">
                        <input
                            className="form-control"
                            type="text"
                            value={
                                fileData[file.name] === undefined ?
                                    "" :
                                    fileData[file.name].userFileName
                            }
                            readOnly={true}
                        />
                    </div>
                </div>
            </div>
        );
    });

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