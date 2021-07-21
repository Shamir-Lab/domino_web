import React, { Component } from "react";
import { modal, modal_content } from "./css/popup.modules.css";

const PopUp = (props) => {

    const handleClick = () => {
        props.toggle();
    }

    return (
        <>
            <div className="modal_popup">
                <div className="modal_content_popup">
                    <span className="close" onClick={handleClick}>&times;    </span>
                    <p className="text_popup">DOMINO's execution did not identify any modules for these input files.</p>
                </div>
            </div>
        </>
    );

}

export default PopUp;
