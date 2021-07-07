import React, { useState, useEffect  } from "react";
import axios from "axios";
import { Spinner } from "@chevtek/react-spinners";
import { spinnerService } from "@chevtek/react-spinners";
import fileStructure from "./public/files";
import { conf } from "./config.js";
import {file_header, file_desc, file_error, file_block} from "./style.module.css";
import PopUp from "./PopUp";

/**
 JSON Structures
 fileData
 --------
 {
    "Active gene file": {
        userFileName: "active_genes.txt",
        ref: ...
        },
        ...
     }
 */

// TODO: file_error class is used for general error messages. change class name

const MAX_FILE_SIZE_MB = 10;

const FileUpload = (props) => {
    const [fileData, setFileData] = useState(
        fileStructure.files.reduce((obj, file) => ({
          ...obj,
          [file.name]: {
              userFileName: "",
              inputTagRef: React.createRef(),
              errorMessage: ""
          }
        }), {})
    );

    const [seen, setSeen] = useState(false);
     useEffect(() => {
                        console.log("test here", seen)
                    }, [seen]);

    const togglePop = () => {
        setSeen(!seen)
    };

    const [serverErrorResponse, setServerErrorResponse] = useState("");

    /** The onClick attribute for the upload button.
     * The files uploaded by the user are sent to the server
     * to run the algorithm via a post request.*/
    const uploadFiles = () => {
        console.log("prepare for uploading...");

        /* Validate inputted files */
        let goodFiles = true;
        for (const file of fileStructure.files) {
            const ref = fileData[file.name].inputTagRef;

            // no file was inputted for this field
            if (ref.current.files.length === 0) {
                goodFiles = false;
                continue;
            }

            const fileSizeMB = ref.current.files[0].size / (10 ** 6); // in megabytes
            if (fileSizeMB > MAX_FILE_SIZE_MB) {
                setFileData(prev => ({
                    ...prev,
                    [file.name]: {
                        ...prev[file.name],
                        errorMessage: `The ${file.name} uploaded is ${fileSizeMB.toFixed(2)}MB, which exceedes the ${MAX_FILE_SIZE_MB}MB limit. Submit a new file and then click 'Upload' again.`
                    }
                }));
                goodFiles = false;
            } else {
                setFileData(prev => ({
                    ...prev,
                    [file.name]: {
                        ...prev[file.name],
                        errorMessage: ``
                    }
                }));
            }
        }

        if (!goodFiles) {
            console.log("Delayed \\upload POST request. Files exceed max file size and/or no files inputted.");
            return;
        }

        const data = new FormData();
        for (const file of fileStructure.files) {
            const ref = fileData[file.name].inputTagRef;

            data.append(`${file.name} name`, fileData[file.name].userFileName);
            data.append(`${file.name} contents`, ref.current.files[0]);
        }

        console.log("Sending POST request ...");
        spinnerService.show("mySpinner");
        setServerErrorResponse("");
        axios
            .post("http://" + conf.IP_ADDRESS  + ":8000/upload", data)
            .then(res => {
                spinnerService.hide("mySpinner");
                console.log(
                    "successfully uploaded: " + fileStructure.files.map(file => file.name).join(", ")
                );
               
                // redirect to module component
                const fileNaming = fileStructure.files.reduce((obj, file) => ({
                    ...obj,
                    [file.name]: fileData[file.name].userFileName
                }), {});
                console.log("fileNaming", fileNaming);
                console.log("", res.data.webDetails)
                if (!res.data.webDetails.numModules){
                    setSeen(true)
          
                }
                else{
                    props.history.push({
                        pathname : '/modules',
                        state: {
                            ...fileNaming,
                            ...res.data.webDetails
                        }
                    });
                }
            })
            .catch(error => {
                spinnerService.hide("mySpinner");
                console.log(error);
                setServerErrorResponse(
                    "Oops! There's an error with the DOMINO execution. Please check your inputted files for correctness."
                );
            });
    }

    const fileUploadList = fileStructure.files.map(file => {
        return (
            <div className = {file_block} key = {file.name}>
                {/* File header and error message */}
                <div style = {{textAlign: "left"}}>
                    <p className={file_header}>{file.name}</p>
                    <p className={file_error}>
                        {fileData[file.name].errorMessage}
                    </p>
                </div>

                {/* Form */}
                <div className="custom-file">
                    <input
                        className="form-control input-sm custom-file-input"
                        type="file"
                        ref={fileData[file.name].inputTagRef}
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

                {/* File information and Error message*/}
                <div
                    style = {{textAlign: "left",
                              marginTop: "10px"}}>
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
            </div>
        );
    });

    return (
        <>
            <div>
                {seen ? <PopUp toggle={togglePop} /> : null}
            </div>

            <div className="jumbotron">
                <p style={{fontSize: "45px", textAlign: "center"}}>
                    File Upload
                </p>
            </div>

            {/* Error with file upload. */}
            <div style = {{textAlign: "left", margin: "auto", width: "80%"}}>
                <p className={file_error}>
                    {serverErrorResponse}
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
