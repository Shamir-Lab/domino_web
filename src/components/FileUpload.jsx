import React, {useState, useEffect} from "react";
import {
    Container,
    Row,
    Col,
    Dropdown,
    Jumbotron
} from "react-bootstrap";
import {Spinner} from "@chevtek/react-spinners";
import {spinnerService} from "@chevtek/react-spinners";
import DropdownButton from "react-bootstrap/DropdownButton";
import Tour from 'reactour'
import JsxParser from 'react-jsx-parser';
import axios from "axios";
import Cookies from 'js-cookie';
import PopUp from "./PopUp";
import {
    file_header,
    file_desc,
    file_error,
    file_block,
} from "./css/file_upload.module.css";
import fileStructure from "./public/files";
import loading1 from "./resources/loading1.gif";
import loading2 from "./resources/loading2.gif";
import { file_upload_steps } from "./public/tour_instructions.js";

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
    const DROPDOWN_CUSTOM_NETWORK = "Choose from your PC";
    const [fileData, setFileData] = useState(
        fileStructure.files.reduce(
            (obj, file) => ({
                ...obj,
                [file.name]: {
                    userFileName: "",
                    inputTagRef: React.createRef(),
                    dropdownOption: {name: DROPDOWN_DEFAULT, label: DROPDOWN_DEFAULT},
                    errorMessage: ""
                },
            }),
            {}
        )
    );
    const [serverErrorResponse, setServerErrorResponse] = useState("");

    const [seen, setSeen] = useState(false);
    const togglePop = () => {
        setSeen(!seen);
    };

    const [isTourOpen, setIsTourOpen] = useState(!Cookies.get('returningClientFileUpload'));
    Cookies.set('returningClientFileUpload',true);

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

            const noFileChosen =
                (fileData[file.name].dropdownOption.name === DROPDOWN_DEFAULT ||
                    fileData[file.name].dropdownOption.name === DROPDOWN_CUSTOM_NETWORK) &&
                (!ref.current.files || ref.current.files.length === 0);
            if (noFileChosen) {
                goodFiles = false;
                setFileData((prev) => ({
                    ...prev,
                    [file.name]: {
                        ...prev[file.name],
                        errorMessage: `No file was chosen for this field`,
                    },
                }));
            } else {
                setFileData((prev) => ({
                    ...prev,
                    [file.name]: {
                        ...prev[file.name],
                        errorMessage: ``,
                    },
                }));
            }

            if (fileData[file.name].dropdownOption.name !== DROPDOWN_DEFAULT && fileData[file.name].dropdownOption.name !== DROPDOWN_CUSTOM_NETWORK) {
                continue;
            }

            const fileSizeMB = ref.current.files[0].size / 10 ** 6; // in megabytes
            if (fileSizeMB > MAX_FILE_SIZE_MB) {
                setFileData((prev) => ({
                    ...prev,
                    [file.name]: {
                        ...prev[file.name],
                        errorMessage: `The ${file.name} uploaded is ${fileSizeMB.toFixed(
                            2
                        )}MB, which exceedes the ${MAX_FILE_SIZE_MB}MB limit. Submit a new file and then click 'Upload' again.`,
                    },
                }));
                goodFiles = false;
            } else {
                setFileData((prev) => ({
                    ...prev,
                    [file.name]: {
                        ...prev[file.name],
                        errorMessage: ``,
                    },
                }));
            }
        }

        if (!goodFiles) {
//            setServerErrorResponse(
//                    "Seems like at least one of the input files are missing. Please provide an active gene file and choose/provide a network file"
//                );
            console.log(
                "Delayed \\upload POST request. Files exceed max file size and/or no files inputted."
            );
            return;
        }

        const data = new FormData();
        data.append("fromWebExecutor", "true");

        for (const file of fileStructure.files) {
            const ref = fileData[file.name].inputTagRef;
            const dropdownOption = fileData[file.name].dropdownOption;

            if ((dropdownOption.name !== DROPDOWN_CUSTOM_NETWORK) && (dropdownOption.name !== DROPDOWN_DEFAULT)) {
                data.append(`${file.name} name`, dropdownOption.name);
                data.append(
                    `${file.name} path`,
                    file.availableFiles.directory + dropdownOption.name
                );
            } else {
                data.append(`${file.name} name`, fileData[file.name].userFileName);
                data.append(`${file.name} contents`, ref.current.files[0]);
            }
        }
        for (var pair of data.entries()) {
            console.log(pair[0] + ", " + pair[1]);
        }

        console.log("Sending POST request ...");
        spinnerService.show("mySpinner");
        axios
            .post(`/upload`, data)
            .then((res) => {
                spinnerService.hide("mySpinner");
                console.log(
                    "successfully uploaded: " +
                    fileStructure.files.map((file) => file.name).join(", ")
                );

                // redirect to module component
                const fileNaming = fileStructure.files.reduce((obj, file) => {
                    const f = fileData[file.name];

                    return {
                        ...obj,
                        [file.name]:
                            f.dropdownOption.name === DROPDOWN_DEFAULT
                                ? fileData[file.name].userFileName
                                : f.dropdownOption.name,
                    };
                }, {});
                const numModules = Object.values(res.data.webDetails.geneSets).reduce(
                    (sum, value) => sum + value
                );
                if (numModules === 0) {
                    setSeen(true);
                } else {
                    spinnerService.show("mySpinner2");
                    setTimeout(() => {
                        spinnerService.hide("mySpinner2");
                        props.history.push({
                            pathname: "/modules",
                            state: {
                                ...fileNaming,
                                ...res.data.webDetails,
                            },
                        });
                    }, 2000);
                }
            })
            .catch((error) => {
                spinnerService.hide("mySpinner");
                spinnerService.hide("mySpinner2");
                console.log(error);
                setServerErrorResponse(error.response.data);
            });
    };

    const fileUploadList = fileStructure.files.map((file) => {
        return (
            <div className={file_block} key={file.name}>
                {/* File header and error message */}
                <div style={{textAlign: "left"}}>
                    <p className={file_header} data-tour={file.tourStep}>{file.name}</p>
                    <p className={file_error}>{fileData[file.name].errorMessage}</p>
                </div>

                {/* Form */}
                <Row>
                    {/* Dropdown menu for available files. */}
                    {file.availableFiles ? (
                        <Col>
                            <Dropdown
                                title={fileData[[file.name]].dropdownOption.label}
                                onSelect={(fileMd) => {
                                   if(fileData[[file.name]].dropdownOption.label === DROPDOWN_CUSTOM_NETWORK){
                                        fileData[file.name].userFileName=""
                                        // fileData[file.name] = undefined  
                                   }
                                    setFileData((prev) => ({
                                        ...prev,
                                        [file.name]: {
                                            ...prev[file.name],
                                            dropdownOption: JSON.parse(fileMd),
                                            
                                        },
                                    }))
                                } 
                               }
                            >
                                <Dropdown.Toggle
                                    style={{width: "300px"}}
                                    ref={fileData[file.name].inputTagRef}
                                    value={fileData[[file.name]].dropdownOption}
                                >
                                    {" "}
                                    {fileData[[file.name]].dropdownOption.label}
                                </Dropdown.Toggle>
                                <Dropdown.Menu style={{width: "300px"}}>
                                    {file.availableFiles.fileMetadatas.map((curFile) => (
                                        <Dropdown.Item eventKey={JSON.stringify(curFile)}>
                                            {curFile.label}
                                        </Dropdown.Item>
                                    ))}
                                    <Dropdown.Item eventKey={JSON.stringify({name: DROPDOWN_CUSTOM_NETWORK, label: DROPDOWN_CUSTOM_NETWORK})}>
                                        {DROPDOWN_CUSTOM_NETWORK}
                                    </Dropdown.Item>
                                </Dropdown.Menu>
                            </Dropdown>
                        </Col>
                    ) : (
                        <></>
                    )}
                    {(file.name === "Active gene file"
                        || fileData[file.name].dropdownOption.name === DROPDOWN_CUSTOM_NETWORK)
                        ? (
                            <Col
                                xs={(file.availableFiles ? 8 : 12)}
                            >
                                <input
                                    className="form-control input-sm custom-file-input"
                                    type="file"
                                    ref={fileData[file.name].inputTagRef}
                                    onChange={(e) => {
                                        let name = "";
                                        if (e.target.files[0] !== undefined) {
                                            name = e.target.files[0].name;
                                        }
                                        setFileData((prev) => ({
                                            ...prev,
                                            [file.name]: {
                                                ...prev[file.name],
                                                userFileName: name,
                                            },
                                        }));
                                    }}
                                />
                                <label
                                    className="custom-file-label"
                                    style={{marginLeft: "15px", marginRight: "15px"}}
                                >
                                    Choose a file...
                                </label>

                                <div className="form-group">
                                    <input
                                        className="form-control"
                                        type="text"
                                        value={
                                            (fileData[file.name] === undefined || fileData[file.name].userFileName === "")
                                                ? ""
                                                : fileData[file.name].userFileName
                                        }
                                        readOnly={true}
                                    />
                                </div>
                                {/* File information and Error message*/}
                                <div style={{textAlign: "left"}}>
                                    <p className={file_desc}>
                                        <JsxParser
                                            jsx={`<span>${file.description}</span>`}
                                        />
                                        {file.maxSize === 0 ? (
                                            <></>
                                        ) : (
                                            <>
                                                <span>Maximum file size: {file.maxSize}MB</span>
                                                <br></br>
                                            </>
                                        )}

                                        Recommended file type(s): {file.type}
                                    </p>
                                </div>
                            </Col>
                        ) : (
                            <></>
                        )}
                </Row>
            </div>
        );
    });

    return (
        <>
            <Spinner name="mySpinner">
                <img
                    src={loading1}
                    style={{
                        position: "absolute",
                        left: 0,
                        top: 0,
                        height: "100vh",
                        width: "100vw",
                        zIndex: "100",
                        opacity: "0.85",
                    }}
                />
            </Spinner>
            <Spinner name="mySpinner2">
                <img
                    src={loading2}
                    style={{
                        position: "absolute",
                        left: 0,
                        top: 0,
                        height: "100vh",
                        width: "100vw",
                        zIndex: "100",
                        opacity: "0.9",
                    }}
                />
            </Spinner>
            <div>{seen ? <PopUp toggle={togglePop}/> : null}</div>

            <Jumbotron style={{backgroundColor: "white", padding: "10px", marginBottom: "0px"}}>
                <div style={{margin: "auto", textAlign: "center"}}>
                    <span style={{fontSize: "35px"}}>Run Domino</span>
                </div>
            </Jumbotron>

            {/* Error with file upload. */}
            <div style={{textAlign: "left", margin: "auto", width: "80%"}}>
                <p className={file_error}>{serverErrorResponse}</p>
            </div>

            {fileUploadList}
            <div style={{textAlign: "right", margin: "auto", width: "80%"}}>
                <button
                    className="btn btn-primary"
                    style={{width: "200px"}}
                    onClick={uploadFiles}
                    data-tour='third-step'
                >
                    Execute
                </button>
            </div>
            <Tour
                steps={file_upload_steps}
                isOpen={isTourOpen}
                onRequestClose={() => setIsTourOpen(false)}
                lastStepNextButton={<button className="btn btn-primary" style={{width: "150px"}}>Done! Let's start
                    playing</button>}
            />
        </>
    );
};

export default FileUpload;
