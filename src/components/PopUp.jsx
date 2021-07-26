import React, { Component } from "react";
import { modal, modal_content } from "./css/popup.modules.css";
import {
    Container,
    Row,
    Col,
    Button,
} from "react-bootstrap";

import "bootstrap/dist/css/bootstrap.css";

const PopUp = (props) => {

    const handleClick = () => {
        props.toggle();
    }

    return (
        <>
            <div className="modal_popup">
                <div className="modal_content_popup">
                    <p className="text_popup">DOMINO's execution did not identify any modules for this input files.</p>

                    <Row><Col className={'text-center'}><Button onClick={handleClick}>Close</Button></Col></Row>
                </div>
            </div>
        </>
    );

}

export default PopUp;
