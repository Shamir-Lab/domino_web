import React, { useState, useEffect  } from "react";
import axios from "axios";
import { Spinner } from "@chevtek/react-spinners";
import { spinnerService } from "@chevtek/react-spinners";
import fileStructure from "./public/files";
import { conf } from "./config.js";
import {file_header, file_desc, file_error, file_block} from "./style.module.css";
import PopUp from "./PopUp";
import DropdownButton from 'react-bootstrap/DropdownButton';
import Dropdown from 'react-bootstrap/Dropdown';

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
    const DROPDOWN_DEFAULT = "Select from available network files";
    const [fileData, setFileData] = useState(
        fileStructure.files.reduce((obj, file) => ({
          ...obj,
          [file.name]: {
              userFileName: "",
              inputTagRef: React.createRef(),
              dropdownOption: DROPDOWN_DEFAULT,
              errorMessage: ""
          }
        }), {})
    );
    const [serverErrorResponse, setServerErrorResponse] = useState("");

    const [seen, setSeen] = useState(false);
    const togglePop = () => {
        setSeen(!seen);
    };

    const uploadFiles = () => {
        /** The onClick attribute for the upload button.
         * The files uploaded by the user are sent to the server
         * to run the algorithm via a post request.
         * Files chosen in the dropdown menu are always analyzed first.
         * Passes if for each required input file:
         *      a file of the appropriate size and file name is uploaded by the user,
         *      OR a file from the list of available files is chosen.*/

        console.log("prepare for uploading...");
        setServerErrorResponse("");

        /* Validate inputted files */
        let goodFiles = true;
        for (const file of fileStructure.files) {
            const ref = fileData[file.name].inputTagRef;

            const noFileChosen = (!ref.current.files && fileData[file.name].dropdownOption === DROPDOWN_DEFAULT);
            const notValidInputFileName = (ref.current.files && fileData[file.name].userFileName === "") && (!ref.current.files && !ref.current.value);
            if (noFileChosen || notValidInputFileName) {
                goodFiles = false;
                continue;
            }

            if (fileData[file.name].dropdownOption !== DROPDOWN_DEFAULT) {
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
        data.append("fromWebExecutor", "true");

        for (const file of fileStructure.files) {
            const ref = fileData[file.name].inputTagRef;
            const dropdownOption = fileData[file.name].dropdownOption;

            if (dropdownOption !== DROPDOWN_DEFAULT) {
                data.append(`${file.name} name`, dropdownOption);
                data.append(
                    `${file.name} path`,
                    file.availableFiles.directory + dropdownOption
                );
            } else {
                data.append(`${file.name} name`, fileData[file.name].userFileName);
                data.append(`${file.name} contents`, ref.current.files[0]);
            }
        }
        for(var pair of data.entries()) {
            console.log(pair[0]+ ', '+ pair[1]);
        }

        console.log("Sending POST request ...");
        spinnerService.show("mySpinner");
        axios
            .post("http://" + conf.IP_ADDRESS  + ":8000/upload", data)
            .then(res => {
                spinnerService.hide("mySpinner")
                console.log(
                    "successfully uploaded: " + fileStructure.files.map(file => file.name).join(", ")
                );
               
                // redirect to module component
                const fileNaming = fileStructure.files.reduce((obj, file) => {
                    const f = fileData[file.name];

                    return {
                        ...obj,
                        [file.name]: (f.dropdownOption === DROPDOWN_DEFAULT ?
                            fileData[file.name].userFileName:
                            f.dropdownOption
                        )
                    };
                }, {});
                const numModules = Object.values(res.data.webDetails.geneSets).reduce((sum, value) =>
                    sum + value
                );
                if (numModules === 0){
                    setSeen(true);
                }
                else{
                    spinnerService.show("mySpinner2");
                    setTimeout(() => {
                        spinnerService.hide("mySpinner2");
                        props.history.push({
                        pathname : '/modules',
                        state: {
                            ...fileNaming,
                            ...res.data.webDetails
                        }
                    });
                },2000);
                }
            })
            .catch(error => {
                spinnerService.hide("mySpinner");
                spinnerService.hide("mySpinner2");
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
                <div className = "row">
                    {/* Dropdown menu for available files. */}
                    {file.availableFiles ?
                        <>
                            <div className = "col">
                                <Dropdown
                                    title = {fileData[[file.name]].dropdownOption}
                                    onSelect={fileName =>
                                        setFileData(prev => ({
                                            ...prev,
                                            [file.name]: {
                                                ...prev[file.name],
                                                dropdownOption: fileName
                                                }
                                            }))
                                    }>
                                    <Dropdown.Toggle 
                                        style={{width:'300px'}} ref={fileData[file.name].inputTagRef} value={fileData[[file.name]].dropdownOption}> {fileData[[file.name]].dropdownOption}
                                        </Dropdown.Toggle>
                                    <Dropdown.Menu style={{width:'300px'}}>
                                    {file.availableFiles.fileNames.map(fileName =>
                                        <Dropdown.Item eventKey = {fileName}>
                                            {fileName}
                                        </Dropdown.Item>

                                    )}
                                    <Dropdown.Item eventKey = 'Choose from your PC'>
                                            Choose from your PC
                                        </Dropdown.Item>
                                    </Dropdown.Menu>    
                                </Dropdown>
                            </div>
                        </>
                        :
                        <></>
                    }
                    {(file.name=='Active gene file' || fileData[file.name].dropdownOption=='Choose from your PC') ? 
                        <>
                    <div className={(file.availableFiles ? "col-8" : "col-12") + " custom-file"}>
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
                        <label className="custom-file-label" style={{marginLeft:'15px', marginRight:'15px'}}>
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
                    </> : 
                    <></>}
                </div>

                {/* File information and Error message*/}
                <div
                    style = {{textAlign: "left",
                              marginTop: "40px"}}>
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
            <Spinner name="mySpinner">
            <img src='https://acegif.com/wp-content/uploads/loading-48.gif' style={{position: 'fixed', height: '100vh',width: '100vw',margin: '5px', zIndex: '100', opacity: '0.85'}}/>
            </Spinner>
            <Spinner name="mySpinner2">
            <img src='https://acegif.com/wp-content/uploads/loading-1.gif' style={{position: 'fixed', height: '100vh',width: '100vw',margin: '5px', zIndex: '100', opacity: '0.9'}}/>
            </Spinner>
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
                <button className="btn btn-primary" style={{width:'200px'}}
                        onClick={uploadFiles}
                >Upload</button>    
            </div>
            <footer className="text-center text-lg-start" style = {{backgroundColor: "#e9ecef"}}>
                Footer
            </footer>
        </>
    );
};

export default FileUpload;
